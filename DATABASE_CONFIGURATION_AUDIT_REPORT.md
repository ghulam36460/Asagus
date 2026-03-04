# ASAGUS Database & Configuration Audit Report

**Date**: March 3, 2026
**Audited Components**: Schema, Database Config, Dependencies, Docker Setup, Environment Variables

---

## CRITICAL FINDINGS

### 🔴 SECURITY ISSUES

#### 1. **Hardcoded Default Credentials in Docker Compose** (CRITICAL)
**Location**: `docker/docker-compose.yml` (line 10)
```yaml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-Gang$ter111}
```
**Issue**: Default password `Gang$ter111` is exposed in version control
**Risk**: Anyone with access to repo can access database
**Fix**: Remove hardcoded defaults, require explicit env vars
```yaml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # Remove default!
```

#### 2. **Weak Default Admin Password** (HIGH)
**Location**: `.env` (line 44) and `packages/database/src/seed.ts` (line 155)
```
SUPER_ADMIN_PASSWORD="Admin@2026Secure!"
```
**Issue**: Same password used in example files and actual .env
**Risk**: Weak password pattern, exposed in multiple places
**Fix**: Generate strong random password per deployment, don't commit to .env

#### 3. **Insufficient JWT Secrets** (MEDIUM)
**Location**: `.env` (lines 17-18)
```
JWT_ACCESS_SECRET="asagus-admin-access-secret-2026-min-32-characters-required"
JWT_REFRESH_SECRET="asagus-admin-refresh-secret-2026-min-32-characters-required"
```
**Issue**: 
- Secrets are hardcoded in committed .env file
- Text indicates "min-32-characters" but values are predictable strings
- Should be cryptographically random
**Fix**: Generate with `openssl rand -base64 32`

#### 4. **Exposed Database URL Credentials** (HIGH)
**Location**: `.env` (line 6)
```
DATABASE_URL="postgresql://postgres:Gang%24ter111@localhost:5432/asagus_admin?schema=public"
```
**Issue**: Password embedded in connection string, file is committed
**Fix**: Use DATABASE_URL from CI/CD secrets, never commit actual credentials

#### 5. **Missing API Key Validation** (MEDIUM)
**Location**: `packages/database/prisma/schema.prisma` (line 116)
```prisma
permissions Json?  // Stored as JSON without validation
```
**Issue**: ApiKey.permissions stored as unvalidated JSON
**Risk**: No schema validation, could accept malformed permission objects
**Fix**: Define strict JSON schema or use separate PermissionGrant model

---

## SCHEMA DESIGN ISSUES

### Missing Indexes (Performance)

#### 1. **ProjectMetric Table** (MEDIUM)
**Issue**: No index on `project_id`
**Impact**: Queries filtering by project will cause full table scans
**Migration**:
```sql
CREATE INDEX project_metrics_project_id_idx ON project_metrics(project_id);
```

#### 2. **Contact Submissions** (MEDIUM)
**Missing indexes**:
- No index on `email` (needed for deduplication queries)
- No index on `is_replied` (for filtering unreplied contacts)
```sql
CREATE INDEX contact_submissions_email_idx ON contact_submissions(email);
CREATE INDEX contact_submissions_is_replied_idx ON contact_submissions(is_replied);
```

#### 3. **Newsletter Subscribers** (MEDIUM)
**Missing indexes**:
- No index on `subscribed_at` (for time-range queries)
- No index on `unsubscribed_at` (for active subscriber filtering)
```sql
CREATE INDEX newsletter_subscribers_subscribed_at_idx ON newsletter_subscribers(subscribed_at);
CREATE INDEX newsletter_subscribers_unsubscribed_at_idx ON newsletter_subscribers(unsubscribed_at);
```

#### 4. **Blog Posts** (MEDIUM)
**Missing indexes**:
- No index on `tags` (array field - would need GIN index)
- No author_id index (foreign key to User, though not enforced)
```sql
CREATE INDEX blog_posts_tags_idx ON blog_posts USING GIN(tags);
```

