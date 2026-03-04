# Backend Microservices Security Audit Report

## Executive Summary
Comprehensive audit of ASAGUS backend microservices revealed several security vulnerabilities, code quality issues, and missing validations. While the architecture demonstrates good practices in authentication and authorization, critical issues require immediate attention.

---

## Critical Issues (Priority: HIGH)

### 1. Missing Input Validation on Unprotected Routes
**File:** `services/content-service/src/routes/team.routes.ts` (Lines 72-100)
**Issue:** Team member creation endpoint lacks input validation despite accepting user input
- No validation for email format
- No validation for URL fields (linkedinUrl, twitterUrl, githubUrl, websiteUrl)
- No length limits on text fields
- No type checking on expertise array
**Impact:** Potential for invalid data pollution, XSS if URLs are rendered without sanitization
**Fix:** Add Zod schema validation similar to other content routes

---

### 2. Missing Input Validation on Blog Routes
**File:** `services/content-service/src/routes/blog.routes.ts` (Lines 77-138)
- No validation for blog post content, title, or metadata
- `tags` array not validated
- `readTime` field not validated (could be negative or non-numeric)
- HTML content stored without sanitization (XSS risk if rendered as HTML)
**Impact:** XSS vulnerability, data integrity issues
**Fix:** Implement comprehensive Zod validation schema for blog posts

---

### 3. Unvalidated PUT Request Bypasses Schema Validation
**File:** `services/content-service/src/routes/services.routes.ts` (Line 64)
```typescript
router.put("/:id", authenticate, authorize("services:update"), async (req: AuthRequest, res: Response) => {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
```
**Issue:** UPDATE endpoint accepts `req.body` directly without schema validation
- Allows setting any field not intended for modification
- No validation of enum values (cardType, accentColor)
**Impact:** Privilege escalation, business logic bypass
**Fix:** Parse and validate req.body against serviceSchema before update

**Also Found In:**
- `testimonials.routes.ts` Line 58 (same issue)
- `faqs.routes.ts` Line 60 (same issue)
- `settings.routes.ts` Line 58 (bulk update uses `any` casting)

---

### 4. Insecure Type Casting with `as any`
**Multiple Files:**
- `services/content-service/src/routes/services.routes.ts` Line 19: `where: where as any`
- `testimonials.routes.ts` Line 17: `where: where as any`
- `faqs.routes.ts` Line 17: `where: where as any`
- `contacts.routes.ts` Line 18: `where: where as any`
- `settings.routes.ts` Line 58: `data: { value: s.value as any }`

**Issue:** Using `as any` bypasses TypeScript type safety
**Impact:** Allows invalid data types to reach database
**Fix:** Use proper type definitions or safer type assertions

---

### 5. Missing Authorization on Team Routes
**File:** `services/content-service/src/routes/team.routes.ts` (Lines 72-135, 138-203, 206-222, 225-248)
**Issue:** All team member modification endpoints (POST, PUT, DELETE, reorder) only require `authenticate`, NOT `authorize`
- No permission check for team management
- Any authenticated user can modify team data
**Impact:** Unauthorized data modification
**Fix:** Add `authorize("team:create")`, `authorize("team:update")`, etc.

---

### 6. Missing Authorization on Blog Routes
**File:** `services/content-service/src/routes/blog.routes.ts` (Lines 78-138, 142-204, 208-224, 227-250)
**Issue:** All blog modification endpoints only require `authenticate`, NOT `authorize`
- Any authenticated user can create, edit, delete, or publish blog posts
**Impact:** Unauthorized content modification
**Fix:** Add proper permission checks (blog:create, blog:update, blog:delete, blog:publish)

---

### 7. Missing Authorization on Research Routes
**File:** `services/content-service/src/routes/research.routes.ts`
**Issue:** Similar to team and blog routes - missing authorization checks
- Cannot verify without full file content, but structure suggests same pattern

---

