# ASAGUS Admin Panel - Complete File Inventory

## Project Overview
**Project Name:** ASAGUS Admin Panel  
**Version:** 1.0.0  
**Architecture:** Microservices with monorepo structure using pnpm workspaces  
**Tech Stack:** Node.js, Express, Next.js, React, PostgreSQL, Redis, Prisma ORM, TypeScript

---

## Root Level Configuration Files

### Configuration & Setup
| File Path | Description |
|-----------|-------------|
| `package.json` | Root workspace configuration with pnpm workspaces. Contains scripts for dev, build, database management, Docker, and linting. Manages all microservices and frontend. |
| `pnpm-workspace.yaml` | pnpm monorepo workspace configuration defining package locations. |
| `pnpm-lock.yaml` | Lockfile for pnpm dependency management. |
| `docker-compose.yml` | Docker Compose configuration for PostgreSQL (port 5432) and Redis (port 6379) services with health checks and persistent volumes. |
| `.env.example` | Template environment variables for database, Redis, JWT, services, frontend, email, and admin credentials. |
| `.env` | Actual environment variables (git-ignored in production). |

### Documentation & Scripts
| File Path | Description |
|-----------|-------------|
| `README.md` | Project documentation and setup instructions. |
| `DATABASE-SETUP.md` | Database setup and configuration guide. |
| `AUDIT_REPORT.md` | Audit logging and compliance report. |
| `IMPLEMENTATION_PROGRESS.md` | Frontend implementation progress tracking. |
| `create-database.bat` | Windows batch script for database creation. |
| `startup.sh` | Bash script for project startup. |
| `test-login.json` | Test credentials for login testing. |
| `asagus_admin_dump.sql` | Database dump/backup SQL file. |

---

## Frontend Application (`frontend/`)

### Root Configuration
| File Path | Description |
|-----------|-------------|
| `frontend/package.json` | Next.js frontend package configuration. Contains scripts for dev (port 3001), build, start, lint, and clean. Dependencies include React 19, Next.js 15, Radix UI, TailwindCSS 4, Recharts, Tiptap editor. |
| `frontend/tsconfig.json` | TypeScript configuration for frontend. |
| `frontend/next.config.ts` | Next.js configuration. |
| `frontend/postcss.config.mjs` | PostCSS configuration for Tailwind CSS. |
| `frontend/IMPLEMENTATION_PROGRESS.md` | Frontend feature implementation status. |

### Application Layout & Pages
| File Path | Description |
|-----------|-------------|
| `frontend/src/app/layout.tsx` | Root layout component with metadata, global styles, and Toaster for notifications. |
| `frontend/src/app/page.tsx` | Root page with token-based redirect logic (authenticated → dashboard, unauthenticated → login). |
| `frontend/src/app/globals.css` | Global stylesheet with CSS variables and base styles. |
| `frontend/src/app/login/page.tsx` | Login page component. |
| `frontend/src/app/dashboard/layout.tsx` | Dashboard layout with sidebar and header navigation. |
| `frontend/src/app/dashboard/page.tsx` | Dashboard home page with overview statistics. |
| `frontend/src/app/dashboard/analytics/page.tsx` | Analytics dashboard with charts and metrics. |
| `frontend/src/app/dashboard/projects/page.tsx` | Projects management page with CRUD operations. |
| `frontend/src/app/dashboard/services/page.tsx` | Services management page. |
| `frontend/src/app/dashboard/testimonials/page.tsx` | Testimonials management page with rating system. |
| `frontend/src/app/dashboard/faqs/page.tsx` | FAQ management page. |
| `frontend/src/app/dashboard/contacts/page.tsx` | Contact submissions management page. |
| `frontend/src/app/dashboard/blog/page.tsx` | Blog/content management page. |
| `frontend/src/app/dashboard/team/page.tsx` | Team members management page. |
| `frontend/src/app/dashboard/users/page.tsx` | User management page (admin functionality). |
| `frontend/src/app/dashboard/settings/page.tsx` | Application settings page. |
| `frontend/src/app/dashboard/audit-logs/page.tsx` | Audit logs viewing page. |
| `frontend/src/app/dashboard/research/page.tsx` | Research/documentation page. |
| `frontend/src/app/dashboard/demo/page.tsx` | Demo/test page for UI components. |
| `frontend/src/app/api/upload/route.ts` | API route for file uploads (POST endpoint). |