#### 5. **Analytics Tables** (MEDIUM)
**PageView**: No index on `referrer` (common query field)
**AnalyticsEvent**: No index on `category` (filtering by event type)
```sql
CREATE INDEX page_views_referrer_idx ON page_views(referrer);
CREATE INDEX analytics_events_category_idx ON analytics_events(category);
```

---

### Missing Foreign Key Constraints (Data Integrity)

#### 1. **BlogPost.authorId** (HIGH)
**Location**: `schema.prisma` line 539
```prisma
authorId   String? @map("author_id")
```
**Issue**: Foreign key reference to User table not enforced
**Fix**:
```prisma
authorId   String? @map("author_id")
author     User?   @relation(fields: [authorId], references: [id], onDelete: SetNull)
```

#### 2. **Media.uploadedBy** (MEDIUM)
**Location**: `schema.prisma` line 417
```prisma
uploadedBy String? @map("uploaded_by")
```
**Issue**: No foreign key to User table
**Fix**: Add User relation

#### 3. **AuditLog.userId** (MEDIUM)
**Current**: Only optional FK without cascade on delete
```prisma
user User? @relation("AuditLogUser", fields: [userId], references: [id])
```
**Issue**: If user is deleted, orphaned audit logs remain. Should use `onDelete: SetNull` for audit trail integrity
**Already correct** ✓

---

### Field Type Issues

#### 1. **ProjectMetric Values** (MEDIUM)
**Location**: `schema.prisma` line 202
```prisma
value String  // Should be flexible for numbers or formatted strings
```
**Issue**: Metric values like "50,000+" or "4.8/5" stored as strings
**Better approach**: Store as JSON with type info
```prisma
value Json  // {"raw": 50000, "display": "50,000+"}
```

#### 2. **Contact Submission Reply** (LOW)
**Current**: `reply String? @db.Text`
**Issue**: No reply timestamp or admin who replied
**Fix**: Add `repliedBy String?` FK to User

---

### Missing Relationships

#### 1. **ProjectMetric → no direct User relation** (LOW)
Can't track who created/modified metrics

#### 2. **ResearchProject** (MEDIUM)
**Line 601**: `teamMembers String[]` stores team member IDs as array
**Issue**: No normalized relation to TeamMember model
**Current**:
```prisma
teamMembers String[] @map("team_members")
```
**Fix**: Create junction table
```prisma
model ResearchTeamMember {
  researchProjectId String
  teamMemberId      String
  researchProject   ResearchProject @relation(fields: [researchProjectId])
  teamMember        TeamMember      @relation(fields: [teamMemberId])
  @@id([researchProjectId, teamMemberId])
}
```

---

## ENVIRONMENT & CONFIGURATION ISSUES

### 1. **Missing Environment Variables** (HIGH)
**Required but not documented**:
- `NEXT_PUBLIC_API_URL` in web app (used but no .env.example in apps/web)
- No `.env.example` in root or app directories
- Services missing their own .env files

**Fix**: Create `.env.example` at root and in each app:
```bash
# Root .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/asagus?schema=public
JWT_ACCESS_SECRET=<generate-32-char-random>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-password>
# ... etc
```

### 2. **Inconsistent Environment Variable Naming** (MEDIUM)
- Root `.env`: Uses `SUPER_ADMIN_EMAIL`, `JWT_ACCESS_SECRET`
- Config example: Same (good consistency)
- Services: Don't define their own schemas

**Fix**: Create `.env.schema` or document in README

### 3. **Production Configuration Missing** (HIGH)
**Location**: Root `.env` is development-only
**Issues**:
- No `.env.production` template
- No DATABASE_URL for production
- NODE_ENV hardcoded as "development" in `.env`
- No reference to production secrets management

