#!/bin/bash
# =====================================================================
# ShaastraAI — Automated HTTPS / SSL Setup with Nginx Reverse Proxy
# Enables HTTPS on port 443 (via self-signed SAN IP cert and sslip.io)
# =====================================================================

set -e

echo "=========================================================="
echo " Setting up HTTPS / SSL for ShaastraAI... "
echo "=========================================================="

SUDO=""
if [ "$EUID" -ne 0 ]; then
    SUDO="sudo"
fi

# Detect Public IP
PUBLIC_IP=$(curl -s --connect-timeout 2 https://checkip.amazonaws.com || curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/public-ipv4 || echo "3.27.42.68")
DASHED_IP=$(echo "$PUBLIC_IP" | tr '.' '-')
SSSLIP_DOMAIN="${DASHED_IP}.sslip.io"

echo "Detected Public IP: $PUBLIC_IP"
echo "Assigned Free SSL Domain: $SSSLIP_DOMAIN"

# 1. Install Nginx and OpenSSL
if command -v dnf &> /dev/null; then
    echo "Installing Nginx on Amazon Linux 2023..."
    $SUDO dnf install -y --allowerasing nginx openssl
elif command -v apt-get &> /dev/null; then
    echo "Installing Nginx on Ubuntu/Debian..."
    $SUDO apt-get update -y
    $SUDO apt-get install -y nginx openssl
fi

# 2. Setup SSL Certificate Directories and generate SAN Certificate
$SUDO mkdir -p /etc/pki/tls/certs /etc/pki/tls/private /etc/ssl/certs /etc/ssl/private
CERT_PATH="/etc/pki/tls/certs/shaastra.crt"
KEY_PATH="/etc/pki/tls/private/shaastra.key"

echo "Generating SSL Certificate with Subject Alternative Name (SAN)..."
$SUDO openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY_PATH" \
    -out "$CERT_PATH" \
    -subj "/CN=$PUBLIC_IP" \
    -addext "subjectAltName=IP:$PUBLIC_IP,DNS:$SSSLIP_DOMAIN,DNS:localhost" 2>/dev/null || \
$SUDO openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY_PATH" \
    -out "$CERT_PATH" \
    -subj "/CN=$PUBLIC_IP"

$SUDO chmod 600 "$KEY_PATH"
$SUDO chmod 644 "$CERT_PATH"

# Copy to /etc/ssl for system-wide compatibility
$SUDO cp "$CERT_PATH" /etc/ssl/certs/shaastra.crt 2>/dev/null || true
$SUDO cp "$KEY_PATH" /etc/ssl/private/shaastra.key 2>/dev/null || true

# 3. Configure Nginx Reverse Proxy
echo "Configuring Nginx reverse proxy on port 80 and 443..."
$SUDO tee /etc/nginx/conf.d/shaastra.conf > /dev/null <<EOF
# HTTP Server: Port 80
server {
    listen 80;
    listen [::]:80;
    server_name $PUBLIC_IP $SSSLIP_DOMAIN localhost _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# HTTPS Server: Port 443
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $PUBLIC_IP $SSSLIP_DOMAIN localhost _;

    ssl_certificate $CERT_PATH;
    ssl_certificate_key $KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
EOF

# In Amazon Linux 2023, disable default server block in nginx.conf if present
if [ -f /etc/nginx/nginx.conf ]; then
    $SUDO sed -i 's/listen       80 default_server;/listen       8088;/g' /etc/nginx/nginx.conf 2>/dev/null || true
    $SUDO sed -i 's/listen       \[::\]:80 default_server;/listen       \[::\]:8088;/g' /etc/nginx/nginx.conf 2>/dev/null || true
fi

# 4. Pull latest master and rebuild container to apply newest UI updates
DEPLOY_DIR="/opt/shaastra-ai"
if [ -d "$DEPLOY_DIR" ]; then
    echo "Updating ShaastraAI codebase in $DEPLOY_DIR..."
    cd "$DEPLOY_DIR"
    git fetch origin master
    git reset --hard origin/master

    echo "Rebuilding and switching container to internal port 127.0.0.1:8000..."
    $SUDO docker build -t shaastra-ai:latest .
    $SUDO docker stop shaastra-ai-portal 2>/dev/null || true
    $SUDO docker rm shaastra-ai-portal 2>/dev/null || true
    $SUDO docker run -d \
        --name shaastra-ai-portal \
        --restart always \
        -p 127.0.0.1:8000:8000 \
        --env-file .env \
        shaastra-ai:latest
fi

# 5. Start and Enable Nginx
echo "Validating Nginx configuration..."
$SUDO nginx -t
echo "Starting Nginx service..."
$SUDO systemctl restart nginx
$SUDO systemctl enable nginx

# 6. Attempt Certbot for Green-Padlock SSL on sslip.io domain
echo "Checking for Certbot Let's Encrypt support..."
if command -v dnf &> /dev/null; then
    $SUDO dnf install -y certbot python3-certbot-nginx 2>/dev/null || true
elif command -v apt-get &> /dev/null; then
    $SUDO apt-get install -y certbot python3-certbot-nginx 2>/dev/null || true
fi

if command -v certbot &> /dev/null; then
    echo "Requesting Let's Encrypt certificate for $SSSLIP_DOMAIN..."
    $SUDO certbot --nginx -d "$SSSLIP_DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>/dev/null || \
        echo "Notice: Falling back to pre-configured SAN certificate for $PUBLIC_IP."
fi

echo "=========================================================="
echo " ShaastraAI HTTPS / SSL Configuration Complete! "
echo " 🔒 HTTPS (Direct IP): https://$PUBLIC_IP"
echo " 🔒 HTTPS (Trusted Domain): https://$SSSLIP_DOMAIN"
echo " 🌐 HTTP (Standard): http://$PUBLIC_IP"
echo "=========================================================="
echo ""
echo "CRITICAL STEP:"
echo "Verify your AWS EC2 Security Group has Port 443 (HTTPS) open:"
echo "AWS Console -> EC2 -> Security Groups -> Edit Inbound Rules -> Add HTTPS (443) -> 0.0.0.0/0"