### Reusable Components (`frontend/src/components/`)
| File Path | Description |
|-----------|-------------|
| `frontend/src/components/header.tsx` | Header component with navigation and user menu. |
| `frontend/src/components/sidebar.tsx` | Sidebar navigation component with menu items. |
| `frontend/src/components/data-table.tsx` | Reusable data table component with sorting and pagination. |
| `frontend/src/components/stats-card.tsx` | Statistics card component for displaying metrics. |
| `frontend/src/components/error-boundary.tsx` | Error boundary component for error handling. |

### UI Components Library (`frontend/src/components/ui/`)
| File Path | Description |
|-----------|-------------|
| `frontend/src/components/ui/button.tsx` | Button component (Radix UI based). |
| `frontend/src/components/ui/input.tsx` | Input field component. |
| `frontend/src/components/ui/label.tsx` | Label component (Radix UI). |
| `frontend/src/components/ui/card.tsx` | Card container component. |
| `frontend/src/components/ui/table.tsx` | Table component with TanStack React Table integration. |
| `frontend/src/components/ui/select.tsx` | Select/dropdown component (Radix UI). |
| `frontend/src/components/ui/dialog.tsx` | Modal dialog component (Radix UI). |
| `frontend/src/components/ui/dropdown-menu.tsx` | Dropdown menu component (Radix UI). |
| `frontend/src/components/ui/alert.tsx` | Alert/notification component. |
| `frontend/src/components/ui/toast.tsx` | Toast notification component. |
| `frontend/src/components/ui/toaster.tsx` | Toaster container for rendering toasts. |
| `frontend/src/components/ui/sheet.tsx` | Sheet/slide-out panel component. |
| `frontend/src/components/ui/filter-bar.tsx` | Filter controls component for data filtering. |
| `frontend/src/components/ui/search-input.tsx` | Search input component with debouncing. |
| `frontend/src/components/ui/image-upload.tsx` | Image upload component with preview. |
| `frontend/src/components/ui/rich-text-editor.tsx` | Rich text editor component (Tiptap-based). |
| `frontend/src/components/ui/technology-selector.tsx` | Technology selection component for projects. |

### Hooks (`frontend/src/hooks/`)
| File Path | Description |
|-----------|-------------|
| `frontend/src/hooks/use-toast.ts` | Custom hook for toast notifications. |
| `frontend/src/hooks/use-debounce.ts` | Custom hook for debouncing values (used in search). |

### Utilities (`frontend/src/lib/`)
| File Path | Description |
|-----------|-------------|
| `frontend/src/lib/api.ts` | API client class with authentication, token refresh logic, and request methods (GET, POST, PUT, PATCH, DELETE). Handles 401 errors with automatic token refresh. |
| `frontend/src/lib/utils.ts` | Utility functions (className merging, formatting, etc.). |

### Static Assets
| File Path | Description |
|-----------|-------------|
| `frontend/public/uploads/.gitignore` | Git ignore for uploaded files directory. |

---

## Packages (`packages/`)

### Database Package (`packages/database/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `packages/database/package.json` | Database package configuration with Prisma scripts (generate, push, migrate, seed). |
| `packages/database/tsconfig.json` | TypeScript configuration for database package. |

#### Prisma ORM
| File Path | Description |
|-----------|-------------|
| `packages/database/prisma/schema.prisma` | Prisma schema defining database models: User, Project, Service, Testimonial, FAQ, ContactSubmission, BlogPost, Team, Setting, AuditLog, and their relationships. Includes validation rules and indexing. |
| `packages/database/prisma/dev.db` | SQLite development database file. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `packages/database/src/index.ts` | Exports Prisma client singleton with logging configuration (query/error/warn logs in dev, error only in prod). |
| `packages/database/src/seed.ts` | Database seeding script for initial data population (admin user, sample projects, services, etc.). |

### Shared Package (`packages/shared/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `packages/shared/package.json` | Shared utilities package configuration. |
| `packages/shared/tsconfig.json` | TypeScript configuration for shared package. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `packages/shared/src/index.ts` | Main export file for shared package (exports types, constants, validation schemas). |
| `packages/shared/src/constants.ts` | Shared constants: ROLES (super_admin, admin, editor, viewer), PROJECT_CATEGORIES, SERVICE_ICONS, PAGINATION_DEFAULTS, JWT_CONFIG, RATE_LIMITS, MEDIA_CONFIG (file sizes, allowed types, thumbnail sizes). |
| `packages/shared/src/validation.ts` | Zod validation schemas for: login, register, change password, project, service, testimonial, FAQ, contact reply, and settings. Includes type inference utilities. |
| `packages/shared/src/types/index.ts` | TypeScript interfaces for: AuthUser, LoginRequest/Response, TokenPayload, ApiResponse, PaginatedResponse, ProjectDTO, ServiceDTO, TestimonialDTO, FAQDTO, ContactSubmissionDTO, DashboardStats, UserRole, and filter parameters. |

