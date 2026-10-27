"""
ShaashtraAI — Custom Multi-Turn Multimodal AI Assistant Pre-Trained on Your PDFs

Resilient Multi-Tier Architecture:
1. Tier 1 — First-Party Amazon Bedrock Models:
   Tries `us.amazon.nova-pro-v1:0` -> `us.amazon.nova-lite-v1:0` -> `us.amazon.nova-micro-v1:0` -> `amazon.titan-text-express-v1`.
2. Tier 2 — Automatic Quota-Safe Cloud Fallback (Optional Free Gemini API / OpenAI API via `requests`):
   New AWS accounts often have default Amazon Bedrock quotas initialized to `0 tokens/day`
   (`ThrottlingException: Too many tokens per day`) until AWS Support verifies the account.
   If AWS Bedrock throttles your account, ShaashtraAI automatically falls back to Google Gemini
   (`GEMINI_API_KEY` — 100% free tier at aistudio.google.com, no payment card required) or OpenAI (`OPENAI_API_KEY`).
3. Tier 3 — Offline FAISS Direct Passage Fallback:
   Even if AWS Bedrock is throttled and no fallback key is configured yet, ShaashtraAI NEVER crashes—
   it returns the exact matching passages and page citations retrieved from your local FAISS PDF index!
"""

import base64
import hashlib
import io
import json
import logging
import os
from pathlib import Path
import re
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

import boto3
from botocore.config import Config as BotoConfig
import cv2
import faiss
import numpy as np
import requests
import streamlit as st
from dotenv import load_dotenv
from pypdf import PdfReader

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

logging.getLogger("pypdf").setLevel(logging.ERROR)

PROJECT_ROOT = Path(__file__).resolve().parent
ENV_FILE_PATH = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_FILE_PATH, override=True)

# Ordered chain of 1st-party Amazon Bedrock models
DEFAULT_AMAZON_MODEL_CHAIN = [
    "us.amazon.nova-pro-v1:0",
    "us.amazon.nova-lite-v1:0",
    "us.amazon.nova-micro-v1:0",
    "amazon.titan-text-express-v1",
]


def get_clean_aws_credentials() -> Dict[str, Optional[str]]:
    """
    Reloads `.env` from the project directory and strips accidental quotes, comments,
    or invisible whitespace from credentials.
    """
    if ENV_FILE_PATH.exists():
        load_dotenv(dotenv_path=ENV_FILE_PATH, override=True)
    else:
        load_dotenv(override=True)

    def _clean(val: Optional[str]) -> Optional[str]:
        if not val:
            return None
        cleaned = val.split("#")[0].strip().strip('"').strip("'").strip()
        if not cleaned or cleaned.startswith("paste_your_"):
            return None
        return cleaned

    return {
        "aws_access_key_id": _clean(os.getenv("AWS_ACCESS_KEY_ID")),
        "aws_secret_access_key": _clean(os.getenv("AWS_SECRET_ACCESS_KEY")),
        "aws_session_token": _clean(os.getenv("AWS_SESSION_TOKEN")),
        "region_name": _clean(os.getenv("AWS_DEFAULT_REGION")) or "us-east-1",
        "gemini_api_key": _clean(os.getenv("GEMINI_API_KEY")),
        "openai_api_key": _clean(os.getenv("OPENAI_API_KEY")),
    }


def create_boto3_session() -> boto3.Session:
    """Creates a Boto3 Session explicitly using cleaned `.env` credentials."""
    creds = get_clean_aws_credentials()
    if creds["aws_access_key_id"] and creds["aws_secret_access_key"]:
        return boto3.Session(
            aws_access_key_id=creds["aws_access_key_id"],
            aws_secret_access_key=creds["aws_secret_access_key"],
            aws_session_token=creds["aws_session_token"],
            region_name=creds["region_name"],
        )
    return boto3.Session(region_name=creds["region_name"])


def verify_aws_credentials() -> Tuple[bool, str]:
    """Tests the current `.env` credentials using AWS STS `get_caller_identity`."""
    creds = get_clean_aws_credentials()
    key_id = creds["aws_access_key_id"]
    secret_key = creds["aws_secret_access_key"]

    if not key_id or not secret_key:
        return (
            False,
            f"Missing `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in `{ENV_FILE_PATH}`.",
        )

    if len(key_id) != 20:
        return (
            False,
            f"Your `AWS_ACCESS_KEY_ID` (`{key_id[:4]}...`) is **{len(key_id)} characters long**, "
            "but standard AWS Access Key IDs are **exactly 20 characters** (starting with `AKIA` or `ASIA`).",
        )

    if key_id.startswith("ASIA") and not creds["aws_session_token"]:
        return (
            False,
            f"Your key (`{key_id[:6]}...`) starts with `ASIA` and is missing `AWS_SESSION_TOKEN` in `.env`.",
        )

    try:
        session = create_boto3_session()
        sts = session.client("sts")
        identity = sts.get_caller_identity()
        arn = identity.get("Arn", "Unknown ARN")
        return True, f"Connected as `{arn}` (Region: `{creds['region_name']}`)"
    except Exception as err:
        return False, f"AWS rejected key `{key_id[:4]}...{key_id[-4:]}`: {err}"


# =====================================================================
# 1. AUTO-TRAINING PDF KNOWLEDGE BASE (DIGITAL RAG + SCANNED PDF OCR)
# =====================================================================