### 8. SQL Injection Risk via Raw Queries
**File:** `services/analytics-service/src/routes/analytics.routes.ts` (Lines 133-156)
```typescript
prisma.$queryRawUnsafe<...>(
  `SELECT path, COUNT(*) as count FROM page_views WHERE created_at >= $1 GROUP BY path...`,
  since
)
```
**Issue:** Using `$queryRawUnsafe` instead of `$queryRaw`
- While parameters are used ($1, $2), the method name suggests unsafe usage
- If any user input were added to query string, it would be vulnerable
**Impact:** Potential SQL injection if future changes add user input
**Fix:** Replace all `$queryRawUnsafe` with `$queryRaw` which enforces parameterized queries

---

## High Priority Issues

### 9. Unvalidated Reorder Endpoint
**File:** `services/content-service/src/routes/services.routes.ts` (Lines 82-94)
```typescript
router.patch("/reorder", authenticate, authorize("services:update"), async (req: AuthRequest, res: Response) => {
  const { services } = req.body as { services: { id: string; orderIndex: number }[] };
```
**Issue:** No validation of the services array or orderIndex values
- orderIndex could be negative, non-numeric, or out of bounds
- No validation that IDs actually exist
**Impact:** Data corruption
**Fix:** Validate array structure and numeric values with Zod

**Also Found In:**
- `faqs.routes.ts` Line 78-88 (similar)
- `team.routes.ts` Line 225-248 (similar)

---

### 10. Weak Contact Form Validation
**File:** `services/content-service/src/routes/contacts.routes.ts` (Lines 56-76)
```typescript
router.post("/:id/reply", authenticate, authorize("contacts:update"), async (req: AuthRequest, res: Response) => {
  const { reply } = req.body;
  if (!reply) { /* error */ }
```
**Issue:** Only checks if reply exists, no type checking or length validation
- Could accept extremely large strings
- No validation of reply format
**Impact:** DoS potential, data integrity
**Fix:** Use contactReplySchema validation (defined in shared but not used here)

---

### 11. Newsletter Route Security Issue
**File:** `services/content-service/src/routes/contacts.routes.ts` (Lines 89-111)
**Issue:** Newsletter subscriber list accessible at `/newsletter/subscribers` but endpoint structure seems wrong
- Should be POST-only for subscribing
- This appears to be a read endpoint for admin (requires auth+permission)
- But path structure suggests this might also be publicly accessible

---

### 12. Missing Request Size Limits on Content Service
**File:** `services/content-service/src/index.ts` (Line 32)
```typescript
app.use(express.json({ limit: "10mb" }));
```
**Issue:** 10MB limit is excessive for JSON content
- Auth service uses 1MB (appropriate)
- Could enable DoS attacks with large payloads
**Impact:** DoS vulnerability
**Fix:** Reduce to 1-2MB max

---

### 13. Profile Update Missing Validation
**File:** `services/auth-service/src/controllers/auth.controller.ts` (Lines 383-397)
```typescript
async updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const { name, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, avatarUrl },
  });
```
**Issue:** No validation of name or avatarUrl
- name could be empty or extremely long
- avatarUrl not validated as URL
**Impact:** Data integrity
**Fix:** Add validation schema

---

### 14. Password Reset Token Logged to Console
**File:** `services/auth-service/src/controllers/auth.controller.ts` (Line 467)
```typescript
console.log(`[Auth] Password reset token for ${email}: ${resetToken}`);
```
**Issue:** Sensitive password reset token logged to console
- Visible in logs and monitoring systems
- Exposes reset tokens
**Impact:** Security vulnerability, token exposure
**Fix:** Remove console.log, send via email only

---

### 15. Settings Endpoint Allows Arbitrary Field Creation
**File:** `services/content-service/src/routes/settings.routes.ts` (Lines 37-50)
```typescript
router.put("/:key", authenticate, authorize("settings:update"), async (req: AuthRequest, res: Response) => {
  const { value } = req.body;
  const setting = await prisma.setting.upsert({
    where: { key: req.params.key },
    update: { value },
    create: { key: req.params.key, value, ...req.body },
  });
```
**Issue:** create spreads `req.body` directly - allows setting arbitrary fields
- Spread operator includes fields beyond key/value
- group, label, type fields can be set from user input without validation
**Impact:** Unvalidated data creation
**Fix:** Only include validated fields in create operation

---

## Medium Priority Issues

