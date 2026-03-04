# ASAGUS Audit - Technical Details & Code Fixes

## 1. CRITICAL SCHEMA FIXES

### Fix 1: Add Missing ProjectMetric Index

**Current State**: No index on project_id
```sql
CREATE TABLE "project_metrics" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,  -- NO INDEX!
    "metric" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "project_metrics_pkey" PRIMARY KEY ("id")
);
```

**Migration File**: `packages/database/prisma/migrations/20260304000001_add_missing_indexes/migration.sql`

```sql
-- AddIndex
CREATE INDEX "project_metrics_project_id_idx" ON "project_metrics"("project_id");
```

**Prisma Schema Update**:
```prisma
model ProjectMetric {
  id        Int    @id @default(autoincrement())
  projectId String @map("project_id")
  metric    String
  value     String

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])  // ADD THIS
  @@map("project_metrics")
}
```

---

### Fix 2: Add BlogPost.authorId Foreign Key

**Current Issue**: No relation to User table
```prisma
model BlogPost {
  id         String  @id @default(uuid())
  title      String
  slug       String  @unique
  // ...
  authorId   String? @map("author_id")  // NO FK!
  authorName String  @map("author_name")
  // ...
}
```

**Migration**:
```sql
-- AddForeignKey (may already exist, verify)
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" 
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

**Prisma Schema Fix**:
```prisma
model BlogPost {
  id         String  @id @default(uuid())
  title      String
  slug       String  @unique
  excerpt    String? @db.Text
  content    String  @db.Text
  featuredImage String? @map("featured_image")

  // Author relation - ADD THIS
  authorId   String? @map("author_id")
  author     User?   @relation("BlogPostAuthor", fields: [authorId], references: [id], onDelete: SetNull)
  authorName String  @map("author_name")

  category String
  tags     String[]
  
  status      String    @default("draft")
  publishedAt DateTime? @map("published_at")
  featured    Boolean   @default(false)
  viewCount   Int       @default(0) @map("view_count")
  readTime    Int?      @map("read_time")

  metaTitle       String? @map("meta_title")
  metaDescription String? @map("meta_description")
  ogImage         String? @map("og_image")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@index([category])
  @@index([publishedAt])
  @@index([featured])
  @@index([createdAt])
  @@map("blog_posts")
}

// Update User model to include this relation
model User {
  // ... existing fields ...
  blogPosts BlogPost[] @relation("BlogPostAuthor")
}
```

---

### Fix 3: Normalize ResearchProject.teamMembers

**Current Issue**: Array of strings instead of proper relation
```prisma
model ResearchProject {
  // ...
  teamMembers String[] @map("team_members")  // WRONG!
  // ...
}
```

**Problem**: 
- Can't query by team member efficiently
- No cascading deletes if team member deleted
- No metadata about role/contribution

**Solution - Add Junction Table**:

**Migration**:
```sql
-- CreateTable
CREATE TABLE "research_team_members" (
    "research_project_id" TEXT NOT NULL,
    "team_member_id" TEXT NOT NULL,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_team_members_pkey" PRIMARY KEY ("research_project_id","team_member_id")
);

-- AddForeignKey
ALTER TABLE "research_team_members" ADD CONSTRAINT "research_team_members_research_project_id_fkey" 
  FOREIGN KEY ("research_project_id") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "research_team_members" ADD CONSTRAINT "research_team_members_team_member_id_fkey" 
  FOREIGN KEY ("team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove old column (if migrating)
ALTER TABLE "research_projects" DROP COLUMN "team_members";
```

**Updated Schema**:
```prisma
model ResearchProject {
  id          String @id @default(uuid())
  title       String
  slug        String @unique
  description String @db.Text

  status       String   @default("ongoing")
  category     String
  technologies String[]
  
  // REPLACE: teamMembers String[] @map("team_members")
  // WITH:
  teamMembers ResearchTeamMember[]

  thumbnailUrl  String?  @map("thumbnail_url")
  galleryImages String[] @map("gallery_images")

  objectives   String? @db.Text
  methodology  String? @db.Text
  results      String? @db.Text
  publications Json?

  startDate DateTime? @map("start_date")
  endDate   DateTime? @map("end_date")

  isPublic   Boolean @default(false) @map("is_public")
  featured   Boolean @default(false)
  orderIndex Int     @default(0) @map("order_index")

  metaTitle       String? @map("meta_title")
  metaDescription String? @map("meta_description")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@index([category])
  @@index([isPublic])
  @@index([featured])
  @@map("research_projects")
}

model ResearchTeamMember {
  researchProjectId String @map("research_project_id")
  teamMemberId      String @map("team_member_id")
  role              String?

  researchProject ResearchProject @relation(fields: [researchProjectId], references: [id], onDelete: Cascade)
  teamMember      TeamMember      @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)

  @@id([researchProjectId, teamMemberId])
  @@map("research_team_members")
}

