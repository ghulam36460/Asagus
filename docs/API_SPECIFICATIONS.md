# 🔌 ASAGUS API SPECIFICATIONS & BEST PRACTICES

**Version:** 1.0  
**Date:** February 2026  
**Purpose:** Complete API documentation and development standards

---

## 📋 TABLE OF CONTENTS

1. [API Design Principles](#api-design-principles)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Versioning Strategy](#versioning-strategy)
8. [Best Practices](#best-practices)

---

## 🎯 API DESIGN PRINCIPLES

### RESTful Standards

```
GET    /api/v1/resource        - List all resources
GET    /api/v1/resource/:id    - Get single resource
POST   /api/v1/resource        - Create new resource
PUT    /api/v1/resource/:id    - Update entire resource
PATCH  /api/v1/resource/:id    - Partially update resource
DELETE /api/v1/resource/:id    - Delete resource
```

### Naming Conventions

- **Use plural nouns:** `/projects` not `/project`
- **Use kebab-case:** `/user-profiles` not `/userProfiles`
- **Be consistent:** `/projects/:id/comments` not `/projects/:id/comment-list`
- **Avoid deep nesting:** Max 2 levels (`/projects/:id/comments/:commentId`)

### Response Codes

```typescript
// Success
200 OK              - Successful GET, PUT, PATCH
201 Created         - Successful POST
204 No Content      - Successful DELETE

// Client Errors
400 Bad Request     - Invalid request data
401 Unauthorized    - Missing or invalid authentication
403 Forbidden       - Authenticated but not authorized
404 Not Found       - Resource doesn't exist
422 Unprocessable   - Validation failed
429 Too Many Requests - Rate limit exceeded

// Server Errors
500 Internal Server Error - Something went wrong
502 Bad Gateway     - Service unavailable
503 Service Unavailable - Temporary outage
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### JWT Token Structure

```typescript
// Access Token (15 minutes expiry)
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "roles": ["admin"],
    "permissions": [
      "projects:read",
      "projects:write",
      "users:read"
    ],
    "iat": 1707024000,
    "exp": 1707024900
  },
  "signature": "..."
}

// Refresh Token (7 days expiry)
{
  "sub": "user-uuid",
  "type": "refresh",
  "iat": 1707024000,
  "exp": 1707628800
}
```

### Authentication Flow

```typescript
// 1. Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["admin"]
  }
}

// 2. Authenticated Request
GET /api/v1/content/projects
Headers:
  Authorization: Bearer eyJhbGc...

// 3. Refresh Token
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "eyJhbGc...", // New access token
  "refreshToken": "eyJhbGc..." // New refresh token
}
```

### Permission System

```typescript
// Permission format: resource:action
const permissions = [
  // Projects
  'projects:create',
  'projects:read',
  'projects:update',
  'projects:delete',
  'projects:publish',
  
  // Services
  'services:create',
  'services:read',
  'services:update',
  'services:delete',
  
  // Users (admin only)
  'users:create',
  'users:read',
  'users:update',
  'users:delete',
  'users:assign-roles',
  
  // Settings (super admin only)
  'settings:read',
  'settings:update',
  'settings:system',
];

// Middleware usage
app.get('/api/v1/projects', 
  authenticate,
  authorize('projects:read'),
  projectController.list
);
```

---

## 📚 API ENDPOINTS REFERENCE

### Authentication Service

```typescript
// Base URL: /api/v1/auth

// Register new user
POST /register
Body: {
  email: string;
  password: string;
  name: string;
}
Response: {
  message: string;
  user: User;
}

