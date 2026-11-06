# =====================================================================
# ShaastraAI Production Dockerfile for AWS Deployment
# Optimized for AWS App Runner, Amazon ECS (Fargate), and Amazon EC2
# =====================================================================

FROM python:3.11-slim

# Set environment defaults
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    APP_HOME=/app

WORKDIR ${APP_HOME}

# Install minimal system dependencies (curl for container healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for caching layers
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code and web assets
COPY serve.py .
COPY app.py .
COPY public/ ./public/

# Copy pre-indexed classical Shastra vector database and metadata
# (Allows 100% offline zero-latency RAG on AWS without re-indexing)
COPY chunks_metadata.json .
COPY faiss_index.bin .

# Expose web portal port
EXPOSE 8000

# Container Healthcheck (AWS App Runner / ALB / ECS will probe this endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the threaded web portal and RAG API server
CMD ["python", "serve.py"]