// Update TeamMember model
model TeamMember {
  // ... existing fields ...
  researchProjects ResearchTeamMember[]
}
```

---

### Fix 4: Add Missing Contact Submission Indexes

**Migration**:
```sql
-- AddIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");
CREATE INDEX "contact_submissions_is_replied_idx" ON "contact_submissions"("is_replied");
```

**Schema Update**:
```prisma
model ContactSubmission {
  id        String    @id @default(uuid())
  name      String
  email     String
  subject   String?
  message   String    @db.Text
  phone     String?
  company   String?
  isRead    Boolean   @default(false) @map("is_read")
  isReplied Boolean   @default(false) @map("is_replied")
  repliedAt DateTime? @map("replied_at")
  reply     String?   @db.Text
  ipAddress String?   @map("ip_address")

  createdAt DateTime @default(now()) @map("created_at")

  @@index([isRead])
  @@index([createdAt])
  @@index([email])       // ADD THIS
  @@index([isReplied])   // ADD THIS
  @@map("contact_submissions")
}
```

---

### Fix 5: Add Newsletter Subscriber Indexes

**Migration**:
```sql
CREATE INDEX "newsletter_subscribers_subscribed_at_idx" ON "newsletter_subscribers"("subscribed_at");
CREATE INDEX "newsletter_subscribers_unsubscribed_at_idx" ON "newsletter_subscribers"("unsubscribed_at");
```

**Schema Update**:
```prisma
model NewsletterSubscriber {
  id             String    @id @default(uuid())
  email          String    @unique
  name           String?
  isActive       Boolean   @default(true) @map("is_active")
  subscribedAt   DateTime  @default(now()) @map("subscribed_at")
  unsubscribedAt DateTime? @map("unsubscribed_at")
  source         String?
  ipAddress      String?   @map("ip_address")

  @@index([isActive])
  @@index([subscribedAt])      // ADD THIS
  @@index([unsubscribedAt])    // ADD THIS
  @@map("newsletter_subscribers")
}
```

---

## 2. ENVIRONMENT CONFIGURATION FIXES

### Fix 1: Create Root .env.example

**File**: `.env.example` (at root)

```bash
# ============================================
# ASAGUS Workspace Root - Environment Variables
# Copy this file to .env and fill in actual values
# NEVER commit real credentials
# ============================================

# Database (PostgreSQL)
# Use strong password: openssl rand -base64 32
DATABASE_URL="postgresql://postgres:YOUR_STRONG_PASSWORD@localhost:5432/asagus_admin?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
POSTGRES_DB=asagus_admin
POSTGRES_PORT=5432

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379

# JWT Secrets - MUST be >= 32 characters, cryptographically random
# Generate: openssl rand -base64 32
JWT_ACCESS_SECRET=YOUR_RANDOM_32_CHAR_SECRET_HERE
JWT_REFRESH_SECRET=YOUR_RANDOM_32_CHAR_SECRET_HERE
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API Gateway
GATEWAY_PORT=4000
GATEWAY_URL=http://localhost:4000

# Services
AUTH_SERVICE_PORT=4001
AUTH_SERVICE_URL=http://localhost:4001
CONTENT_SERVICE_PORT=4002
CONTENT_SERVICE_URL=http://localhost:4002
ANALYTICS_SERVICE_PORT=4003
ANALYTICS_SERVICE_URL=http://localhost:4003

# Admin Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
ADMIN_FRONTEND_PORT=3001

# Email (Resend)
RESEND_API_KEY=re_YOUR_API_KEY_HERE
FROM_EMAIL=admin@asagus.com

# Super Admin - CHANGE THESE in production!
SUPER_ADMIN_EMAIL=admin@asagus.com
SUPER_ADMIN_PASSWORD=YOUR_STRONG_PASSWORD_HERE
SUPER_ADMIN_NAME=Super Admin

# Node environment
NODE_ENV=development
```

**Important**: Update `.gitignore` to ensure .env is never committed:
```bash
# In .gitignore, verify:
.env
.env.*
!.env.example
!.env.*.example
```

---

### Fix 2: Create Production Environment Template

**File**: `.env.production.example`

```bash
# ============================================
# ASAGUS Production - Environment Variables
# Use CI/CD secrets management for all sensitive values
# DO NOT commit real credentials
# ============================================

NODE_ENV=production

# Database - Use production credentials from secrets
DATABASE_URL=${DATABASE_URL}  # Set via CI/CD secret
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=asagus_admin_prod
POSTGRES_PORT=5432

# Redis - Optional, production cache
REDIS_URL=${REDIS_URL}
REDIS_PORT=6379

# JWT - Use random secrets from secrets management
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API Configuration
GATEWAY_PORT=4000
GATEWAY_URL=https://api.asagus.com
AUTH_SERVICE_PORT=4001
AUTH_SERVICE_URL=http://auth-service:4001
CONTENT_SERVICE_PORT=4002
CONTENT_SERVICE_URL=http://content-service:4002
ANALYTICS_SERVICE_PORT=4003
ANALYTICS_SERVICE_URL=http://analytics-service:4003

