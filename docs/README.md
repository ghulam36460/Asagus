# ASAGUS Admin Panel

Microservices-based admin panel for ASAGUS — AI, Cybersecurity & Web Development Solutions.

## Architecture

```
admin-panel/
├── packages/
│   ├── database/          # Prisma ORM + PostgreSQL schema (18 models)
│   └── shared/            # Shared types, validation (Zod), constants
├── services/
│   ├── api-gateway/       # Express.js gateway (port 4000)
│   ├── auth-service/      # JWT auth + RBAC (port 4001)
│   ├── content-service/   # Projects, Services, FAQs CRUD (port 4002)
│   └── analytics-service/ # Page views, events, audit logs (port 4003)
├── frontend/              # Next.js 15 admin dashboard (port 3001)
├── docker-compose.yml     # PostgreSQL 16 + Redis 7
└── scripts/init-db.sql    # Database initialization
```

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 15, Tailwind CSS 4, Lucide Icons    |
| Gateway    | Express.js, http-proxy-middleware, Helmet    |
| Services   | Express.js, TypeScript                      |
| Database   | PostgreSQL 16, Prisma ORM v6                |
| Cache      | Redis 7                                     |
| Auth       | JWT (access + refresh tokens), bcryptjs      |
| Validation | Zod                                         |

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8
- **Docker** & **Docker Compose**

## Quick Start

### 1. Clone & Setup Environment

```bash
cd admin-panel
cp .env.example .env
# Edit .env with your values (defaults work for local dev)
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker compose up -d

# Verify containers are running
docker compose ps
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:push

# Seed initial data (roles, permissions, super admin, sample data)
pnpm db:seed
```

### 5. Start Development

```bash
# Start all services concurrently
pnpm dev
```

This starts:
- **API Gateway** → http://localhost:4000
- **Auth Service** → http://localhost:4001
- **Content Service** → http://localhost:4002
- **Analytics Service** → http://localhost:4003
- **Admin Frontend** → http://localhost:3001

### 6. Login

Open http://localhost:3001 and sign in with:

- **Email:** `admin@asagus.com`
- **Password:** `Admin@2026Secure!`

## RBAC Roles

| Role         | Permissions                          |
|--------------|--------------------------------------|
| Super Admin  | Full access (all permissions bypass) |
| Admin        | All CRUD + user management           |
| Editor       | Create/Read/Update content           |
| Viewer       | Read-only access                     |

## API Endpoints

All API requests go through the gateway at `http://localhost:4000/api`.

### Auth (`/api/auth`)
- `POST /login` — Login with email/password
- `POST /register` — Register new user
- `POST /refresh` — Refresh access token
- `POST /logout` — Logout (invalidate refresh token)
- `GET /me` — Get current user profile
- `GET /users` — List all users (admin)
- `PUT /users/:id` — Update user (admin)
- `DELETE /users/:id` — Delete user (admin)

### Content (`/api/content`)
- `GET|POST /projects` — List/create projects
- `GET|PUT|DELETE /projects/:id` — Get/update/delete project
- `GET|POST /services` — List/create services
- `GET|POST /testimonials` — List/create testimonials
- `GET|POST /faqs` — List/create FAQs
- `GET /contacts` — List contact submissions
- `POST /contacts/:id/reply` — Reply to contact
- `GET /dashboard/stats` — Dashboard statistics
- `GET|PUT /settings` — Application settings

### Analytics (`/api/analytics`)
- `POST /pageview` — Track page view
- `POST /event` — Track custom event
- `GET /overview` — Analytics overview
- `GET /audit-logs` — Get audit log entries

## Admin Dashboard Pages

| Page          | Path                    | Description                    |
|---------------|-------------------------|--------------------------------|
| Login         | `/login`                | Authentication                 |
| Dashboard     | `/dashboard`            | Stats overview + recent data   |
| Projects      | `/dashboard/projects`   | CRUD with filters & pagination |
| Services      | `/dashboard/services`   | Service management             |
| Testimonials  | `/dashboard/testimonials` | Client testimonials          |
| FAQs          | `/dashboard/faqs`       | FAQ management with reorder    |
| Contacts      | `/dashboard/contacts`   | Messages + reply functionality |
| Analytics     | `/dashboard/analytics`  | Views, visitors, devices       |
| Users         | `/dashboard/users`      | User management + role assign  |
| Audit Logs    | `/dashboard/audit-logs` | System activity history        |
| Settings      | `/dashboard/settings`   | Configuration by group         |

## Database Schema

**18 models** organized into schemas:

- **Auth:** User, Role, Permission, UserRole, RolePermission, RefreshToken, ApiKey, AuditLog
- **Content:** Project, ProjectMetric, ProjectTestimonial, Service, Testimonial, FAQ, ClientLogo, Stat
- **Contact:** ContactSubmission, NewsletterSubscriber
- **Media:** Media
- **Analytics:** PageView, AnalyticsEvent
- **Settings:** Setting

## Scripts

```bash
pnpm dev           # Start all services in development mode
pnpm build         # Build all packages and services
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
pnpm db:seed       # Seed initial data
pnpm db:studio     # Open Prisma Studio (DB GUI)
pnpm docker:up     # Start Docker containers
pnpm docker:down   # Stop Docker containers
```

## Environment Variables

See `.env.example` for all available configuration options including:
- Database connection (PostgreSQL)
- Redis connection
- JWT secrets and expiration
- Service ports
- Super admin credentials
- CORS origins

## Security Features

- JWT with access (15min) + refresh (7d) token rotation
- bcrypt password hashing (12 rounds)
- Role-based access control with 53 granular permissions
- Rate limiting (200 req/min per IP)
- Helmet security headers
- CORS whitelist
- Audit logging for all sensitive operations
- Input validation with Zod schemas