**Fix**: Create `.env.production.example`:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
# Use strong random secrets, managed via CI/CD
JWT_ACCESS_SECRET=<from-ci-cd-secret>
JWT_REFRESH_SECRET=<from-ci-cd-secret>
```

### 4. **Missing Redis Configuration** (MEDIUM)
**Location**: `.env` has `REDIS_URL` but:
- No Redis client instantiated in any service
- Docker compose defines Redis but code doesn't use it
- No caching layer implemented

**Either**:
- Remove Redis from docker-compose if not needed
- Or implement Redis client in services

---

## DEPENDENCY ISSUES

### 1. **Version Inconsistencies** (MEDIUM)

**apps/web/package.json**:
```json
"next": "16.1.6"
"@types/react": "^19"
```

**apps/admin/package.json**:
```json
"next": "^15.1.0"
"@types/react": "^19.0.0"
```

**Issue**: Web uses Next 16, Admin uses Next 15 - could cause monorepo issues
**Fix**: Standardize to same major version

### 2. **Missing Security Patches** (Check Required)

**Issue**: Cannot check with npm outdated due to PowerShell limitations, but note:
- `helmet@^8.0.0` (ok)
- `express@^5.0.1` (latest major, check for vulnerabilities)
- `jsonwebtoken@^9.0.2` (check for recent CVEs)

**Action**: Run in CI/CD:
```bash
npm audit
pnpm audit
```

### 3. **Unnecessary Dependencies** (LOW)

**packages/database**:
- `dotenv@^16.4.0` is only used for seed script
- Should be in devDependencies only
- Already moved dotenv-cli to devDependencies ✓

**Fix**:
```json
"devDependencies": {
  "dotenv": "^16.4.0"
}
```

### 4. **Missing Validation Libraries**
**apps/web**: No input validation library, uses ad-hoc validation
**apps/admin**: No form validation beyond HTML5

**Add to both**:
```json
"zod": "^3.24.0"
```
(Already in shared package, should be re-exported)

---

## DOCKER CONFIGURATION ISSUES

### 1. **Health Check Configuration** (MEDIUM)
**Location**: `docker/docker-compose.yml` (lines 17-21)
```yaml
healthcheck:
  test: [\"CMD-SHELL\", \"pg_isready -U ${POSTGRES_USER:-postgres}\"]
  interval: 10s
  timeout: 5s
  retries: 5
```
**Issue**: 
- Uses `${POSTGRES_USER}` but should be just `postgres` for pg_isready
- Timeout of 5s may be too short for startup
**Fix**:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 15s
  timeout: 10s
  retries: 5
  start_period: 40s
```

### 2. **Persistent Volume Issues** (LOW)
**Location**: `docker/docker-compose.yml` (lines 40-43)
```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```
**Issue**: Local driver volumes are tied to single machine
**For production**: Use named volumes with proper backup strategy
**Better config**:
```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: tmpfs  # Or configure backup
      device: tmpfs
      o: size=1G
```

### 3. **Missing Container Resource Limits** (MEDIUM)
**Issue**: No memory/CPU limits defined
**Add**:
```yaml
postgres:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 2G
      reservations:
        cpus: '0.5'
        memory: 1G
redis:
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
```

### 4. **Missing Init Script** (LOW)
**Location**: `docker/docker-compose.yml` line 16
```yaml
./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
```
**Issue**: File doesn't exist in workspace, would fail on container start
**Fix**: Create `scripts/init-db.sql` or remove the volume mount

---

## SEED DATA & MIGRATION ISSUES

### 1. **Seed Script Error** (HIGH)
**Location**: `packages/database/src/seed.ts` line 55
```typescript
where: { resource_action: { resource, action } }
```
**Issue**: Using composite unique constraint `resource_action` but Prisma requires explicit where clause
**Should be**:
```typescript
where: { 
  resource_action: { 
    resource_action: { resource, action }  // Correct syntax
  } 
}
```
**Or better**, use simpler unique:
```prisma
// In schema
@@unique([resource, action], name: "resource_action")
```

### 2. **Technology Seeding Issue** (MEDIUM)
**Location**: `seed.ts` lines 207-279
**Issue**: 69 technologies hardcoded - difficult to maintain
**Better approach**: Move to separate `data/technologies.ts` file

### 3. **Missing Seed Validation** (LOW)
**Current seed**: No validation of seeded data against schemas
**Fix**: Add post-seed validation
```typescript
const createdProject = await prisma.project.findUnique({...});
const validated = projectSchema.parse(createdProject);
```

---

## GITIGNORE ISSUES

### Properly Configured ✓
- Node modules excluded
- Build artifacts excluded
- Environment files (.env) excluded
- IDE config partially excluded (with exceptions)
- OS files excluded
- Logs excluded

### Minor Issues

1. **Line 116**: `tmp_*` pattern is good but could be more specific
   ```gitignore
   tmp_rovodev_*  # Only temporary test files from audits
   tmp_*.db
   ```

2. **Line 89**: `.vscode/*` excluded but some files are included
   - Consider removing exceptions if they're auto-generated
   ```gitignore
   .vscode/  # Fully ignore
   ```

---

## DATABASE.PRISMA ANALYSIS

### Good Practices ✓
1. Proper use of UUIDs for primary keys
2. Timestamps on all records (`createdAt`, `updatedAt`)
3. Soft delete pattern with `isActive` flags
4. Proper field mapping (@map)
5. Cascade delete on child records
6. Unique constraints on slugs

### Issues Found

1. **No Soft Delete Support** (Design Issue)
   - Records deleted from DB permanently
   - Better: Add `deletedAt DateTime?` to important models
   ```prisma
   model Project {
     ...
     deletedAt DateTime? @map("deleted_at")
   }
   ```

2. **Limited Audit Trail** (Security Issue)
   - Only AuditLog table, no automatic tracking
   - Consider: Add triggers or history tables for sensitive changes
   - Missing: Who created/updated records (no createdBy/updatedBy)

3. **No Constraint Validation** (Data Quality)
   - Contact email field not unique (could be spam)
   - Rating validation only in schema, not DB
   - No check constraints on numeric fields

---

## RECOMMENDATIONS SUMMARY

### Immediate (Critical - Fix Before Production)
1. ✅ Remove hardcoded credentials from docker-compose.yml
2. ✅ Remove .env file from git history, switch to secrets management
3. ✅ Fix seed script unique constraint syntax
4. ✅ Add missing indexes on frequently queried columns
5. ✅ Add BlogPost.authorId foreign key constraint

### High Priority (Before Launch)
1. ✅ Create .env.example files for all packages
2. ✅ Implement production configuration template
3. ✅ Standardize Next.js versions across apps
4. ✅ Add health check start_period to docker-compose
5. ✅ Document all required environment variables

### Medium Priority (Best Practices)
1. ✅ Add resource limits to Docker containers
2. ✅ Implement soft deletes on important models
3. ✅ Add audit trail (createdBy/updatedBy) fields
4. ✅ Normalize array fields to relations (teamMembers, etc.)
5. ✅ Run npm audit in CI/CD pipeline

### Low Priority (Future Improvements)
1. ✅ Implement Redis caching if configured
2. ✅ Add database backup strategy documentation
3. ✅ Implement full-text search indexes
4. ✅ Add data validation constraints to DB

---

## COMPLIANCE CHECKLIST

| Aspect | Status | Notes |
|--------|--------|-------|
| SQL Injection Prevention | ✅ GOOD | Using Prisma ORM prevents injection |
| Password Hashing | ✅ GOOD | Using bcryptjs with 12 rounds |
| JWT Secrets | 🔴 WEAK | Hardcoded, should be random |
| Database Credentials | 🔴 EXPOSED | In .env file committed to repo |
| HTTPS Enforcement | ⚠️ UNKNOWN | Not configured in code |
| CORS Configuration | ⚠️ UNKNOWN | Configured in services but not verified |
| Rate Limiting | ✅ GOOD | express-rate-limit in gateway |
| Audit Logging | ✅ GOOD | AuditLog table exists |
| Input Validation | ✅ GOOD | Zod schemas in place |
| Output Encoding | ⚠️ UNKNOWN | Not verified in response handling |

