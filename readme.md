# ShaashtraAI — Custom Multi-Turn Multimodal PDF RAG Assistant

**ShaashtraAI** is a custom multi-turn, multimodal Retrieval-Augmented Generation (RAG) AI assistant built in Python with [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html), [FAISS](https://pypi.org/project/faiss-cpu/), [PyMuPDF](https://pypi.org/project/pymupdf/), and [Streamlit](https://docs.streamlit.io/). It automatically indexes collections of reference PDFs—including Sanskrit, Hindi, and English texts—and answers user questions across multi-turn conversations using text, video, audio, image, and document inputs.

## Key Features

- **Automatic Dual-Mode PDF Ingestion (Digital Text + Scanned Manuscripts)**:
  - Recursively scans local `training_pdfs/` and `training_pdf/` directories (including nested subfolders) as well as an [Amazon S3](https://docs.aws.amazon.com/boto3/latest/reference/services/s3.html) bucket on startup.
  - Extracts text from digital PDFs using [PyMuPDF (`fitz`)](https://pypi.org/project/pymupdf/) and fault-tolerant [`pypdf`](https://pypdf.readthedocs.io/) fallback, storing 1024-dimension vectors in a persistent local [`faiss-cpu`](https://pypi.org/project/faiss-cpu/) index (`faiss_index.bin`).
  - Automatically detects scanned image PDFs (such as archival Sanskrit and Hindi books with no embedded text layer) and registers them in a built-in **Scanned PDF Vision OCR Reader** that renders selected pages to high-resolution JPEG images for vision-model analysis.
- **History-Aware Multi-Turn Conversations**:
  - Rewrites follow-up questions using recent conversation turns (`contextualize_query`) so pronouns like *"it"*, *"they"*, or *"that verse"* are resolved into standalone search queries before vector retrieval.
  - Compresses historical multimodal attachments into concise text summaries after each turn so multi-turn conversations remain fast and never exceed API payload limits.
- **Full Multimodal Input Support**:
  - **Text**: Direct multi-turn questions and follow-ups.
  - **Video (`mp4`, `mov`, `webm`, `mkv`)**: Native video bytes for [Amazon Nova](https://docs.aws.amazon.com/nova/latest/userguide/modalities-video-examples.html) and keyframe extraction via [`opencv-python`](https://pypi.org/project/opencv-python/).
  - **Audio (`mp3`, `wav`, `m4a`, `flac`, `ogg`)**: Speech-to-text transcription via [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/) using temporary S3 storage with automatic cleanup.
  - **Images (`png`, `jpg`, `jpeg`, `webp`) & Documents (`pdf`, `docx`, `csv`, `txt`)**: Native vision and document content blocks via the [Amazon Bedrock Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html).
- **3-Tier Resilient Model Failover**:
  - **Tier 1 (Primary AWS Bedrock Chain)**: Attempts `us.amazon.nova-pro-v1:0` → `us.amazon.nova-lite-v1:0` → `us.amazon.nova-micro-v1:0` → `amazon.titan-text-express-v1`.
  - **Tier 2 (Quota-Safe Cloud Fallback)**: Automatically routes to [Google Gemini](https://ai.google.dev/gemini-api/docs) (`gemini-2.5-flash`) over HTTPS if a new AWS account encounters `ThrottlingException` (`0 tokens/day` initial quota).
  - **Tier 3 (Zero-Crash Local FAISS Retriever)**: Displays exact matching passages and page citations directly from the local FAISS index if all cloud endpoints are unreachable.

## Architecture & Tech Stack

| Component | Technology / Service | Role in ShaashtraAI |
| :--- | :--- | :--- |
| **Frontend UI** | [Streamlit](https://docs.streamlit.io/) | Multi-turn chat interface, sidebar diagnostics, and Scanned PDF Vision OCR page selector |
| **Primary LLM & Vision** | [Amazon Nova Pro & Lite](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) (`bedrock-runtime`) | Multi-turn query rewriting, media summarization, scanned page OCR, and grounded response generation |
| **Quota-Safe Fallback LLM** | [Google Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs) (REST API) | Automatic zero-downtime failover when AWS Bedrock daily token quotas are throttled |
| **Speech-to-Text** | [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/) + [Amazon S3](https://docs.aws.amazon.com/boto3/latest/reference/services/s3.html) | Converts user audio questions into text transcripts |
| **PDF Parsing & Rendering** | [PyMuPDF (`fitz`)](https://pypi.org/project/pymupdf/), [`pypdf`](https://pypdf.readthedocs.io/), [`fonttools`](https://pypi.org/project/fonttools/) | Fault-tolerant text extraction and 150-DPI JPEG page rendering for scanned Sanskrit/Hindi texts |
| **Vector Database** | [`faiss-cpu`](https://pypi.org/project/faiss-cpu/) + [`numpy`](https://pypi.org/project/numpy/) | Persistent local 1024-dimension similarity search (`faiss_index.bin` & `chunks_metadata.json`) |
| **Video Processing** | [`opencv-python`](https://pypi.org/project/opencv-python/) (`cv2`) | Evenly spaced JPEG keyframe sampling from video attachments |
| **AWS SDK & Auth** | [`boto3`](https://docs.aws.amazon.com/boto3/latest/) + [`python-dotenv`](https://pypi.org/project/python-dotenv/) | AWS session management and live `sts:GetCallerIdentity` credential verification |

## Project Structure

```text
ShaastraAI/
├── training_pdfs/           # Place your training PDFs (or subfolders of PDFs) here
├── app.py                   # Main Streamlit application, RAG engine, and multi-tier model router
├── requirements.txt         # Python package dependencies
├── .env.example             # Template for environment variables
├── .gitignore               # Excludes .env, .venv/, training_pdfs/, and local FAISS cache
└── README.md                # Project documentation
```

## Prerequisites

1. **Python 3.10+** installed locally (or configured via a PyCharm virtual environment).
2. **AWS Account** with an IAM User holding `AmazonBedrockFullAccess`, `AmazonTranscribeFullAccess`, and `AmazonS3FullAccess` policies.
3. **Amazon S3 Bucket** in `us-east-1` for temporary audio transcription storage and optional cloud PDF syncing.
4. *(Optional)* **Google AI Studio API Key** (`GEMINI_API_KEY`) from [Google AI Studio](https://aistudio.google.com/) as a free automatic fallback if your AWS account's Bedrock quota is not yet seeded.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ShaastraAI.git
cd ShaastraAI
```

### 2. Create a Virtual Environment and Install Dependencies

```bash
python -m venv .venv
# Windows (Command Prompt / PowerShell)
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory (never commit `.env` to Git):

```ini
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=your_40_character_secret_access_key
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
BEDROCK_MODEL_ID=us.amazon.nova-pro-v1:0
BEDROCK_EMBEDDING_ID=amazon.titan-embed-text-v2:0
GEMINI_API_KEY=optional_free_gemini_api_key_for_throttling_fallback
```

### 4. Add Your Training PDFs

Place your PDF documents (or subfolders of PDFs) inside the `training_pdfs/` directory in the project root, or upload them to your configured S3 bucket.

### 5. Run the Application

```bash
streamlit run app.py
```

The application will open automatically at `http://localhost:8501`.

## How to Use ShaashtraAI

1. **Verify AWS Connection**: Check **0. AWS & Fallback Status** at the top of the left sidebar to confirm your IAM user ARN is connected.
2. **Inspect Indexed Knowledge Base**: Under **1. ShaashtraAI Knowledge Base**, view how many **Digital Text PDFs** were chunked into FAISS and how many **Scanned Image PDFs** were registered for Vision OCR.
3. **Query Digital Text PDFs**: Type any question in the bottom chat input. ShaashtraAI rewrites follow-up pronouns using conversation history, retrieves the top matching passages, and cites the exact PDF filename and page number.
4. **Read Scanned Sanskrit/Hindi Manuscripts**: Select any scanned book under **Read Scanned Sanskrit/Hindi PDF Pages** in the sidebar, pick a page range (e.g., Pages 1–3), and ask your question—ShaashtraAI renders those pages to images and reads the Sanskrit or Hindi text directly.
5. **Attach Multimodal Files**: Upload a video (`mp4`, `mov`), audio clip (`mp3`, `wav`), image (`png`, `jpg`), or document under **2. Attach Multimodal Input** to analyze user media against your trained PDFs.
6. **Audit Retrieval & Model Routing**: Expand **View Rewritten Search Query & Cited PDF Passages** beneath any assistant response to inspect the standalone search query, model failover logs, and raw PDF excerpts used to generate the answer.
