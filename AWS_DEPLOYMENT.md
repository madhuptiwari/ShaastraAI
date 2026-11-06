# 🚀 AWS Deployment Guide — ShaastraAI

This guide provides end-to-end, production-ready instructions to deploy the **ShaastraAI** web application on Amazon Web Services (AWS).

---

## 📋 Table of Contents
1. [Architecture & Deployment Options](#1-architecture--deployment-options)
2. [Method 1: AWS App Runner (Recommended — Fast, Fully Managed, Auto-HTTPS)](#2-method-1-aws-app-runner-recommended)
3. [Method 2: Amazon EC2 with Docker (Free Tier Eligible)](#3-method-2-amazon-ec2-with-docker-free-tier)
4. [Method 3: Amazon ECR + Container Image Deployment](#4-method-3-amazon-ecr--container-image-deployment)
5. [Method 4: AWS Elastic Beanstalk](#5-method-4-aws-elastic-beanstalk)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Verification & Health Checks](#7-post-deployment-verification--health-checks)

---

## 1. Architecture & Deployment Options

ShaastraAI is containerized and runs a high-performance, multi-threaded Python server (`serve.py`) serving both the modern frontend portal (`public/`) and the RAG API (`/api/chat`).

| Deployment Option | Target Service | Best For | Estimated Monthly Cost | Difficulty |
| :--- | :--- | :--- | :--- | :--- |
| **Method 1 (Recommended)** | **AWS App Runner** | Production web portal, zero server management, automatic TLS/SSL certificates, auto-scaling, GitHub CI/CD | ~$5 – $15 (scales CPU to zero when idle) | 🟢 Easy (5 mins) |
| **Method 2 (Budget)** | **Amazon EC2 + Docker** | Complete control, runs 24/7 on AWS Free Tier (`t3.micro` or `t2.micro`) | **$0 (Free Tier 12 mo)** or ~$3–$7 | 🟡 Medium (10 mins) |
| **Method 3 (PaaS)** | **AWS Elastic Beanstalk** | AWS traditional PaaS using Docker container platform | ~$10 – $20 | 🟡 Medium (10 mins) |
| **Method 4 (Enterprise)** | **Amazon ECS (Fargate)** | Enterprise multi-container orchestration with Application Load Balancer | Pay-per-vCPU/RAM | 🔴 Advanced |

---

## 2. Method 1: AWS App Runner (Recommended)

**AWS App Runner** is AWS's modern, fully managed service for running containerized web applications. It automatically builds, secures, and scales your application with built-in HTTPS.

### Step 1: Push your code to GitHub
Ensure your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare codebase for AWS deployment"
git push origin master
```

### Step 2: Open AWS App Runner Console
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **App Runner** and select **AWS App Runner**.
3. Choose your preferred AWS Region (e.g., `us-east-1` N. Virginia or `ap-south-1` Mumbai).
4. Click **Create service**.

### Step 3: Configure Source & Deployment Trigger
1. Under **Source type**, select **Source code repository**.
2. Click **Add new** or select your existing **GitHub connection**.
3. Under **Repository**, select your repository: `madhuptiwari/ShaastraAI`.
4. Under **Branch**, select `master` (or `main`).
5. Under **Deployment trigger**, select **Automatic** *(App Runner will automatically redeploy whenever you push commits to GitHub)*.
6. Click **Next**.

### Step 4: Configure Build Settings
You have two options:
- **Option A (Automatic):** Select **Use a configuration file**. App Runner will automatically read the bundled [`apprunner.yaml`](apprunner.yaml) file from your repository.
- **Option B (Manual):** Select **Configure all settings here**:
  - **Runtime:** `Python 3`
  - **Build command:** `pip install --upgrade pip && pip install -r requirements.txt`
  - **Start command:** `python serve.py`
  - **Port:** `8000`

### Step 5: Configure Service Details & Environment Variables
1. **Service name:** `shaastra-ai-portal`
2. **Virtual CPU & Memory:**
   - **vCPU:** `1 vCPU`
   - **Memory:** `2 GB` *(Recommended for loading the 9,828 FAISS vector embeddings in RAM)*
3. **Environment variables:**
   Add the following key-value pairs:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PORT` | `8000` | Server listening port |
   | `GEMINI_API_KEY` | `your_actual_gemini_key` | Free key from [Google AI Studio](https://aistudio.google.com/) |
   | `AWS_DEFAULT_REGION` | `us-east-1` | AWS Region for Bedrock/S3 (optional) |
   | `BEDROCK_MODEL_ID` | `us.amazon.nova-lite-v1:0` | Amazon Bedrock model ID (optional) |
4. **Health check settings:**
   - **Protocol:** `HTTP`
   - **Path:** `/health`
   - **Interval:** `10` seconds
   - **Timeout:** `5` seconds
   - **Healthy threshold:** `1`
   - **Unhealthy threshold:** `3`
5. Click **Next** -> Review your settings -> Click **Create & deploy**.

### Step 6: Access Your Live Application
In approximately 3 to 5 minutes, App Runner will transition to status **Running**.
You will receive a default public HTTPS URL, such as:
```text
https://xxxxxxxxxx.us-east-1.awsapprunner.com
```
Open this URL in any browser or mobile device to use ShaastraAI live on AWS!

---

## 3. Method 2: Amazon EC2 with Docker (Free Tier)

If you want to take advantage of the **AWS Free Tier (750 hours/month of `t3.micro` or `t2.micro` for 12 months)**, you can run ShaastraAI inside Docker on an EC2 instance.

### Step 1: Launch an EC2 Instance
1. Open the **Amazon EC2 Console**.
2. Click **Launch Instance**.
3. **Name:** `ShaastraAI-Server`
4. **Application and OS Images (AMI):** Select **Amazon Linux 2023 AMI** (or **Ubuntu 24.04 LTS**).
5. **Instance type:** `t3.micro` (or `t3.small` / `t2.micro`).
6. **Key pair (login):** Select an existing key pair or create a new `.pem` key pair to SSH into the machine.
7. **Network settings / Security group:**
   Ensure the following inbound ports are checked:
   - ✅ **Allow SSH traffic** from anywhere (Port `22`)
   - ✅ **Allow HTTP traffic from the internet** (Port `80`)
   - ✅ **Allow HTTPS traffic from the internet** (Port `443`)
   - ✅ **Custom TCP Rule**: Port `8000` from anywhere (`0.0.0.0/0`)
8. **Storage:** `20 GiB gp3` (Free Tier allows up to 30 GiB).
9. Click **Launch Instance**.

### Step 2: Connect via SSH
Open your local terminal and connect to your EC2 public IP:
```bash
ssh -i /path/to/your-key.pem ec2-user@<YOUR_EC2_PUBLIC_IP>
```
*(If using Ubuntu, replace `ec2-user` with `ubuntu`)*.

### Step 3: Run the 1-Click Automated Deployment Script
We have provided an automated deployment script [`scripts/deploy_ec2.sh`](scripts/deploy_ec2.sh) in the repository:
```bash
curl -sSL https://raw.githubusercontent.com/madhuptiwari/ShaastraAI/master/scripts/deploy_ec2.sh | bash
```

This script automatically:
1. Installs Docker and Git.
2. Clones the ShaastraAI repository into `/opt/shaastra-ai`.
3. Builds the production Docker image.
4. Starts the container on port `80` and `8000` with `--restart always`.

### Step 4: Configure Your Environment Secrets
Navigate to the deployment directory and edit your `.env` file:
```bash
cd /opt/shaastra-ai
sudo nano .env
```
Set your `GEMINI_API_KEY`:
```env
PORT=8000
GEMINI_API_KEY=AIzaSy...your_gemini_key_here
AWS_DEFAULT_REGION=us-east-1
```
Press `Ctrl+O` then `Enter` to save, and `Ctrl+X` to exit.

Restart the container to apply the secrets:
```bash
sudo docker restart shaastra-ai-portal
```

### Step 5: Test Your EC2 Deployment
Open your browser and navigate to:
```text
http://<YOUR_EC2_PUBLIC_IP>
```
You can also verify the health endpoint:
```text
http://<YOUR_EC2_PUBLIC_IP>/health
```

---

## 4. Method 3: Amazon ECR + Container Image Deployment

If your team prefers building the Docker image locally or in a CI/CD pipeline and pushing it to **Amazon Elastic Container Registry (ECR)**:

### Step 1: Create an ECR Repository
```bash
aws ecr create-repository \
    --repository-name shaastra-ai \
    --region us-east-1
```

### Step 2: Authenticate Docker with Amazon ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### Step 3: Build & Tag the Docker Image
```bash
docker build -t shaastra-ai:latest .
docker tag shaastra-ai:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/shaastra-ai:latest
```

### Step 4: Push Image to ECR
```bash
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/shaastra-ai:latest
```

### Step 5: Deploy Image to App Runner or ECS
1. In the **AWS App Runner Console**, choose **Container image** as the source repository.
2. Select **Amazon ECR** and choose `<YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/shaastra-ai:latest`.
3. Set Port to `8000` and deploy.

---

## 5. Method 4: AWS Elastic Beanstalk

You can also deploy ShaastraAI on **AWS Elastic Beanstalk** using the Docker platform:

1. Install the Elastic Beanstalk CLI:
   ```bash
   pip install awsebcli
   ```
2. Initialize Elastic Beanstalk in the project directory:
   ```bash
   eb init -p docker shaastra-ai --region us-east-1
   ```
3. Create the environment:
   ```bash
   eb create shaastra-prod-env --instance_type t3.small
   ```
4. Set environment variables:
   ```bash
   eb setenv PORT=8000 GEMINI_API_KEY=your_key_here
   ```
5. Open your live application:
   ```bash
   eb open
   ```

---

## 6. Environment Variables Reference

| Variable Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `8000` | Port for the HTTP server to listen on. |
| `GEMINI_API_KEY` | Recommended | `""` | Google Gemini API Key for high-fidelity multi-turn conversations. |
| `AWS_DEFAULT_REGION` | Optional | `us-east-1` | AWS Region for Amazon Bedrock and Amazon S3. |
| `AWS_ACCESS_KEY_ID` | Optional | `""` | AWS credentials *(not needed if using IAM Role on EC2/ECS/App Runner)*. |
| `AWS_SECRET_ACCESS_KEY`| Optional | `""` | AWS secret key. |
| `BEDROCK_MODEL_ID` | Optional | `us.amazon.nova-lite-v1:0`| Bedrock Model ID (`us.amazon.nova-lite-v1:0`, `anthropic.claude-3-haiku-20240307-v1:0`). |
| `S3_BUCKET_NAME` | Optional | `""` | S3 bucket name if downloading `faiss_index.bin` at startup. |

---

## 7. Post-Deployment Verification & Health Checks

Once your application is deployed, run the following verification steps:

### 1. Health Probe Verification
Send an HTTP GET request to `/health`:
```bash
curl -i https://<YOUR-AWS-URL>/health
```
Expected response (`HTTP 200 OK`):
```json
{
  "status": "healthy",
  "service": "ShaastraAI",
  "port": 8000,
  "rag_chunks": 9828,
  "gemini_api_configured": true,
  "aws_region": "us-east-1"
}
```

### 2. Multi-Turn RAG Chat Verification
Send an inquiry to `/api/chat`:
```bash
curl -X POST https://<YOUR-AWS-URL>/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "hi i m busy", "history": []}'
```
Expected response:
- Returns the **3-Minute Shastric Micro-Dinacharya** from *Arogyanidhii* pp. 20–21 and *Bhagavad Gita* 2.48–50.
- Does **not** assume any default sign (no Simha or Kanya).
- Ends with an open-ended question and the `### 📚 Scriptural Sources` citation box.

### 3. Astrologer Agent Birth Chart Verification
Test Kundli casting by providing full birth details:
```bash
curl -X POST https://<YOUR-AWS-URL>/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "My name is Madhur, born 15 August 1995 at 06:30 AM in New Delhi.", "history": []}'
```
Expected response:
- Calculates exact Nirayana Sidereal Janma Kundali.
- Identifies Lagna, Chandra Rashi, Nakshatra, and active Vimshottari Dasha.
- Maharaj Ji synthesizes remedies from *Brihat Jataka* and *Charaka Samhita*.
