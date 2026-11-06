#!/bin/bash
# =====================================================================
# ShaastraAI — 1-Click AWS EC2 Deployment Script
# Tested on Amazon Linux 2023 & Ubuntu 22.04 / 24.04 LTS
# Can be run manually via SSH or added to EC2 User Data at launch.
# =====================================================================

set -e

echo "=========================================================="
echo " Starting ShaastraAI Automated EC2 Deployment Setup... "
echo "=========================================================="

# 1. Detect OS and install Docker & Git
if command -v dnf &> /dev/null; then
    echo "Detected Amazon Linux 2023 / Fedora / RHEL..."
    dnf update -y
    dnf install -y docker git curl
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user || true
elif command -v apt-get &> /dev/null; then
    echo "Detected Ubuntu / Debian..."
    apt-get update -y
    apt-get install -y docker.io git curl
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ubuntu || true
fi

# 2. Setup project directory
DEPLOY_DIR="/opt/shaastra-ai"
echo "Setting up application directory at: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# 3. Pull or clone repository
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "Existing git repository found. Pulling latest master branch..."
    git pull origin master
else
    echo "Cloning repository..."
    git clone https://github.com/madhuptiwari/ShaastraAI.git .
fi

# 4. Create or verify .env file
if [ ! -f .env ]; then
    echo "Creating .env template..."
    cat <<EOT > .env
PORT=8000
GEMINI_API_KEY=
AWS_DEFAULT_REGION=us-east-1
BEDROCK_MODEL_ID=us.amazon.nova-lite-v1:0
EOT
    echo "Notice: Please add your GEMINI_API_KEY to $DEPLOY_DIR/.env"
fi

# 5. Build and run Docker container
echo "Building ShaastraAI Docker container..."
docker build -t shaastra-ai:latest .

echo "Stopping any existing container..."
docker stop shaastra-ai-portal 2>/dev/null || true
docker rm shaastra-ai-portal 2>/dev/null || true

echo "Starting ShaastraAI on port 8000 with auto-restart..."
docker run -d \
    --name shaastra-ai-portal \
    --restart always \
    -p 80:8000 \
    -p 8000:8000 \
    --env-file .env \
    shaastra-ai:latest

echo "=========================================================="
echo " ShaastraAI is successfully deployed and running! "
echo " Access your portal at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo 'YOUR_EC2_PUBLIC_IP')"
echo " Health check: http://localhost:8000/health"
echo "=========================================================="
