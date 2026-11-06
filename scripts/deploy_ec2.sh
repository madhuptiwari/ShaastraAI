#!/bin/bash
# =====================================================================
# ShaastraAI — 1-Click AWS EC2 Deployment Script
# Tested on Amazon Linux 2023 & Ubuntu 22.04 / 24.04 LTS
# Can be run as regular user or root (handles sudo automatically)
# =====================================================================

set -e

echo "=========================================================="
echo " Starting ShaastraAI Automated EC2 Deployment Setup... "
echo "=========================================================="

# Helper for sudo
SUDO=""
if [ "$EUID" -ne 0 ]; then
    SUDO="sudo"
fi

# Detect current non-root user (ec2-user or ubuntu)
CURRENT_USER=${SUDO_USER:-$(whoami)}

# 1. Setup 2GB Swap Memory (guarantees t3.micro/t2.micro never runs out of memory during build)
if ! swapon --show | grep -q "/swapfile"; then
    echo "Configuring 2GB Swap Memory for smooth container builds..."
    $SUDO fallocate -l 2G /swapfile 2>/dev/null || $SUDO dd if=/dev/zero of=/swapfile bs=1M count=2048
    $SUDO chmod 600 /swapfile
    $SUDO mkswap /swapfile
    $SUDO swapon /swapfile
    if ! grep -q "/swapfile" /etc/fstab; then
        echo '/swapfile none swap sw 0 0' | $SUDO tee -a /etc/fstab
    fi
    echo "Swap memory active."
fi

# 2. Detect OS and install Docker & Git
if command -v dnf &> /dev/null; then
    echo "Detected Amazon Linux 2023 / Fedora / RHEL..."
    $SUDO dnf update -y
    $SUDO dnf install -y docker git curl
    $SUDO systemctl start docker
    $SUDO systemctl enable docker
    $SUDO usermod -aG docker "$CURRENT_USER" || true
elif command -v apt-get &> /dev/null; then
    echo "Detected Ubuntu / Debian..."
    $SUDO apt-get update -y
    $SUDO apt-get install -y docker.io git curl
    $SUDO systemctl start docker
    $SUDO systemctl enable docker
    $SUDO usermod -aG docker "$CURRENT_USER" || true
fi

# 3. Setup project directory with correct user permissions
DEPLOY_DIR="/opt/shaastra-ai"
echo "Setting up application directory at: $DEPLOY_DIR"
$SUDO mkdir -p "$DEPLOY_DIR"
$SUDO chown -R "$CURRENT_USER:$CURRENT_USER" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# 4. Pull or clone repository
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "Existing git repository found. Pulling latest master branch..."
    git pull origin master
else
    echo "Cloning repository..."
    git clone https://github.com/madhuptiwari/ShaastraAI.git .
fi

# Ensure user owns the files
$SUDO chown -R "$CURRENT_USER:$CURRENT_USER" "$DEPLOY_DIR"

# 5. Create or verify .env file
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

# 6. Build and run Docker container
echo "Building ShaastraAI Docker container..."
$SUDO docker build -t shaastra-ai:latest .

echo "Stopping any existing container..."
$SUDO docker stop shaastra-ai-portal 2>/dev/null || true
$SUDO docker rm shaastra-ai-portal 2>/dev/null || true

echo "Starting ShaastraAI on port 80 and 8000 with auto-restart..."
$SUDO docker run -d \
    --name shaastra-ai-portal \
    --restart always \
    -p 80:8000 \
    -p 8000:8000 \
    --env-file .env \
    shaastra-ai:latest

# Fetch public IP address
PUBLIC_IP=$(curl -s --connect-timeout 2 https://checkip.amazonaws.com || curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/public-ipv4 || echo "YOUR_EC2_PUBLIC_IP")

echo "=========================================================="
echo " ShaastraAI is successfully deployed and running! "
echo " Access your portal at: http://$PUBLIC_IP"
echo " Health check: http://$PUBLIC_IP/health"
echo "=========================================================="