# Admin Frontend
NEXT_PUBLIC_API_URL=https://api.asagus.com/api/v1
ADMIN_FRONTEND_PORT=3001

# Email Service
RESEND_API_KEY=${RESEND_API_KEY}
FROM_EMAIL=noreply@asagus.com

# Logging
LOG_LEVEL=info

# Monitoring (if using)
# SENTRY_DSN=${SENTRY_DSN}
```

---

### Fix 3: Update apps/web and apps/admin with .env.example

**File**: `apps/web/.env.example`

```bash
# Apps Web Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

**File**: `apps/admin/.env.example`

```bash
# Apps Admin Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
DATABASE_URL=postgresql://postgres:password@localhost:5432/asagus_admin?schema=public
```

---

## 3. DOCKER COMPOSE FIXES

**File**: `docker/docker-compose.yml`

```yaml
version: "3.9"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: asagus_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-asagus_admin}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 15s
      timeout: 10s
      retries: 5
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: asagus_redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 15s
      timeout: 10s
      retries: 5
      start_period: 20s
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

**Key Changes**:
- Removed default `Gang$ter111` password ✓
- Added `start_period` to health checks ✓
- Added resource limits ✓
- Increased health check timeouts ✓

---

## 4. DEPENDENCY STANDARDIZATION

### Fix: Align Next.js Versions

**Current State**:
- `apps/web`: Next 16.1.6
- `apps/admin`: Next 15.1.0

**Solution**: Update `apps/admin/package.json`

```json
{
  "name": "@asagus/admin-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "clean": "rimraf node_modules .next"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@tanstack/react-table": "^8.21.3",
    "@tiptap/extension-image": "^3.19.0",
    "@tiptap/extension-link": "^3.19.0",
    "@tiptap/extension-placeholder": "^3.19.0",
    "@tiptap/react": "^3.19.0",
    "@tiptap/starter-kit": "^3.19.0",
    "@vercel/blob": "^2.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "next": "16.1.6",  // CHANGED from ^15.1.0
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.24.0"  // ADD THIS
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.49",
    "rimraf": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

---

## 5. SEED SCRIPT FIX

**File**: `packages/database/src/seed.ts` (Line 54-58)

**Current (BROKEN)**:
```typescript
const perm = await prisma.permission.upsert({
  where: { resource_action: { resource, action } },  // WRONG!
  update: {},
  create: { resource, action, description: `${action} ${resource}` },
});
```

**Fixed**:
```typescript
const perm = await prisma.permission.upsert({
  where: {
    resource_action: {
      resource: resource,
      action: action
    }
  },
  update: {},
  create: { resource, action, description: `${action} ${resource}` },
});
```

**Or update schema to use explicit unique naming**:

In `packages/database/prisma/schema.prisma`:
```prisma
model Permission {
  id          Int      @id @default(autoincrement())
  resource    String
  action      String
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  rolePermissions RolePermission[]

  @@unique([resource, action], name: "resource_action")  // Explicit name
  @@map("permissions")
}
```

Then use:
```typescript
where: { resource_action: { resource, action } }
```

---

## 6. PACKAGE.JSON FIXES

### Fix 1: Move dotenv to devDependencies in packages/database

**Current**:
```json
"dependencies": {
  "@prisma/client": "6.19.2",
  "dotenv": "^16.4.0"
}
```

**Fixed**:
```json
"dependencies": {
  "@prisma/client": "6.19.2"
},
"devDependencies": {
  "@types/bcryptjs": "^2.4.6",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.4.0",
  "dotenv-cli": "^8.0.0",
  "prisma": "6.19.2",
  "rimraf": "^6.0.0",
  "tsx": "^4.19.0",
  "typescript": "^5.7.0"
}
```

---

## 7. CI/CD VALIDATION COMMANDS

Add to your CI/CD pipeline (GitHub Actions, GitLab CI, etc.):

```bash
# Check for environment variables
npm run audit
pnpm audit

# Validate schema
pnpm --filter @asagus/database generate
pnpm --filter @asagus/database db:validate

# Run migrations
pnpm --filter @asagus/database migrate:prod

# Seed database
pnpm --filter @asagus/database seed

# Build all packages
pnpm build
```

---

## 8. SECURITY CHECKLIST

- [ ] Remove .env from git history: `git rm -r --cached .env && git commit -m "Remove credentials"`
- [ ] Set up CI/CD secrets for: JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, DATABASE_URL, POSTGRES_PASSWORD
- [ ] Generate new JWT secrets: `openssl rand -base64 32`
- [ ] Create production database with separate strong password
- [ ] Enable PostgreSQL SSL connections in production
- [ ] Add rate limiting to all public APIs
- [ ] Enable CORS properly (whitelist domains)
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Add Content-Security-Policy headers
- [ ] Enable request validation on all endpoints
- [ ] Run `npm audit` in CI/CD pipeline
- [ ] Set up monitoring and alerting for failed login attempts

