# ASAGUS - Complete Azure Deployment Guide

**Project:** ASAGUS - AI, Cybersecurity & Web Development Platform  
**Domain:** asagus.com (Hostinger)  
**Cloud:** Microsoft Azure (Student Subscription - $100 credit, 12 months)  
**Date:** February 2026  
**Auto-Deploy:** Yes, via GitHub Actions (push to `main` = auto-update website)

---

## TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [Azure Services & Cost Breakdown](#2-azure-services--cost-breakdown)
3. [Prerequisites & Tools](#3-prerequisites--tools)
4. [PHASE 1: GitHub Repository Setup](#4-phase-1-github-repository-setup)
5. [PHASE 2: Deploy Main Website (Azure Static Web Apps)](#5-phase-2-deploy-main-website-azure-static-web-apps)
6. [PHASE 3: Custom Domain Setup (Hostinger → Azure)](#6-phase-3-custom-domain-setup-hostinger--azure)
7. [PHASE 4: Deploy PostgreSQL Database (Azure)](#7-phase-4-deploy-postgresql-database-azure)
8. [PHASE 5: Deploy Admin Panel Backend (Azure App Service)](#8-phase-5-deploy-admin-panel-backend-azure-app-service)
9. [PHASE 6: Deploy Admin Panel Frontend](#9-phase-6-deploy-admin-panel-frontend)
10. [PHASE 7: CI/CD Auto-Deploy Setup](#10-phase-7-cicd-auto-deploy-setup)
11. [PHASE 8: Environment Variables Reference](#11-phase-8-environment-variables-reference)
12. [PHASE 9: Post-Deployment Verification](#12-phase-9-post-deployment-verification)
13. [PHASE 10: Monitoring & Maintenance](#13-phase-10-monitoring--maintenance)
14. [Troubleshooting](#14-troubleshooting)
15. [Security Checklist](#15-security-checklist)

---

## 1. ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   USERS (Browser)                                                │
│       │                                                          │
│       ├── asagus.com ──────────► Azure Static Web Apps (FREE)    │
│       │                          ├── Next.js 16 (Main Site)      │
│       │                          ├── Contact Form API (/api/)    │
│       │                          ├── Newsletter API (/api/)      │
│       │                          ├── Free SSL Certificate        │
│       │                          └── Global CDN                  │
│       │                                                          │
│       ├── admin.asagus.com ───► Azure App Service (FREE F1)      │
│       │                          ├── Admin Dashboard (Next.js)   │
│       │                          └── Port 3001                   │
│       │                                                          │
│       └── api.asagus.com ────► Azure App Service (B1 Basic)      │
│                                  ├── API Gateway (port 4000)     │
│                                  ├── Auth Service (port 4001)    │
│                                  ├── Content Service (port 4002) │
│                                  └── Analytics Service (4003)    │
│                                                                  │
│   DATABASE                                                       │
│       └── Azure PostgreSQL Flexible Server (FREE B1MS)           │
│           ├── 750 hrs/month free                                 │
│           ├── 32 GB storage free                                 │
│           └── asagus_admin database                              │
│                                                                  │
│   CI/CD                                                          │
│       └── GitHub Actions (FREE)                                  │
│           ├── Auto-deploy on push to main                        │
│           └── Build + Deploy pipeline                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
ASAGUS/
├── app/                          # Main website (Next.js 16)
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── sitemap.ts                # SEO sitemap
│   ├── api/contact/route.ts      # Contact form API (Resend)
│   ├── api/newsletter/route.ts   # Newsletter API (Resend)
│   ├── portfolio/                # Portfolio page
│   ├── projects/                 # Project case studies
│   ├── privacy/                  # Privacy policy
│   └── terms/                    # Terms of service
├── components/                   # React components
├── admin-panel/                  # Admin panel (separate deployment)
│   ├── frontend/                 # Admin dashboard (Next.js 15)
│   ├── services/
│   │   ├── api-gateway/          # Express.js API Gateway (port 4000)
│   │   ├── auth-service/         # Auth microservice (port 4001)
│   │   ├── content-service/      # Content microservice (port 4002)
│   │   └── analytics-service/    # Analytics microservice (port 4003)
│   └── packages/
│       ├── database/             # Prisma ORM + PostgreSQL schema
│       └── shared/               # Shared types & utilities
├── package.json                  # Root config
└── next.config.ts                # Next.js config
```

---

## 2. AZURE SERVICES & COST BREAKDOWN

### Monthly Cost with Azure Student Subscription

| Service | Plan | Purpose | Monthly Cost |
|---------|------|---------|-------------|
| **Azure Static Web Apps** | Free | Main website (asagus.com) | **$0** |
| **Azure App Service #1** | Free F1 | Admin frontend (admin.asagus.com) | **$0** |
| **Azure App Service #2** | Basic B1 | Backend microservices (api.asagus.com) | **~$13** (from $100 credit) |
| **Azure PostgreSQL Flexible** | Burstable B1MS | Database | **$0** (free 12 months) |
| **GitHub Actions** | Free | CI/CD auto-deploy | **$0** |
| **SSL Certificates** | Free | Included with SWA & App Service | **$0** |
| **Custom Domain** | Free | Supported by all services | **$0** |
| | | **TOTAL** | **~$13/month** (from credits) |

> **Note:** Your $100 Azure Student credit covers ~7+ months of the B1 App Service. The Free F1 tier could also be used for the backend if you consolidate services, making it $0/month total.

### Free Tier Alternative (Complete $0/month)

If you want $0 cost, run all backend services as a single Express app on one Free F1 App Service:

| Service | Plan | Cost |
|---------|------|------|
| Azure Static Web Apps | Free | $0 |
| Azure App Service (all backend + admin frontend) | Free F1 | $0 |
| Azure PostgreSQL Flexible Server | Free B1MS | $0 |
| **TOTAL** | | **$0/month** |

---

## 3. PREREQUISITES & TOOLS

### Accounts Needed

- [ ] **Azure Student Account** - https://azure.microsoft.com/free/students/
- [ ] **GitHub Account** - https://github.com
- [ ] **Hostinger Account** - https://hpanel.hostinger.com (domain: asagus.com)
- [ ] **Resend Account** - https://resend.com (for contact/newsletter emails)

### Install Required Tools

Open PowerShell/Terminal and run:

```powershell
# 1. Node.js (should already be installed)
node --version    # Should be 18+ 

# 2. Git
git --version     # Should be 2.x+

# 3. Azure CLI
winget install Microsoft.AzureCLI
# OR download from: https://learn.microsoft.com/cli/azure/install-azure-cli-windows

# 4. Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# 5. GitHub CLI (optional but helpful)
winget install GitHub.cli

# 6. pnpm (your package manager)
npm install -g pnpm
```

### Verify Installation

```powershell
az --version          # Azure CLI
swa --version         # Static Web Apps CLI
gh --version          # GitHub CLI
node --version        # Node.js
pnpm --version        # pnpm
git --version         # Git
```

### Login to Azure

```powershell
# Login to Azure (opens browser)
az login

# Set your student subscription as default
az account list --output table
az account set --subscription "Azure for Students"

# Verify
az account show --query "{name:name, id:id}" --output table
```

---

## 4. PHASE 1: GITHUB REPOSITORY SETUP

### Step 1.1: Initialize Git Repository

```powershell
cd "d:\New folder (9)\Asagus"

# Initialize git
git init

# Create .gitignore (if not exists)
```

### Step 1.2: Create/Verify .gitignore

Make sure your `.gitignore` includes:

```
# Dependencies
node_modules/
admin-panel/**/node_modules/

# Build outputs
.next/
out/
dist/
admin-panel/**/.next/
admin-panel/**/dist/

# Environment variables (NEVER commit these)
.env
.env.local
.env.production
admin-panel/.env
admin-panel/.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

# Misc
tmp_*
ss/
```

### Step 1.3: Push to GitHub

```powershell
# Stage all files
git add .

# Initial commit
git commit -m "Initial commit - ASAGUS website + admin panel"

# Create GitHub repository (using GitHub CLI)
gh repo create asagus --private --source=. --push

# OR manually:
# 1. Go to https://github.com/new
# 2. Create repo named "asagus" (private recommended)
# 3. Then run:
git remote add origin https://github.com/YOUR_USERNAME/asagus.git
git branch -M main
git push -u origin main
```

---

## 5. PHASE 2: DEPLOY MAIN WEBSITE (Azure Static Web Apps)

### What Gets Deployed
- Main Next.js 16 website (asagus.com)
- Contact form API route (`/api/contact`)
- Newsletter API route (`/api/newsletter`)
- All pages: Homepage, Portfolio, Projects, Privacy, Terms

### Step 2.1: Create Azure Resource Group

```powershell
# Create a resource group for all ASAGUS resources
az group create --name asagus-rg --location eastus
```

### Step 2.2: Create Static Web App via Azure Portal (Recommended)

1. Go to **https://portal.azure.com**
2. Click **+ Create a resource**
3. Search **"Static Web Apps"** → Click **Create**
4. Fill in:

| Setting | Value |
|---------|-------|
| **Subscription** | Azure for Students |
| **Resource Group** | asagus-rg |
| **Name** | asagus-website |
| **Plan Type** | **Free** |
| **Region** | East US (or closest to you) |
| **Source** | **GitHub** |

5. Click **Sign in with GitHub** → Authorize Azure
6. Select:

| Setting | Value |
|---------|-------|
| **Organization** | Your GitHub username |
| **Repository** | asagus |
| **Branch** | main |

7. Build Details:

| Setting | Value |
|---------|-------|
| **Build Preset** | **Next.js** |
| **App location** | `/` |
| **API location** | (leave empty) |
| **Output location** | (leave empty) |

8. Click **Review + Create** → **Create**

> **What happens:** Azure automatically creates a GitHub Actions workflow file in your repo that auto-deploys on every push to `main`.

### Step 2.2 (Alternative): Create via CLI

```powershell
# Create Static Web App linked to GitHub
az staticwebapp create \
  --name asagus-website \
  --resource-group asagus-rg \
  --source https://github.com/YOUR_USERNAME/asagus \
  --branch main \
  --app-location "/" \
  --output-location "" \
  --login-with-github
```

### Step 2.3: Add Environment Variables

In Azure Portal → **asagus-website** → **Settings** → **Configuration** → **Application settings**:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | `re_your_actual_resend_api_key` |
| `CONTACT_EMAIL` | `contact@asagus.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://asagus.com` |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (if using Google Analytics) |

### Step 2.4: Verify Deployment

1. Go to Azure Portal → your Static Web App → **Overview**
2. Copy the auto-generated URL (e.g., `https://happy-river-abc123.azurestaticapps.net`)
3. Open it in a browser → your site should be live!

> Save this URL — you'll need it for the custom domain setup.

---

## 6. PHASE 3: CUSTOM DOMAIN SETUP (Hostinger → Azure)

### What You'll Set Up

| Domain | Points To | Purpose |
|--------|-----------|---------|
| `asagus.com` | Azure Static Web Apps | Main website |
| `www.asagus.com` | Azure Static Web Apps | Main website (www) |
| `admin.asagus.com` | Azure App Service | Admin dashboard |
| `api.asagus.com` | Azure App Service | Backend API |

### Step 3.1: Set Up `www.asagus.com`

**At Hostinger:**
1. Login to **https://hpanel.hostinger.com**
2. Go to **Domains** → **asagus.com** → **DNS / Nameservers** → **DNS Records**
3. **Delete** any existing CNAME record for `www`
4. **Add** new CNAME record:

| Type | Name | Target | TTL |
|------|------|--------|-----|
| **CNAME** | `www` | `happy-river-abc123.azurestaticapps.net` | 14400 |

> Replace `happy-river-abc123.azurestaticapps.net` with YOUR actual Static Web App URL from Step 2.4.

**At Azure Portal:**
1. Go to **asagus-website** (Static Web App)
2. Click **Settings** → **Custom domains** → **+ Add**
3. Select **Custom domain on other DNS**
4. Enter: `www.asagus.com`
5. Azure will validate the CNAME record
6. ✅ Free SSL certificate auto-generated

### Step 3.2: Set Up `asagus.com` (Apex/Root Domain)

**At Azure Portal:**
1. Go to **asagus-website** → **Settings** → **Custom domains** → **+ Add**
2. Enter: `asagus.com`
3. Select **Hostname record type**: **TXT**
4. Click **Generate code**
5. **Copy** the validation code

**At Hostinger DNS Panel:**
1. Add **TXT** record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **TXT** | `@` | `(paste validation code from Azure)` | 14400 |

2. Wait 5-10 minutes for DNS propagation

**Get Static IP for A Record:**
1. In Azure Portal → your Static Web App → **Overview** → click **JSON View** (top right corner)
2. Find `"stableInboundIP"` → copy the IP address (e.g., `20.42.xxx.xxx`)

**At Hostinger DNS Panel:**
3. **Delete** any existing A record for `@` (pointing to Hostinger's default IP)
4. Add **A** record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `20.42.xxx.xxx` (your stableInboundIP) | 14400 |

5. Back in Azure Portal → Custom domains → wait for validation ✅

> ⚠️ **Important:** DNS propagation can take 15 minutes to 48 hours. Be patient.

### Step 3.3: Set Up `admin.asagus.com` (After Phase 5)

**At Hostinger DNS Panel:**

| Type | Name | Target | TTL |
|------|------|--------|-----|
| **CNAME** | `admin` | `asagus-admin.azurewebsites.net` | 14400 |

### Step 3.4: Set Up `api.asagus.com` (After Phase 5)

**At Hostinger DNS Panel:**

| Type | Name | Target | TTL |
|------|------|--------|-----|
| **CNAME** | `api` | `asagus-api.azurewebsites.net` | 14400 |

### Step 3.5: Final DNS Records Summary at Hostinger

After everything is set up, your Hostinger DNS should look like:

| Type | Name | Value / Target |
|------|------|----------------|
| **A** | `@` | `20.42.xxx.xxx` (Azure stableInboundIP) |
| **CNAME** | `www` | `happy-river-abc123.azurestaticapps.net` |
| **CNAME** | `admin` | `asagus-admin.azurewebsites.net` |
| **CNAME** | `api` | `asagus-api.azurewebsites.net` |
| **TXT** | `@` | `(Azure validation code)` |

### Step 3.6: Verify Custom Domains

Open each in your browser:
- [ ] `https://asagus.com` → Main website loads with SSL
- [ ] `https://www.asagus.com` → Main website loads with SSL
- [ ] `https://admin.asagus.com` → Admin panel (after Phase 5)
- [ ] `https://api.asagus.com` → API responds (after Phase 5)

---

## 7. PHASE 4: DEPLOY POSTGRESQL DATABASE (Azure)

### Step 4.1: Create Azure PostgreSQL Flexible Server

**Via Azure Portal:**
1. Go to **https://portal.azure.com**
2. Click **+ Create a resource** → Search **"Azure Database for PostgreSQL Flexible Server"** → **Create**
3. Fill in:

| Setting | Value |
|---------|-------|
| **Subscription** | Azure for Students |
| **Resource Group** | asagus-rg |
| **Server name** | `asagus-db` (must be globally unique) |
| **Region** | East US (same as your other resources) |
| **PostgreSQL version** | **16** |
| **Workload type** | **Development** (selects Burstable) |
| **Compute + storage** | **Burstable B1MS** (free for 12 months) |
| **Storage** | **32 GB** (free for 12 months) |

4. Authentication:

| Setting | Value |
|---------|-------|
| **Authentication method** | PostgreSQL authentication only |
| **Admin username** | `asagusadmin` |
| **Password** | `YourSecurePassword123!` (use a strong password) |

5. Networking:

| Setting | Value |
|---------|-------|
| **Connectivity method** | Public access |
| **Allow public access** | Yes |
| **Allow Azure services** | ✅ Yes |
| **Add current client IP** | ✅ Yes (for initial setup) |

6. Click **Review + Create** → **Create** (takes 5-10 minutes)

### Step 4.2: Get Connection String

1. Go to **asagus-db** → **Overview** → Note the **Server name** (e.g., `asagus-db.postgres.database.azure.com`)
2. Your connection string format:

```
postgresql://asagusadmin:YourSecurePassword123!@asagus-db.postgres.database.azure.com:5432/asagus_admin?sslmode=require
```

### Step 4.3: Create the Database

```powershell
# Connect using psql (install PostgreSQL client if needed)
psql "host=asagus-db.postgres.database.azure.com port=5432 dbname=postgres user=asagusadmin password=YourSecurePassword123! sslmode=require"

# Create database
CREATE DATABASE asagus_admin;
\q
```

### Step 4.4: Run Prisma Migrations

```powershell
cd "d:\New folder (9)\Asagus\admin-panel"

# Set the Azure DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://asagusadmin:YourSecurePassword123!@asagus-db.postgres.database.azure.com:5432/asagus_admin?sslmode=require"

# Generate Prisma client
pnpm db:generate

# Push schema to Azure database
pnpm db:push

# Seed initial data (admin user, roles, permissions)
pnpm db:seed

# Verify with Prisma Studio (optional)
pnpm db:studio
```

### Step 4.5: Verify Database

```powershell
# Connect and check tables
psql "host=asagus-db.postgres.database.azure.com port=5432 dbname=asagus_admin user=asagusadmin password=YourSecurePassword123! sslmode=require"

# List tables
\dt

# Check users table
SELECT email, name FROM users;
```

---

## 8. PHASE 5: DEPLOY ADMIN PANEL BACKEND (Azure App Service)

### Option A: Deploy All Services on One App Service (Recommended for Student Plan)

Since you have 4 microservices + 1 admin frontend, the most cost-effective approach is to run the API Gateway as the main entry point on one App Service, with it proxying to services running on different ports.

### Step 5.1: Create App Service for Backend API

```powershell
# Create App Service Plan (Free F1 or Basic B1)
az appservice plan create \
  --name asagus-plan \
  --resource-group asagus-rg \
  --sku B1 \
  --is-linux

# Create Web App for backend
az webapp create \
  --name asagus-api \
  --resource-group asagus-rg \
  --plan asagus-plan \
  --runtime "NODE:20-lts"
```

### Step 5.2: Configure App Service Environment Variables

```powershell
az webapp config appsettings set \
  --name asagus-api \
  --resource-group asagus-rg \
  --settings \
    DATABASE_URL="postgresql://asagusadmin:YourSecurePassword123!@asagus-db.postgres.database.azure.com:5432/asagus_admin?sslmode=require" \
    JWT_ACCESS_SECRET="your-production-jwt-access-secret-min-32-characters" \
    JWT_REFRESH_SECRET="your-production-jwt-refresh-secret-min-32-characters" \
    JWT_ACCESS_EXPIRY="15m" \
    JWT_REFRESH_EXPIRY="7d" \
    NODE_ENV="production" \
    GATEWAY_PORT="8080" \
    AUTH_SERVICE_URL="http://localhost:4001" \
    CONTENT_SERVICE_URL="http://localhost:4002" \
    ANALYTICS_SERVICE_URL="http://localhost:4003" \
    RESEND_API_KEY="re_your_actual_key" \
    FROM_EMAIL="admin@asagus.com" \
    WEBSITE_NODE_DEFAULT_VERSION="~20"
```

> ⚠️ **Important:** Azure App Service expects apps to listen on port `8080` (via `process.env.PORT`). Update your API Gateway to use `process.env.PORT || 4000`.

### Step 5.3: Prepare Backend for Azure Deployment

Create a startup script at `admin-panel/startup.sh`:

```bash
#!/bin/bash
# Start all services concurrently
cd /home/site/wwwroot

# Install production dependencies
npm install --production

# Start API Gateway (main entry - listens on PORT from Azure)
node services/api-gateway/dist/index.js &

# Start Auth Service
node services/auth-service/dist/index.js &

# Start Content Service
node services/content-service/dist/index.js &

# Start Analytics Service
node services/analytics-service/dist/index.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
```

### Step 5.4: Build Backend for Production

```powershell
cd "d:\New folder (9)\Asagus\admin-panel"

# Build all services
pnpm -r build

# This runs `tsc` in each service, outputting to dist/ folders
```

### Step 5.5: Deploy Backend to Azure

**Option A: Deploy via GitHub Actions (auto-deploy - see Phase 7)**

**Option B: Deploy via Azure CLI (manual):**

```powershell
cd "d:\New folder (9)\Asagus\admin-panel"

# Zip the built files
Compress-Archive -Path services/*, packages/*, package.json, pnpm-lock.yaml, startup.sh -DestinationPath deploy.zip -Force

# Deploy
az webapp deploy \
  --name asagus-api \
  --resource-group asagus-rg \
  --src-path deploy.zip \
  --type zip
```

### Step 5.6: Configure Custom Domain for API

```powershell
# Add custom domain
az webapp config hostname add \
  --webapp-name asagus-api \
  --resource-group asagus-rg \
  --hostname api.asagus.com

# Enable free managed SSL
az webapp config ssl bind \
  --name asagus-api \
  --resource-group asagus-rg \
  --certificate-thumbprint (auto) \
  --ssl-type SNI
```

---

## 9. PHASE 6: DEPLOY ADMIN PANEL FRONTEND

### Step 6.1: Create App Service for Admin Frontend

```powershell
# Use same plan or create free plan
az appservice plan create \
  --name asagus-free-plan \
  --resource-group asagus-rg \
  --sku F1 \
  --is-linux

az webapp create \
  --name asagus-admin \
  --resource-group asagus-rg \
  --plan asagus-free-plan \
  --runtime "NODE:20-lts"
```

### Step 6.2: Configure Admin Frontend Environment Variables

```powershell
az webapp config appsettings set \
  --name asagus-admin \
  --resource-group asagus-rg \
  --settings \
    NEXT_PUBLIC_API_URL="https://api.asagus.com/api/v1" \
    NODE_ENV="production" \
    PORT="8080"
```

### Step 6.3: Update Admin Frontend next.config.ts for Production

In `admin-panel/frontend/next.config.ts`, the rewrites should point to the Azure API:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",  // Required for Azure App Service
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

### Step 6.4: Build and Deploy Admin Frontend

```powershell
cd "d:\New folder (9)\Asagus\admin-panel\frontend"

# Build
pnpm build

# Deploy (via zip)
Compress-Archive -Path .next/standalone/*, .next/static, public -DestinationPath admin-deploy.zip -Force

az webapp deploy \
  --name asagus-admin \
  --resource-group asagus-rg \
  --src-path admin-deploy.zip \
  --type zip
```

### Step 6.5: Configure Custom Domain for Admin

```powershell
az webapp config hostname add \
  --webapp-name asagus-admin \
  --resource-group asagus-rg \
  --hostname admin.asagus.com
```

---

## 10. PHASE 7: CI/CD AUTO-DEPLOY SETUP

### Auto-Deploy Main Website (Already Set Up!)

When you created the Static Web App via Azure Portal with GitHub, Azure **automatically** created a GitHub Actions workflow file at:

```
.github/workflows/azure-static-web-apps-<random>.yml
```

**Every `git push` to `main` will auto-deploy your main website.** 

### Step 7.1: Verify Auto-Deploy Workflow

Pull the latest changes (Azure added the workflow file):

```powershell
cd "d:\New folder (9)\Asagus"
git pull origin main
```

Check the file at `.github/workflows/`. It should look similar to:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_HAPPY_RIVER_ABC123 }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: ""

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_HAPPY_RIVER_ABC123 }}
          action: "close"
```

### Step 7.2: Add Auto-Deploy for Admin Backend

Create `.github/workflows/deploy-admin-backend.yml`:

```yaml
name: Deploy Admin Backend to Azure App Service

on:
  push:
    branches:
      - main
    paths:
      - 'admin-panel/services/**'
      - 'admin-panel/packages/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install dependencies
        working-directory: ./admin-panel
        run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        working-directory: ./admin-panel
        run: pnpm db:generate

      - name: Build all services
        working-directory: ./admin-panel
        run: pnpm -r build

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'asagus-api'
          publish-profile: ${{ secrets.AZURE_BACKEND_PUBLISH_PROFILE }}
          package: ./admin-panel
```

### Step 7.3: Add Auto-Deploy for Admin Frontend

Create `.github/workflows/deploy-admin-frontend.yml`:

```yaml
name: Deploy Admin Frontend to Azure App Service

on:
  push:
    branches:
      - main
    paths:
      - 'admin-panel/frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install dependencies
        working-directory: ./admin-panel/frontend
        run: pnpm install --frozen-lockfile

      - name: Build
        working-directory: ./admin-panel/frontend
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: https://api.asagus.com/api/v1

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'asagus-admin'
          publish-profile: ${{ secrets.AZURE_ADMIN_PUBLISH_PROFILE }}
          package: ./admin-panel/frontend/.next/standalone
```

### Step 7.4: Get Publish Profiles (for GitHub Secrets)

```powershell
# Get backend publish profile
az webapp deployment list-publishing-profiles \
  --name asagus-api \
  --resource-group asagus-rg \
  --xml

# Get admin frontend publish profile
az webapp deployment list-publishing-profiles \
  --name asagus-admin \
  --resource-group asagus-rg \
  --xml
```

### Step 7.5: Add Secrets to GitHub

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:

| Secret Name | Value |
|-------------|-------|
| `AZURE_BACKEND_PUBLISH_PROFILE` | (paste full XML from backend publish profile) |
| `AZURE_ADMIN_PUBLISH_PROFILE` | (paste full XML from admin frontend publish profile) |

> The Static Web App token is auto-added by Azure when you created the SWA.

### Step 7.6: Test Auto-Deploy

```powershell
cd "d:\New folder (9)\Asagus"

# Make a small change (e.g., update a text in hero-section.tsx)
# Then:
git add .
git commit -m "Test auto-deploy"
git push origin main
```

**Monitor deployment:**
- Go to GitHub → your repo → **Actions** tab
- You'll see workflows running for each deployment
- Main website deploys in ~2-3 minutes
- Backend/Admin deploys in ~3-5 minutes

### Auto-Deploy Summary

| What Changes | Auto-Deploys To | Trigger |
|-------------|----------------|---------|
| Any file in root `/` | Azure Static Web Apps (main site) | Push to main |
| Files in `admin-panel/services/**` or `admin-panel/packages/**` | Azure App Service (backend API) | Push to main |
| Files in `admin-panel/frontend/**` | Azure App Service (admin dashboard) | Push to main |

---

## 11. PHASE 8: ENVIRONMENT VARIABLES REFERENCE

### Main Website (Azure Static Web Apps)

Set in Azure Portal → Static Web App → Configuration:

| Variable | Value | Required |
|----------|-------|----------|
| `RESEND_API_KEY` | `re_xxxxx` | ✅ Yes |
| `CONTACT_EMAIL` | `contact@asagus.com` | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://asagus.com` | ✅ Yes |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Optional |

### Admin Backend (Azure App Service - asagus-api)

Set in Azure Portal → App Service → Configuration → Application Settings:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | `postgresql://asagusadmin:PASS@asagus-db.postgres.database.azure.com:5432/asagus_admin?sslmode=require` | ✅ Yes |
| `JWT_ACCESS_SECRET` | (random 64+ char string) | ✅ Yes |
| `JWT_REFRESH_SECRET` | (random 64+ char string) | ✅ Yes |
| `JWT_ACCESS_EXPIRY` | `15m` | ✅ Yes |
| `JWT_REFRESH_EXPIRY` | `7d` | ✅ Yes |
| `GATEWAY_PORT` | `8080` | ✅ Yes |
| `AUTH_SERVICE_URL` | `http://localhost:4001` | ✅ Yes |
| `CONTENT_SERVICE_URL` | `http://localhost:4002` | ✅ Yes |
| `ANALYTICS_SERVICE_URL` | `http://localhost:4003` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `RESEND_API_KEY` | `re_xxxxx` | ✅ Yes |
| `FROM_EMAIL` | `admin@asagus.com` | ✅ Yes |
| `SUPER_ADMIN_EMAIL` | `admin@asagus.com` | ✅ Yes |
| `SUPER_ADMIN_PASSWORD` | (strong password) | For seeding |

### Admin Frontend (Azure App Service - asagus-admin)

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.asagus.com/api/v1` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `8080` | ✅ Yes |

### Generate Secure JWT Secrets

```powershell
# Generate random secrets (run in Node.js)
node -e "console.log('ACCESS:', require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH:', require('crypto').randomBytes(64).toString('hex'))"
```

---

## 12. PHASE 9: POST-DEPLOYMENT VERIFICATION

### Main Website Checklist

- [ ] `https://asagus.com` loads correctly
- [ ] `https://www.asagus.com` loads correctly
- [ ] SSL certificate shows valid (padlock icon)
- [ ] Dark/Light theme toggle works
- [ ] All sections visible: Hero, Services, Projects, About, Contact, Footer
- [ ] Contact form submits and email received
- [ ] Newsletter subscription works
- [ ] Portfolio page loads (`/portfolio`)
- [ ] Project case studies load (`/projects/[slug]`)
- [ ] Privacy Policy page loads (`/privacy`)
- [ ] Terms of Service page loads (`/terms`)
- [ ] Mobile responsive on phone
- [ ] Lighthouse score > 90 (Performance, SEO, Accessibility)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Open Graph meta tags render (test with https://opengraph.dev)

### Admin Panel Checklist

- [ ] `https://admin.asagus.com` loads login page
- [ ] Login works with admin credentials
- [ ] Dashboard displays analytics
- [ ] Content management (CRUD) works
- [ ] User management works
- [ ] API responds at `https://api.asagus.com/api/v1/health`

### Auto-Deploy Checklist

- [ ] Push a small change → check GitHub Actions runs
- [ ] Main site updates within 3 minutes
- [ ] Admin panel updates within 5 minutes
- [ ] No build errors in GitHub Actions logs

---

## 13. PHASE 10: MONITORING & MAINTENANCE

### Monitor Your Resources

**Azure Portal Dashboard:**
1. Go to **asagus-rg** resource group
2. Pin all resources to your dashboard for quick access

**Check Credit Usage:**
1. Go to https://www.microsoftazuresponsorships.com
2. Monitor your $100 student credit balance

**Set Up Budget Alerts:**
```powershell
# Create a budget alert at $50 (halfway through credits)
az consumption budget create \
  --budget-name "asagus-budget" \
  --amount 50 \
  --category Cost \
  --time-grain Monthly \
  --start-date 2026-02-01 \
  --end-date 2027-02-01
```

### Regular Maintenance Tasks

| Task | Frequency | How |
|------|-----------|-----|
| Check credit balance | Weekly | Azure Sponsorships portal |
| Review GitHub Actions logs | After each deploy | GitHub → Actions tab |
| Check SSL certificate expiry | Monthly | Browser padlock → certificate info |
| Update dependencies | Monthly | `pnpm update` |
| Database backup | Weekly | Azure Portal → PostgreSQL → Backups |
| Review error logs | Weekly | Azure Portal → App Service → Log stream |

### Useful Azure CLI Commands

```powershell
# Check all resources in your resource group
az resource list --resource-group asagus-rg --output table

# Check App Service logs (live stream)
az webapp log tail --name asagus-api --resource-group asagus-rg

# Check database status
az postgres flexible-server show --name asagus-db --resource-group asagus-rg --query "{status:state, fqdn:fullyQualifiedDomainName}" --output table

# Restart App Service (if needed)
az webapp restart --name asagus-api --resource-group asagus-rg

# Check Static Web App status
az staticwebapp show --name asagus-website --resource-group asagus-rg --query "{url:defaultHostname, status:contentDistributionEndpoint}" --output table
```

---

## 14. TROUBLESHOOTING

### Common Issues

#### 1. "DNS validation failed" for custom domain
- **Cause:** DNS records haven't propagated yet
- **Fix:** Wait 15min-48hrs. Check propagation at https://dnschecker.org

#### 2. "502 Bad Gateway" on App Service
- **Cause:** App not listening on port 8080
- **Fix:** Ensure `process.env.PORT || 8080` is used in your Express/Next.js app
```powershell
# Check logs
az webapp log tail --name asagus-api --resource-group asagus-rg
```

#### 3. "Database connection refused"
- **Cause:** Firewall rules blocking connection
- **Fix:** Allow Azure services in PostgreSQL firewall:
```powershell
az postgres flexible-server firewall-rule create \
  --name asagus-db \
  --resource-group asagus-rg \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### 4. GitHub Actions build fails
- **Cause:** Missing dependencies or build errors
- **Fix:** Check the Actions log, fix errors, push again

#### 5. Static Web App returns 404
- **Cause:** Build output location mismatch
- **Fix:** Ensure output location is empty (not `.next` or `out`) for hybrid Next.js

#### 6. "App exceeded quota" on Free F1
- **Cause:** Free tier has 60 CPU-minutes/day limit
- **Fix:** Upgrade to Basic B1 ($13/month from credits) or optimize your app

#### 7. SSL certificate not working
- **Cause:** DNS not fully propagated or domain not validated
- **Fix:** Wait for DNS propagation, then re-add custom domain in Azure

### Get Help

- **Azure Support:** Azure Portal → Help + Support → New support request
- **Azure Docs:** https://learn.microsoft.com/azure
- **GitHub Actions Docs:** https://docs.github.com/actions
- **Hostinger Support:** https://www.hostinger.com/cpanel-login

---

## 15. SECURITY CHECKLIST

### Before Going Live

- [ ] **Never commit `.env` files** — verify `.gitignore` is correct
- [ ] **Use strong JWT secrets** — minimum 64 characters, randomly generated  
- [ ] **Use strong database password** — mix of upper, lower, numbers, symbols
- [ ] **Change default admin password** after first login
- [ ] **Enable HTTPS only** — redirect HTTP to HTTPS
- [ ] **Set CORS correctly** — only allow your domains in API Gateway
- [ ] **Rate limiting enabled** — already configured in API Gateway
- [ ] **Helmet.js enabled** — already configured in API Gateway
- [ ] **Input validation** — Zod schemas in auth service
- [ ] **SQL injection protection** — Prisma ORM handles this
- [ ] **XSS protection** — React handles this + HTML escaping in email templates

### Production Security Settings

```powershell
# Force HTTPS on App Service
az webapp update --name asagus-api --resource-group asagus-rg --https-only true
az webapp update --name asagus-admin --resource-group asagus-rg --https-only true

# Disable FTP (not needed)
az webapp config set --name asagus-api --resource-group asagus-rg --ftps-state Disabled
az webapp config set --name asagus-admin --resource-group asagus-rg --ftps-state Disabled
```

### Update CORS for Production

In `admin-panel/services/api-gateway/src/index.ts`, update CORS origins:

```typescript
app.use(cors({
  origin: [
    "https://admin.asagus.com",
    "https://asagus.com",
    "https://www.asagus.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
}));
```

---

## QUICK REFERENCE: DEPLOYMENT COMMANDS

```powershell
# ===== FIRST TIME SETUP =====
az login
az account set --subscription "Azure for Students"
az group create --name asagus-rg --location eastus

# ===== DAILY WORKFLOW (AUTO-DEPLOY) =====
cd "d:\New folder (9)\Asagus"
git add .
git commit -m "your changes"
git push origin main
# → GitHub Actions auto-deploys everything! 🚀

# ===== MANUAL DEPLOY (IF NEEDED) =====
# Main site:
npx swa deploy --env production

# Backend:
az webapp deploy --name asagus-api --resource-group asagus-rg --src-path deploy.zip --type zip

# Admin frontend:
az webapp deploy --name asagus-admin --resource-group asagus-rg --src-path admin-deploy.zip --type zip

# ===== MONITORING =====
az webapp log tail --name asagus-api --resource-group asagus-rg
az webapp log tail --name asagus-admin --resource-group asagus-rg
```

---

## TIMELINE ESTIMATE

| Phase | Time | Status |
|-------|------|--------|
| Phase 1: GitHub Setup | 15 minutes | ⬜ |
| Phase 2: Deploy Main Website | 30 minutes | ⬜ |
| Phase 3: Custom Domain | 30 min + 24hr DNS wait | ⬜ |
| Phase 4: PostgreSQL Database | 30 minutes | ⬜ |
| Phase 5: Deploy Backend | 1 hour | ⬜ |
| Phase 6: Deploy Admin Frontend | 30 minutes | ⬜ |
| Phase 7: CI/CD Auto-Deploy | 30 minutes | ⬜ |
| Phase 8: Environment Variables | 15 minutes | ⬜ |
| Phase 9: Verification | 30 minutes | ⬜ |
| **TOTAL** | **~5 hours** (+ DNS wait) | |

---

**Document Version:** 1.0  
**Last Updated:** February 12, 2026  
**Author:** ASAGUS Development Team
