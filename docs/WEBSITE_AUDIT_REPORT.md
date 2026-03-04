# 🔍 Website Audit Report
**Date:** 2026-03-04  
**Project:** ASAGUS Web Application  
**Auditor:** Rovo Dev AI  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Issues](#-critical-issues-fix-immediately)
   - [Security](#security)
   - [Frontend](#frontend)
   - [SEO](#seo)
3. [High Priority Issues](#-high-priority-issues)
   - [Backend](#backend)
   - [Frontend / UX](#frontend--ux)
   - [Database Schema](#database-schema)
   - [SEO / Performance](#seo--performance)
4. [Medium Priority Issues](#-medium-priority-issues)
5. [What's Working Well](#-whats-working-well)
6. [Scores](#-scores)
7. [Recommended Fix Order](#-recommended-fix-order)
8. [Detailed Findings](#-detailed-findings)
   - [Backend Services Deep Dive](#backend-services-deep-dive)
   - [Frontend Components Deep Dive](#frontend-components-deep-dive)
   - [Database & Config Deep Dive](#database--config-deep-dive)
   - [SEO & Performance Deep Dive](#seo--performance-deep-dive)

---

## Executive Summary

A comprehensive audit was performed across all layers of the ASAGUS web application including:
- **48 frontend files** (components, pages, hooks, lib, API routes)
- **4 backend microservices** (auth, content, analytics, api-gateway)
- **Database schema** (Prisma schema, migrations, seed scripts)
- **Configuration files** (Docker, package.json, environment, Next.js)
- **SEO & Performance** (structured data, sitemaps, robots.txt, meta tags)

**Total Issues Found: 39+**
- 🔴 Critical: 10
- 🟠 High: 16
- 🟡 Medium: 13+
- ✅ Working Well: 10+

---

## 🔴 Critical Issues (Fix Immediately)

### Security

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | **Hardcoded database password** | `docker/docker-compose.yml:10` | Password `Gang$ter111` exposed in source code |
| 2 | **`.env` file committed to git** | `config/` directory | Contains DB passwords, JWT secrets, admin credentials |
| 3 | **Missing authorization on endpoints** | `services/content-service/src/routes/` (team, blog, research routes) | Only `authenticate` middleware used, no `authorize` role check — any authenticated user can modify admin data |
| 4 | **`$queryRawUnsafe` usage** | `services/analytics-service/src/` | Raw SQL executed without sanitization — SQL injection vulnerability |
| 5 | **Password reset token logged to console** | `services/auth-service/` | Sensitive reset token written to `console.log` — exposed in server logs |
| 6 | **JWT secret falls back to random value** | `services/auth-service/src/utils/jwt.ts` | If `JWT_SECRET` env var is missing, a random secret is generated — all sessions invalidated on every restart |
| 7 | **Weak/hardcoded admin password** | `config/.env.admin.example` | Default admin password used in multiple places |

### Frontend

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 8 | **Unsafe DOM access** | `apps/web/components/live-chat.tsx` | DOM elements accessed without null checks — causes runtime crashes |
| 9 | **Missing error boundaries** | Three.js / neural visual components | No fallback UI if 3D rendering fails — blank white screen for users |
| 10 | **Modal focus traps missing** | Multiple modal components | Focus is not trapped inside modals — WCAG 2.1 accessibility violation |

### SEO

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 11 | **Placeholder verification codes** | `apps/web/app/layout.tsx` (line ~109), `comprehensive-seo.tsx` (lines 104–110) | Google, Bing, Yandex, Pinterest, Facebook verification codes are all dummy placeholder strings — blocks Search Console verification |
| 12 | **Language alternates point to non-existent routes** | `apps/web/app/layout.tsx:61-73` | Declares localized routes (`/en-US/`, `/en-GB/`, etc.) that don't exist — search engines waste crawl budget on 404s |
| 13 | **Duplicate FAQPage schemas** | `apps/web/app/comprehensive-seo.tsx` + `apps/web/app/geo-schema.tsx` | Same FAQ questions appear in multiple JSON-LD schemas — confuses search engines about which to use |

---

## 🟠 High Priority Issues

### Backend

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | **No input validation on team & blog routes** | `services/content-service/src/routes/team.routes.ts`, `blog.routes.ts` | No Zod validation schemas — any malformed data accepted |
| 2 | **Unvalidated PUT requests on multiple routes** | `services/content-service/src/routes/` (testimonials, faqs) | PUT update endpoints bypass schema validation |
| 3 | **10MB JSON payload limit** | `services/api-gateway/src/index.ts` | Excessively large limit opens DoS attack vector |
| 4 | **`sortBy` parameter used directly in DB queries** | `services/content-service/` | Unsanitized sort parameter passed into Prisma query — potential injection risk |
| 5 | **Missing pagination on team/blog routes** | `services/content-service/src/routes/` | Returns all database records in a single response — DoS risk as data grows |
| 6 | **Duplicate `slugify` function** | 3 separate route files in `services/content-service/src/routes/` | Same utility function copy-pasted in `projects.routes.ts`, `blog.routes.ts`, `services.routes.ts` |
| 7 | **Duplicate auth middleware across services** | `services/auth-service/src/middleware/auth.ts`, `services/content-service/src/middleware/auth.ts` | Auth logic duplicated instead of using shared package |
| 8 | **Settings endpoint allows arbitrary field creation** | `services/content-service/src/routes/settings.routes.ts` | No schema enforcement — arbitrary fields can be written to the database |

### Frontend / UX

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 9 | **4 oversized components** | `apps/web/components/hero-section.tsx`, `neural-visual.tsx`, and others | Components exceed 400 lines — hard to maintain and test |
| 10 | **Broken navigation links** | `apps/web/components/floating-navbar.tsx`, `footer.tsx` | Links to `/products` and `/research-development` return 404 |
| 11 | **Inconsistent file naming** | `apps/web/components/` | Mix of `PascalCase` (`CardCarousel.tsx`, `ProjectGrid.tsx`) and `kebab-case` (`hero-section.tsx`, `faq-section.tsx`) |
| 12 | **Widespread TypeScript `any` type usage** | Multiple files across `apps/web/` | Undermines type safety throughout the codebase |
| 13 | **Prop drilling anti-patterns** | Multiple component trees | Data passed through many component levels instead of using context or state management |
| 14 | **Silent error swallowing** | `apps/web/app/api/cards/route.ts` | API errors caught but not surfaced to the user or logged properly |
| 15 | **Unhandled promise rejections** | Multiple async components | `.catch()` missing on several async operations |

### Database Schema

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 16 | **Missing indexes on filtered columns** | `packages/database/prisma/schema.prisma` | `Contact.email`, `Project.slug`, `BlogPost.status` not indexed — slow queries at scale |
| 17 | **No full-text search indexes** | `packages/database/prisma/schema.prisma` | `BlogPost.title` and `BlogPost.content` lack full-text search indexes |
| 18 | **Seed script syntax error** | `packages/database/src/seed.ts:55` | Invalid Prisma constraint syntax — seed will fail to run |
| 19 | **Missing `init-db.sql`** | `docker/docker-compose.yml` | Docker initialization references a file that doesn't exist — container initialization fails silently |

### SEO / Performance

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 20 | **Empty LocalBusiness address & phone** | `apps/web/app/structured-data.tsx`, `geo-schema.tsx` | Street, city, region, postal code, and telephone fields are empty strings |
| 21 | **No image optimization config** | `apps/web/next.config.ts` | Missing `deviceSizes`, `imageSizes`, `formats` settings |
| 22 | **Custom fonts not preloaded** | `apps/web/app/layout.tsx` | `Azonix` font loaded without preload hint — impacts LCP and CLS scores |
| 23 | **No skip-to-content link** | `apps/web/app/layout.tsx` | Missing keyboard navigation accessibility feature |
| 24 | **Inconsistent cache headers** | `apps/web/app/sitemap.xml/route.ts`, `geo-sitemap.xml/`, `sitemap-images.xml/` | 3 different `Cache-Control` strategies across sitemaps |
| 25 | **Geo-sitemap references 404 URLs** | `apps/web/app/geo-sitemap.xml/route.ts` | Creates sitemap entries for non-existent localized routes |

---

## 🟡 Medium Priority Issues

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | **No CSRF protection** | All backend services | No CSRF tokens or `SameSite` cookie enforcement |
| 2 | **No XSS sanitization on blog content** | `services/content-service/src/routes/blog.routes.ts` | HTML content stored directly without DOMPurify or similar sanitization |
| 3 | **No request correlation/tracing** | All microservices | No request ID propagation across services — debugging is extremely difficult |
| 4 | **Missing `swcMinify` and compression** | `apps/web/next.config.ts` | Not using SWC minification or response compression |
| 5 | **`X-Powered-By` header not removed** | `apps/web/next.config.ts` | Exposes Next.js version to potential attackers |
| 6 | **`lang` attribute too vague** | `apps/web/app/layout.tsx` | `lang="en"` should be `lang="en-US"` for specificity |
| 7 | **Favicon conflicts** | `apps/web/app/layout.tsx` + `apps/web/public/favicon/` | Multiple competing favicon strategies defined |
| 8 | **No bundle analyzer configured** | `apps/web/next.config.ts` | Cannot audit JavaScript bundle sizes |
| 9 | **Missing `apple-touch-icon` sizes** | `apps/web/app/layout.tsx` | Only one size defined; multiple sizes needed for full iOS support |
| 10 | **No `preconnect` hints** | `apps/web/app/layout.tsx` | Missing `<link rel="preconnect">` for external domains (fonts, APIs) |
| 11 | **Inline styles in page.tsx** | `apps/web/app/page.tsx` | Styles that should use Tailwind classes are written inline |
| 12 | **Missing profile update validation** | `services/auth-service/src/controllers/auth.controller.ts` | Profile update endpoint has no input validation |
| 13 | **Hardcoded CORS origins** | `services/api-gateway/src/index.ts`, multiple services | CORS allowed origins hardcoded — should be environment variables |

---

## ✅ What's Working Well

| Area | Detail |
|------|--------|
| **Password hashing** | bcryptjs with 12 rounds — strong and correct |
| **JWT authentication** | Auth system is in place and functional |
| **Rate limiting** | Applied on API gateway — protects against brute force |
| **SQL injection prevention** | Prisma ORM used throughout — mostly safe |
| **Cascade deletes** | Properly configured on database relationships |
| **Data model** | Comprehensive 20+ table schema covering all features |
| **RBAC** | Role-based access control partially implemented |
| **TypeScript** | Used throughout both frontend and backend |
| **Structured data** | JSON-LD schemas implemented (good foundation) |
| **Sitemap & robots.txt** | Present and mostly well-configured |

---

## 📊 Scores

| Area | Score | Status | Key Issues |
|------|-------|--------|------------|
| **Security** | 5/10 | 🔴 Needs Work | Hardcoded secrets, missing authorization, raw SQL |
| **Code Quality** | 6/10 | 🟠 Fair | Inconsistent patterns, `any` types, large files |
| **SEO** | 6/10 | 🟠 Fair | Good foundation but placeholder values & duplicate schemas |
| **Performance** | 6/10 | 🟠 Fair | Missing image/font optimization config |
| **Accessibility** | 5/10 | 🔴 Needs Work | Missing ARIA, focus traps, skip links |
| **Database Design** | 7/10 | 🟡 Good | Good schema, missing indexes |
| **API Design** | 6/10 | 🟠 Fair | Missing validation, pagination, and error standards |
| **DevOps / Config** | 4/10 | 🔴 Needs Work | Hardcoded secrets, missing init files |

**Overall Score: 5.6 / 10**

---

## 🚀 Recommended Fix Order

### Phase 1 — This Week (Critical Security) ~4 hours

- [ ] Remove hardcoded password from `docker/docker-compose.yml`, move to env vars
- [ ] Add `.env` to `.gitignore` and purge from git history (`git filter-branch` or BFG)
- [ ] Rotate all secrets (DB password, JWT secret, admin password)
- [ ] Fix JWT fallback — throw error if `JWT_SECRET` is not set
- [ ] Remove or sanitize `$queryRawUnsafe` in analytics service
- [ ] Remove password reset token from `console.log`
- [ ] Replace all placeholder verification codes in `layout.tsx`

### Phase 2 — Next Week (High Priority) ~8 hours

- [ ] Add Zod validation schemas to team and blog routes
- [ ] Add `authorize` middleware to all admin-only endpoints
- [ ] Reduce API gateway JSON payload limit (e.g., `1mb`)
- [ ] Add DB indexes: `Contact.email`, `Project.slug`, `BlogPost.status`
- [ ] Fix broken navigation links (`/products`, `/research-development`)
- [ ] Remove duplicate language alternates from sitemap / layout
- [ ] Fix seed script syntax error
- [ ] Consolidate `slugify` into shared utility
- [ ] Add pagination to team and blog routes
- [ ] Remove duplicate FAQPage schema from `comprehensive-seo.tsx`

### Phase 3 — Following Weeks (Medium Priority) ~12 hours

- [ ] Add error boundaries around Three.js / neural visual components
- [ ] Implement modal focus traps (accessibility)
- [ ] Add skip-to-content link in layout
- [ ] Fix unsafe DOM access in `live-chat.tsx`
- [ ] Add image optimization config to `next.config.ts`
- [ ] Add font preload hints
- [ ] Consolidate auth middleware into shared package
- [ ] Add CSRF protection
- [ ] Add XSS sanitization on blog content (DOMPurify)
- [ ] Refactor oversized components (>400 lines)
- [ ] Standardize file naming convention (kebab-case recommended)
- [ ] Replace all `any` TypeScript types
- [ ] Remove hardcoded CORS origins — use environment variables
- [ ] Add `X-Powered-By: false` to Next.js config
- [ ] Add bundle analyzer

### Phase 4 — Polish ~4 hours

- [ ] Add request correlation IDs across microservices
- [ ] Complete LocalBusiness address and phone in structured data
- [ ] Fix apple-touch-icon sizes
- [ ] Add preconnect hints for external domains
- [ ] Standardize cache headers across all sitemaps
- [ ] Move inline styles to Tailwind classes

---

## 📋 Detailed Findings

### Backend Services Deep Dive

#### Auth Service (`services/auth-service/`)

**Issues:**
- `jwt.ts` — If `JWT_SECRET` environment variable is missing, a random value is generated at runtime. This means all active user sessions are destroyed every time the server restarts.
- `auth.controller.ts` — Password reset token is written to `console.log()`. In a production environment, this token will appear in server logs which may be accessible to unauthorized parties.
- `auth.controller.ts` — Profile update endpoint accepts any fields without validation. An attacker could send arbitrary fields.

**Good:**
- Passwords hashed with bcryptjs (12 rounds) ✓
- JWT-based stateless authentication ✓

#### Content Service (`services/content-service/`)

**Issues:**
- `team.routes.ts` / `blog.routes.ts` — No Zod input validation on POST/PUT. Malformed data is stored directly in the database.
- `team.routes.ts` / `blog.routes.ts` / `research.routes.ts` — Only `authenticate` middleware applied. Any logged-in user (not just admins) can create/update/delete content.
- `projects.routes.ts`, `blog.routes.ts`, `services.routes.ts` — `slugify()` function is copy-pasted in all three files.
- `settings.routes.ts` — Accepts any key-value pair and stores it. No enforcement of allowed settings keys.
- Unsanitized `sortBy` query parameter passed into Prisma `orderBy` — Prisma handles most injection risks, but the field name itself is never validated against an allowlist.

#### Analytics Service (`services/analytics-service/`)

**Issues:**
- `$queryRawUnsafe()` used — Raw SQL executed with string interpolation. This is a direct SQL injection vulnerability. Must be replaced with Prisma's `$queryRaw` template literal tag or parameterized queries.

#### API Gateway (`services/api-gateway/`)

**Issues:**
- JSON body parser configured with `10mb` limit — This allows a single request to consume 10MB of memory. A coordinated attack with many such requests would exhaust server memory.
- CORS allowed origins hardcoded in source — Should be read from environment variables for deployment flexibility.

---

### Frontend Components Deep Dive

#### Large Components Needing Refactoring

| File | Approx. Lines | Recommendation |
|------|--------------|----------------|
| `apps/web/components/hero-section.tsx` | 400+ | Split into HeroText, HeroBackground, HeroCTA |
| `apps/web/components/neural-visual.tsx` | 400+ | Extract Three.js setup, animation loop, controls into separate hooks |
| `apps/web/components/neural-visual-scene.tsx` | 400+ | Same as above |
| `apps/web/components/contact-section.tsx` | 300+ | Split into ContactForm, ContactInfo |

#### TypeScript Issues

- `any` types used in: API response handlers, event handlers, Three.js refs, dynamic imports
- Missing return types on several exported functions
- Missing type definitions for API response shapes (should be in `packages/shared/src/types/`)

#### Error Handling Issues

- `apps/web/components/live-chat.tsx` — `document.getElementById()` result used without null check
- `apps/web/app/api/cards/route.ts` — Errors caught but not properly logged or returned to client
- `apps/web/hooks/useCards.ts` — No loading/error state differentiation
- Unhandled `.then()` without `.catch()` in several async operations

#### Accessibility Issues

| Issue | Impact | WCAG Criterion |
|-------|--------|----------------|
| No focus trap in modals | Critical | 2.1.2 No Keyboard Trap |
| Missing ARIA labels on icon-only buttons | High | 4.1.2 Name, Role, Value |
| No skip-to-content link | High | 2.4.1 Bypass Blocks |
| Insufficient color contrast in some text | Medium | 1.4.3 Contrast |
| Modal close button lacks accessible name | Medium | 4.1.2 Name, Role, Value |

---

### Database & Config Deep Dive

#### Prisma Schema (`packages/database/prisma/schema.prisma`)

**Missing Indexes:**
```prisma
// These indexes should be added:
@@index([email])         // on Contact model
@@index([slug])          // on Project model
@@index([status])        // on BlogPost model
@@index([status, createdAt]) // on BlogPost model for sorted filtering
```

**Recommendations:**
- Add `@@index` for all columns used in `WHERE`, `ORDER BY`, or `JOIN` operations
- Add full-text search indexes for `BlogPost.title` and `BlogPost.content`
- Consider adding `updatedAt` to models that currently only have `createdAt`

#### Docker Configuration (`docker/docker-compose.yml`)

**Issues:**
- Database password hardcoded as `Gang$ter111` — must be moved to a `.env` file referenced by Docker Compose
- References an `init-db.sql` file that doesn't exist in the repository
- No healthcheck defined for the database service
- No resource limits (CPU/memory) on containers

#### Package Dependencies

**Issues across services:**
- Several packages are pinned to exact versions without caret (`^`) — makes security patching harder
- No `npm audit` or Dependabot configuration found
- `packages/shared` is not consistently used — services re-implement shared logic locally

---

### SEO & Performance Deep Dive

#### Structured Data Issues

| Schema | Issue |
|--------|-------|
| `LocalBusiness` | Empty `address`, `telephone`, `geo` fields |
| `FAQPage` | Defined in both `comprehensive-seo.tsx` AND `geo-schema.tsx` |
| `Organization` | Missing `@id` field for entity disambiguation |
| `WebSite` | `potentialAction` search URL may not match actual search implementation |
| `OpeningHoursSpecification` | Missing timezone reference |

#### Sitemap Issues

| File | Issue |
|------|-------|
| `sitemap.xml/route.ts` | References dynamically fetched URLs that may fail silently |
| `geo-sitemap.xml/route.ts` | Generates URLs for non-existent localized routes |
| `sitemap-images.xml/route.ts` | Inconsistent cache headers vs other sitemaps |

#### Next.js Config Recommendations

```typescript
// Recommended additions to apps/web/next.config.ts:
const nextConfig = {
  poweredByHeader: false,           // Remove X-Powered-By header
  compress: true,                   // Enable gzip compression
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

#### Performance Quick Wins

1. **Font preloading** — Add `<link rel="preload">` for `Azonix` font in `layout.tsx`
2. **Preconnect hints** — Add for Google Fonts, API domains
3. **Image priority** — Add `priority` prop to above-the-fold images (hero section)
4. **Bundle analyzer** — Install `@next/bundle-analyzer` to identify large dependencies

---

## 📅 Estimated Timeline

| Phase | Work | Estimated Effort | Target |
|-------|------|-----------------|--------|
| Phase 1 | Critical Security | 2–4 hours | Week 1 |
| Phase 2 | High Priority | 6–8 hours | Week 1–2 |
| Phase 3 | Medium Priority | 10–12 hours | Week 2–3 |
| Phase 4 | Polish | 3–4 hours | Week 3–4 |
| **Total** | **All phases** | **~24–28 hours** | **4 weeks** |

---

## 📈 Expected Improvement After Fixes

| Area | Current | After All Phases |
|------|---------|-----------------|
| Security Score | 5/10 | 9/10 |
| Code Quality | 6/10 | 8.5/10 |
| SEO Score | 6/10 | 9/10 |
| Performance | 6/10 | 8/10 |
| Accessibility | 5/10 | 8.5/10 |
| Overall | **5.6/10** | **8.6/10** |

---

*Report generated by Rovo Dev AI — 2026-03-04*