---

## Microservices (`services/`)

### API Gateway (`services/api-gateway/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `services/api-gateway/package.json` | API Gateway package configuration. Runs on port 4000. |
| `services/api-gateway/tsconfig.json` | TypeScript configuration. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `services/api-gateway/src/index.ts` | API Gateway entry point. Initializes Express server and proxies requests to microservices. |
| `services/api-gateway/src/env.ts` | Environment variables configuration for gateway. |

### Authentication Service (`services/auth-service/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `services/auth-service/package.json` | Auth Service package configuration. Runs on port 4001. |
| `services/auth-service/tsconfig.json` | TypeScript configuration. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `services/auth-service/src/index.ts` | Auth Service entry point. Initializes Express server for authentication endpoints. |
| `services/auth-service/src/env.ts` | Environment variables configuration for auth service. |
| `services/auth-service/src/routes/auth.routes.ts` | Auth routes: login, logout, register, refresh-token, forgot-password, reset-password, me (get current user). |
| `services/auth-service/src/controllers/auth.controller.ts` | Auth controller with business logic for authentication operations. |
| `services/auth-service/src/middleware/auth.ts` | JWT verification middleware for protecting routes. |
| `services/auth-service/src/utils/jwt.ts` | JWT token generation and verification utilities. |
| `services/auth-service/src/utils/password.ts` | Password hashing (bcrypt) and verification utilities. |

### Content Service (`services/content-service/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `services/content-service/package.json` | Content Service package configuration. Runs on port 4002. |
| `services/content-service/tsconfig.json` | TypeScript configuration. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `services/content-service/src/index.ts` | Content Service entry point. Initializes Express server for content management. |
| `services/content-service/src/env.ts` | Environment variables configuration for content service. |
| `services/content-service/src/middleware/auth.ts` | JWT verification middleware for protected content routes. |
| `services/content-service/src/routes/projects.routes.ts` | Project CRUD routes: GET (list/single), POST (create), PUT (update), DELETE (delete), with filtering and pagination. |
| `services/content-service/src/routes/services.routes.ts` | Service CRUD routes for managing services. |
| `services/content-service/src/routes/testimonials.routes.ts` | Testimonial CRUD routes with rating and approval system. |
| `services/content-service/src/routes/faqs.routes.ts` | FAQ CRUD routes with category and activity management. |
| `services/content-service/src/routes/contacts.routes.ts` | Contact submission routes: list, get single, reply to contact. |
| `services/content-service/src/routes/blog.routes.ts` | Blog/article management routes. |
| `services/content-service/src/routes/team.routes.ts` | Team members management routes. |
| `services/content-service/src/routes/research.routes.ts` | Research/documentation content routes. |
| `services/content-service/src/routes/dashboard.routes.ts` | Dashboard statistics and overview route. |
| `services/content-service/src/routes/settings.routes.ts` | Application settings CRUD routes. |
| `services/content-service/src/routes/technologies.routes.ts` | Technology management routes (used in projects). |

### Analytics Service (`services/analytics-service/`)

#### Configuration
| File Path | Description |
|-----------|-------------|
| `services/analytics-service/package.json` | Analytics Service package configuration. Runs on port 4003. |
| `services/analytics-service/tsconfig.json` | TypeScript configuration. |

#### Source Code
| File Path | Description |
|-----------|-------------|
| `services/analytics-service/src/index.ts` | Analytics Service entry point. Initializes Express server for analytics endpoints. |
| `services/analytics-service/src/env.ts` | Environment variables configuration for analytics service. |
| `services/analytics-service/src/routes/analytics.routes.ts` | Analytics routes: page views, visitor metrics, project view tracking, engagement metrics. |

### Shared Utilities (`services/shared/`)

| File Path | Description |
|-----------|-------------|
| `services/shared/logger.ts` | Centralized logging utility for all services with configurable levels (info, warn, error, debug). |

---

## Scripts Directory (`scripts/`)

| File Path | Description |
|-----------|-------------|
| `scripts/init-db.sql` | SQL initialization script for PostgreSQL Docker container. Sets up initial database schema and users. |

---

## Architecture Summary