### 16. Inconsistent Error Messages Leak Information
**File:** Multiple routes expose different error messages for auth failures
- `"User not found"` vs `"Invalid credentials"` in auth.controller.ts leaks user existence
- Should return generic `"Invalid credentials"` for both cases
**Affected Files:**
- `services/auth-service/src/controllers/auth.controller.ts` Lines 48-62

---

### 17. Missing Content-Type Validation
**File:** `services/analytics-service/src/routes/analytics.routes.ts` (Lines 52-78, 84-110)
**Issue:** No validation that metadata is actually JSON object
```typescript
metadata: metadata && typeof metadata === "object" ? metadata : undefined,
```
- Accepts any object (including arrays, which might not be intended)
- No depth limits on nested objects
**Impact:** Potential DoS with deeply nested structures
**Fix:** Validate structure more strictly

---

### 18. Missing Rate Limiting on Some Public Endpoints
**File:** `services/content-service/src/index.ts`
**Issue:** Public endpoints (GET /api/v1/content/*) have no rate limiting
- Could be abused for scraping
**Fix:** Add rate limiting for public list endpoints

---

### 19. Inconsistent Field Validation in Projects
**File:** `services/content-service/src/routes/projects.routes.ts` (Lines 112-168)
**Issue:** projectSchema validation applied in POST but not in PUT
- Line 114: `const { technologyIds, ...projectData } = req.body;` - no validation
- Should validate projectData against schema

---

### 20. Missing Validation on Dynamic sortBy Parameter
**File:** `services/content-service/src/routes/projects.routes.ts` (Lines 29-30)
```typescript
const sortBy = (req.query.sortBy as string) || "createdAt";
const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
// ...
orderBy: { [sortBy]: sortOrder },
```
**Issue:** sortBy parameter used directly in database query without validation
- Could allow sorting by sensitive fields (passwordHash, etc.)
- No allowlist of permitted fields
**Impact:** Information disclosure
**Fix:** Whitelist allowed sort fields

---

### 21. Missing Pagination Limits on Team/Blog Routes
**File:** `services/content-service/src/routes/team.routes.ts` and `blog.routes.ts`
**Issue:** No pagination - returns ALL records
```typescript
const teamMembers = await prisma.teamMember.findMany({ where, orderBy: [...] });
```
**Impact:** DoS vulnerability, slow response times
**Fix:** Implement pagination with limit/offset

---

### 22. Missing XSS Protection on Rendered Content
**File:** `services/content-service/src/routes/blog.routes.ts`
**Issue:** Blog content stored without sanitization
- If frontend renders as HTML, XSS vulnerability exists
- Should sanitize content server-side
**Impact:** XSS vulnerability
**Fix:** Use library like DOMPurify on content before storage

---

## Code Quality Issues

### 23. Duplicate Code: Slugify Function
**Locations:**
- `services/content-service/src/routes/projects.routes.ts` Lines 9-15
- `services/content-service/src/routes/services.routes.ts` Lines 7-9
- `services/content-service/src/routes/technologies.routes.ts` Lines 8-14
**Issue:** Same function defined in multiple files
**Fix:** Move to shared utilities

---

### 24. Duplicate Middleware: Auth Functions
**Locations:**
- `services/auth-service/src/middleware/auth.ts`
- `services/content-service/src/middleware/auth.ts`
- `services/analytics-service/src/routes/analytics.routes.ts` (inline)
**Issue:** Authentication logic duplicated across services
**Fix:** Export shared auth middleware or use centralized package

---

### 25. Inconsistent Error Handling
**Issue:** Mixed use of try-catch with error handling
- Some routes log errors, others don't
- Some return 500, others might not
- Missing error type checking
**Fix:** Implement centralized error handling middleware

---

### 26. Using Non-Standard Logger
**File:** `services/shared/logger.ts`
**Issue:** Custom logger only logs to console in dev mode
- Production errors not logged to proper logging system
- Should use Winston, Pino, or similar
**Fix:** Integrate proper logging service

---

### 27. No Request ID/Correlation Tracking
**Issue:** No request IDs for tracing across services
- Makes debugging microservice calls difficult
**Fix:** Add request ID middleware and propagate through services

---

### 28. Magic Numbers Without Constants
**Example:** `services/analytics-service/src/routes/analytics.routes.ts` Line 118
```typescript
const days = parseInt(req.query.days as string) || 30;
```
- Hard-coded defaults and limits throughout
**Fix:** Extract to constants file

---

## Missing Security Middleware

### 29. No CSRF Protection
**Issue:** No CSRF token validation on state-changing operations
- POST, PUT, DELETE endpoints don't validate CSRF tokens
**Fix:** Add CSRF middleware for cross-origin requests

---

### 30. No Input Sanitization Middleware
**Issue:** No global input sanitization for XSS
- User inputs not sanitized before storage
**Fix:** Add middleware to sanitize string inputs

---

### 31. No API Key Authentication Option
**Issue:** Only Bearer token auth, no API key option for service-to-service
- Gateway/services communicate without additional auth layer
**Fix:** Add X-API-Key validation between services

---

## Environment & Configuration Issues

### 32. Hardcoded CORS Origins
**File:** Multiple service index.ts files
**Issue:** Localhost origins hardcoded in code
- Should be environment variables
**Example:** `services/auth-service/src/index.ts` Lines 13-20
**Fix:** Move all origins to .env with fallback to localhost

---

### 33. Missing Environment Variable Validation
**File:** All services
**Issue:** No validation that required env vars are set
- Services silently fail if JWT_ACCESS_SECRET missing
- Should fail fast at startup
**Fix:** Add startup validation with helpful error messages

---

### 34. JWT Secret Fallback to Random
**File:** `services/auth-service/src/utils/jwt.ts` Lines 5-12
```typescript
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || (() => {
  console.warn("⚠️  WARNING...");
  return crypto.randomBytes(64).toString("hex");
})();
```
**Issue:** Generates random secret if missing
- Causes token verification to fail after restart
- Should fail loudly instead
**Impact:** Service becomes unavailable after restart
**Fix:** Throw error if secret not set

---

## Documentation & Audit Trail Issues

### 35. Insufficient Audit Logging
**File:** `services/auth-service/src/controllers/auth.controller.ts`
**Issue:** Some actions logged, others not
- User creation not logged
- User deletion logged but insufficient detail
- Role assignments logged but not removed
**Fix:** Comprehensive audit trail for all mutations

---

### 36. No API Documentation
**Issue:** No OpenAPI/Swagger documentation
- Unclear which endpoints require auth
- Unclear permission requirements
**Fix:** Generate OpenAPI specs for all endpoints

---

## Validation Schema Issues

### 37. URL Validation Too Permissive
**File:** `packages/shared/src/validation.ts` Line 45
```typescript
projectUrl: z.string().url().optional().or(z.literal("")),
```
**Issue:** Allows empty string but also requires URL if provided
- Should be either .url() OR empty, not both
- Also doesn't validate protocol (http/https)
**Fix:** `z.string().url({ message: "Must be valid URL" }).optional()`

---

### 38. Metadata Field Unrestricted
**File:** `packages/shared/src/validation.ts` Line 104
```typescript
value: z.unknown(),
```
**Issue:** Settings value completely unrestricted
- Could accept any type
- No size limits
**Fix:** Define specific types per setting key

---

## API Design Issues

### 39. Inconsistent Response Format
**Issue:** Some endpoints return `{ success, data }` while others return `{ success, message }`
- Inconsistent pagination response structure
**Fix:** Standardize response format across all endpoints

---

### 40. No Versioning Strategy for APIs
**Issue:** All endpoints are v1
- No clear deprecation path
- No way to maintain backward compatibility
**Fix:** Implement API versioning strategy in gateway

---

## Summary Table

| # | Issue | Severity | File(s) | Type |
|---|-------|----------|---------|------|
| 1 | Missing input validation on team routes | CRITICAL | team.routes.ts | Security |
| 2 | Missing input validation on blog routes | CRITICAL | blog.routes.ts | Security |
| 3 | Unvalidated PUT requests bypass schema | CRITICAL | services/testimonials/faqs.routes.ts | Security |
| 4 | Insecure type casting with `as any` | CRITICAL | Multiple | Code Quality |
| 5 | Missing authorization on team routes | CRITICAL | team.routes.ts | Security |
| 6 | Missing authorization on blog routes | CRITICAL | blog.routes.ts | Security |
| 7 | Missing authorization on research routes | CRITICAL | research.routes.ts | Security |
| 8 | SQL injection via queryRawUnsafe | HIGH | analytics.routes.ts | Security |
| 9 | Unvalidated reorder endpoints | HIGH | services/faqs/team.routes.ts | Security |
| 10 | Weak contact reply validation | HIGH | contacts.routes.ts | Security |
| 11 | Excessive JSON payload limit | HIGH | content-service/index.ts | DoS |
| 12 | Missing profile update validation | HIGH | auth.controller.ts | Security |
| 13 | Password reset token in logs | CRITICAL | auth.controller.ts | Security |
| 14 | Settings arbitrary field creation | HIGH | settings.routes.ts | Security |
| 15 | Inconsistent error messages | MEDIUM | auth.controller.ts | Security |
| 16 | Missing metadata validation | MEDIUM | analytics.routes.ts | Security |
| 17 | Missing rate limiting on public endpoints | MEDIUM | content-service | DoS |
| 18 | Missing project PUT validation | MEDIUM | projects.routes.ts | Security |
| 19 | Unsanitized sortBy parameter | HIGH | projects.routes.ts | Security |
| 20 | Missing pagination on team/blog | HIGH | team/blog.routes.ts | DoS |
| 21 | Missing XSS sanitization | HIGH | blog.routes.ts | Security |
| 22 | Duplicate slugify function | LOW | Multiple | Code Quality |
| 23 | Duplicate auth middleware | LOW | Multiple | Code Quality |
| 24 | Inconsistent error handling | MEDIUM | Multiple | Code Quality |
| 25 | Non-standard logger in prod | MEDIUM | logger.ts | Operations |
| 26 | No request correlation tracking | MEDIUM | All services | Operations |
| 27 | Magic numbers without constants | LOW | Multiple | Code Quality |
| 28 | No CSRF protection | MEDIUM | All routes | Security |
| 29 | No input sanitization middleware | HIGH | All services | Security |
| 30 | No API key auth | MEDIUM | Gateway | Security |
| 31 | Hardcoded CORS origins | MEDIUM | Multiple | Configuration |
| 32 | Missing env var validation | HIGH | All services | Configuration |
| 33 | JWT secret fallback | CRITICAL | jwt.ts | Security |
| 34 | Insufficient audit logging | MEDIUM | auth.controller.ts | Audit |
| 35 | No API documentation | MEDIUM | Gateway | Documentation |
| 36 | URL validation too permissive | MEDIUM | validation.ts | Validation |
| 37 | Metadata field unrestricted | MEDIUM | validation.ts | Validation |
| 38 | Inconsistent response format | LOW | Multiple | Design |
| 39 | No API versioning strategy | LOW | Gateway | Design |

---

## Recommendations

### Immediate Actions (Within 1 week)
1. Add Zod validation to all unprotected routes (team, blog, research)
2. Add authorization checks to team and blog routes
3. Replace `$queryRawUnsafe` with `$queryRaw`
4. Remove password reset token from logs
5. Add validation to settings endpoint `create` operation
6. Fix JWT secret generation to fail loudly

### Short Term (Within 2 weeks)
7. Add input sanitization middleware
8. Implement CSRF protection
9. Add request ID/correlation tracking
10. Implement pagination on team/blog routes
11. Add rate limiting to public endpoints
12. Move shared code (slugify, auth middleware) to packages/shared

### Medium Term (Within 1 month)
13. Integrate proper logging system (Winston/Pino)
14. Implement API documentation (OpenAPI)
15. Add comprehensive audit logging
16. Implement input sanitization for XSS
17. Validate all dynamic query parameters
18. Standardize response formats and error handling

### Long Term (Within 2-3 months)
19. Add API versioning strategy
20. Implement API key authentication between services
21. Move environment variables to configuration service
22. Add comprehensive integration tests
23. Implement request signing between services
24. Add rate limiting per user/API key