// Login
POST /login
Body: {
  email: string;
  password: string;
}
Response: {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Logout
POST /logout
Headers: Authorization: Bearer {token}
Response: {
  message: string;
}

// Refresh access token
POST /refresh-token
Body: {
  refreshToken: string;
}
Response: {
  accessToken: string;
  refreshToken: string;
}

// Get current user
GET /me
Headers: Authorization: Bearer {token}
Response: User

// Update profile
PUT /profile
Headers: Authorization: Bearer {token}
Body: {
  name?: string;
  avatar_url?: string;
}
Response: User

// Change password
PUT /password
Headers: Authorization: Bearer {token}
Body: {
  currentPassword: string;
  newPassword: string;
}
Response: {
  message: string;
}

// Forgot password
POST /forgot-password
Body: {
  email: string;
}
Response: {
  message: string;
}

// Reset password
POST /reset-password
Body: {
  token: string;
  newPassword: string;
}
Response: {
  message: string;
}

// Verify email
GET /verify-email/:token
Response: {
  message: string;
}
```

### Content Service

```typescript
// Base URL: /api/v1/content

// ===== PROJECTS =====

// List projects
GET /projects
Query params:
  - page?: number (default: 1)
  - limit?: number (default: 10)
  - category?: string
  - featured?: boolean
  - published?: boolean
  - search?: string
  - sortBy?: 'createdAt' | 'title' | 'viewCount'
  - sortOrder?: 'asc' | 'desc'
Response: {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Get single project
GET /projects/:slug
Response: Project

// Create project (admin only)
POST /projects
Headers: Authorization: Bearer {token}
Body: {
  title: string;
  slug?: string; // Auto-generated if not provided
  description: string;
  category: string;
  clientName?: string;
  technologies: string[];
  images: {
    hero: string;
    gallery: string[];
  };
  // ... more fields
}
Response: Project

// Update project (admin only)
PUT /projects/:id
Headers: Authorization: Bearer {token}
Body: Partial<Project>
Response: Project

// Delete project (admin only)
DELETE /projects/:id
Headers: Authorization: Bearer {token}
Response: {
  message: string;
}

// Publish/unpublish project
PATCH /projects/:id/publish
Headers: Authorization: Bearer {token}
Body: {
  published: boolean;
}
Response: Project

// Increment view count
POST /projects/:id/view
Response: {
  viewCount: number;
}

// ===== SERVICES =====

// List services
GET /services
Query params: active?: boolean, featured?: boolean
Response: Service[]

// Get single service
GET /services/:slug
Response: Service

// Create service (admin only)
POST /services
Headers: Authorization: Bearer {token}
Body: Service
Response: Service

// Update service
PUT /services/:id
Headers: Authorization: Bearer {token}
Body: Partial<Service>
Response: Service

// Delete service
DELETE /services/:id
Headers: Authorization: Bearer {token}
Response: { message: string }

// Reorder services
PATCH /services/reorder
Headers: Authorization: Bearer {token}
Body: {
  services: Array<{ id: string; orderIndex: number }>;
}
Response: { message: string }

// ===== TESTIMONIALS =====

// List testimonials
GET /testimonials
Query params: featured?: boolean, active?: boolean
Response: Testimonial[]

// Create testimonial
POST /testimonials
Headers: Authorization: Bearer {token}
Body: Testimonial
Response: Testimonial

// Update testimonial
PUT /testimonials/:id
Headers: Authorization: Bearer {token}
Body: Partial<Testimonial>
Response: Testimonial

// Delete testimonial
DELETE /testimonials/:id
Headers: Authorization: Bearer {token}
Response: { message: string }

// ===== FAQs =====

// List FAQs
GET /faqs
Query params: category?: string, active?: boolean
Response: FAQ[]

// Create FAQ
POST /faqs
Headers: Authorization: Bearer {token}
Body: FAQ
Response: FAQ

// Update FAQ
PUT /faqs/:id
Headers: Authorization: Bearer {token}
Body: Partial<FAQ>
Response: FAQ

// Delete FAQ
DELETE /faqs/:id
Headers: Authorization: Bearer {token}
Response: { message: string }

// Mark FAQ as helpful
POST /faqs/:id/helpful
Response: { helpfulCount: number }

// ===== CLIENT LOGOS =====

// List clients
GET /clients
Query params: active?: boolean, featured?: boolean
Response: Client[]

// Create client
POST /clients
Headers: Authorization: Bearer {token}
Body: Client
Response: Client

// Update client
PUT /clients/:id
Headers: Authorization: Bearer {token}
Body: Partial<Client>
Response: Client

// Delete client
DELETE /clients/:id
Headers: Authorization: Bearer {token}
Response: { message: string }

// ===== STATS =====

// Get all stats
GET /stats
Response: Stat[]

// Update stat
PUT /stats/:id
Headers: Authorization: Bearer {token}
Body: Partial<Stat>
Response: Stat

// ===== NEWSLETTER =====

// Subscribe to newsletter
POST /newsletter/subscribe
Body: {
  email: string;
  name?: string;
}
Response: {
  message: string;
}

// Unsubscribe
POST /newsletter/unsubscribe
Body: {
  email: string;
}
Response: {
  message: string;
}

// List subscribers (admin only)
GET /newsletter/subscribers
Headers: Authorization: Bearer {token}
Query params: page?, limit?, active?
Response: {
  subscribers: Subscriber[];
  pagination: Pagination;
}

// Export subscribers (admin only)
GET /newsletter/subscribers/export
Headers: Authorization: Bearer {token}
Response: CSV file

// ===== CONTACT =====

// Submit contact form
POST /contact
Body: {
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}
Response: {
  message: string;
}

// List contact submissions (admin only)
GET /contact/submissions
Headers: Authorization: Bearer {token}
Query params: status?, page?, limit?
Response: {
  submissions: ContactSubmission[];
  pagination: Pagination;
}

// Get single submission
GET /contact/:id
Headers: Authorization: Bearer {token}
Response: ContactSubmission

// Update submission status
PUT /contact/:id/status
Headers: Authorization: Bearer {token}
Body: {
  status: 'new' | 'read' | 'replied' | 'closed' | 'spam';
}
Response: ContactSubmission

// Respond to submission
POST /contact/:id/respond
Headers: Authorization: Bearer {token}
Body: {
  response: string;
}
Response: {
  message: string;
}

// ===== SEARCH =====

// Full-text search
GET /search
Query params:
  - q: string (search query)
  - type?: 'projects' | 'services' | 'faqs'
  - limit?: number
Response: {
  results: Array<Project | Service | FAQ>;
  total: number;
}
```

### Media Service

```typescript
// Base URL: /api/v1/media

// Upload single file
POST /upload
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData with 'file' field
Response: {
  id: string;
  filename: string;
  url: string;
  cdnUrl: string;
  thumbnailUrl: string;
  variants: {
    small: string;
    medium: string;
    large: string;
  };
}

// Upload multiple files
POST /upload/multiple
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData with multiple 'files'
Response: {
  files: MediaFile[];
}

// Upload from URL
POST /upload/url
Headers: Authorization: Bearer {token}
Body: {
  url: string;
  filename?: string;
}
Response: MediaFile

// List media
GET /
Headers: Authorization: Bearer {token}
Query params:
  - page?: number
  - limit?: number
  - type?: 'image' | 'video' | 'document'
  - category?: string
  - search?: string
Response: {
  files: MediaFile[];
  pagination: Pagination;
}

// Get single media
GET /:id
Headers: Authorization: Bearer {token}
Response: MediaFile

// Update media metadata
PUT /:id
Headers: Authorization: Bearer {token}
Body: {
  altText?: string;
  title?: string;
  caption?: string;
}
Response: MediaFile

// Delete media (soft delete)
DELETE /:id
Headers: Authorization: Bearer {token}
Response: { message: string }

// Restore deleted media
POST /:id/restore
Headers: Authorization: Bearer {token}
Response: MediaFile

// Permanently delete
DELETE /:id/permanent
Headers: Authorization: Bearer {token}
Response: { message: string }

// Optimize image
POST /:id/optimize
Headers: Authorization: Bearer {token}
Response: MediaFile

// Resize image
POST /:id/resize
Headers: Authorization: Bearer {token}
Body: {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
}
Response: MediaFile

// Search media
GET /search
Headers: Authorization: Bearer {token}
Query params: q: string
Response: MediaFile[]

// Get unused media
GET /unused
Headers: Authorization: Bearer {token}
Response: MediaFile[]

// Folder management
GET /folders
POST /folders
PUT /folders/:id
DELETE /folders/:id

// Tag management
GET /tags
POST /tags
POST /:id/tags
DELETE /:id/tags/:tagId
```

---

## 📊 REQUEST/RESPONSE FORMATS

### Standard Response Format

```typescript
// Success Response
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful",
  "timestamp": "2026-02-04T00:00:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-02-04T00:00:00Z"
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Common Data Types

```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Project
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  published: boolean;
  clientName?: string;
  clientLogoUrl?: string;
  year?: number;
  duration?: string;
  technologies: string[];
  metrics?: Record<string, string>;
  images: {
    hero: string;
    gallery: string[];
    thumbnail: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// More types in documentation...
```

---

## ⚠️ ERROR HANDLING

### Error Codes

```typescript
// Authentication Errors
'AUTH_REQUIRED'           // 401
'AUTH_INVALID_TOKEN'      // 401
'AUTH_TOKEN_EXPIRED'      // 401
'AUTH_INVALID_CREDENTIALS'// 401
'AUTH_FORBIDDEN'          // 403

// Validation Errors
'VALIDATION_ERROR'        // 422
'MISSING_REQUIRED_FIELD'  // 422
'INVALID_FORMAT'          // 422

// Resource Errors
'RESOURCE_NOT_FOUND'      // 404
'RESOURCE_ALREADY_EXISTS' // 409
'RESOURCE_CONFLICT'       // 409

// Rate Limiting
'RATE_LIMIT_EXCEEDED'     // 429

// Server Errors
'INTERNAL_SERVER_ERROR'   // 500
'SERVICE_UNAVAILABLE'     // 503
```

### Error Response Examples

```typescript
// Validation Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for the request",
    "details": [
      {
        "field": "email",
        "message": "Email is required",
        "value": ""
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "value": "short"
      }
    ]
  },
  "timestamp": "2026-02-04T00:00:00Z"
}

// Not Found Error
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project with slug 'invalid-slug' not found",
    "resource": "project",
    "identifier": "invalid-slug"
  },
  "timestamp": "2026-02-04T00:00:00Z"
}

// Rate Limit Error
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60, // seconds
    "limit": 100,
    "remaining": 0
  },
  "timestamp": "2026-02-04T00:00:00Z"
}
```

---

## 🚦 RATE LIMITING

### Rate Limits by Endpoint Type

```typescript
const rateLimits = {
  // Public endpoints (no auth)
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
  
  // Authenticated users
  authenticated: {
    windowMs: 15 * 60 * 1000,
    max: 1000,
  },
  
  // Admin users
  admin: {
    windowMs: 15 * 60 * 1000,
    max: 5000,
  },
  
  // Specific endpoints
  auth: {
    login: {
      windowMs: 15 * 60 * 1000,
      max: 5, // 5 login attempts per 15 minutes
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 registrations per hour
    },
  },
  
  upload: {
    windowMs: 60 * 60 * 1000,
    max: 50, // 50 uploads per hour
  },
};
```

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707024900
```

---

## 🔄 VERSIONING STRATEGY

### URL Versioning

```typescript
// Current version
/api/v1/projects

// Future version (with breaking changes)
/api/v2/projects

// Version in header (alternative)
GET /api/projects
Headers:
  Accept: application/vnd.asagus.v1+json
```

### Version Lifecycle

```
v1 (Current)    →   v2 (New)      →   v1 (Deprecated)  →   v1 (Sunset)
                    6 months              12 months            Remove
```

---

## ✅ BEST PRACTICES

### Security

1. **Always use HTTPS in production**
2. **Validate all inputs** (use Zod or similar)
3. **Sanitize outputs** (prevent XSS)
4. **Use parameterized queries** (prevent SQL injection)
5. **Implement rate limiting**
6. **Log all security events**
7. **Regular security audits**

### Performance

1. **Use caching aggressively** (Redis)
2. **Implement pagination** (never return all data)
3. **Use database indexes**
4. **Optimize N+1 queries**
5. **Enable compression** (gzip)
6. **Use CDN for assets**

### Monitoring

1. **Log all requests** (with correlation IDs)
2. **Track response times**
3. **Monitor error rates**
4. **Set up alerts**
5. **Use distributed tracing**

### Documentation

1. **Keep API docs up to date**
2. **Include examples for every endpoint**
3. **Document error codes**
4. **Provide Postman collection**
5. **Auto-generate from code** (Swagger/OpenAPI)

---

## 📦 COMPLETE API COLLECTION

### Postman Collection Structure

```json
{
  "info": {
    "name": "ASAGUS API",
    "version": "1.0.0"
  },
  "folders": [
    {
      "name": "Authentication",
      "requests": ["Login", "Register", "Logout", "Refresh Token", ...]
    },
    {
      "name": "Content",
      "folders": [
        {"name": "Projects", "requests": [...]},
        {"name": "Services", "requests": [...]},
        {"name": "Testimonials", "requests": [...]},
        {"name": "FAQs", "requests": [...]}
      ]
    },
    {
      "name": "Media",
      "requests": [...]
    },
    {
      "name": "Analytics",
      "requests": [...]
    }
  ]
}
```

---

**This completes your API specification! Use this as a reference when building your microservices.** 🚀