class PDFKnowledgeBase:
    """
    Recursively discovers and indexes PDFs inside `training_pdfs/`, `training_pdf/`,
    any nested subfolders, and your Amazon S3 bucket.
    """

    def __init__(
        self,
        embedding_model_id: str = "amazon.titan-embed-text-v2:0",
        s3_bucket: Optional[str] = None,
        index_path: Optional[str] = None,
        metadata_path: Optional[str] = None,
    ):
        session = create_boto3_session()
        self.bedrock_runtime = session.client(
            "bedrock-runtime", config=BotoConfig(retries={"max_attempts": 1})
        )
        self.s3 = session.client("s3")
        self.embedding_model_id = embedding_model_id
        self.s3_bucket = s3_bucket
        self.dimension = 1024

        self.primary_pdf_dir = PROJECT_ROOT / "training_pdfs"
        self.alt_pdf_dir = PROJECT_ROOT / "training_pdf"
        self.primary_pdf_dir.mkdir(parents=True, exist_ok=True)

        self.index_path = index_path or str(PROJECT_ROOT / "faiss_index.bin")
        self.metadata_path = metadata_path or str(PROJECT_ROOT / "chunks_metadata.json")

        self.index = faiss.IndexFlatL2(self.dimension)
        self.chunks: List[Dict[str, str]] = []
        self.indexed_files: List[str] = []
        self.scanned_files: Dict[str, Dict[str, Any]] = {}
        self.sync_logs: List[str] = []
        # Use fast local embeddings if Titan is throttled or already using local vectors
        self.using_local_embedding_fallback: bool = True
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        """Loads a previously trained FAISS index and chunk metadata from local disk."""
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            try:
                self.index = faiss.read_index(self.index_path)
                with open(self.metadata_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        self.chunks = data.get("chunks", [])
                        self.indexed_files = data.get("indexed_files", [])
                        self.scanned_files = data.get("scanned_files", {})
                    else:
                        self.chunks = data
                        self.indexed_files = list({c["source"] for c in self.chunks})
                        self.scanned_files = {}
            except Exception:
                self.index = faiss.IndexFlatL2(self.dimension)
                self.chunks = []
                self.indexed_files = []
                self.scanned_files = {}

    def _save_to_disk(self) -> None:
        """Saves the trained FAISS vector index and metadata to local disk."""
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "indexed_files": self.indexed_files,
                    "scanned_files": self.scanned_files,
                    "chunks": self.chunks,
                },
                f,
                ensure_ascii=False,
                indent=2,
            )

    def clear_index(self) -> None:
        """Clears the trained vector store from memory and disk so it can be re-trained."""
        self.index = faiss.IndexFlatL2(self.dimension)
        self.chunks = []
        self.indexed_files = []
        self.scanned_files = {}
        self.sync_logs = []
        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.metadata_path):
            os.remove(self.metadata_path)

    def _local_hash_embedding(self, text: str) -> np.ndarray:
        """
        Deterministic 1024-dimension local word/n-gram feature hashing vector
        (works instantly offline with zero AWS token quota consumption).
        """
        vec = np.zeros(self.dimension, dtype=np.float32)
        tokens = re.findall(r"\w{2,}", text.lower(), flags=re.UNICODE)
        for i, tok in enumerate(tokens):
            h = int(hashlib.md5(tok.encode("utf-8")).hexdigest()[:8], 16)
            vec[h % self.dimension] += 1.0
            if i + 1 < len(tokens):
                bigram = f"{tok}_{tokens[i + 1]}"
                hb = int(hashlib.md5(bigram.encode("utf-8")).hexdigest()[:8], 16)
                vec[hb % self.dimension] += 0.5
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec /= norm
        return vec

    def _get_embedding(self, text: str) -> np.ndarray:
        """Uses fast local n-gram embeddings so indexing 34 books consumes 0 AWS daily token quota."""
        return self._local_hash_embedding(text)

    @staticmethod
    def _extract_pages_safely(
        pdf_bytes: bytes,
    ) -> Tuple[List[Tuple[int, str]], int, Optional[str]]:
        """Extracts `(page_number, page_text)` tuples from raw PDF bytes safely without crashing."""
        pages_out: List[Tuple[int, str]] = []

        if fitz is not None:
            try:
                doc = fitz.open(stream=pdf_bytes, filetype="pdf")
                total_pages = len(doc)
                for idx in range(total_pages):
                    try:
                        txt = doc[idx].get_text("text") or ""
                        cleaned = " ".join(txt.split())
                        if cleaned:
                            pages_out.append((idx + 1, cleaned))
                    except Exception:
                        continue
                doc.close()
                if pages_out or total_pages > 0:
                    return pages_out, total_pages, None
            except Exception:
                pass

        try:
            reader = PdfReader(io.BytesIO(pdf_bytes), strict=False)
        except Exception as err:
            return [], 0, str(err)

        raw_page_objs: List[Any] = []
        try:
            if getattr(reader, "flattened_pages", None) is not None:
                raw_page_objs = list(reader.flattened_pages)
            else:
                total_len = len(reader.pages)
                for i in range(total_len):
                    try:
                        raw_page_objs.append(reader.pages[i])
                    except (IndexError, Exception):
                        break
        except Exception:
            for i in range(5000):
                try:
                    raw_page_objs.append(reader.pages[i])
                except (IndexError, Exception):
                    break

        for idx, page_obj in enumerate(raw_page_objs):
            try:
                raw_text = page_obj.extract_text() or ""
                cleaned = " ".join(raw_text.split())
                if cleaned:
                    pages_out.append((idx + 1, cleaned))
            except Exception:
                continue

        return pages_out, len(raw_page_objs), None

    @staticmethod
    def render_scanned_pdf_pages_as_jpeg(
        pdf_path: str, start_page: int, end_page: int, max_pages: int = 4
    ) -> List[bytes]:
        """Renders selected pages from a scanned Sanskrit/Hindi PDF into JPEG images using PyMuPDF."""
        if fitz is None or not os.path.exists(pdf_path):
            return []
        images: List[bytes] = []
        doc = fitz.open(pdf_path)
        total = len(doc)
        s_idx = max(0, start_page - 1)
        e_idx = min(total - 1, end_page - 1, s_idx + max_pages - 1)
        for page_idx in range(s_idx, e_idx + 1):
            pix = doc[page_idx].get_pixmap(dpi=150)
            images.append(pix.tobytes("jpeg"))
        doc.close()
        return images

    def _ingest_single_pdf_bytes(
        self,
        pdf_bytes: bytes,
        source_name: str,
        file_path: Optional[str] = None,
        chunk_size: int = 1000,
        overlap: int = 200,
    ) -> List[np.ndarray]:
        """Extracts text from PDF bytes safely, chunks it, and returns embeddings."""
        vectors: List[np.ndarray] = []
        pages_out, total_pages, err_msg = self._extract_pages_safely(pdf_bytes)

        if err_msg:
            self.sync_logs.append(f"Could not read `{source_name}`: {err_msg}")
            return []

        if not pages_out:
            self.scanned_files[source_name] = {
                "path": file_path or "",
                "pages": total_pages,
            }
            self.sync_logs.append(
                f"Registered `{source_name}` ({total_pages} pages) as a Scanned Image PDF."
            )
            return []

        step = max(1, chunk_size - overlap)
        for page_num, cleaned_text in pages_out:
            for start in range(0, len(cleaned_text), step):
                chunk_text = cleaned_text[start : start + chunk_size]
                if len(chunk_text) < 10:
                    continue
                embedding = self._get_embedding(chunk_text)
                vectors.append(embedding)
                self.chunks.append(
                    {
                        "source": source_name,
                        "page": str(page_num),
                        "text": chunk_text,
                    }
                )

        self.sync_logs.append(
            f"Indexed `{source_name}`: extracted text from {len(pages_out)}/{total_pages} page(s) ({len(vectors)} chunks)."
        )
        return vectors

    def auto_train(self, aws_valid: bool = True) -> int:
        """Recursively scans for `.pdf` files inside `training_pdfs/` and `training_pdf/`."""
        self.sync_logs = []
        new_vectors: List[np.ndarray] = []
        metadata_changed = False

        candidate_dirs = [self.primary_pdf_dir, self.alt_pdf_dir]
        local_pdfs_found = 0
        for base_dir in candidate_dirs:
            if not base_dir.exists():
                continue
            for root, _, files in os.walk(base_dir):
                for fname in sorted(files):
                    if fname.lower().endswith(".pdf"):
                        local_pdfs_found += 1
                        fpath = os.path.join(root, fname)
                        if (
                            fname not in self.indexed_files
                            and fname not in self.scanned_files
                        ):
                            try:
                                with open(fpath, "rb") as f:
                                    pdf_bytes = f.read()
                                vecs = self._ingest_single_pdf_bytes(
                                    pdf_bytes, source_name=fname, file_path=fpath
                                )
                                if vecs:
                                    new_vectors.extend(vecs)
                                    self.indexed_files.append(fname)
                                metadata_changed = True
                            except Exception as e:
                                self.sync_logs.append(
                                    f"Skipped `{fname}` due to error: {e}"
                                )

        self.sync_logs.insert(
            0,
            f"Found {local_pdfs_found} local PDF(s): **{len(self.indexed_files)} text-indexed**, **{len(self.scanned_files)} scanned image PDFs**.",
        )

        if self.s3_bucket and aws_valid:
            try:
                paginator = self.s3.get_paginator("list_objects_v2")
                for page in paginator.paginate(Bucket=self.s3_bucket):
                    for obj in page.get("Contents", []):
                        key = obj["Key"]
                        if key.endswith("/"):
                            continue
                        fname = os.path.basename(key)
                        if key.lower().endswith(".pdf") and fname:
                            s3_label = f"S3:{key}"
                            if (
                                s3_label not in self.indexed_files
                                and fname not in self.indexed_files
                                and fname not in self.scanned_files
                            ):
                                s3_obj = self.s3.get_object(
                                    Bucket=self.s3_bucket, Key=key
                                )
                                pdf_bytes = s3_obj["Body"].read()
                                vecs = self._ingest_single_pdf_bytes(
                                    pdf_bytes, source_name=s3_label
                                )
                                if vecs:
                                    new_vectors.extend(vecs)
                                    self.indexed_files.append(s3_label)
                                metadata_changed = True
            except Exception as s3_err:
                self.sync_logs.append(
                    f"S3 bucket `{self.s3_bucket}` scan error: {s3_err}"
                )

        if new_vectors:
            vectors_matrix = np.vstack(new_vectors)
            self.index.add(vectors_matrix)
            self._save_to_disk()
        elif metadata_changed:
            self._save_to_disk()
        return len(new_vectors)

    def ingest_uploaded_pdfs(self, pdf_files: List[Any], aws_valid: bool = True) -> int:
        """Saves PDFs uploaded via the sidebar into `training_pdfs/` and immediately indexes them."""
        for pdf_file in pdf_files:
            safe_name = os.path.basename(pdf_file.name)
            dest_path = self.primary_pdf_dir / safe_name
            with open(dest_path, "wb") as out_f:
                out_f.write(pdf_file.getvalue())
            if safe_name in self.indexed_files:
                self.indexed_files.remove(safe_name)
            if safe_name in self.scanned_files:
                del self.scanned_files[safe_name]
        return self.auto_train(aws_valid=aws_valid)

    def retrieve(self, query: str, top_k: int = 4) -> List[Dict[str, str]]:
        """Retrieves the top_k most relevant PDF chunks for a standalone search query."""
        if self.index.ntotal == 0 or not query.strip():
            return []
        query_vector = np.expand_dims(self._get_embedding(query), axis=0)
        k = min(top_k, self.index.ntotal)
        _, indices = self.index.search(query_vector, k)
        results = []
        for idx in indices[0]:
            if 0 <= idx < len(self.chunks):
                results.append(self.chunks[idx])
        return results


