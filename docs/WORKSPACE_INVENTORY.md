# ASAGUS Website - Complete Workspace Inventory

## Project Overview
**Project Name:** ASAGUS  
**Version:** 0.2.0  
**Type:** Next.js 16 + React 19 Portfolio/Marketing Website  
**Purpose:** AI-focused software development company website with portfolio, services, and contact management

---

## Configuration Files (Root Level)

### Build & Runtime Configuration
| File | Purpose |
|------|---------|
| `package.json` | NPM/pnpm dependencies and scripts. Next.js 16, React 19, Framer Motion, Three.js, GSAP for animations, Tailwind CSS 4, TypeScript |
| `tsconfig.json` | TypeScript compiler options with path alias `@/*` mapped to root directory |
| `next.config.ts` | Next.js configuration with standalone output, React compiler enabled, Unsplash image remotePatterns |
| `tailwind.config.js` | Tailwind CSS v4 config with dark mode support, custom brand colors (#1D4DF1 blue), custom fonts (Azonix display, Roboto body), glow shadows |
| `postcss.config.mjs` | PostCSS config using Tailwind CSS v4 plugin |
| `eslint.config.mjs` | ESLint configuration with Next.js core web vitals and TypeScript rules |

### Version Control & Meta
| File | Purpose |
|------|---------|
| `.gitignore` | Ignores node_modules, .next, build artifacts, tmp_* files, admin-panel dependencies |
| `.gitattributes` | Git attributes configuration |
| `pnpm-lock.yaml` | pnpm lock file for reproducible installs |

### Environment
| File | Purpose |
|------|---------|
| `.env.local` | Local environment variables (secrets, API keys) |

---

## App Directory (Next.js Pages & Routes)

### Core Layout & Pages
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with theme provider, smooth scroll, SEO meta, font loading (Azonix, Roboto). Includes header and scroll reveal provider |
| `app/page.tsx` | Home page - renders hero, services, projects, contact sections, footer, theme toggle, scroll progress, live chat |
| `app/globals.css` | Global CSS with Tailwind import, custom scroll reveal animations, focus styles, card base styles, bento play button styles |

### SEO & Metadata
| File | Purpose |
|------|---------|
| `app/structured-data.tsx` | JSON-LD structured data injection for SEO |
| `app/comprehensive-seo.tsx` | Comprehensive SEO meta tags and headers |
| `app/geo-schema.tsx` | Geo-location schema for local SEO |
| `app/ai-meta.tsx` | AI-specific meta tags for AI-related content |
| `app/citation-guide.tsx` | Citation guide schema injection |
| `app/conversational-content.tsx` | Conversational content meta tags |
| `app/manifest.ts` | Web app manifest for PWA support |
| `app/about-company.json` | Static JSON data about the company |

### Special Pages
| File | Purpose |
|------|---------|
| `app/favicon.ico` | Favicon |
| `app/icon.tsx` | App icon component |
| `app/not-found.tsx` | 404 error page |
| `app/opengraph-image.tsx` | Dynamic OpenGraph image generation |

### Routes (Nested Pages)
| Path | Purpose |
|------|---------|
| `app/portfolio/page.tsx` | Portfolio showcase page |
| `app/privacy/page.tsx` | Privacy policy page |
| `app/projects/page.tsx` | All projects listing page |
| `app/projects/[slug]/page.tsx` | Dynamic project detail page |
| `app/projects/[slug]/layout.tsx` | Layout for project detail pages |
| `app/terms/page.tsx` | Terms of service page |

### API Routes
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `app/api/contact/route.ts` | POST | Contact form submission - validates, sanitizes, sends email via Resend |
| `app/api/cards/route.ts` | GET/POST | Project cards API - gets/posts cards data with fallback to static data |
| `app/api/cards/[id]/route.ts` | Route handler | Dynamic card routes |
| `app/api/newsletter/route.ts` | Route handler | Newsletter subscription endpoint |

### XML Sitemap Routes
| Endpoint | Purpose |
|----------|---------|
| `app/sitemap.xml/route.ts` | XML sitemap generation |
| `app/sitemap-images.xml/route.ts` | Image sitemap for SEO |
| `app/geo-sitemap.xml/route.ts` | Geographic sitemap for location-based SEO |

---

## Components Directory

### Layout Components
| File | Purpose |
|------|---------|
| `components/site-header.tsx` | Header wrapper with announcement bar and floating navbar |
| `components/announcement-bar.tsx` | Dismissible announcement banner |
| `components/floating-navbar.tsx` | Sticky navigation bar with offset awareness |
| `components/footer.tsx` | Footer with newsletter signup, social links, site navigation, contact info, status pills |

### Hero & Landing
| File | Purpose |
|------|---------|
| `components/hero-section.tsx` | Hero section v2.0 - Neural theme with 2-column layout, Three.js neural visual, spring physics cursor interaction, Framer Motion animations, CTA buttons |
| `components/neural-visual.tsx` | Neural visual component wrapper |
| `components/neural-visual-scene.tsx` | Three.js scene for neural visualization with spring physics |

### Services & Features
| File | Purpose |
|------|---------|
| `components/bento-services-section.tsx` | Bento grid services showcase with 6 service categories |
| `components/services-section.tsx` | Traditional services section layout |
| `components/faq-section.tsx` | FAQ accordion section |
| `components/testimonials-section.tsx` | Client testimonials carousel |
| `components/about-section.tsx` | About company section |
| `components/client-logos.tsx` | Client logos showcase |

### Projects & Portfolio
| File | Purpose |
|------|---------|
| `components/projects-section.tsx` | Thin wrapper exporting SurfCarousel as ProjectsSection |
| `components/SurfCarousel.tsx` | Main carousel component for project showcase with smooth scroll |
| `components/ProjectGrid.tsx` | Grid layout for project display |
| `components/project-modal.tsx` | Modal for project details popup |
| `components/project-page-client.tsx` | Client component for individual project pages |
| `components/portfolio-filter.tsx` | Filter component for portfolio projects |
| `components/CardCarousel.tsx` | Carousel card component |
| `components/CarouselCard.tsx` | Individual carousel card |

### Contact & Forms
| File | Purpose |
|------|---------|
| `components/contact-section.tsx` | Contact form section with validation, form state management, toast notifications |
| `components/service-modal.tsx` | Modal for service selection/details |

### UI Components
| File | Purpose |
|------|---------|
| `components/button.tsx` | Reusable button component |
| `components/input.tsx` | Reusable input component |
| `components/toast.tsx` | Toast notification component for success/error messages |
| `components/spinner.tsx` | Loading spinner component |
| `components/section.tsx` | Section wrapper component with consistent styling |

### Theme & Providers
| File | Purpose |
|------|---------|
| `components/theme-provider.tsx` | Theme provider wrapper using next-themes for dark/light mode |
| `components/theme-toggle.tsx` | Theme switcher button component |

### Animations & Effects
| File | Purpose |
|------|---------|
| `components/smooth-scroll.tsx` | Lenis smooth scroll implementation with GSAP ScrollTrigger integration |
| `components/scroll-reveal-provider.tsx` | Provider for scroll reveal animations |
| `components/scroll-progress.tsx` | Progress bar indicating page scroll position |
| `components/animated-background.tsx` | Animated background effects |

### Utilities
| File | Purpose |
|------|---------|
| `components/analytics.tsx` | Analytics tracking component |
| `components/live-chat.tsx` | Live chat widget integration |

### Images (Component Assets)
| File | Purpose |
|------|---------|
| `components/images/girilli.png` | Grilli restaurant project image |
| `components/images/GS.png` | GS Dashboard project image |
| `components/images/image.png` | Generic component image |
| `components/images/iPhone 16 Plus - 1.png` | iPhone mockup image |
| `components/images/vocalexpert.png` | AI Vocal Expert project image |

---

## Data Directory

### Static Data
| File | Purpose |
|------|---------|
| `data/cards.ts` | CardEntry interface and staticCards array with 6 project cards (LOGBOG, AI Vocal Expert, GS Dashboard, Brand Redesign, Grilli, FitLife Pro) |
| `data/projects.ts` | Project interface with full project data. Includes 6 projects with details: slug, title, category, technologies, descriptions, challenges, solutions, results, images, testimonials. Export functions: getProjectBySlug, getFeaturedProjects, getProjectsByCategory |

---

## Hooks Directory

### Custom React Hooks
| File | Purpose |
|------|---------|
| `hooks/useCards.ts` | Hook to fetch cards from /api/cards with fallback to static data. Returns cards, loading state, error state |

---

## Lib Directory

### Utility Functions & Libraries
| File | Purpose |
|------|---------|
| `lib/projects-api.ts` | API client for projects endpoint. Interfaces for ProjectRecord and responses. Functions: fetchProjects (with filters), fetchProject (by slug). Includes query building and error handling |
| `lib/scroll-reveal.ts` | GSAP scroll reveal initialization. Functions: initScrollReveal (setup fade, stagger, parallax animations), destroyScrollReveal (cleanup). Respects prefers-reduced-motion |
| `lib/validation.ts` | Form validation utilities. ValidationRule, ValidationRules, ValidationError interfaces. Functions: validateField, validateForm. Includes contactFormRules with email/phone/name patterns |
| `lib/logger.ts` | Logging utility (content not shown but imported in contact route) |
| `lib/springPhysics.ts` | Spring physics calculations for cursor interaction (referenced in hero section) |

---

## Public Directory

### Static Assets
| File/Folder | Purpose |
|-------------|---------|
| `public/robots.txt` | SEO robots directive file |
| `public/ai.txt` | AI-specific robots/crawling rules |
| `public/sitemap.xsl` | XSLT stylesheet for sitemap rendering |
| `public/company-facts.json` | Static JSON with company facts for SEO/display |
| `public/file.svg` | SVG asset |
| `public/globe.svg` | Globe SVG icon |
| `public/next.svg` | Next.js logo SVG |
| `public/vercel.svg` | Vercel logo SVG |
| `public/window.svg` | Window/frame SVG icon |

### Favicon Folder
| File | Purpose |
|------|---------|
| `public/favicon/` | Empty folder reserved for favicon assets |

### Images Folder
| File | Purpose |
|------|---------|
| `public/images/carosal.jpg` | Carousel/hero image |
| `public/images/carosal-2.jpg` | Carousel image variant 2 |
| `public/images/carosal-3.jpg` | Carousel image variant 3 |
| `public/images/f76072d1d73b5c5ca9a64079fafd1c8b.jpg` | Hashed image file |
| `public/images/grilli.png` | Grilli restaurant project image |
| `public/images/gs.png` | GS Dashboard project image |
| `public/images/logbog.png` | LOGBOG blogging platform project image |
| `public/images/vocalexpert.png` | AI Vocal Expert project image |

---

## Font Directory

### Custom Fonts
| File | Purpose |
|------|---------|
| `font/Azonix-1VB0.otf` | Azonix display font (used for headings via CSS variable --font-azonix) |
| `font/Roboto-VariableFont_wdth,wght.ttf` | Roboto variable font (used for body text via CSS variable --font-roboto) |

---

## GitHub Workflows (.github/workflows)

### CI/CD Pipelines
| File | Purpose |
|------|---------|
| `.github/workflows/deploy-main-website.yml` | Main website deployment pipeline |
| `.github/workflows/deploy-admin-frontend.yml` | Admin panel frontend deployment |
| `.github/workflows/deploy-admin-backend.yml` | Admin panel backend deployment |

---

## Root-Level Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `GETTING_STARTED.md` | Quick start guide |
| `QUICKSTART.md` | Quick reference guide |
| `TECHNOLOGY_ICONS_IMPLEMENTATION.md` | Tech stack icons documentation |
| `DEPLOYMENT.md` | Deployment instructions |
| `SECURITY.md` | Security practices and guidelines |
| `PERFORMANCE.md` | Performance optimization guide |
| `PROJECT_INDEX.md` | Index of all projects |
| `CONTENT_GUIDE.md` | Content management guidelines |
| Various PHASE_*.md files | Implementation phase tracking |
| `COMPREHENSIVE_SEO_IMPLEMENTATION.md` | SEO strategy documentation |
| `GEO_IMPLEMENTATION_GUIDE.md` | Geographic/location SEO guide |
| `COMPLETE_SEO_GEO_SUMMARY.md` | Combined SEO & geo implementation summary |
| `SEO_IMPROVEMENT_GUIDE.md` | SEO enhancement recommendations |
| `ENTERPRISE_ARCHITECTURE_PLAN.md` | Architecture planning document |
| `COMPREHENSIVE_AUDIT_REPORT.md` | Full audit of codebase/performance |
| `API_SPECIFICATIONS.md` | API endpoint specifications |
| `ADMIN_PANEL_SPECIFICATION.md` | Admin panel requirements and specs |
| `IMPLEMENTATION_ROADMAP.md` | Feature implementation timeline |
| `PRE_DEPLOYMENT_CHECKLIST.md` | Pre-launch verification checklist |
| `AZURE_DEPLOYMENT_GUIDE.md` | Azure deployment instructions |
| `AZURE_STARTUP_CONFIGURATION.md` | Azure startup/configuration guide |
| `IMPLEMENTATION_COMPLETE.md` | Completion status documentation |

---

## Admin Panel (Separate Project)

Located in `admin-panel/` directory. This is a monorepo with:

### Frontend (`admin-panel/frontend/`)
- Next.js-based admin dashboard
- Dashboard pages for: Analytics, Audit Logs, Blog, Contacts, Demo, FAQs, Projects, Research, Services, Settings, Team, Testimonials, Users
- Login/Authentication system
- File upload API integration
- Component library with UI components (dialogs, tables, forms, etc.)

### Backend Services (`admin-panel/services/`)
- **api-gateway**: API gateway service
- **auth-service**: Authentication and authorization
- **content-service**: Content management for blog, contacts, projects, services, etc.
- **analytics-service**: Analytics tracking

### Shared Packages (`admin-panel/packages/`)
- **database**: Prisma ORM with SQLite
- **shared**: Common constants, types, and validation

### Database
- `admin-panel/packages/database/prisma/schema.prisma` - Database schema
- `admin-panel/packages/database/prisma/dev.db` - Development SQLite database

---

## Project Structure Summary

```
asagus/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── projects/                 # Projects section
│   ├── portfolio/                # Portfolio page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── [SEO files]               # Meta, schema, sitemap routes
├── components/                   # React components
│   ├── images/                   # Component images
│   ├── hero-section.tsx          # Hero with neural visual
│   ├── footer.tsx                # Footer
│   ├── projects-section.tsx      # Projects carousel
│   └── [40+ UI/Layout components]
├── data/                         # Static data
│   ├── cards.ts                  # Project cards
│   └── projects.ts               # Full project details
├── hooks/                        # Custom hooks
│   └── useCards.ts               # Cards fetching hook
├── lib/                          # Utilities
│   ├── projects-api.ts           # Projects API client
│   ├── scroll-reveal.ts          # GSAP animations
│   ├── validation.ts             # Form validation
│   └── logger.ts                 # Logging
├── public/                       # Static files
│   ├── images/                   # Project images
│   └── [SVGs, robots.txt, etc]
├── font/                         # Custom fonts
│   ├── Azonix-1VB0.otf
│   └── Roboto-VariableFont_*.ttf
├── admin-panel/                  # Admin dashboard (separate project)
├── .github/workflows/            # CI/CD pipelines
└── [Config files]                # next.config.ts, tailwind.config.js, etc.
```

---

## Key Technologies & Dependencies

### Frontend Framework
- **Next.js 16.1.6** - React meta-framework with server components
- **React 19.2.0** - UI library
- **React DOM 19.2.0** - React renderer

### Styling & Layout
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS 4** - CSS processing
- **@tailwindcss/postcss** - Tailwind v4 plugin

### Animation & Interaction
- **Framer Motion 12.23.25** - React animation library
- **GSAP 3.13.0** - JavaScript animation library
- **Lenis 1.3.15** - Smooth scroll library

### 3D Graphics
- **Three.js 0.183.1** - 3D graphics library
- **@react-three/fiber 9.5.0** - React renderer for Three.js
- **@react-three/drei 10.7.7** - Useful Three.js utilities

### Theme & UI
- **next-themes 0.4.6** - Dark/light mode provider
- **lucide-react 0.556.0** - Icon library

### Forms & Communication
- **Resend 6.5.2** - Email sending service

### Developer Tools
- **TypeScript 5** - Type safety
- **ESLint 9** - Code linting
- **Babel React Compiler** - Automatic component optimization

---

## Configuration Highlights

### Tailwind Custom Colors
```
brand.blue: #1D4DF1
brand.black: #000000
brand.white: #FFFFFF
```

### Custom Shadows
- `glow`: 0 0 20px rgba(29, 77, 241, 0.5)
- `glow-lg`: 0 0 40px rgba(29, 77, 241, 0.6)

### Custom Fonts
- `display`: Azonix (headings)
- `body`: Roboto (body text)

### Key Features
- Dark mode by default
- Smooth scroll with Lenis + GSAP
- Scroll reveal animations
- Three.js neural visualization
- Spring physics cursor interactions
- Form validation with custom rules
- Email integration via Resend
- SEO-optimized with structured data, sitemaps, Open Graph
- Newsletter subscription
- Live chat integration
- Responsive design (mobile-first)

---

## Entry Points

### Main Application
- **Home**: `app/page.tsx` → renders all major sections
- **Projects**: `app/projects/page.tsx` → projects listing, `app/projects/[slug]/page.tsx` → individual project details

### Admin Dashboard (Separate)
- Located in `admin-panel/frontend/src/app/` with its own layout and pages

---

## Build & Development Commands

From `package.json`:
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm dev:all          # Dev main + admin concurrently
pnpm build:all        # Build main + admin
pnpm install:all      # Install main + admin dependencies
```

---

## Summary Statistics

- **Total Components**: 45+ UI/layout components
- **API Routes**: 4 main endpoints
- **Pages**: 8+ public pages
- **Data Files**: 2 (cards, projects)
- **Custom Hooks**: 1
- **Utility Modules**: 5
- **Images**: 15+ project/asset images
- **Fonts**: 2 custom fonts
- **Configuration Files**: 7 main configs
- **Documentation Files**: 20+ MD guides

