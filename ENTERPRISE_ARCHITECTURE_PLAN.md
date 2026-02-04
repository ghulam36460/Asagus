# 🚀 ASAGUS ENTERPRISE MICROSERVICES ARCHITECTURE PLAN

**Version:** 1.0  
**Date:** February 2026  
**Project:** ASAGUS Startup Platform  
**Purpose:** Long-term scalable architecture for AI/ML, Cybersecurity, and Service-based business

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Strategic Vision & Business Context](#strategic-vision--business-context)
3. [Architecture Overview](#architecture-overview)
4. [Microservices Detailed Design](#microservices-detailed-design)
5. [Database Strategy](#database-strategy)
6. [Azure Infrastructure Design](#azure-infrastructure-design)
7. [Admin Panel Features](#admin-panel-features)
8. [Technology Stack](#technology-stack)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Cost Analysis](#cost-analysis)
11. [Deployment Strategy](#deployment-strategy)
12. [Security & Compliance](#security--compliance)
13. [Monitoring & Observability](#monitoring--observability)
14. [Scalability Strategy](#scalability-strategy)
15. [API Documentation Standards](#api-documentation-standards)
16. [Next Steps](#next-steps)

---

## 🎯 EXECUTIVE SUMMARY

### Project Overview

ASAGUS is transitioning from a static portfolio website to a full-scale startup platform focused on:
- **AI/ML Solutions** - Future product offerings
- **Cybersecurity Services** - Future product offerings  
- **Web Development Services** - Current revenue generation
- **Fully Customizable Admin Panel** - Complete content management

### Why Microservices Architecture?

✅ **Strategic Reasons:**
- Independent service deployment and scaling
- Technology flexibility (Python for AI, Node.js for web)
- Team scalability as startup grows
- Fault isolation (one service down ≠ entire system down)
- Future-proof for product-based business model

✅ **Technical Reasons:**
- Azure Student credits provide free infrastructure for 12 months
- Complex data requirements (PostgreSQL + MongoDB + Redis)
- Need for rapid feature iteration without downtime
- Multiple independent product lines (AI, Security, Web Services)

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Microservices | Long-term scalability, independent scaling |
| **Primary Database** | PostgreSQL | Structured data, ACID compliance |
| **Secondary Database** | MongoDB (Cosmos DB) | Analytics, flexible schemas, AI/ML data |
| **Caching Layer** | Redis + Memcached | Performance, session management |
| **Cloud Provider** | Microsoft Azure | Free student credits, enterprise features |
| **Container Platform** | Azure Container Apps | Easier than AKS, auto-scaling |
| **API Gateway** | Azure API Management | Centralized routing, rate limiting |
| **Admin Panel** | Separate Next.js App | Independent deployment, security isolation |
| **ORM/ODM** | Prisma + Mongoose | Type-safe database access |
| **Authentication** | JWT + OAuth 2.0 | Industry standard, flexible |
| **Message Queue** | Azure Service Bus | Reliable async communication |
| **File Storage** | Azure Blob Storage | Scalable, CDN integration |
| **Monitoring** | Azure Monitor + App Insights | Full observability |

---

## 🌟 STRATEGIC VISION & BUSINESS CONTEXT

### Business Model Evolution

```
Phase 1 (Current): Portfolio Website
└── Static website showcasing services
    
Phase 2 (0-6 months): Service-Based Agency
├── Custom admin panel
├── Client management
├── Project showcase with CMS
└── Contact & lead management

Phase 3 (6-12 months): Platform Development
├── AI/ML service APIs
├── Cybersecurity tools
├── White-label solutions
└── API marketplace

Phase 4 (12+ months): Product Company
├── SaaS offerings
├── API marketplace
├── Enterprise solutions
└── Multiple revenue streams
```

### Revenue Streams

#### 1. **Immediate Revenue (Month 0-6)**
- **Web Development Projects**: $2,000 - $10,000 per project
- **Design Services**: $500 - $3,000 per project
- **Consulting Fees**: $100 - $200 per hour
- **Target**: $10,000 - $30,000 total

#### 2. **Short-term Revenue (Month 6-12)**
- **AI Content Generation API**: $0.01 - $0.05 per request
- **Security Scanning Service**: $49 - $199 per month
- **White-label Admin Panel**: $5,000 - $15,000 one-time
- **Target**: $30,000 - $100,000 total

#### 3. **Long-term Revenue (Month 12+)**
- **SaaS Products**: $29 - $299 per user/month
- **Enterprise Contracts**: $10,000 - $100,000 per year
- **API Marketplace**: 20% revenue share
- **Training Programs**: $500 - $2,000 per student
- **Target**: $100,000 - $500,000+ annually

### Growth Projections

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Users** | 100-500 | 1,000-5,000 | 10,000+ |
| **API Calls/Month** | 10K | 100K | 1M+ |
| **Revenue** | $10K-50K | $100K-300K | $500K+ |
| **Team Size** | 1-3 | 5-10 | 15-25 |
| **Services** | 3 | 8-10 | 15-20 |
| **Customers** | 10-20 | 100-200 | 500+ |
| **Infrastructure Cost** | $0-1K/mo | $2K-5K/mo | $10K+/mo |

### Target Market

#### Primary Markets
1. **Small-Medium Businesses** (Web Services)
   - 10-100 employees
   - Need digital transformation
   - Budget: $5K-50K per project

2. **Startups** (AI/ML Services)
   - Tech-savvy founders
   - Need rapid MVP development
   - Budget: $10K-100K

3. **Enterprises** (Cybersecurity)
   - 500+ employees
   - Compliance requirements
   - Budget: $50K-500K

#### Geographic Focus
- **Phase 1**: Local market (your region)
- **Phase 2**: National expansion
- **Phase 3**: International (English-speaking countries)

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          AZURE CLOUD INFRASTRUCTURE                                │
│                      (Azure Student Account - 12 Months Free)                      │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL TRAFFIC MANAGER                                     │
│                       (Azure Front Door + CDN)                                     │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Features:                                                                         │
│  • Global load balancing across regions                                           │
│  • DDoS protection (Layer 3, 4, 7)                                               │
│  • SSL/TLS termination                                                            │
│  • WAF (Web Application Firewall)                                                │
│  • Geo-filtering                                                                  │
│  • URL rewriting                                                                  │
│  • HTTP/2 and HTTP/3 support                                                     │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                      ┌─────────────────┴─────────────────┐
                      ▼                                   ▼
┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│   PUBLIC WEBSITE FRONTEND         │      │    ADMIN PANEL FRONTEND          │
│  (Azure Static Web Apps)          │      │   (Azure Static Web Apps)        │
├──────────────────────────────────┤      ├──────────────────────────────────┤
│  • Next.js 15 (App Router)       │      │  • Next.js 15 / React SPA        │
│  • React 19                       │      │  • TypeScript                    │
│  • TypeScript                     │      │  • Shadcn/ui or Ant Design       │
│  • Tailwind CSS 4                │      │  • React Query (data fetching)   │
│  • Framer Motion                  │      │  • Zustand (state management)    │
│  • SEO optimized                  │      │  • React Hook Form               │
│  • PWA support                    │      │  • TanStack Table                │
│                                   │      │  • Role-based UI rendering       │
│  Domain: asagus.com               │      │  Domain: admin.asagus.com        │
└──────────────────────────────────┘      └──────────────────────────────────┘
                      │                                   │
                      └─────────────────┬─────────────────┘
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                        │
│                      (Azure API Management - APIM)                                 │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Core Features:                                                                    │
│  ✓ Request routing (/api/v1/*, /api/v2/*)                                        │
│  ✓ Rate limiting (per user, per IP, per API key)                                 │
│  ✓ Authentication & Authorization (JWT validation)                                │
│  ✓ Request/Response transformation                                                │
│  ✓ API versioning                                                                 │
│  ✓ Developer portal                                                               │
│  ✓ Analytics & monitoring                                                         │
│  ✓ Caching policies                                                               │
│  ✓ CORS handling                                                                  │
│  ✓ Mock responses for development                                                 │
│                                                                                    │
│  Routing Rules:                                                                    │
│  • /api/v1/auth/*         → Auth Service                                          │
│  • /api/v1/content/*      → Content Management Service                            │
│  • /api/v1/media/*        → Media Management Service                              │
│  • /api/v1/analytics/*    → Analytics Service                                     │
│  • /api/v1/notifications/* → Notification Service                                 │
│  • /api/v1/pages/*        → Page Builder Service                                  │
│  • /api/v1/ai/*           → AI/ML Service (future)                               │
│  • /api/v1/security/*     → Cybersecurity Service (future)                       │
│  • /api/v1/billing/*      → Billing Service (future)                             │
│                                                                                    │
│  Rate Limits:                                                                      │
│  • Public endpoints: 100 requests/min                                             │
│  • Authenticated users: 1000 requests/min                                         │
│  • API keys (paid): 10,000 requests/min                                          │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                         MICROSERVICES LAYER                                        │
│                    (Azure Container Apps / AKS)                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  Auth Service   │  │ Content Service │  │  Media Service  │                 │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                 │
│  │ • User auth     │  │ • Projects CRUD │  │ • File uploads  │                 │
│  │ • JWT tokens    │  │ • Services CRUD │  │ • Image process │                 │
│  │ • RBAC          │  │ • Testimonials  │  │ • CDN URLs      │                 │
│  │ • Sessions      │  │ • FAQs          │  │ • Optimization  │                 │
│  │ • OAuth         │  │ • Client logos  │  │ • Thumbnails    │                 │
│  │                 │  │ • Stats         │  │ • Video trans   │                 │
│  │ PostgreSQL      │  │ PostgreSQL      │  │ Blob Storage    │                 │
│  │ Redis (cache)   │  │ Redis (cache)   │  │ PostgreSQL (md) │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │Analytics Service│  │Notification Svc │  │Page Builder Svc │                 │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                 │
│  │ • Event track   │  │ • Email sending │  │ • Template mgmt │                 │
│  │ • User behavior │  │ • SMS sending   │  │ • Block editor  │                 │
│  │ • Conversion    │  │ • Push notifs   │  │ • Component lib │                 │
│  │ • Dashboards    │  │ • Templates     │  │ • Page version  │                 │
│  │ • Reports       │  │ • Scheduling    │  │ • SEO tools     │                 │
│  │ • A/B testing   │  │ • Queue mgmt    │  │ • Preview       │                 │
│  │                 │  │                 │  │                 │                 │
│  │ MongoDB         │  │ Service Bus     │  │ PostgreSQL      │                 │
│  │ Redis (RT data) │  │ PostgreSQL (log)│  │ MongoDB (blocks)│                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  AI/ML Service  │  │ Security Service│  │ Billing Service │                 │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                 │
│  │ • GPT API       │  │ • Vuln scanning │  │ • Subscriptions │                 │
│  │ • Image gen     │  │ • Threat detect │  │ • Invoices      │                 │
│  │ • Chatbot       │  │ • Audit logs    │  │ • Payments      │                 │
│  │ • ML models     │  │ • Compliance    │  │ • Usage track   │                 │
│  │ • Training      │  │ • Alerts        │  │ • Tax calc      │                 │
│  │ • Inference     │  │ • Reporting     │  │ • Analytics     │                 │
│  │                 │  │                 │  │                 │                 │
│  │ MongoDB         │  │ PostgreSQL      │  │ PostgreSQL      │                 │
│  │ (FUTURE)        │  │ Redis (RT)      │  │ Redis (cache)   │                 │
│  │                 │  │ (FUTURE)        │  │ (FUTURE)        │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                    │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYER                                            │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────┐  ┌────────────────────────────────┐   │
│  │     Redis Cache (Azure Cache)         │  │    Memcached (Optional)        │   │
│  ├──────────────────────────────────────┤  ├────────────────────────────────┤   │
│  │ Use Cases:                            │  │ Use Cases:                     │   │
│  │ • Session management                  │  │ • DB query caching             │   │
│  │ • API response caching (TTL: 5-60m)  │  │ • Computed data caching        │   │
│  │ • Real-time counters                 │  │ • Static content cache         │   │
│  │ • Rate limiting data                 │  │ • Distributed caching          │   │
│  │ • Pub/Sub messaging                  │  │                                │   │
│  │ • Leaderboards                       │  │ Config:                        │   │
│  │ • Temporary data                     │  │ • 512MB - 1GB RAM              │   │
│  │                                       │  │ • LRU eviction policy          │   │
│  │ Config:                               │  │ • 30 min default TTL           │   │
│  │ • Basic C0: 250 MB ($16/mo)          │  │                                │   │
│  │ • Standard C1: 1 GB ($55/mo)         │  │                                │   │
│  │ • Persistence: RDB snapshots         │  │                                │   │
│  │ • Clustering: Available              │  │                                │   │
│  └──────────────────────────────────────┘  └────────────────────────────────┘   │
│                                                                                    │
│  Cache Strategy:                                                                   │
│  • L1: Redis (hot data, <1ms latency)                                            │
│  • L2: Memcached (warm data, <5ms latency)                                       │
│  • L3: Database (cold data, <50ms latency)                                       │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                           │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │           PostgreSQL (Azure Database for PostgreSQL)                  │        │
│  ├──────────────────────────────────────────────────────────────────────┤        │
│  │ Configuration:                                                         │        │
│  │ • Flexible Server deployment                                          │        │
│  │ • Burstable B1MS (1 vCore, 2 GB RAM) - FREE with student account    │        │
│  │ • 32 GB storage (expandable to 16 TB)                                │        │
│  │ • Automated backups (7-35 days retention)                            │        │
│  │ • Point-in-time restore                                               │        │
│  │ • High availability option                                            │        │
│  │ • Read replicas for scaling                                           │        │
│  │                                                                        │        │
│  │ Databases:                                                             │        │
│  │ • asagus_auth (users, roles, permissions)                            │        │
│  │ • asagus_content (projects, services, testimonials, faqs)            │        │
│  │ • asagus_media (file metadata)                                        │        │
│  │ • asagus_pages (page builder data)                                    │        │
│  │ • asagus_billing (invoices, subscriptions)                           │        │
│  │ • asagus_security (audit logs)                                        │        │
│  │                                                                        │        │
│  │ Data Stored:                                                           │        │
│  │ ✓ User accounts & authentication                                      │        │
│  │ ✓ Structured content (projects, services, etc.)                      │        │
│  │ ✓ Transactional data (orders, payments)                              │        │
│  │ ✓ Relational data requiring JOINs                                    │        │
│  │ ✓ Data requiring ACID compliance                                     │        │
│  │ ✓ Audit logs & compliance data                                       │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │         MongoDB (Azure Cosmos DB - MongoDB API)                       │        │
│  ├──────────────────────────────────────────────────────────────────────┤        │
│  │ Configuration:                                                         │        │
│  │ • Serverless or Provisioned throughput                                │        │
│  │ • Free tier: 1000 RU/s, 25 GB storage                                │        │
│  │ • Multi-region replication                                            │        │
│  │ • Automatic indexing                                                  │        │
│  │ • Change feed for real-time sync                                     │        │
│  │                                                                        │        │
│  │ Databases & Collections:                                              │        │
│  │ • asagus_analytics                                                    │        │
│  │   - events (user interactions, page views)                           │        │
│  │   - sessions (user session data)                                     │        │
│  │   - conversions (conversion tracking)                                │        │
│  │   - ab_tests (A/B test results)                                      │        │
│  │                                                                        │        │
│  │ • asagus_pages                                                        │        │
│  │   - page_blocks (dynamic page content blocks)                        │        │
│  │   - components (custom component definitions)                        │        │
│  │   - templates (page templates)                                       │        │
│  │                                                                        │        │
│  │ • asagus_ai (future)                                                  │        │
│  │   - models (ML model metadata)                                       │        │
│  │   - training_data (training datasets)                                │        │
│  │   - predictions (inference results)                                  │        │
│  │   - experiments (ML experiments)                                     │        │
│  │                                                                        │        │
│  │ • asagus_logs                                                         │        │
│  │   - application_logs                                                  │        │
│  │   - error_logs                                                        │        │
│  │   - performance_metrics                                               │        │
│  │                                                                        │        │
│  │ Data Stored:                                                           │        │
│  │ ✓ Analytics & event tracking                                         │        │
│  │ ✓ Logs & monitoring data                                             │        │
│  │ ✓ Dynamic schemas (page blocks, custom fields)                      │        │
│  │ ✓ AI/ML training data & models                                       │        │
│  │ ✓ Real-time data streams                                             │        │
│  │ ✓ Time-series data                                                   │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                    │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE QUEUE LAYER                                        │
│                       (Azure Service Bus)                                          │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Features:                                                                         │
│  • Async communication between services                                           │
│  • Message durability & persistence                                               │
│  • Dead letter queues                                                             │
│  • Message scheduling                                                             │
│  • Session support                                                                │
│  • Duplicate detection                                                            │
│                                                                                    │
│  Queues:                                                                           │
│  • email-notifications (contact forms, newsletters)                               │
│  • sms-notifications (alerts, OTPs)                                               │
│  • image-processing (resize, optimize, thumbnails)                                │
│  • analytics-events (async event tracking)                                        │
│  • backup-jobs (scheduled database backups)                                       │
│  • report-generation (PDF generation, exports)                                    │
│                                                                                    │
│  Topics (Pub/Sub):                                                                 │
│  • user-events (login, logout, signup)                                           │
│  • content-changes (create, update, delete)                                       │
│  • payment-events (success, failed, refund)                                       │
└───────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                       OBSERVABILITY & MONITORING LAYER                             │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │              Azure Monitor + Application Insights                     │        │
│  ├──────────────────────────────────────────────────────────────────────┤        │
│  │ • Distributed tracing (track requests across services)               │        │
│  │ • Performance monitoring (response times, throughput)                │        │
│  │ • Dependency tracking (database calls, external APIs)                │        │
│  │ • Exception tracking                                                  │        │
│  │ • Custom metrics & events                                             │        │
│  │ • Live metrics streaming                                              │        │
│  │ • Smart detection (anomaly detection)                                │        │
│  │ • Application map (service dependencies)                              │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │                     Azure Log Analytics                               │        │
│  ├──────────────────────────────────────────────────────────────────────┤        │
│  │ • Centralized log aggregation                                         │        │
│  │ • KQL (Kusto Query Language) for analysis                            │        │
│  │ • Custom dashboards                                                   │        │
│  │ • Alerting rules                                                      │        │
│  │ • Log retention (7-730 days)                                         │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │                     Alerting & Notifications                          │        │
│  ├──────────────────────────────────────────────────────────────────────┤        │
│  │ • Service health alerts                                               │        │
│  │ • Performance threshold alerts                                        │        │
│  │ • Error rate alerts                                                   │        │
│  │ • Security alerts                                                     │        │
│  │ • Cost alerts                                                         │        │
│  │                                                                        │        │
│  │ Notification Channels:                                                │        │
│  │ • Email                                                               │        │
│  │ • SMS                                                                 │        │
│  │ • Slack/Discord webhooks                                              │        │
│  │ • Azure mobile app                                                    │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                    │
└───────────────────────────────────────────────────────────────────────────────────┘

---

## ?? MICROSERVICES DETAILED DESIGN

### Service Architecture Principles

Each microservice follows these design principles:

1. **Single Responsibility**: Each service handles one business domain
2. **Loose Coupling**: Services communicate via well-defined APIs
3. **High Cohesion**: Related functionality grouped together
4. **Independent Deployment**: Deploy services without affecting others
5. **Data Ownership**: Each service owns its data
6. **Failure Isolation**: Service failures don't cascade
7. **Technology Agnostic**: Choose best tech for each service

---

### 1. Authentication & Authorization Service

**Purpose**: Centralized user authentication and access control

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js or Fastify
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Cache: Redis
- Authentication: JWT + Refresh Tokens
- Password Hashing: bcrypt (10 rounds)
- OAuth Providers: Google, GitHub, Microsoft
``

#### Database Schema (PostgreSQL)

``sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 'super_admin', 'admin', 'editor', 'viewer'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  resource VARCHAR(100) NOT NULL, -- 'projects', 'services', 'users', etc.
  action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource, action)
);

-- User roles (many-to-many)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

-- Role permissions (many-to-many)
CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- OAuth connections
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'github', 'microsoft'
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- API keys for programmatic access
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  permissions JSONB, -- Custom permissions for this key
  rate_limit INTEGER DEFAULT 1000, -- requests per minute
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log for security
CREATE TABLE auth_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'password_change', etc.
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN,
  failure_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON auth_audit_log(created_at);
``

#### API Endpoints

``
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
GET    /api/v1/auth/me
PUT    /api/v1/auth/profile
PUT    /api/v1/auth/password

# OAuth
GET    /api/v1/auth/oauth/:provider
GET    /api/v1/auth/oauth/:provider/callback

# Admin endpoints
GET    /api/v1/auth/users
GET    /api/v1/auth/users/:id
PUT    /api/v1/auth/users/:id
DELETE /api/v1/auth/users/:id
POST   /api/v1/auth/users/:id/roles
DELETE /api/v1/auth/users/:id/roles/:roleId

# API Keys
GET    /api/v1/auth/api-keys
POST   /api/v1/auth/api-keys
DELETE /api/v1/auth/api-keys/:id
``

#### Redis Cache Structure

``
# Session cache (TTL: 1 hour)
session:{userId} -> { userId, email, roles, permissions }

# Rate limiting (TTL: 1 minute)
rate_limit:{userId}:{endpoint} -> request_count

# Email verification tokens (TTL: 24 hours)
verify_email:{token} -> userId

# Password reset tokens (TTL: 1 hour)
reset_password:{token} -> userId

# Failed login attempts (TTL: 15 minutes)
failed_logins:{email} -> attempt_count
``

#### Security Features

1. **Password Requirements**
   - Minimum 8 characters
   - Must contain uppercase, lowercase, number, special char
   - Password strength meter
   - Breached password check (Have I Been Pwned API)

2. **Rate Limiting**
   - Login: 5 attempts per 15 minutes per IP
   - Registration: 3 attempts per hour per IP
   - Password reset: 3 attempts per hour per email
   - API calls: Based on user tier

3. **JWT Structure**
``json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["admin"],
  "permissions": ["projects:create", "projects:read"],
  "iat": 1234567890,
  "exp": 1234571490
}
``

4. **Two-Factor Authentication** (Future)
   - TOTP (Google Authenticator)
   - SMS OTP
   - Email OTP
   - Backup codes

#### Deployment Configuration

``yaml
# Docker Compose
services:
  auth-service:
    image: asagus/auth-service:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres/asagus_auth
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=\
      - JWT_EXPIRY=15m
      - REFRESH_TOKEN_EXPIRY=7d
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
    replicas: 2
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
``

---

### 2. Content Management Service

**Purpose**: Manage all website content (projects, services, testimonials, FAQs, etc.)

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Cache: Redis + Memcached
- Search: PostgreSQL Full-Text Search (or Elasticsearch later)
- Validation: Zod
``

#### Database Schema (PostgreSQL)

``sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'web_development', 'mobile_app', 'ai_ml', etc.
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  
  -- Client information
  client_name VARCHAR(255),
  client_logo_url TEXT,
  client_industry VARCHAR(100),
  
  -- Project details
  year INTEGER,
  duration VARCHAR(50), -- '3 months', '6 weeks', etc.
  team_size INTEGER,
  project_url TEXT,
  github_url TEXT,
  
  -- Technologies (JSONB for flexibility)
  technologies JSONB, -- ["Next.js", "React", "PostgreSQL", ...]
  
  -- Metrics (JSONB for flexibility)
  metrics JSONB, -- {"conversions": "250%", "performance": "90 PageSpeed", ...}
  
  -- Case study content
  challenge TEXT,
  solution TEXT,
  outcome TEXT,
  testimonial_id UUID REFERENCES testimonials(id),
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image_url TEXT,
  
  -- Media (JSONB for flexibility)
  images JSONB, -- {"hero": "url", "gallery": ["url1", "url2"], "thumbnail": "url"}
  videos JSONB, -- {"demo": "youtube_url", "testimonial": "url"}
  
  -- Ordering and visibility
  order_index INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  icon VARCHAR(100), -- Icon name from lucide-react or custom
  
  -- Pricing (if applicable)
  starting_price DECIMAL(10, 2),
  pricing_model VARCHAR(50), -- 'one_time', 'monthly', 'custom'
  
  -- Features (JSONB array)
  features JSONB, -- ["Feature 1", "Feature 2", ...]
  
  -- Process steps
  process_steps JSONB, -- [{"title": "Step 1", "description": "..."}, ...]
  
  -- Deliverables
  deliverables JSONB, -- ["Deliverable 1", "Deliverable 2", ...]
  
  -- Related projects
  related_projects JSONB, -- [project_id_1, project_id_2, ...]
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Ordering and visibility
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  company VARCHAR(255),
  company_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  
  -- Relations
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  
  -- Visibility
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- FAQs table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100), -- 'general', 'pricing', 'technical', etc.
  
  -- Related content
  related_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  
  -- Ordering and visibility
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client logos table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  industry VARCHAR(100),
  
  -- Related projects
  project_ids JSONB, -- [project_id_1, project_id_2, ...]
  
  -- Ordering and visibility
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stats (About section) table
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  suffix VARCHAR(20), -- '+', '%', 'K', 'M', etc.
  description TEXT,
  icon VARCHAR(100),
  
  -- Ordering and visibility
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  
  -- Audit fields
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  active BOOLEAN DEFAULT true,
  
  -- Preferences
  preferences JSONB, -- {"frequency": "weekly", "topics": ["ai", "web"]}
  
  -- Source tracking
  source VARCHAR(100), -- 'homepage', 'blog', 'popup', etc.
  referrer TEXT,
  
  -- Engagement
  email_opened_count INTEGER DEFAULT 0,
  link_clicked_count INTEGER DEFAULT 0,
  last_engaged_at TIMESTAMP
);

-- Contact submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service VARCHAR(100), -- Which service they're interested in
  message TEXT NOT NULL,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied', 'closed', 'spam'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  assigned_to UUID REFERENCES users(id),
  
  -- Response
  response TEXT,
  responded_at TIMESTAMP,
  responded_by UUID REFERENCES users(id),
  
  -- Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_published ON projects(published) WHERE published = true;
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(active) WHERE active = true;
CREATE INDEX idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(active) WHERE active = true;

-- Full-text search indexes
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_services_search ON services USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_faqs_search ON faqs USING gin(to_tsvector('english', question || ' ' || answer));
``


#### API Endpoints

``
# Projects
GET    /api/v1/content/projects              # List all projects (with filters)
GET    /api/v1/content/projects/:slug        # Get single project by slug
POST   /api/v1/content/projects              # Create new project (admin)
PUT    /api/v1/content/projects/:id          # Update project (admin)
DELETE /api/v1/content/projects/:id          # Delete project (admin)
PATCH  /api/v1/content/projects/:id/publish  # Publish/unpublish project
POST   /api/v1/content/projects/:id/view     # Increment view count

# Services
GET    /api/v1/content/services              # List all services
GET    /api/v1/content/services/:slug        # Get single service
POST   /api/v1/content/services              # Create service (admin)
PUT    /api/v1/content/services/:id          # Update service (admin)
DELETE /api/v1/content/services/:id          # Delete service (admin)
PATCH  /api/v1/content/services/:id/reorder  # Reorder services

# Testimonials
GET    /api/v1/content/testimonials          # List all testimonials
POST   /api/v1/content/testimonials          # Create testimonial (admin)
PUT    /api/v1/content/testimonials/:id      # Update testimonial (admin)
DELETE /api/v1/content/testimonials/:id      # Delete testimonial (admin)

# FAQs
GET    /api/v1/content/faqs                  # List all FAQs
POST   /api/v1/content/faqs                  # Create FAQ (admin)
PUT    /api/v1/content/faqs/:id              # Update FAQ (admin)
DELETE /api/v1/content/faqs/:id              # Delete FAQ (admin)
POST   /api/v1/content/faqs/:id/helpful      # Mark FAQ as helpful

# Clients
GET    /api/v1/content/clients               # List all client logos
POST   /api/v1/content/clients               # Add client (admin)
PUT    /api/v1/content/clients/:id           # Update client (admin)
DELETE /api/v1/content/clients/:id           # Delete client (admin)

# Stats
GET    /api/v1/content/stats                 # Get all stats
PUT    /api/v1/content/stats/:id             # Update stat (admin)

# Newsletter
POST   /api/v1/content/newsletter/subscribe  # Subscribe to newsletter
POST   /api/v1/content/newsletter/unsubscribe # Unsubscribe
GET    /api/v1/content/newsletter/subscribers # List subscribers (admin)

# Contact
POST   /api/v1/content/contact               # Submit contact form
GET    /api/v1/content/contact/submissions   # List submissions (admin)
GET    /api/v1/content/contact/:id           # Get single submission (admin)
PUT    /api/v1/content/contact/:id/status    # Update status (admin)
POST   /api/v1/content/contact/:id/respond   # Send response (admin)

# Search
GET    /api/v1/content/search?q=query        # Full-text search across content
``

#### Caching Strategy

``typescript
// Redis cache keys and TTL
const cacheKeys = {
  allProjects: 'content:projects:all', // TTL: 5 minutes
  featuredProjects: 'content:projects:featured', // TTL: 15 minutes
  projectBySlug: (slug) => content:project:, // TTL: 1 hour
  allServices: 'content:services:all', // TTL: 1 hour
  featuredTestimonials: 'content:testimonials:featured', // TTL: 30 minutes
  allFaqs: 'content:faqs:all', // TTL: 1 hour
  clientLogos: 'content:clients:all', // TTL: 1 day
  stats: 'content:stats:all', // TTL: 1 day
};

// Cache invalidation on write
// When content is created/updated/deleted, invalidate related cache keys
``

#### Memcached for Query Results

``typescript
// Complex query results cached in Memcached
// TTL: 15-30 minutes

// Example: Featured projects with testimonials and client info
const cacheKey = 'query:projects:featured:with_relations';
const cachedData = await memcached.get(cacheKey);

if (!cachedData) {
  const data = await db.query(/* complex JOIN query */);
  await memcached.set(cacheKey, data, 1800); // 30 minutes
  return data;
}

return cachedData;
``

---

### 3. Media Management Service

**Purpose**: Handle file uploads, image optimization, CDN management

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- Storage: Azure Blob Storage
- Database: PostgreSQL (metadata only)
- Image Processing: Sharp
- Video Processing: FFmpeg
- CDN: Azure CDN
``

#### Database Schema (PostgreSQL)

``sql
-- Media files table
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  
  -- Storage info
  storage_path TEXT NOT NULL, -- Path in blob storage
  blob_url TEXT NOT NULL, -- Direct blob URL
  cdn_url TEXT NOT NULL, -- CDN URL for public access
  
  -- File metadata
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL, -- in bytes
  file_extension VARCHAR(10),
  
  -- Media type and category
  media_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document', 'audio'
  category VARCHAR(100), -- 'project', 'service', 'testimonial', 'logo', etc.
  
  -- Image-specific metadata
  width INTEGER,
  height INTEGER,
  format VARCHAR(20), -- 'jpeg', 'png', 'webp', etc.
  
  -- Optimization data
  is_optimized BOOLEAN DEFAULT false,
  original_size BIGINT,
  compressed_size BIGINT,
  compression_ratio DECIMAL(5, 2),
  
  -- Variants (thumbnails, different sizes)
  variants JSONB, -- {"thumbnail": "url", "small": "url", "medium": "url", "large": "url"}
  
  -- SEO and accessibility
  alt_text TEXT,
  title TEXT,
  caption TEXT,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  used_in JSONB, -- [{"type": "project", "id": "uuid"}, ...]
  
  -- Access control
  is_public BOOLEAN DEFAULT true,
  access_level VARCHAR(50) DEFAULT 'public', -- 'public', 'authenticated', 'private'
  
  -- Audit fields
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP,
  
  -- Soft delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);

-- Media folders/collections
CREATE TABLE media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_folder_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  
  -- Access control
  access_level VARCHAR(50) DEFAULT 'public',
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media tags (for better organization)
CREATE TABLE media_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media file tags (many-to-many)
CREATE TABLE media_file_tags (
  media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES media_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (media_file_id, tag_id)
);

-- Indexes
CREATE INDEX idx_media_files_type ON media_files(media_type);
CREATE INDEX idx_media_files_category ON media_files(category);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX idx_media_files_deleted ON media_files(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_folders_parent ON media_folders(parent_folder_id);
``

#### API Endpoints

``
# Upload
POST   /api/v1/media/upload                  # Upload single file
POST   /api/v1/media/upload/multiple         # Upload multiple files
POST   /api/v1/media/upload/url              # Upload from URL

# Browse and search
GET    /api/v1/media                         # List all media (paginated, filtered)
GET    /api/v1/media/:id                     # Get single media details
GET    /api/v1/media/search?q=query          # Search media

# Management
PUT    /api/v1/media/:id                     # Update media metadata
DELETE /api/v1/media/:id                     # Delete media (soft delete)
POST   /api/v1/media/:id/restore             # Restore deleted media
DELETE /api/v1/media/:id/permanent           # Permanently delete

# Image operations
POST   /api/v1/media/:id/optimize            # Optimize image
POST   /api/v1/media/:id/resize              # Resize image
POST   /api/v1/media/:id/crop                # Crop image
POST   /api/v1/media/:id/convert             # Convert format

# Folders
GET    /api/v1/media/folders                 # List all folders
POST   /api/v1/media/folders                 # Create folder
PUT    /api/v1/media/folders/:id             # Update folder
DELETE /api/v1/media/folders/:id             # Delete folder
POST   /api/v1/media/:id/move                # Move media to folder

# Tags
GET    /api/v1/media/tags                    # List all tags
POST   /api/v1/media/tags                    # Create tag
POST   /api/v1/media/:id/tags                # Add tags to media
DELETE /api/v1/media/:id/tags/:tagId         # Remove tag from media

# Analytics
GET    /api/v1/media/stats                   # Media library statistics
GET    /api/v1/media/unused                  # Find unused media
``

#### Image Processing Pipeline

``typescript
// When an image is uploaded:
1. Upload original to Azure Blob Storage
2. Generate variants:
   - thumbnail: 150x150 (square crop)
   - small: 640px width (maintain aspect ratio)
   - medium: 1024px width
   - large: 1920px width
   - webp versions of all sizes
3. Optimize all variants (Sharp with quality: 85)
4. Upload variants to blob storage
5. Save metadata to PostgreSQL
6. Generate CDN URLs
7. Return response with all URLs

// Optimization settings
const optimizationConfig = {
  jpeg: { quality: 85, progressive: true },
  png: { compressionLevel: 9 },
  webp: { quality: 85 },
};
``

#### Azure Blob Storage Structure

``
/media
  /images
    /projects
      /hero
      /gallery
      /thumbnails
    /services
    /testimonials
    /logos
    /avatars
  /videos
    /demos
    /testimonials
  /documents
    /case-studies
    /presentations
  /temp (auto-delete after 24 hours)
``

---

### 4. Analytics Service

**Purpose**: Track user behavior, generate insights, A/B testing

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- Database: MongoDB (Cosmos DB)
- Cache: Redis (real-time data)
- Visualization: Chart.js, D3.js (frontend)
``

#### MongoDB Collections

``javascript
// Collection: events
{
  _id: ObjectId(),
  eventType: 'page_view', // 'page_view', 'click', 'form_submit', etc.
  userId: 'user-uuid', // If authenticated
  sessionId: 'session-uuid',
  
  // Event data
  eventData: {
    page: '/projects/project-slug',
    referrer: 'https://google.com',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'launch',
  },
  
  // User context
  userAgent: 'Mozilla/5.0...',
  device: 'desktop', // 'desktop', 'mobile', 'tablet'
  browser: 'Chrome',
  os: 'Windows',
  country: 'US',
  city: 'New York',
  
  // Performance metrics (for page_view events)
  performance: {
    loadTime: 1234, // ms
    firstPaint: 500,
    firstContentfulPaint: 800,
    domInteractive: 1000,
  },
  
  // Timestamps
  timestamp: ISODate('2026-02-04T00:00:00Z'),
  serverTimestamp: ISODate('2026-02-04T00:00:01Z'),
}

// Collection: sessions
{
  _id: ObjectId(),
  sessionId: 'session-uuid',
  userId: 'user-uuid', // If authenticated
  
  // Session info
  startTime: ISODate('2026-02-04T00:00:00Z'),
  endTime: ISODate('2026-02-04T00:30:00Z'),
  duration: 1800, // seconds
  
  // Entry/Exit
  entryPage: '/projects',
  exitPage: '/contact',
  pagesViewed: 5,
  
  // User context
  device: 'desktop',
  browser: 'Chrome',
  country: 'US',
  
  // Engagement
  bounced: false,
  converted: true,
  conversionType: 'contact_form', // 'contact_form', 'newsletter', etc.
  
  // Attribution
  source: 'google',
  medium: 'organic',
  campaign: null,
}

// Collection: conversions
{
  _id: ObjectId(),
  conversionType: 'contact_form', // 'contact_form', 'newsletter', 'project_inquiry'
  userId: 'user-uuid',
  sessionId: 'session-uuid',
  
  // Conversion value
  value: 0, // For future e-commerce tracking
  currency: 'USD',
  
  // Attribution
  firstTouch: {
    source: 'google',
    medium: 'organic',
    campaign: null,
    timestamp: ISODate(),
  },
  lastTouch: {
    source: 'direct',
    medium: 'none',
    campaign: null,
    timestamp: ISODate(),
  },
  
  // Conversion data
  conversionData: {
    service: 'web_development',
    budget: '10k-50k',
  },
  
  timestamp: ISODate('2026-02-04T00:30:00Z'),
}

// Collection: ab_tests
{
  _id: ObjectId(),
  testName: 'hero_cta_button',
  variant: 'A', // 'A', 'B', 'C'
  userId: 'user-uuid',
  sessionId: 'session-uuid',
  
  // Test results
  shown: true,
  clicked: true,
  converted: false,
  
  timestamp: ISODate('2026-02-04T00:00:00Z'),
}

// Collection: performance_metrics
{
  _id: ObjectId(),
  page: '/projects/project-slug',
  
  // Core Web Vitals
  lcp: 1200, // Largest Contentful Paint (ms)
  fid: 50, // First Input Delay (ms)
  cls: 0.05, // Cumulative Layout Shift
  
  // Other metrics
  ttfb: 200, // Time to First Byte
  fcp: 800, // First Contentful Paint
  tti: 2000, // Time to Interactive
  
  // Device
  device: 'desktop',
  connection: '4g',
  
  timestamp: ISODate('2026-02-04T00:00:00Z'),
}
``

#### API Endpoints

``
# Event tracking
POST   /api/v1/analytics/event               # Track custom event
POST   /api/v1/analytics/pageview            # Track page view
POST   /api/v1/analytics/conversion          # Track conversion

# Dashboards (admin only)
GET    /api/v1/analytics/dashboard           # Main dashboard data
GET    /api/v1/analytics/realtime            # Real-time visitors
GET    /api/v1/analytics/overview            # Overview stats
GET    /api/v1/analytics/pages               # Page analytics
GET    /api/v1/analytics/sources             # Traffic sources
GET    /api/v1/analytics/devices             # Device breakdown
GET    /api/v1/analytics/geography           # Geographic data
GET    /api/v1/analytics/conversions         # Conversion funnel

# Reports
GET    /api/v1/analytics/reports/daily       # Daily report
GET    /api/v1/analytics/reports/weekly      # Weekly report
GET    /api/v1/analytics/reports/monthly     # Monthly report
GET    /api/v1/analytics/reports/custom      # Custom date range

# A/B Testing
GET    /api/v1/analytics/ab-tests            # List all A/B tests
POST   /api/v1/analytics/ab-tests            # Create A/B test
GET    /api/v1/analytics/ab-tests/:id/results # Get test results
POST   /api/v1/analytics/ab-tests/:id/winner  # Declare winner
``


#### Redis Real-Time Data

``typescript
// Real-time visitor count
realtime:visitors -> Set of active session IDs (TTL: 5 minutes)

// Real-time page views
realtime:pageviews:{page} -> Counter (TTL: 1 hour)

// Active users by page
realtime:page:{page}:users -> Set of session IDs (TTL: 5 minutes)

// Live events stream
realtime:events -> Stream of events (last 1000 events)
``

---

### 5. Notification Service

**Purpose**: Send emails, SMS, push notifications

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- Queue: Azure Service Bus
- Email: Resend / SendGrid
- SMS: Twilio
- Database: PostgreSQL (notification logs)
``

#### Database Schema (PostgreSQL)

``sql
-- Notification templates
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push'
  subject VARCHAR(500), -- For email
  
  -- Template content (supports variables like {{name}}, {{link}})
  body_html TEXT, -- For email
  body_text TEXT, -- For email/sms
  
  -- Variables expected in template
  variables JSONB, -- ["name", "link", "date"]
  
  -- Settings
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  reply_to VARCHAR(255),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification log
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES notification_templates(id),
  
  -- Recipient
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  recipient_user_id UUID REFERENCES users(id),
  
  -- Notification details
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push'
  subject VARCHAR(500),
  body TEXT,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
  provider VARCHAR(50), -- 'resend', 'sendgrid', 'twilio'
  provider_message_id VARCHAR(255),
  
  -- Timestamps
  queued_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Metadata
  metadata JSONB -- Additional context
);

-- Email tracking (for analytics)
CREATE TABLE email_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_log_id UUID REFERENCES notification_log(id),
  
  -- Interaction type
  interaction_type VARCHAR(50) NOT NULL, -- 'opened', 'clicked', 'bounced', 'complained'
  
  -- Click tracking
  link_url TEXT,
  
  -- User context
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notification_log_status ON notification_log(status);
CREATE INDEX idx_notification_log_recipient_email ON notification_log(recipient_email);
CREATE INDEX idx_notification_log_sent_at ON notification_log(sent_at);
``

#### API Endpoints

``
# Send notifications
POST   /api/v1/notifications/send/email      # Send single email
POST   /api/v1/notifications/send/email/bulk # Send bulk emails
POST   /api/v1/notifications/send/sms        # Send SMS
POST   /api/v1/notifications/send/push       # Send push notification

# Templates (admin)
GET    /api/v1/notifications/templates       # List all templates
GET    /api/v1/notifications/templates/:id   # Get template
POST   /api/v1/notifications/templates       # Create template
PUT    /api/v1/notifications/templates/:id   # Update template
DELETE /api/v1/notifications/templates/:id   # Delete template
POST   /api/v1/notifications/templates/:id/test # Send test notification

# Logs and tracking (admin)
GET    /api/v1/notifications/logs            # List notification logs
GET    /api/v1/notifications/logs/:id        # Get log details
GET    /api/v1/notifications/stats           # Notification statistics

# Webhooks (from providers)
POST   /api/v1/notifications/webhook/resend  # Resend webhooks
POST   /api/v1/notifications/webhook/twilio  # Twilio webhooks
``

#### Notification Templates

``typescript
// Example: Welcome email template
{
  name: 'welcome_email',
  type: 'email',
  subject: 'Welcome to ASAGUS, {{name}}!',
  body_html: 
    <h1>Welcome {{name}}!</h1>
    <p>Thank you for subscribing to our newsletter.</p>
    <a href="{{unsubscribe_link}}">Unsubscribe</a>
  ,
  variables: ['name', 'unsubscribe_link'],
}

// Example: Contact form notification
{
  name: 'contact_form_received',
  type: 'email',
  subject: 'New Contact Form Submission from {{name}}',
  body_html: 
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {{name}}</p>
    <p><strong>Email:</strong> {{email}}</p>
    <p><strong>Service:</strong> {{service}}</p>
    <p><strong>Message:</strong> {{message}}</p>
    <a href="{{admin_link}}">View in Admin Panel</a>
  ,
  variables: ['name', 'email', 'service', 'message', 'admin_link'],
}
``

#### Azure Service Bus Queue Processing

``typescript
// Queue: email-notifications
// Message format:
{
  templateId: 'uuid',
  recipientEmail: 'user@example.com',
  variables: {
    name: 'John Doe',
    link: 'https://asagus.com/verify',
  },
  priority: 'normal', // 'low', 'normal', 'high'
}

// Worker processes messages from queue
// Retry logic: 3 attempts with exponential backoff
// Dead letter queue for failed messages
``

---

### 6. Page Builder Service

**Purpose**: Dynamic page creation and management

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL (page structure, SEO)
- Database: MongoDB (page blocks, components)
- Cache: Redis
``

#### Database Schema (PostgreSQL)

``sql
-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  
  -- Page type
  type VARCHAR(50) DEFAULT 'custom', -- 'custom', 'landing', 'blog_post', 'service_page'
  template_id UUID REFERENCES page_templates(id),
  
  -- Content reference (stored in MongoDB)
  content_ref VARCHAR(100), -- MongoDB document ID
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  
  -- Schema.org structured data
  structured_data JSONB,
  
  -- Custom head scripts
  custom_css TEXT,
  custom_js TEXT,
  head_scripts TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  scheduled_publish_at TIMESTAMP,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  parent_version_id UUID REFERENCES pages(id),
  
  -- Access control
  is_public BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  allowed_roles JSONB, -- ['admin', 'premium_user']
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Page templates
CREATE TABLE page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Template structure (stored in MongoDB)
  structure_ref VARCHAR(100),
  
  -- Available blocks for this template
  available_blocks JSONB, -- ['hero', 'features', 'testimonials', 'cta']
  
  -- Settings
  is_system BOOLEAN DEFAULT false, -- System templates can't be deleted
  active BOOLEAN DEFAULT true,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Page versions (for rollback)
CREATE TABLE page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Snapshot of page data
  title VARCHAR(255),
  content_ref VARCHAR(100),
  meta_data JSONB,
  
  -- Change tracking
  change_summary TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(page_id, version_number)
);

-- Indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_published ON pages(published_at) WHERE status = 'published';
``

#### MongoDB Collections

``javascript
// Collection: page_content
{
  _id: ObjectId(),
  pageId: 'uuid', // Reference to PostgreSQL pages table
  
  // Page structure (array of blocks)
  blocks: [
    {
      id: 'block-1',
      type: 'hero',
      order: 0,
      settings: {
        title: 'Welcome to ASAGUS',
        subtitle: 'Building the future',
        backgroundImage: 'https://cdn.asagus.com/hero-bg.jpg',
        ctaText: 'Get Started',
        ctaLink: '/contact',
      },
      style: {
        backgroundColor: '#1a1a1a',
        padding: '100px 0',
        textAlign: 'center',
      },
    },
    {
      id: 'block-2',
      type: 'features',
      order: 1,
      settings: {
        heading: 'Our Services',
        features: [
          {
            title: 'Web Development',
            icon: 'code',
            description: 'Custom websites...',
          },
          // More features...
        ],
      },
      style: {
        backgroundColor: '#ffffff',
        padding: '80px 0',
      },
    },
    // More blocks...
  ],
  
  // Global page settings
  globalStyles: {
    primaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    containerWidth: '1200px',
  },
  
  // Version tracking
  version: 1,
  updatedAt: ISODate('2026-02-04T00:00:00Z'),
}

// Collection: block_components (reusable components)
{
  _id: ObjectId(),
  name: 'Hero Section - Style 1',
  type: 'hero',
  thumbnail: 'https://...',
  
  // Component structure
  structure: {
    // Same as block structure above
  },
  
  // Component variables (for customization)
  variables: [
    { name: 'title', type: 'text', default: 'Default Title' },
    { name: 'backgroundImage', type: 'image', default: null },
  ],
  
  // Category
  category: 'hero',
  tags: ['modern', 'gradient', 'animated'],
  
  // Usage
  usageCount: 15,
  isPublic: true,
  
  createdBy: 'user-uuid',
  createdAt: ISODate('2026-02-04T00:00:00Z'),
}

// Collection: page_templates
{
  _id: ObjectId(),
  templateId: 'uuid', // Reference to PostgreSQL
  
  // Template structure
  blocks: [
    // Pre-configured blocks
  ],
  
  // Template settings
  settings: {
    // Default settings for this template
  },
}
``

#### API Endpoints

``
# Pages
GET    /api/v1/pages                         # List all pages
GET    /api/v1/pages/:slug                   # Get page by slug (public)
POST   /api/v1/pages                         # Create new page (admin)
PUT    /api/v1/pages/:id                     # Update page (admin)
DELETE /api/v1/pages/:id                     # Delete page (admin)
POST   /api/v1/pages/:id/publish             # Publish page (admin)
POST   /api/v1/pages/:id/duplicate           # Duplicate page (admin)

# Page versions
GET    /api/v1/pages/:id/versions            # Get page version history
POST   /api/v1/pages/:id/versions/:versionId/restore # Restore version
GET    /api/v1/pages/:id/preview/:versionId  # Preview specific version

# Page builder
GET    /api/v1/pages/:id/content             # Get page content for editing
PUT    /api/v1/pages/:id/content             # Update page content
POST   /api/v1/pages/:id/blocks              # Add block to page
PUT    /api/v1/pages/:id/blocks/:blockId     # Update block
DELETE /api/v1/pages/:id/blocks/:blockId     # Remove block
POST   /api/v1/pages/:id/blocks/reorder      # Reorder blocks

# Templates
GET    /api/v1/pages/templates               # List all templates
GET    /api/v1/pages/templates/:id           # Get template
POST   /api/v1/pages/templates               # Create template (admin)
POST   /api/v1/pages/templates/:id/use       # Create page from template

# Components
GET    /api/v1/pages/components              # List all components
GET    /api/v1/pages/components/:id          # Get component
POST   /api/v1/pages/components              # Create component (admin)
PUT    /api/v1/pages/components/:id          # Update component (admin)
DELETE /api/v1/pages/components/:id          # Delete component (admin)
``

#### Page Builder Features

``typescript
// Drag-and-drop interface
// Real-time preview
// Responsive design controls (desktop, tablet, mobile)
// Undo/Redo functionality
// Save as draft
// Schedule publishing
// SEO preview
// Performance score
// Accessibility checker
// Custom CSS/JS injection
// Import/Export pages
// A/B testing support
``

---

### 7. AI/ML Service (Future)

**Purpose**: AI-powered features and ML models

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Python 3.11 (for ML) + Node.js (for API)
- Framework: FastAPI (Python) or Express.js (Node.js)
- ML Libraries: TensorFlow, PyTorch, Transformers
- Database: MongoDB (model metadata, predictions)
- Vector DB: Pinecone or Azure Cognitive Search
- Cache: Redis
``

#### Features (Planned)

``typescript
// 1. Content Generation
- Blog post generation (GPT-4)
- Meta description generation
- Social media captions
- Image alt text generation

// 2. Image Generation
- Hero images (DALL-E, Midjourney API)
- Logo generation
- Thumbnail creation
- Image style transfer

// 3. Chatbot
- Customer support chatbot
- Lead qualification bot
- Project requirement collector

// 4. Recommendation Engine
- Project recommendations
- Service recommendations
- Content recommendations

// 5. Sentiment Analysis
- Testimonial analysis
- Contact form priority scoring
- Review sentiment classification

// 6. Predictive Analytics
- Lead scoring
- Conversion prediction
- Churn prediction (for SaaS)
``

#### MongoDB Collections

``javascript
// Collection: ml_models
{
  _id: ObjectId(),
  name: 'content_generator_v1',
  type: 'text_generation',
  provider: 'openai', // 'openai', 'anthropic', 'custom'
  modelId: 'gpt-4',
  
  // Configuration
  config: {
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
  },
  
  // Performance metrics
  metrics: {
    averageLatency: 1200, // ms
    successRate: 99.5, // %
    totalRequests: 10000,
  },
  
  // Cost tracking
  costPerRequest: 0.03, // USD
  totalCost: 300, // USD
  
  // Status
  isActive: true,
  version: '1.0.0',
  
  createdAt: ISODate('2026-02-04T00:00:00Z'),
  updatedAt: ISODate('2026-02-04T00:00:00Z'),
}

// Collection: predictions
{
  _id: ObjectId(),
  modelId: ObjectId(),
  
  // Input
  input: {
    prompt: 'Generate a blog post about...',
    parameters: { temperature: 0.7 },
  },
  
  // Output
  output: {
    text: 'Here is your blog post...',
    tokensUsed: 500,
  },
  
  // Metadata
  userId: 'user-uuid',
  latency: 1234, // ms
  cost: 0.03, // USD
  
  // Quality feedback
  userRating: 5,
  userFeedback: 'Great output!',
  
  timestamp: ISODate('2026-02-04T00:00:00Z'),
}

// Collection: training_data
{
  _id: ObjectId(),
  datasetName: 'testimonials_sentiment',
  
  // Training examples
  examples: [
    { input: 'This is amazing!', label: 'positive' },
    { input: 'Not satisfied', label: 'negative' },
    // More examples...
  ],
  
  // Dataset info
  totalExamples: 10000,
  trainingExamples: 8000,
  validationExamples: 1000,
  testExamples: 1000,
  
  createdAt: ISODate('2026-02-04T00:00:00Z'),
}
``

#### API Endpoints (Future)

``
# Content generation
POST   /api/v1/ai/generate/text              # Generate text content
POST   /api/v1/ai/generate/image             # Generate image
POST   /api/v1/ai/generate/meta              # Generate meta descriptions

# Chatbot
POST   /api/v1/ai/chat                       # Chat with AI
GET    /api/v1/ai/chat/history/:sessionId    # Get chat history

# Analysis
POST   /api/v1/ai/analyze/sentiment          # Sentiment analysis
POST   /api/v1/ai/analyze/text               # Text analysis

# Recommendations
GET    /api/v1/ai/recommendations/projects   # Get project recommendations
GET    /api/v1/ai/recommendations/services   # Get service recommendations

# Admin
GET    /api/v1/ai/models                     # List all models
GET    /api/v1/ai/usage                      # Usage statistics
GET    /api/v1/ai/costs                      # Cost tracking
``

---

### 8. Cybersecurity Service (Future)

**Purpose**: Security scanning, vulnerability detection, compliance

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Python 3.11 (for security tools) + Node.js (for API)
- Framework: FastAPI (Python)
- Security Tools: OWASP ZAP, Nmap, Metasploit
- Database: PostgreSQL (audit logs, scan results)
- Cache: Redis
``

#### Features (Planned)

``typescript
// 1. Vulnerability Scanning
- Website vulnerability scanning
- API security testing
- SSL/TLS certificate validation
- Security headers check

// 2. Penetration Testing
- Automated pen testing
- SQL injection testing
- XSS detection
- CSRF testing

// 3. Compliance Monitoring
- GDPR compliance checker
- OWASP Top 10 compliance
- PCI DSS compliance
- ISO 27001 assessment

// 4. Threat Detection
- Real-time threat monitoring
- Brute force detection
- DDoS detection
- Anomaly detection

// 5. Audit Logging
- Security event logging
- Access logs
- Change logs
- Compliance reports
``

#### Database Schema (PostgreSQL)

``sql
-- Security scans
CREATE TABLE security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_url TEXT NOT NULL,
  scan_type VARCHAR(50) NOT NULL, -- 'vulnerability', 'penetration', 'compliance'
  
  -- Scan configuration
  config JSONB,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  progress INTEGER DEFAULT 0, -- 0-100
  
  -- Results
  vulnerabilities_found INTEGER DEFAULT 0,
  risk_score INTEGER, -- 0-100
  report_url TEXT,
  
  -- Timing
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration INTEGER, -- seconds
  
  -- Audit
  requested_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vulnerabilities
CREATE TABLE vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES security_scans(id),
  
  -- Vulnerability details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low', 'info'
  cvss_score DECIMAL(3, 1), -- 0.0 - 10.0
  cve_id VARCHAR(50), -- CVE-2021-12345
  
  -- Location
  url TEXT,
  parameter VARCHAR(255),
  method VARCHAR(10), -- GET, POST, etc.
  
  -- Remediation
  remediation TEXT,
  references JSONB, -- [{"title": "...", "url": "..."}]
  
  -- Status
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'false_positive'
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Security audit log
CREATE TABLE security_audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  
  -- Event details
  description TEXT,
  user_id UUID REFERENCES users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Context
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  action VARCHAR(50),
  
  -- Additional data
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_security_scans_status ON security_scans(status);
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX idx_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX idx_audit_log_created_at ON security_audit_log(created_at);
``

#### API Endpoints (Future)

``
# Scanning
POST   /api/v1/security/scan/start           # Start security scan
GET    /api/v1/security/scan/:id             # Get scan status
GET    /api/v1/security/scan/:id/report      # Get scan report
DELETE /api/v1/security/scan/:id             # Cancel scan

# Vulnerabilities
GET    /api/v1/security/vulnerabilities      # List vulnerabilities
GET    /api/v1/security/vulnerabilities/:id  # Get vulnerability details
PUT    /api/v1/security/vulnerabilities/:id/status # Update status
POST   /api/v1/security/vulnerabilities/:id/retest # Re-test vulnerability

# Compliance
GET    /api/v1/security/compliance           # Get compliance status
POST   /api/v1/security/compliance/check     # Run compliance check
GET    /api/v1/security/compliance/report    # Generate compliance report

# Audit logs
GET    /api/v1/security/audit-log            # Get audit logs
GET    /api/v1/security/audit-log/export     # Export audit logs
``

---

### 9. Billing Service (Future)

**Purpose**: Subscriptions, payments, invoicing

#### Technical Specifications

``typescript
// Technology Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Payment Gateway: Stripe / Razorpay
- Cache: Redis
``

#### Database Schema (PostgreSQL)

``sql
-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
  
  -- Features
  features JSONB, -- ["feature1", "feature2", ...]
  limits JSONB, -- {"projects": 10, "api_calls": 1000}
  
  -- Stripe/Razorpay IDs
  stripe_price_id VARCHAR(255),
  razorpay_plan_id VARCHAR(255),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES subscription_plans(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  
  -- Billing
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP,
  
  -- Payment gateway
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Invoice details
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  
  -- Payment
  paid_at TIMESTAMP,
  payment_method VARCHAR(50),
  
  -- Files
  pdf_url TEXT,
  
  -- Gateway
  stripe_invoice_id VARCHAR(255),
  
  -- Due date
  due_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  invoice_id UUID REFERENCES invoices(id),
  
  -- Transaction details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Status
  status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Payment gateway
  gateway VARCHAR(50) NOT NULL, -- 'stripe', 'razorpay'
  gateway_transaction_id VARCHAR(255),
  
  -- Payment method
  payment_method VARCHAR(50), -- 'card', 'upi', 'netbanking', etc.
  
  -- Error handling
  error_code VARCHAR(50),
  error_message TEXT,
  
  -- Timestamps
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking (for metered billing)
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Usage details
  metric VARCHAR(100) NOT NULL, -- 'api_calls', 'storage', 'bandwidth', etc.
  quantity INTEGER NOT NULL,
  
  -- Billing
  unit_price DECIMAL(10, 4),
  total_cost DECIMAL(10, 2),
  
  -- Period
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_usage_user_id ON usage_records(user_id);
``

