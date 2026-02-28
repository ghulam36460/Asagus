# ASAGUS Website API & Data Architecture Analysis

## Overview
This is a **Next.js 14+ frontend** with **server-side and client-side APIs**. The website currently uses a mix of **static data**, **in-memory stores**, and **external APIs**. It's designed with fallback mechanisms to gracefully degrade if backend services are unavailable.

---

## API Routes & Handlers

### 1. **`app/api/cards/route.ts`** - Cards Management API

**Purpose:** Manage project/service cards displayed on the website.

**Endpoints:**
- **GET `/api/cards`**
  - Returns all cards from in-memory store
  - Response: `{ success: true, data: CardEntry[] }`
  - Uses static fallback from `data/cards.ts`

- **POST `/api/cards`**
  - Creates a new card
  - Required fields: `title`, `description`
  - Optional fields: `imageUrl`, `category`, `tech` (array), `link`
  - Auto-generates ID with padding (e.g., "01", "02")
  - Sets `createdAt` timestamp
  - Response: `{ success: true, data: newCard }` (201 Created)
  - Validation: Returns 400 if title/description missing

**Current Implementation:** 
- Uses **in-memory store** initialized from `staticCards`
- ⚠️ **Data resets on server restart** — needs database replacement

**Data Structure:**
```typescript
interface CardEntry {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  tech: string[];
  link?: string;
  createdAt: string;
}
```

---

### 2. **`app/api/cards/[id]/route.ts`** - Individual Card Operations

**Endpoints:**
- **PUT `/api/cards/:id`**
  - Updates a card by ID
  - Merges provided data with existing card (ID is immutable)
  - Response: `{ success: true, data: updatedCard }`
  - Returns 404 if card not found

- **DELETE `/api/cards/:id`**
  - Deletes a card by ID
  - Response: `{ success: true, data: deletedCard }`
  - Returns 404 if card not found

**Current Implementation:** In-memory store (same reference as `route.ts`)

---

### 3. **`app/api/contact/route.ts`** - Contact Form Handler

**Purpose:** Process contact form submissions and send emails.

**Endpoint:**
- **POST `/api/contact`**
  - Accepts: `fullName`, `email`, `phone`, `service`, `message`
  - Required: `fullName`, `email`, `message`
  - Validates email format
  - Sanitizes all inputs with `escapeHtml()` to prevent HTML injection

**Email Service:**
- Uses **Resend** (email provider via `RESEND_API_KEY`)
- **From:** `process.env.FROM_EMAIL` (default: onboarding@resend.dev)
- **To:** `process.env.CONTACT_TO_EMAIL` (default: mshahwar92@gmail.com)
- Email includes styled HTML template with form data

**Error Handling:**
- 400: Missing required fields or invalid email
- 503: If `RESEND_API_KEY` not configured
- 500: Email send failure

**Response:**
```json
{
  "success": true,
  "data": { /* Resend response */ }
}
```

---

### 4. **`app/api/newsletter/route.ts`** - Newsletter Subscription

**Purpose:** Subscribe users to newsletter mailing list.

**Endpoint:**
- **POST `/api/newsletter`**
  - Accepts: `email`
  - Validates email format
  - Sends welcome email to subscriber
  - Sends notification email to admin (`process.env.TO_EMAIL`)

**Emails Sent:**
1. **User Welcome Email:** Branded email with newsletter benefits and link to website
2. **Admin Notification:** Simple notification with subscriber email and timestamp

**Error Handling:**
- 400: Email required or invalid format
- 503: If `RESEND_API_KEY` not configured
- 500: Email send failure

---

### 5. **`app/sitemap.xml/route.ts`** - SEO Sitemap

**Purpose:** Generate XML sitemap for search engines.

**Content:**
- Main pages: Home (priority 1.0), Projects (0.9), Privacy (0.5), Terms (0.5)
- Dynamic project pages from `data/projects.ts`
- Each entry includes: `loc`, `lastmod`, `changefreq`, `priority`
- References XSL stylesheet for browser preview

**Cache Control:** Public, 1 hour max-age

---

### 6. **`app/geo-sitemap.xml/route.ts`** - Geographic Sitemap

**Purpose:** International SEO optimization.

