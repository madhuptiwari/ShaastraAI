# ShaashtraAI — Custom Multi-Turn Multimodal PDF RAG Assistant

[![Netlify Status](https://api.netlify.com/api/v1/badges/e95758d2-b464-4afb-99ec-f6dc1d649bc5/deploy-status)](https://shaastraai.netlify.app/)
[![Live Web Portal](https://img.shields.io/badge/Netlify_Edge-Live_Portal-00c7b7?style=flat&logo=netlify)](https://shaastraai.netlify.app/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat&logo=python)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.40+-ff4b4b?style=flat&logo=streamlit)](https://streamlit.io)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock_Nova-ff9900?style=flat&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285f4?style=flat&logo=google)](https://ai.google.dev/)

**ShaashtraAI** is a custom multi-turn, multimodal Retrieval-Augmented Generation (RAG) AI assistant built with [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html), [Google Gemini](https://ai.google.dev/), [FAISS](https://pypi.org/project/faiss-cpu/), [PyMuPDF](https://pypi.org/project/pymupdf/), and [Streamlit](https://docs.streamlit.io/). It automatically indexes collections of reference PDFs—including ancient Sanskrit manuscripts, Hindi texts, and English scholarship—and answers user questions across multi-turn conversations using text, video, audio, image, and document inputs.

🌐 **Live Netlify Web Portal**: [https://shaastraai.netlify.app/](https://shaastraai.netlify.app/)  
📂 **GitHub Repository**: [https://github.com/madhuptiwari/ShaastraAI](https://github.com/madhuptiwari/ShaastraAI)

---

## Deployments & Access

ShaastraAI offers two complementary access modalities:

1. **Netlify Edge Web Portal ([https://shaastraai.netlify.app/](https://shaastraai.netlify.app/))**:
   - Hosted globally on Netlify Edge CDN.
   - Interactive multi-turn chat interface with live query synthesis, multimodal attachment simulation, and 1-click prompt chips.
   - **Personalized Vedic Dinacharya (दिनचर्या) & Jyotisha Engine**: Generates hour-by-hour schedules based on the user's name, Sun Sign (Surya Rashi), and Nakshatra.
   - **Netlify Serverless Function** (`netlify/functions/chat.js`): Secure serverless edge proxy calling Google Gemini 2.5 Flash when `GEMINI_API_KEY` is configured.
   - Live architectural visualizers and status diagnostics.

2. **Full Local / Cloud Python Streamlit Backend (`app.py`)**:
   - Runs the complete deep RAG engine with local FAISS vector search, PyMuPDF extraction, and Amazon Bedrock Converse API.
   - Scanned PDF Vision OCR reader rendering archival Sanskrit/Hindi manuscript pages at 150-DPI for vision analysis.
   - Amazon Transcribe audio processing and OpenCV video keyframe extraction.

---

## Key Features

- **Personalized Vedic Dinacharya (Daily Routine) & Jyotisha Engine**:
  - Synthesizes classical Ayurveda (*Charaka Samhita Sutrasthana Ch. 5*, *Ashtanga Hridaya Sutrasthana Ch. 2*) with *Jyotisha Horas* (planetary hours) and *Nakshatra Tatvas*.
  - Fine-tuned directly against the uploaded Shastric corpus with precise page and chapter citations:
    - **Arogyanidhii.pdf**: *Ushapan* (500–1250 ml copper vessel water before dawn, p. 20), *Pratimarsa Nasya* (2 drops warm oil in nostrils, p. 20), *Snana Vidhi* (pouring water on head first to protect eyes and brain, p. 22), *Bhojana Tri-bhaga* (stomach 1/2 solid, 1/4 liquid, 1/4 empty, pp. 22–24), *Vama-Kukshi* & *Vajrasana* to ignite Surya Nadi (p. 25), and geomagnetic sleep orientation (head East or South; never North, pp. 18, 30).
    - **Varahamihira's Brihat Jataka**: 12 Kalapurusha anatomical signs, 4 Maha-Tatvas, and the 24-Hora diurnal planetary sequence (Ch. 1-2).
    - **Shiva Samhita (With Hindi Tika)**: 72,000 Nadis and *Nadi Shodhana* balancing Ida (lunar) and Pingala (solar) channels (Ch. 3, vv. 1–40).
  - Generates an 11-step, time-blocked daily schedule from **Brahma Muhurta (04:30 AM)** to **Nidra (10:00 PM)**.
  - Automatically parses and customizes routines based on:
    - **User's Name** (personal addressing).
    - **Sun Sign (Surya Rashi)**: 
      - *Agni / Fire* (Aries, Leo, Sagittarius): Cooling Abhyanga oils (coconut/sandalwood), *Sheetali* pranayama, avoiding noon exertion.
      - *Prithvi / Earth* (Taurus, Virgo, Capricorn): Dynamic brisk workouts, *Kapalabhati*, early dawn waking to pierce Kapha lethargy.
      - *Vayu / Air* (Gemini, Libra, Aquarius): Grounding rhythms, warm sesame oil Abhyanga, *Nadi Shodhana*.
      - *Jala / Water* (Cancer, Scorpio, Pisces): Lymphatic circulation, *Surya Bhedana*, warming non-mucous foods.
    - **Nakshatras** (27 Nakshatras & their Vata/Pitta/Kapha doshas, ruling deities, and planetary Horas).
  - Includes interactive, 1-click test buttons directly in the chat interface.

- **Universal Mobile & Multi-Resolution Optimization**:
  - **Comprehensive Screen Support**: Seamlessly engineered for extra-small screens (320px–360px), standard smartphones (375px–430px iPhone/Pixel/Galaxy), foldables and phablets (480px–600px), tablets (768px–1024px iPad/Galaxy Tab), and desktop displays.
  - **Off-Canvas Mobile Navigation Drawer**: Built-in hamburger navigation menu with smooth slide-out transitions, frosted glass blur, quick-action prompt chips, and backdrop dismiss.
  - **iOS Safari & Android Viewport Hardening**:
    - `viewport-fit=cover` and dynamic viewport units (`dvh` / `min(680px, 85dvh)`) to accommodate mobile URL address bars.
    - Notch & Dynamic Island awareness using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
    - Virtual keyboard awareness via `window.visualViewport` listener and `font-size: 16px !important` on mobile inputs to eliminate unwanted iOS Safari auto-zooming.
  - **Touch Ergonomics & Native Sheet Experience**:
    - All touch targets strictly $\ge 44\text{px} \times 44\text{px}$ adhering to Apple Human Interface & Google Material guidelines.
    - Responsive horizontally scrollable Tatva tables with `-webkit-overflow-scrolling: touch`.
    - Settings modal transforms into a native mobile bottom sheet with rounded drag handles on devices $\le 640\text{px}$.

- **Automatic Dual-Mode PDF Ingestion (Digital Text + Scanned Manuscripts)**:
  - Recursively scans local `training_pdfs/` and `training_pdf/` directories (including nested subfolders) and Amazon S3 buckets on startup.
  - Extracts text from digital PDFs using [PyMuPDF (`fitz`)](https://pypi.org/project/pymupdf/) and fault-tolerant [`pypdf`](https://pypdf.readthedocs.io/), storing 1024-dimension vectors in a persistent local [`faiss-cpu`](https://pypi.org/project/faiss-cpu/) index (`faiss_index.bin`).
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

---

## Architecture & Tech Stack

| Component | Technology / Service | Role in ShaashtraAI |
| :--- | :--- | :--- |
| **Edge Web Portal** | [Netlify Edge](https://www.netlify.com/) + Vanilla HTML5/CSS3/ES6 | Global CDN hosting, interactive chat assistant, and Dinacharya engine |
| **Serverless API** | Netlify Functions (Node.js 18+) | Serverless proxy for Google Gemini 2.5 Flash API calls |
| **Python GUI** | [Streamlit](https://docs.streamlit.io/) | Multi-turn chat interface, sidebar diagnostics, and Vision OCR page selector |
| **Primary LLM & Vision** | [Amazon Nova Pro & Lite](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) (`bedrock-runtime`) | Multi-turn query rewriting, media summarization, scanned page OCR, and grounded generation |
| **Quota-Safe Fallback LLM** | [Google Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs) (REST API) | Automatic zero-downtime failover when AWS Bedrock daily token quotas are throttled |
| **Speech-to-Text** | [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/) + [Amazon S3](https://docs.aws.amazon.com/boto3/latest/reference/services/s3.html) | Converts user audio questions into text transcripts |
| **PDF Parsing & Rendering** | [PyMuPDF (`fitz`)](https://pypi.org/project/pymupdf/), [`pypdf`](https://pypdf.readthedocs.io/), [`fonttools`](https://pypi.org/project/fonttools/) | Fault-tolerant text extraction and 150-DPI JPEG page rendering for scanned Sanskrit/Hindi texts |
| **Vector Database** | [`faiss-cpu`](https://pypi.org/project/faiss-cpu/) + [`numpy`](https://pypi.org/project/numpy/) | Persistent local 1024-dimension similarity search (`faiss_index.bin` & `chunks_metadata.json`) |
| **Video Processing** | [`opencv-python`](https://pypi.org/project/opencv-python/) (`cv2`) | Evenly spaced JPEG keyframe sampling from video attachments |
| **AWS SDK & Auth** | [`boto3`](https://docs.aws.amazon.com/boto3/latest/) + [`python-dotenv`](https://pypi.org/project/python-dotenv/) | AWS session management and live `sts:GetCallerIdentity` credential verification |

---

## Project Structure

```text
ShaastraAI/
├── public/                  # Netlify Edge web application & portal
│   ├── index.html           # Modern interactive UI & documentation portal
│   ├── styles.css           # Responsive obsidian & saffron theme
│   ├── app.js               # Multi-turn assistant, Dinacharya generator & RAG knowledge client
│   └── favicon.svg          # Vector brand icon
├── netlify/
│   └── functions/
│       └── chat.js          # Secure Netlify serverless Gemini API proxy
├── netlify.toml             # Netlify deployment, headers, and SPA edge routing
├── training_pdfs/           # Place your reference/training PDFs (or subfolders) here
├── app.py                   # Main Streamlit application, RAG engine, and multi-tier model router
├── requirements.txt         # Python package dependencies
├── .env.example             # Template for environment variables
├── .gitignore               # Excludes .env, .venv/, training_pdfs/, and local FAISS cache
└── README.md                # Project documentation
```

---

## Prerequisites

1. **Python 3.10+** installed locally (or configured via a PyCharm virtual environment).
2. **AWS Account** with an IAM User holding `AmazonBedrockFullAccess`, `AmazonTranscribeFullAccess`, and `AmazonS3FullAccess` policies.
3. **Amazon S3 Bucket** in `us-east-1` for temporary audio transcription storage and optional cloud PDF syncing.
4. *(Optional)* **Google AI Studio API Key** (`GEMINI_API_KEY`) from [Google AI Studio](https://aistudio.google.com/) as a free automatic fallback if your AWS account's Bedrock quota is not yet seeded.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/madhuptiwari/ShaastraAI.git
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

---

## How to Use ShaashtraAI

### 1. Using the Web Portal ([https://shaastraai.netlify.app/](https://shaastraai.netlify.app/))
- **Personalized Daily Routine (Dinacharya)**:
  - Ask: *"Make a daily routine based on my name, sun sign, nakshatra, etc"*
  - Or supply specific details: *"Make a daily routine for Madhur with Leo sun sign and Magha nakshatra"*
  - Click any of the interactive profile chips (*Leo + Magha*, *Gemini + Swati*, *Taurus + Rohini*, *Aries + Ashwini*, *Pisces + Revati*) to view instant personalized schedules.
- **Classical Shastric Inquiries**:
  - Ask about *Charaka Samhita*, *Mandukya Upanishad*, *Bhagavad Gita Karma Yoga*, *Patanjali Yoga Sutras*, or *Surya Siddhanta*.
- **Multimodal Testing**:
  - Simulate attaching PDFs, images, or audio clips.
- **API Settings**:
  - Click the gear icon in the header to enter an optional personal Gemini API key for live browser requests, or configure `GEMINI_API_KEY` in Netlify Site Settings for serverless execution.

### 2. Using the Python Streamlit App (`app.py`)
1. **Verify AWS Connection**: Check **0. AWS & Fallback Status** at the top of the left sidebar to confirm your IAM user ARN is connected.
2. **Inspect Indexed Knowledge Base**: Under **1. ShaashtraAI Knowledge Base**, view how many **Digital Text PDFs** were chunked into FAISS and how many **Scanned Image PDFs** were registered for Vision OCR.
3. **Query Digital Text PDFs**: Type any question in the bottom chat input. ShaashtraAI rewrites follow-up pronouns using conversation history, retrieves the top matching passages, and cites the exact PDF filename and page number.
4. **Read Scanned Sanskrit/Hindi Manuscripts**: Select any scanned book under **Read Scanned Sanskrit/Hindi PDF Pages** in the sidebar, pick a page range (e.g., Pages 1–3), and ask your question—ShaashtraAI renders those pages to images and reads the Sanskrit or Hindi text directly.
5. **Attach Multimodal Files**: Upload a video (`mp4`, `mov`), audio clip (`mp3`, `wav`), image (`png`, `jpg`), or document under **2. Attach Multimodal Input** to analyze user media against your trained PDFs.
6. **Audit Retrieval & Model Routing**: Expand **View Rewritten Search Query & Cited PDF Passages** beneath any assistant response to inspect the standalone search query, model failover logs, and raw PDF excerpts used to generate the answer.

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