### Microservices Topology
```
Admin Panel (Monorepo)
├── API Gateway (Port 4000)
│   ├── Routes requests to microservices
│   └── Handles API versioning (/api/v1)
├── Auth Service (Port 4001)
│   ├── User authentication
│   ├── Token management (JWT)
│   └── Password management
├── Content Service (Port 4002)
│   ├── Projects management
│   ├── Services management
│   ├── Testimonials & FAQs
│   ├── Blog posts
│   ├── Team members
│   ├── Contact submissions
│   ├── Settings
│   └── Dashboard statistics
└── Analytics Service (Port 4003)
    ├── Page view tracking
    ├── Visitor metrics
    └── Engagement analytics
```

### Database Structure
- **PostgreSQL** (Primary Database)
  - Tables: User, Project, Service, Testimonial, FAQ, ContactSubmission, BlogPost, Team, Setting, AuditLog
  - Managed via Prisma ORM

- **Redis** (Caching & Sessions)
  - Session storage
  - Cache layer
  - Rate limiting

### Frontend Architecture
- **Next.js 15** with React 19
- **Client-side routing** with automatic auth checks
- **API client** with automatic token refresh on 401
- **Component-based UI** with Radix UI + TailwindCSS
- **Rich text editing** with Tiptap
- **Data visualization** with Recharts
- **Form validation** with Zod

---

## Key Features

### Authentication & Authorization
- JWT-based authentication (access + refresh tokens)
- Role-based access control (RBAC): super_admin, admin, editor, viewer
- Automatic token refresh on frontend
- Password hashing with bcrypt
- Email verification and password reset

### Content Management
- Project portfolio management with full metadata
- Service offerings management
- Testimonials with ratings and approval system
- FAQ management with categorization
- Blog/article publishing
- Team member profiles
- Technology tracking

### Admin Features
- User management
- Settings management
- Audit logging
- Contact form submissions with replies
- Analytics dashboard
- File uploads (Vercel Blob integration in frontend)

### Security & Performance
- Rate limiting (5 login attempts/15min, 3 register/hour)
- API request limiting (100/min unauthenticated, 1000/min authenticated)
- CORS and security headers
- Input validation (Zod schemas)
- Automatic audit logging
- Media file size restrictions (10MB max)

---

## Development Commands

### From Root Directory
```bash
pnpm dev              # Start all services and frontend
pnpm dev:gateway      # Start API Gateway only
pnpm dev:auth         # Start Auth Service only
pnpm dev:content      # Start Content Service only
pnpm dev:analytics    # Start Analytics Service only
pnpm dev:frontend     # Start Next.js frontend only
pnpm build            # Build all packages
pnpm db:setup         # Generate, push, and seed database
pnpm db:studio        # Open Prisma Studio for database management
pnpm docker:up        # Start PostgreSQL and Redis containers
pnpm docker:down      # Stop Docker containers
pnpm lint             # Lint all packages
pnpm clean            # Clean all node_modules and build files
```

### Frontend Specific
```bash
cd frontend
pnpm dev              # Start on port 3001
pnpm build            # Production build
pnpm lint             # Run ESLint
```

---

## Environment Configuration

### Key Environment Variables
- **Database**: `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`
- **Redis**: `REDIS_URL`, `REDIS_PORT`
- **JWT**: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`
- **Services**: `GATEWAY_URL`, `AUTH_SERVICE_URL`, `CONTENT_SERVICE_URL`, `ANALYTICS_SERVICE_URL`
- **Frontend**: `NEXT_PUBLIC_API_URL`, `ADMIN_FRONTEND_PORT`
- **Email**: `RESEND_API_KEY`, `FROM_EMAIL`
- **Defaults**: `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`

---

## File Count Summary
- **Root Configuration Files**: 8
- **Documentation Files**: 4
- **Frontend Files**: 50+
- **Database Package**: 4
- **Shared Package**: 4
- **API Gateway**: 2
- **Auth Service**: 6
- **Content Service**: 12
- **Analytics Service**: 3
- **Shared Services**: 1

**Total: ~100+ files across the monorepo**

---

## Technology Stack Summary

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: Zod
- **Logging**: Custom logger utility
- **Rate Limiting**: express-rate-limit (configured)

### Frontend
- **Framework**: Next.js 15
- **Runtime**: React 19
- **UI Components**: Radix UI
- **Styling**: TailwindCSS 4
- **Tables**: TanStack React Table
- **Rich Text**: Tiptap
- **Charts**: Recharts
- **Icons**: Lucide React, Devicon
- **File Upload**: Vercel Blob
- **HTTP**: Fetch API
- **Validation**: Zod

### DevOps
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **Databases**: PostgreSQL 16, SQLite (dev), Redis 7