**Content:**
- Geographic pages for 10 countries: US, GB, AU, CA, IN, SG, AE, NZ, IE, ZA
- Uses `hreflang` alternate links for language variants
- Base URL from `process.env.NEXT_PUBLIC_SITE_URL` (default: https://asagus.com)

**Cache Control:** Public, 1 hour max-age

---

## Data Files

### **`data/cards.ts`**

**Static Cards Array** - fallback display data for portfolio/project cards.

**Purpose:** 
- Initial seed data for `/api/cards` endpoint
- Fallback when API is unavailable
- Used by `useCards()` hook

**Sample Cards:**
1. **LOGBOG** - Full-stack blogging platform (React, Node.js, MongoDB)
2. **AI Vocal Expert** - Voice assistant with face auth (Python, TensorFlow, OpenAI)
3. **GS Dashboard** - CRM dashboard (React, TypeScript, PostgreSQL)
4. **Brand Redesign** - Branding project (Figma, Adobe)
5. **Grilli** - Restaurant website (Next.js, Framer Motion, Sanity CMS)
6. **FitLife Pro** - Fitness app (React Native, Firebase, Redux)

---

### **`data/projects.ts`**

**Static Projects Array** - comprehensive project case studies.

**Purpose:**
- Display portfolio projects with full details
- SEO data for sitemap generation
- Used by `projects-section.tsx` and project detail pages

**Project Structure:**
```typescript
interface Project {
  slug: string;
  title: string;
  category: string;
  technologies: string[];
  description: string;
  fullDescription: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string }[];
  images: { hero: string; gallery: string[] };
  testimonial?: { quote: string; author: string; role: string; company: string };
  date: string;
  featured: boolean;
  externalLink?: string;
}
```

**Includes 5 Featured Projects** with detailed metrics and testimonials.

**Helper Functions:**
- `getProjectBySlug(slug)` - Get single project
- `getFeaturedProjects()` - Get featured projects only
- `getProjectsByCategory(category)` - Filter by category

---

## Libraries & Utilities

### **`lib/projects-api.ts`** - External Projects API Client

**Purpose:** Fetch projects from admin panel backend API.

**Base URL:** `process.env.NEXT_PUBLIC_API_URL` (default: http://localhost:4000/api/v1)

**Interface:**
```typescript
interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: string;
  technologies: string[];
  heroImage?: string;
  galleryImages: string[];
  challenge?: string;
  solution?: string;
  projectUrl?: string;
  githubUrl?: string;
  year?: string;
  duration?: string;
  teamSize?: string;
  featured: boolean;
  published: boolean;
  viewCount?: number;
  orderIndex?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  metrics?: { metric: string; value: string }[];
  testimonial?: { quote: string; author: string; role: string; company: string };
  createdAt?: string;
  updatedAt?: string;
}
```

**Functions:**

1. **`fetchProjects(params?)`**
   - Queries: `published`, `featured`, `category`, `search`, `limit`, `page`, `sortBy`, `sortOrder`
   - Returns: `ProjectRecord[]`
   - Revalidates every 60 seconds (ISR)
   - Falls back to `[]` on error

2. **`fetchProject(slug)`**
   - Gets single project by slug
   - Returns: `ProjectRecord | null`
   - Revalidates every 60 seconds
   - Falls back to `null` on error

**Error Handling:** Silently returns empty array/null; no exceptions thrown

---

### **`lib/logger.ts`** - Structured Logging

**Purpose:** Production-ready logging with context and metadata.

**Methods:**
- `logger.info(message, options)` - Info level (dev only)
- `logger.warn(message, options)` - Warning level (always)
- `logger.error(message, error, options)` - Error level (always)
- `logger.debug(message, options)` - Debug level (dev only)

**Features:**
- Timestamps in ISO format
- Context tags: `[ContactAPI]`, `[NewsletterAPI]`, etc.
- Metadata object support
- Error stack traces included

**Usage in Codebase:**
```typescript
logger.error('Failed to send contact email', error, { context: 'ContactAPI' })
logger.error('Failed to process newsletter subscription', error, { context: 'NewsletterAPI' })
```

---

### **`lib/validation.ts`** - Form Validation

**Purpose:** Client and server-side form validation.

**Validation Rules:**
- `required`: Field must not be empty
- `minLength`: Minimum character count
- `maxLength`: Maximum character count
- `pattern`: RegExp matching
- `message`: Custom error message

**Validators:**
- `validateField(value, rules)` - Returns error string or null
- `validateForm(formData, rules)` - Returns array of ValidationErrors

**Pre-defined Rules:**
```typescript
contactFormRules: {
  fullName: [required, minLength:2, maxLength:100],
  email: [required, pattern:emailPattern],
  phone: [pattern:phonePattern],
  service: [required, minLength:3, maxLength:100],
  message: [required, minLength:10, maxLength:1000]
}
```

**Common Patterns:**
- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone: `/^[\d\s\-\+\(\)]+$/`
- URL: `/^https?:\/\/.+/`

---

### **`lib/scroll-reveal.ts`** - GSAP Scroll Animations

**Purpose:** Scroll-triggered animations using GSAP ScrollTrigger.

**Exported Functions:**

1. **`initScrollReveal()`**
   - Initializes fade-in animations
   - Staggered child animations
   - Parallax item effects
   - Respects `prefers-reduced-motion`

2. **`destroyScrollReveal()`**
   - Cleans up all animations and triggers
   - Removes event listeners

**CSS Classes:**
- `.reveal-fade` - Fade in from bottom
- `.reveal-stagger` - Stagger children with `[data-stagger-child]`
- `.parallax-item` - Parallax scroll with `data-parallax-depth` attribute

---

### **`lib/springPhysics.ts`** - Spring Physics Simulator

**Purpose:** Create natural spring-based animations for interactive elements.

**Interfaces:**
```typescript
interface SpringState1D {
  position: number;
  velocity: number;
}

interface SpringState3D {
  px: number; vx: number;
  py: number; vy: number;
  pz: number; vz: number;
}
```

**Functions:**

1. **`integrateSpring1D(state, target, dt, params, reducedMotion)`**
   - Advances spring state one frame
   - Parameters: mass (default 1), damping (default 10), stiffness (default 50)
   - Preset tunings: soft/floaty, default, snappy

2. **`integrateSpring3D(state, target, dt, params, reducedMotion)`**
   - 3D version with x, y, z dimensions

3. **`makeSpring3D(x, y, z)`**
   - Creates zeroed spring state at origin

**Used by:** `neural-visual-scene.tsx` for cursor interaction

---

## Hooks

### **`hooks/useCards.ts`** - Cards Data Hook

**Purpose:** Fetch cards from `/api/cards` with fallback to static data.

**Return Type:**
```typescript
interface UseCardsResult {
  cards: CardEntry[];
  loading: boolean;
  error: string | null;
}
```

**Behavior:**
1. Attempts to fetch from `/api/cards`
2. Falls back to `staticCards` on any error
3. Silently handles errors (no toast)
4. Disables caching with `cache: 'no-store'`
5. Handles cleanup for component unmount

**Usage Pattern:**
```typescript
const { cards, loading, error } = useCards()
```

---

## Component Integration

### **`components/hero-section.tsx`** - Landing Hero

**Features:**
- 2-column layout (60/40 split)
- Interactive 3D neural visual (right side)
- Spring physics cursor tracking
- Staggered Framer Motion entrance
- Analytics events: `hero_primary_click`, `hero_secondary_click`
- Content from `HERO_CONTENT` constant (hardcoded, not API-driven)

**CTAs:**
- Primary: "Start Your Project" → scrolls to contact section
- Secondary: "View Our Work" → scrolls to projects section

**Data Source:** Hardcoded constant (could be swapped for CMS in future)

---

### **`components/footer.tsx`** - Footer with Newsletter

**Features:**
- Newsletter subscription form
- Newsletter API integration (`/api/newsletter`)
- Success/error state management
- Social links (LinkedIn, Twitter, Instagram, Dribbble)
- Contact details (email, phone, address)
- Footer links, services, CTA card
- Stats display (50+ projects, 99% satisfaction, 3.2x performance)

**Newsletter Integration:**
- Sends to `/api/newsletter`
- Handles loading state
- Shows success confirmation
- Error messages with retry

---

### **`components/floating-navbar.tsx`** - Navigation

**Features:**
- Fixed navbar with backdrop blur
- Desktop horizontal menu
- Mobile drawer menu (slide-in from left)
- Navigation links: Products, Projects, Research, Services, Enterprise, Contact
- Login link
- "Book a Demo" CTA

**Data Source:** Hardcoded `navLinks` array (not API-driven)

---

### **`components/contact-section.tsx`** - Contact Form

**Features:**
- Form validation using `lib/validation.ts`
- Real-time error display
- Toast notifications (success/error)
- Loading spinner during submission
- Sends to `/api/contact`

**Form Fields:**
- Full Name (text)
- Email (email)
- Phone (tel, optional)
- Service (text)
- Message (textarea, 5 rows)

**Validation Rules:** Uses `contactFormRules` from `lib/validation.ts`

**Success State:** Clears form and shows success toast

---

### **`components/projects-section.tsx`** - Projects Carousel

**Purpose:** Thin wrapper that exports `SurfCarousel` as `ProjectsSection`.

**Note:** All implementation lives in `components/SurfCarousel.tsx` (not analyzed here)

---

### **`components/services-section.tsx`** - Services Grid

**Features:**
- 4-column grid of service cards
- Service modal for detailed views
- Interactive hover states
- Background images with blur effect
- Icon badges
- "Explore" button per service

**Services Offered:**
1. Web & App Development
2. AI & Machine Learning
3. API & Backend Engineering
4. Data & Automation

**Data Source:** Hardcoded services array (not API-driven)

---

## Website → Admin Backend Connection

### **Current State:**

**What's Connected:**
- ✅ **Projects API** (`lib/projects-api.ts`)
  - Fetches projects from admin backend: `http://localhost:4000/api/v1/projects`
  - Used by project list and detail pages
  - Graceful fallback if backend unavailable

**What's NOT Connected:**
- ❌ **Cards** - Uses `/api/cards` (in-memory, not synced with admin)
- ❌ **Hero Content** - Hardcoded in `hero-section.tsx`
- ❌ **Navigation** - Hardcoded in `floating-navbar.tsx`
- ❌ **Services** - Hardcoded in `services-section.tsx`
- ❌ **Footer Content** - Mostly hardcoded (except newsletter subscription)

---

## Environment Variables Required

```env
# Email Service
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@asagus.com
CONTACT_TO_EMAIL=hello@asagus.com
TO_EMAIL=admin@asagus.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://asagus.com

# Admin Backend API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## Data Flow Diagram

### Contact Form Submission
```
User Input 
  → ContactSection (React)
  → validateForm() (lib/validation.ts)
  → POST /api/contact
  → Resend Email Service
  → Admin receives email
```

### Projects Display
```
Static data/projects.ts
  ↓
  sitemap.xml generation
  ↓
[PLANNED] Admin panel backend API (lib/projects-api.ts)
  ↓
  SurfCarousel component
  ↓
  Page display
```

### Cards Display
```
useCards() hook
  ↓
  GET /api/cards (in-memory store)
  ↓
  Fallback to staticCards
  ↓
  Component display
```

---

## Key Observations & Recommendations

### 🟡 Current Gaps

1. **In-Memory Card Store**
   - Resets on server restart
   - Not persisted to database
   - Recommendation: Connect to MongoDB/PostgreSQL

2. **Static Content**
   - Hero, services, navigation are hardcoded
   - Recommendation: Create admin CMS endpoints for:
     - `GET /api/v1/content/hero`
     - `GET /api/v1/content/services`
     - `GET /api/v1/content/navigation`

3. **No Admin Webhook/Sync**
   - Website doesn't get notified of content changes
   - Recommendation: Implement ISR (Incremental Static Regeneration) or real-time sync

4. **Email Service Dependency**
   - Only works if Resend API key is configured
   - Graceful degradation exists (503 response)
   - Recommendation: Add fallback email provider

### ✅ Strengths

- **Graceful Degradation:** Static fallbacks for all dynamic data
- **Form Validation:** Client + server-side validation
- **SEO:** Sitemap generation, geographic variants
- **Logging:** Structured error logging
- **Performance:** ISR with 60-second revalidation
- **Security:** HTML escaping for email inputs

---

## Integration Checklist for Admin Panel Backend

### Essential Endpoints to Create

```
GET  /api/v1/projects                  ← fetch projects (exists)
GET  /api/v1/projects/:slug            ← fetch single project (exists)
GET  /api/v1/content/hero              ← fetch hero section content
GET  /api/v1/content/services          ← fetch services
GET  /api/v1/content/navigation        ← fetch navigation links
GET  /api/v1/content/footer            ← fetch footer content
POST /api/v1/cards                     ← create card (sync to DB)
GET  /api/v1/cards                     ← fetch all cards
PUT  /api/v1/cards/:id                 ← update card
DELETE /api/v1/cards/:id               ← delete card
```

### Admin Panel Requirements

- Dashboard for managing cards, projects, hero content
- Publish/unpublish functionality
- SEO metadata editor
- Image upload/management
- Real-time preview on website
- Audit logs for content changes

---

## Summary

The ASAGUS website is a **Next.js 14 frontend** with:
- **Server APIs** for contact, newsletter, and cards management
- **Static fallback data** for resilience
- **External project API integration** (`lib/projects-api.ts`)
- **Email service integration** via Resend
- **Form validation** and error handling
- **SEO optimizations** with sitemaps

**To fully integrate with an admin panel backend**, you need to:
1. Move card management to database
2. Create CMS endpoints for static content
3. Update component hooks to fetch from admin API
4. Implement real-time sync or ISR invalidation