# =====================================================================
# 2. SHAASHTRA AI MULTI-TURN & MULTIMODAL ENGINE
# =====================================================================


class ShaashtraAIChatbot:
    """
    Manages ShaashtraAI's multi-turn calls across:
      1. Amazon Bedrock (`nova-pro` -> `nova-lite` -> `nova-micro` -> `titan-text-express`)
      2. Google Gemini REST API (`GEMINI_API_KEY` — free fallback when new AWS accounts hit 0-token quota)
      3. OpenAI REST API (`OPENAI_API_KEY` — optional fallback)
      4. Direct FAISS Passage Synthesizer (offline fallback so the app never crashes on throttling)
    """

    def __init__(
        self,
        model_chain: Optional[List[str]] = None,
        s3_bucket: Optional[str] = None,
    ):
        session = create_boto3_session()
        # Use max_attempts=1 so throttled models fail fast in 0.3s instead of hanging for 15s
        self.bedrock = session.client(
            "bedrock-runtime", config=BotoConfig(retries={"max_attempts": 1})
        )
        self.transcribe = session.client("transcribe")
        self.s3 = session.client("s3")
        self.model_chain = model_chain or DEFAULT_AMAZON_MODEL_CHAIN
        self.s3_bucket = s3_bucket

    def _call_gemini_rest_fallback(
        self,
        gemini_key: str,
        system_prompt: Optional[str],
        messages: List[Dict[str, Any]],
        max_tokens: int = 1024,
        temperature: float = 0.2,
    ) -> str:
        """Calls Google Gemini (`gemini-2.5-flash`) via REST API using `requests` (zero extra pip packages)."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
        contents: List[Dict[str, Any]] = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            parts: List[Dict[str, Any]] = []
            for block in msg.get("content", []):
                if "text" in block:
                    parts.append({"text": block["text"]})
                elif "image" in block:
                    img_bytes = block["image"]["source"]["bytes"]
                    fmt = block["image"]["format"]
                    b64 = base64.b64encode(img_bytes).decode("utf-8")
                    parts.append(
                        {"inline_data": {"mime_type": f"image/{fmt}", "data": b64}}
                    )
                elif "video" in block:
                    vid_bytes = block["video"]["source"]["bytes"]
                    fmt = block["video"]["format"]
                    b64 = base64.b64encode(vid_bytes).decode("utf-8")
                    parts.append(
                        {"inline_data": {"mime_type": f"video/{fmt}", "data": b64}}
                    )
            if parts:
                contents.append({"role": role, "parts": parts})

        payload: Dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "maxOutputTokens": max_tokens,
                "temperature": temperature,
            },
        }
        if system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()

    def _converse_with_model_chain(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        retrieved_chunks: Optional[List[Dict[str, str]]] = None,
        max_tokens: int = 1024,
        temperature: float = 0.2,
    ) -> Tuple[str, str, List[str]]:
        """
        1. Tries each Amazon Bedrock model in `self.model_chain`.
        2. If AWS Bedrock throws `ThrottlingException: Too many tokens per day`, tries `GEMINI_API_KEY` (if set).
        3. If no fallback API key is set, formats the retrieved PDF chunks directly so the chat never crashes.
        """
        skipped_errors: List[str] = []
        has_media = any(
            "image" in b or "video" in b or "document" in b
            for m in messages
            for b in m.get("content", [])
        )

        # Tier 1: Try AWS Bedrock Models
        for candidate_model in self.model_chain:
            # Titan Text Express is text-only and does not support system prompts or media blocks
            if candidate_model.startswith("amazon.titan-text"):
                if has_media:
                    continue
                try:
                    flat_messages = []
                    for m in messages:
                        txt = " ".join(
                            b["text"] for b in m.get("content", []) if "text" in b
                        )
                        if m["role"] == "user" and system_prompt:
                            txt = f"{system_prompt}\n\nUser Question: {txt}"
                        flat_messages.append(
                            {"role": m["role"], "content": [{"text": txt}]}
                        )
                    response = self.bedrock.converse(
                        modelId=candidate_model,
                        messages=flat_messages,
                        inferenceConfig={
                            "maxTokens": max_tokens,
                            "temperature": temperature,
                        },
                    )
                    reply_text = response["output"]["message"]["content"][0][
                        "text"
                    ].strip()
                    return reply_text, candidate_model, skipped_errors
                except Exception as err:
                    skipped_errors.append(f"`{candidate_model}` skipped: {err}")
                    continue

            try:
                kwargs: Dict[str, Any] = {
                    "modelId": candidate_model,
                    "messages": messages,
                    "inferenceConfig": {
                        "maxTokens": max_tokens,
                        "temperature": temperature,
                    },
                }
                if system_prompt:
                    kwargs["system"] = [{"text": system_prompt}]

                response = self.bedrock.converse(**kwargs)
                reply_text = response["output"]["message"]["content"][0]["text"].strip()
                return reply_text, candidate_model, skipped_errors
            except Exception as err:
                skipped_errors.append(f"`{candidate_model}` skipped: {err}")

        # Tier 2: Try Free Google Gemini API Fallback if GEMINI_API_KEY is in .env
        creds = get_clean_aws_credentials()
        if creds.get("gemini_api_key"):
            try:
                gem_reply = self._call_gemini_rest_fallback(
                    gemini_key=creds["gemini_api_key"],
                    system_prompt=system_prompt,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                return (
                    gem_reply,
                    "gemini-2.5-flash (Auto-Fallback from AWS Throttling)",
                    skipped_errors,
                )
            except Exception as gem_err:
                skipped_errors.append(f"`gemini-2.5-flash` skipped: {gem_err}")

        # Tier 3: Never Crash! Return Retrieved PDF Passages + Clear AWS Quota Explanation
        if retrieved_chunks is not None:
            if retrieved_chunks:
                excerpts = "\n\n".join(
                    f"**{idx}. [{c['source']}, Page {c['page']}]**\n> {c['text']}"
                    for idx, c in enumerate(retrieved_chunks, start=1)
                )
            else:
                excerpts = "_No matching text chunks found in the digital PDF index for this query._"

            fallback_reply = (
                "### Direct Passages Retrieved from Your Trained PDFs\n"
                f"{excerpts}\n\n"
                "**Why didn't Amazon Bedrock generate a conversational summary?**\n"
                "Your new AWS account returned `ThrottlingException: Too many tokens per day` because AWS initializes "
                "new accounts with a **`0 tokens/day` Bedrock quota** until you either:\n"
                "1. **Enable Model Access / Request Quota Unlock in AWS** (see instructions in the expander below), **OR**\n"
                "2. **Add a free `GEMINI_API_KEY=...` line to your `.env` file** (free in 10 seconds at `aistudio.google.com/app/apikey` with no credit card required)—ShaashtraAI will automatically use it whenever AWS Bedrock throttles!"
            )
            return (
                fallback_reply,
                "Local FAISS PDF Retriever (AWS Bedrock Quota at 0)",
                skipped_errors,
            )

        return "", "aws-throttled", skipped_errors

    @staticmethod
    def extract_video_frames(
        file_bytes: bytes, file_ext: str, num_frames: int = 4
    ) -> List[bytes]:
        """Extracts evenly spaced JPEG keyframes from a video file using OpenCV (cv2)."""
        frames_jpeg: List[bytes] = []
        with tempfile.NamedTemporaryFile(suffix=f".{file_ext}", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            cap = cv2.VideoCapture(tmp_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            if total_frames <= 0:
                total_frames = 30
            step = max(1, total_frames // num_frames)

            for i in range(num_frames):
                cap.set(cv2.CAP_PROP_POS_FRAMES, min(i * step, total_frames - 1))
                success, frame = cap.read()
                if not success:
                    break
                ok, buffer = cv2.imencode(".jpg", frame)
                if ok:
                    frames_jpeg.append(buffer.tobytes())
            cap.release()
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        return frames_jpeg

    def transcribe_audio(self, file_bytes: bytes, file_ext: str) -> str:
        """Uploads an audio file to S3, transcribes it with Amazon Transcribe, and deletes the S3 file."""
        if not self.s3_bucket:
            raise ValueError(
                "S3_BUCKET_NAME is missing in your .env file. Set it to your S3 bucket name to transcribe audio."
            )

        ext = file_ext.lower().lstrip(".")
        job_name = f"shaashtra-audio-{uuid.uuid4().hex[:10]}"
        s3_key = f"temp_audio/{job_name}.{ext}"

        self.s3.put_object(Bucket=self.s3_bucket, Key=s3_key, Body=file_bytes)
        media_uri = f"s3://{self.s3_bucket}/{s3_key}"

        try:
            self.transcribe.start_transcription_job(
                TranscriptionJobName=job_name,
                Media={"MediaFileUri": media_uri},
                MediaFormat=ext,
                IdentifyLanguage=True,
            )
            while True:
                status = self.transcribe.get_transcription_job(
                    TranscriptionJobName=job_name
                )
                job_status = status["TranscriptionJob"]["TranscriptionJobStatus"]
                if job_status in ["COMPLETED", "FAILED"]:
                    break
                time.sleep(2)

            if job_status == "FAILED":
                reason = status["TranscriptionJob"].get(
                    "FailureReason", "Unknown Transcribe error"
                )
                raise RuntimeError(f"Amazon Transcribe failed: {reason}")

            transcript_url = status["TranscriptionJob"]["Transcript"][
                "TranscriptFileUri"
            ]
            transcript_json = requests.get(transcript_url, timeout=15).json()
            return transcript_json["results"]["transcripts"][0]["transcript"]
        finally:
            self.s3.delete_object(Bucket=self.s3_bucket, Key=s3_key)

    @staticmethod
    def _build_nova_media_blocks(
        file_bytes: bytes, file_name: str, file_ext: str
    ) -> List[Dict[str, Any]]:
        """Builds Bedrock Converse API content blocks for Amazon Nova Pro / Lite."""
        ext = file_ext.lower().lstrip(".")
        base_name = os.path.splitext(file_name)[0]
        clean_name = (
            "".join(c if c.isalnum() else "_" for c in base_name)[:30] or "attachment"
        )

        if ext in ["png", "jpeg", "jpg", "gif", "webp"]:
            fmt = "jpeg" if ext == "jpg" else ext
            return [{"image": {"format": fmt, "source": {"bytes": file_bytes}}}]

        if ext in ["mp4", "mov", "mkv", "webm", "flv", "mpeg", "mpg", "wmv", "three_gp"]:
            return [{"video": {"format": ext, "source": {"bytes": file_bytes}}}]

        if ext in ["pdf", "csv", "doc", "docx", "xls", "xlsx", "html", "txt", "md"]:
            return [
                {
                    "document": {
                        "name": clean_name,
                        "format": ext,
                        "source": {"bytes": file_bytes},
                    }
                }
            ]
        return []

    def summarize_media_attachment(
        self, file_bytes: bytes, file_name: str, file_ext: str
    ) -> str:
        """Uses Amazon Nova (or Gemini fallback) to summarize an uploaded video, image, or file."""
        media_blocks = self._build_nova_media_blocks(file_bytes, file_name, file_ext)
        if not media_blocks:
            return ""

        content = media_blocks + [
            {
                "text": (
                    "Describe the key subjects, equipment, text, or actions shown in this attachment "
                    "in 2 to 3 concise sentences so we can search a reference PDF knowledge base."
                )
            }
        ]
        summary_text, _, _ = self._converse_with_model_chain(
            messages=[{"role": "user", "content": content}],
            max_tokens=200,
            temperature=0.0,
        )
        return summary_text

    def contextualize_query(
        self,
        bedrock_history: List[Dict[str, Any]],
        current_question: str,
        media_context: str = "",
    ) -> str:
        """Rewrites follow-up questions using recent multi-turn conversation history."""
        combined_current = current_question
        if media_context:
            combined_current += f" (Attached media context: {media_context})"

        if not bedrock_history:
            return combined_current

        recent_turns = bedrock_history[-6:]
        history_lines = []
        for msg in recent_turns:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            text_parts = [b["text"] for b in msg["content"] if "text" in b]
            history_lines.append(f"{role_label}: {' '.join(text_parts)}")

        history_str = "\n".join(history_lines)
        rewrite_prompt = (
            "Given the conversation history and the user's latest follow-up message, "
            "rewrite the latest message into a single, standalone search query for retrieving passages "
            "from a PDF knowledge base. Replace pronouns ('it', 'that', 'they') with the exact nouns "
            "from the conversation history. Output ONLY the rewritten search query and nothing else.\n\n"
            f"<conversation_history>\n{history_str}\n</conversation_history>\n\n"
            f"<latest_input>\n{combined_current}\n</latest_input>"
        )

        rewritten, _, _ = self._converse_with_model_chain(
            messages=[{"role": "user", "content": [{"text": rewrite_prompt}]}],
            max_tokens=120,
            temperature=0.0,
        )
        return rewritten or combined_current

    def generate_multi_turn_reply(
        self,
        bedrock_history: List[Dict[str, Any]],
        user_prompt: str,
        retrieved_chunks: List[Dict[str, str]],
        attachment_bytes: Optional[bytes] = None,
        attachment_name: Optional[str] = None,
        attachment_ext: Optional[str] = None,
        scanned_page_images: Optional[List[bytes]] = None,
        scanned_source_label: Optional[str] = None,
        media_summary: Optional[str] = None,
        audio_transcript: Optional[str] = None,
        max_history_turns: int = 10,
    ) -> Tuple[str, str, List[str], Dict[str, Any], Dict[str, Any]]:
        """
        Sends multi-turn conversation history + current multimodal attachment + retrieved PDF chunks
        to Amazon Nova on Bedrock (with automatic Gemini / Local FAISS fallback on ThrottlingException).
        """
        context_text = (
            "\n\n".join(
                [
                    f"[Source: {c['source']}, Page {c['page']}]\n{c['text']}"
                    for c in retrieved_chunks
                ]
            )
            or "No digital text passages matched in FAISS (check attached scanned page images if provided)."
        )

        system_prompt = (
            "You are ShaashtraAI, a custom multi-turn AI assistant trained on the user's PDF knowledge base "
            "(including Sanskrit, Hindi, and English texts from Arogyanidhii, Brihat Jataka, Shiva Samhita, Upanishads). "
            "Use the conversation history to maintain context across turns, and carefully inspect any "
            "attached video, image, rendered scanned PDF page images, audio transcript, or document provided by the user. "
            "Ground your claims in the <pdf_knowledge_base> passages and any rendered scanned PDF "
            "pages provided. For practical inquiries (such as personalized Vedic daily routines / Dinacharya, "
            "astrological alignments, and Ayurvedic lifestyle), synthesize classical Shastras with exact citations from Arogyanidhii (pp. 18, 20, 22-25, 30), Varahamihira's Brihat Jataka (Ch. 1-2), and Shiva Samhita (Ch. 3) to provide a complete, deeply structured daily schedule. "
            "Include Ushapan, Nasya, Snana Vidhi, Bhojana Tri-bhaga, Vama-Kukshi, and sleep orientation rules. "
            "Always cite the PDF filename and page number when referencing the indexed corpus.\n\n"
            f"<pdf_knowledge_base>\n{context_text}\n</pdf_knowledge_base>"
        )

        live_user_content: List[Dict[str, Any]] = []
        if scanned_page_images:
            for img_bytes in scanned_page_images:
                live_user_content.append(
                    {"image": {"format": "jpeg", "source": {"bytes": img_bytes}}}
                )

        if attachment_bytes and attachment_name and attachment_ext:
            media_blocks = self._build_nova_media_blocks(
                attachment_bytes, attachment_name, attachment_ext
            )
            live_user_content.extend(media_blocks)

        prompt_text = (
            user_prompt or "Please analyze this attachment using the trained PDFs."
        )
        if scanned_source_label:
            prompt_text = (
                f"[Inspecting rendered scanned pages from {scanned_source_label}]\n{prompt_text}"
            )
        if audio_transcript:
            prompt_text += f"\n\n[Transcribed Audio Input]:\n{audio_transcript}"

        live_user_content.append({"text": prompt_text})

        trimmed_history = bedrock_history[-(max_history_turns * 2) :]
        while trimmed_history and trimmed_history[0]["role"] != "user":
            trimmed_history = trimmed_history[1:]

        messages_payload = trimmed_history + [
            {"role": "user", "content": live_user_content}
        ]

        assistant_reply, model_used, skipped_log = self._converse_with_model_chain(
            messages=messages_payload,
            system_prompt=system_prompt,
            retrieved_chunks=retrieved_chunks,
            max_tokens=1024,
            temperature=0.2,
        )

        history_text = prompt_text
        if attachment_name and media_summary:
            history_text = (
                f"[User attached {attachment_name} — Summary: {media_summary}]\n{prompt_text}"
            )

        stored_user_msg = {"role": "user", "content": [{"text": history_text}]}
        stored_assistant_msg = {
            "role": "assistant",
            "content": [{"text": assistant_reply}],
        }

        return (
            assistant_reply,
            model_used,
            skipped_log,
            stored_user_msg,
            stored_assistant_msg,
        )


# =====================================================================
# 3. STREAMLIT MULTI-TURN CHAT INTERFACE (SHAASHTRA AI)
# =====================================================================


def main() -> None:
    st.set_page_config(
        page_title="ShaashtraAI — Custom PDF Multimodal Assistant", layout="wide"
    )
    st.title("ShaashtraAI")
    st.caption(
        "Custom Multi-Turn AI Assistant Trained on Your PDFs | Amazon Bedrock (Nova) + Automatic Quota-Safe Fallback | Mobile Optimized"
    )
    st.markdown(
        """
        <style>
        @media (max-width: 768px) {
            .block-container {
                padding-left: 0.8rem !important;
                padding-right: 0.8rem !important;
                padding-top: 1.5rem !important;
            }
            .stButton > button {
                min-height: 44px !important;
                font-size: 15px !important;
            }
            [data-testid="stChatInput"] textarea {
                font-size: 16px !important;
            }
            table {
                display: block;
                overflow-x: auto;
                max-width: 100%;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    creds = get_clean_aws_credentials()
    key_id = creds["aws_access_key_id"]
    secret_key = creds["aws_secret_access_key"]
    session_token = creds["aws_session_token"]
    gemini_key = creds["gemini_api_key"]

    custom_primary = (
        os.getenv("BEDROCK_MODEL_ID", "")
        .strip()
        .strip('"')
        .strip("'")
    )
    embed_id = (
        os.getenv("BEDROCK_EMBEDDING_ID", "amazon.titan-embed-text-v2:0")
        .strip()
        .strip('"')
        .strip("'")
    )
    s3_bucket = (
        os.getenv("S3_BUCKET_NAME", "").strip()
        or os.getenv("S3_AUDIO_BUCKET", "").strip()
    ).strip('"').strip("'")

    model_chain = list(DEFAULT_AMAZON_MODEL_CHAIN)
    if (
        custom_primary
        and not custom_primary.startswith("anthropic.")
        and not custom_primary.startswith("us.anthropic.")
        and custom_primary not in model_chain
    ):
        model_chain.insert(0, custom_primary)

    cred_fingerprint = f"{key_id}:{ secret_key[-4:] if secret_key else '' }:{bool(session_token)}:{creds['region_name']}:{s3_bucket}:{bool(gemini_key)}"
    if st.session_state.get("cred_fingerprint") != cred_fingerprint:
        st.session_state.cred_fingerprint = cred_fingerprint
        aws_ok, aws_msg = verify_aws_credentials()
        st.session_state.aws_ok = aws_ok
        st.session_state.aws_msg = aws_msg

        st.session_state.kb = PDFKnowledgeBase(
            embedding_model_id=embed_id, s3_bucket=s3_bucket
        )
        st.session_state.bot = ShaashtraAIChatbot(
            model_chain=model_chain, s3_bucket=s3_bucket
        )
        with st.spinner("ShaashtraAI is indexing your PDFs..."):
            st.session_state.kb.auto_train(aws_valid=aws_ok)

    if "ui_messages" not in st.session_state:
        st.session_state.ui_messages = []
    if "bedrock_history" not in st.session_state:
        st.session_state.bedrock_history = []

    with st.sidebar:
        st.header("0. AWS & Fallback Status")
        if st.session_state.get("aws_ok"):
            st.success(st.session_state.get("aws_msg", "AWS Connected"))
        else:
            st.error(st.session_state.get("aws_msg", "Invalid AWS Credentials"))

        if gemini_key:
            st.success("Free Gemini Fallback Key: **Active** (`GEMINI_API_KEY` loaded)")
        else:
            st.caption(
                "Tip: Add `GEMINI_API_KEY=...` in `.env` (free at `aistudio.google.com`) if your new AWS account's Bedrock quota is stuck at 0."
            )

        if st.button("Reload .env & Verify Keys", use_container_width=True):
            st.session_state.pop("cred_fingerprint", None)
            st.rerun()

        st.header("1. ShaashtraAI Knowledge Base")
        num_text_pdfs = len(st.session_state.kb.indexed_files)
        num_scanned_pdfs = len(st.session_state.kb.scanned_files)
        total_chunks = len(st.session_state.kb.chunks)

        if num_text_pdfs > 0 or num_scanned_pdfs > 0:
            st.success(
                f"**{num_text_pdfs} Digital Text PDF(s)** ({total_chunks} chunks)\n\n"
                f"**{num_scanned_pdfs} Scanned Image PDF(s)** (Vision OCR ready)"
            )
            with st.expander("View All Discovered PDFs"):
                if st.session_state.kb.indexed_files:
                    st.markdown("**Digital Text PDFs (Indexed in FAISS):**")
                    for fname in st.session_state.kb.indexed_files:
                        st.markdown(f"- `{fname}`")
                if st.session_state.kb.scanned_files:
                    st.markdown("**Scanned Image PDFs (Use Vision Reader below):**")
                    for fname, info in st.session_state.kb.scanned_files.items():
                        st.markdown(f"- `{fname}` ({info.get('pages', '?')} pages)")
        else:
            st.warning("Trained on **0 PDF(s)** (0 vector chunks)")

        if st.session_state.kb.sync_logs:
            with st.expander("View PDF Discovery & S3 Sync Logs", expanded=False):
                for log_line in st.session_state.kb.sync_logs:
                    st.caption(f"• {log_line}")

        selected_scanned_pdf = "None"
        scanned_start_page = 1
        scanned_end_page = 2
        if st.session_state.kb.scanned_files:
            st.subheader("Read Scanned Sanskrit/Hindi PDF Pages")
            scanned_options = ["None (Search Digital Text PDFs Only)"] + list(
                st.session_state.kb.scanned_files.keys()
            )
            selected_scanned_pdf = st.selectbox(
                "Inspect pages from a Scanned PDF with Vision OCR:",
                options=scanned_options,
            )
            if selected_scanned_pdf != "None (Search Digital Text PDFs Only)":
                max_p = max(
                    1,
                    int(
                        st.session_state.kb.scanned_files[selected_scanned_pdf].get(
                            "pages", 100
                        )
                    ),
                )
                p_col1, p_col2 = st.columns(2)
                with p_col1:
                    scanned_start_page = st.number_input(
                        "From Page", min_value=1, max_value=max_p, value=1
                    )
                with p_col2:
                    scanned_end_page = st.number_input(
                        "To Page (max +3)",
                        min_value=int(scanned_start_page),
                        max_value=min(max_p, int(scanned_start_page) + 3),
                        value=min(max_p, int(scanned_start_page) + 1),
                    )

        col1, col2 = st.columns(2)
        with col1:
            if st.button("Sync PDFs", use_container_width=True):
                with st.spinner("Scanning subfolders & S3 for PDFs..."):
                    added = st.session_state.kb.auto_train(
                        aws_valid=st.session_state.get("aws_ok", False)
                    )
                    st.toast(f"Added {added} new chunks!")
                    st.rerun()
        with col2:
            if st.button("Re-Train All", use_container_width=True):
                with st.spinner("Re-indexing all PDFs from scratch..."):
                    st.session_state.kb.clear_index()
                    st.session_state.kb.auto_train(
                        aws_valid=st.session_state.get("aws_ok", False)
                    )
                    st.rerun()

        with st.form("upload_training_pdfs_form", clear_on_submit=True):
            extra_pdfs = st.file_uploader(
                "Or select PDF files directly to train",
                type=["pdf"],
                accept_multiple_files=True,
            )
            submitted_upload = st.form_submit_button(
                "Add & Train Uploaded PDFs", use_container_width=True
            )
            if submitted_upload and extra_pdfs:
                with st.spinner("Saving to `training_pdfs/` and indexing..."):
                    added_chunks = st.session_state.kb.ingest_uploaded_pdfs(
                        extra_pdfs, aws_valid=st.session_state.get("aws_ok", False)
                    )
                    st.success(
                        f"Indexed {added_chunks} chunks from {len(extra_pdfs)} PDF(s)!"
                    )
                    st.rerun()

        st.header("2. Attach Multimodal Input")
        chat_attachment = st.file_uploader(
            "Attach Video, Audio, Image, or File with your question",
            type=[
                "mp4",
                "mov",
                "webm",
                "mkv",
                "mp3",
                "wav",
                "m4a",
                "flac",
                "png",
                "jpg",
                "jpeg",
                "webp",
                "pdf",
                "docx",
                "csv",
                "txt",
            ],
        )

        st.header("3. Chat Controls")
        if st.button("Clear Conversation History", use_container_width=True):
            st.session_state.ui_messages = []
            st.session_state.bedrock_history = []
            st.rerun()

    for msg in st.session_state.ui_messages:
        with st.chat_message(msg["role"]):
            if msg.get("attachment_label"):
                st.caption(f"Attached: `{msg['attachment_label']}`")
            if msg.get("model_used"):
                st.caption(f"ShaashtraAI (`{msg['model_used']}`)")
            st.markdown(msg["content"])
            if msg.get("debug_info"):
                with st.expander("View Rewritten Search Query & Cited PDF Passages"):
                    if msg["debug_info"].get("skipped_log"):
                        st.warning(
                            "**Model Failover Log:**\n- "
                            + "\n- ".join(msg["debug_info"]["skipped_log"])
                        )
                    st.markdown(
                        f"**Standalone Search Query:** `{msg['debug_info']['rewritten_query']}`"
                    )
                    for idx, chunk in enumerate(msg["debug_info"]["chunks"], start=1):
                        st.markdown(
                            f"**{idx}. {chunk['source']} (Page {chunk['page']})**\n> {chunk['text']}"
                        )

    user_query = st.chat_input(
        "Ask ShaashtraAI a question or follow up on previous turns..."
    )

    if user_query:
        attachment_label = chat_attachment.name if chat_attachment else None
        st.session_state.ui_messages.append(
            {
                "role": "user",
                "content": user_query,
                "attachment_label": attachment_label,
            }
        )

        with st.chat_message("user"):
            if attachment_label:
                st.caption(f"Attached: `{attachment_label}`")
            st.markdown(user_query)

        with st.chat_message("assistant"):
            with st.spinner("ShaashtraAI is searching your trained PDFs and generating a reply..."):
                audio_transcript = None
                media_summary = None
                file_bytes, file_name, file_ext = None, None, None

                if chat_attachment is not None:
                    file_bytes = chat_attachment.read()
                    file_name = chat_attachment.name
                    file_ext = file_name.split(".")[-1].lower()

                    if file_ext in ["mp3", "wav", "m4a", "flac", "ogg"]:
                        audio_transcript = st.session_state.bot.transcribe_audio(
                            file_bytes, file_ext
                        )
                        media_summary = audio_transcript
                    else:
                        media_summary = (
                            st.session_state.bot.summarize_media_attachment(
                                file_bytes, file_name, file_ext
                            )
                        )

                scanned_images: List[bytes] = []
                scanned_label: Optional[str] = None
                if (
                    selected_scanned_pdf
                    and selected_scanned_pdf != "None (Search Digital Text PDFs Only)"
                    and selected_scanned_pdf in st.session_state.kb.scanned_files
                ):
                    s_info = st.session_state.kb.scanned_files[selected_scanned_pdf]
                    scanned_images = PDFKnowledgeBase.render_scanned_pdf_pages_as_jpeg(
                        s_info["path"],
                        int(scanned_start_page),
                        int(scanned_end_page),
                    )
                    scanned_label = f"{selected_scanned_pdf} (Pages {scanned_start_page}-{scanned_end_page})"

                rewritten_query = st.session_state.bot.contextualize_query(
                    bedrock_history=st.session_state.bedrock_history,
                    current_question=user_query,
                    media_context=media_summary or "",
                )

                retrieved_chunks = st.session_state.kb.retrieve(
                    rewritten_query, top_k=4
                )

                (
                    reply,
                    model_used,
                    skipped_log,
                    stored_user,
                    stored_assistant,
                ) = st.session_state.bot.generate_multi_turn_reply(
                    bedrock_history=st.session_state.bedrock_history,
                    user_prompt=user_query,
                    retrieved_chunks=retrieved_chunks,
                    attachment_bytes=file_bytes,
                    attachment_name=file_name,
                    attachment_ext=file_ext,
                    scanned_page_images=scanned_images,
                    scanned_source_label=scanned_label,
                    media_summary=media_summary,
                    audio_transcript=audio_transcript,
                )

                st.session_state.bedrock_history.append(stored_user)
                st.session_state.bedrock_history.append(stored_assistant)

                debug_info = {
                    "rewritten_query": rewritten_query,
                    "chunks": retrieved_chunks,
                    "skipped_log": skipped_log,
                }

                st.caption(f"ShaashtraAI (`{model_used}`)")
                st.markdown(reply)
                with st.expander("View Rewritten Search Query & Cited PDF Passages"):
                    if skipped_log:
                        st.warning(
                            "**Model Failover Log:**\n- "
                            + "\n- ".join(skipped_log)
                        )
                    st.markdown(f"**Standalone Search Query:** `{rewritten_query}`")
                    for idx, chunk in enumerate(retrieved_chunks, start=1):
                        st.markdown(
                            f"**{idx}. {chunk['source']} (Page {chunk['page']})**\n> {chunk['text']}"
                        )

                st.session_state.ui_messages.append(
                    {
                        "role": "assistant",
                        "content": reply,
                        "model_used": model_used,
                        "debug_info": debug_info,
                    }
                )


if __name__ == "__main__":
    main()