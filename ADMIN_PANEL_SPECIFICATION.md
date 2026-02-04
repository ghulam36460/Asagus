# 🎨 ASAGUS ADMIN PANEL - COMPLETE SPECIFICATION

**Version:** 1.0  
**Date:** February 2026  
**Purpose:** Comprehensive admin panel with full content management capabilities

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Dashboard Features](#dashboard-features)
4. [Content Management Modules](#content-management-modules)
5. [Page Builder](#page-builder)
6. [Media Library](#media-library)
7. [Analytics & Reports](#analytics--reports)
8. [Settings & Configuration](#settings--configuration)
9. [User Interface Design](#user-interface-design)
10. [API Integration](#api-integration)

---

## 🎯 OVERVIEW

### Purpose

The ASAGUS Admin Panel is a comprehensive content management system that allows complete customization of:
- Website content (projects, services, testimonials, FAQs)
- Dynamic page creation and editing
- Media management
- User management
- Analytics and reporting
- System configuration

### Technology Stack

```typescript
// Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/ui components
- React Hook Form + Zod validation
- React Query (TanStack Query) for data fetching
- Zustand for global state management
- TanStack Table for data grids
- Recharts for analytics visualization

// Authentication
- JWT tokens (access + refresh)
- Role-based access control (RBAC)
- Session management via Redis

// Deployment
- Azure Static Web Apps
- Domain: admin.asagus.com
```

---

## 👥 USER ROLES & PERMISSIONS

### Role Hierarchy

```
Super Admin (Full Access)
├── Admin (Most Access)
│   ├── Editor (Content Only)
│   │   └── Viewer (Read Only)
```

### Detailed Permissions Matrix

| Feature | Super Admin | Admin | Editor | Viewer |
|---------|-------------|-------|--------|--------|
| **Projects** |
| View projects | ✅ | ✅ | ✅ | ✅ |
| Create projects | ✅ | ✅ | ✅ | ❌ |
| Edit projects | ✅ | ✅ | ✅ | ❌ |
| Delete projects | ✅ | ✅ | ❌ | ❌ |
| Publish projects | ✅ | ✅ | ✅ | ❌ |
| **Services** |
| View services | ✅ | ✅ | ✅ | ✅ |
| Create services | ✅ | ✅ | ✅ | ❌ |
| Edit services | ✅ | ✅ | ✅ | ❌ |
| Delete services | ✅ | ✅ | ❌ | ❌ |
| **Testimonials** |
| View testimonials | ✅ | ✅ | ✅ | ✅ |
| Create testimonials | ✅ | ✅ | ✅ | ❌ |
| Edit testimonials | ✅ | ✅ | ✅ | ❌ |
| Delete testimonials | ✅ | ✅ | ❌ | ❌ |
| **FAQs** |
| View FAQs | ✅ | ✅ | ✅ | ✅ |
| Create FAQs | ✅ | ✅ | ✅ | ❌ |
| Edit FAQs | ✅ | ✅ | ✅ | ❌ |
| Delete FAQs | ✅ | ✅ | ❌ | ❌ |
| **Page Builder** |
| View pages | ✅ | ✅ | ✅ | ✅ |
| Create pages | ✅ | ✅ | ✅ | ❌ |
| Edit pages | ✅ | ✅ | ✅ | ❌ |
| Delete pages | ✅ | ✅ | ❌ | ❌ |
| Publish pages | ✅ | ✅ | ✅ | ❌ |
| **Media Library** |
| View media | ✅ | ✅ | ✅ | ✅ |
| Upload media | ✅ | ✅ | ✅ | ❌ |
| Edit media | ✅ | ✅ | ✅ | ❌ |
| Delete media | ✅ | ✅ | ❌ | ❌ |
| **Users** |
| View users | ✅ | ✅ | ❌ | ❌ |
| Create users | ✅ | ✅ | ❌ | ❌ |
| Edit users | ✅ | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ | ❌ |
| **Settings** |
| View settings | ✅ | ✅ | ❌ | ❌ |
| Edit settings | ✅ | ✅ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ |
| API keys | ✅ | ❌ | ❌ | ❌ |
| **Analytics** |
| View analytics | ✅ | ✅ | ✅ | ✅ |
| Export reports | ✅ | ✅ | ✅ | ❌ |
| **Contact & Newsletter** |
| View submissions | ✅ | ✅ | ✅ | ✅ |
| Respond to contacts | ✅ | ✅ | ✅ | ❌ |
| Delete submissions | ✅ | ✅ | ❌ | ❌ |
| Export subscribers | ✅ | ✅ | ❌ | ❌ |

---

## 📊 DASHBOARD FEATURES

### Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] ASAGUS Admin                    [Search] [Notifications] [Profile] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │  Total    │  │  Projects │  │   Page    │  │  Contact  │   │
│  │ Visitors  │  │ Published │  │   Views   │  │  Forms    │   │
│  │  12,543   │  │    45     │  │  125,432  │  │    23     │   │
│  │  ↑ 12.5%  │  │  ↑ 5      │  │  ↑ 8.2%   │  │  ↑ 3      │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│                                                                   │
│  ┌─────────────────────────────────┐  ┌─────────────────────┐  │
│  │  Traffic Overview (Last 30 Days)│  │  Recent Activities  │  │
│  │  [Line Chart]                   │  │  • Project updated  │  │
│  │                                 │  │  • New contact form │  │
│  │                                 │  │  • Media uploaded   │  │
│  └─────────────────────────────────┘  └─────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────┐  ┌─────────────────────┐  │
│  │  Top Pages                      │  │  Quick Actions      │  │
│  │  1. /projects/project-1  1,234  │  │  [+ New Project]    │  │
│  │  2. /services            987    │  │  [+ New Page]       │  │
│  │  3. /about               654    │  │  [Upload Media]     │  │
│  └─────────────────────────────────┘  └─────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Metrics Cards

1. **Total Visitors**
   - Current count
   - Percentage change from last period
   - Sparkline chart

2. **Published Projects**
   - Count of published projects
   - Recent changes
   - Quick link to projects page

3. **Page Views**
   - Total page views
   - Trending pages
   - Bounce rate

4. **Contact Forms**
   - Unread submissions
   - Response rate
   - Quick link to inbox

5. **Newsletter Subscribers**
   - Total subscribers
   - New subscribers this month
   - Unsubscribe rate

6. **Media Storage**
   - Storage used
   - Total files
   - Recent uploads

### Real-Time Features

```typescript
// WebSocket connection for real-time updates
const realtimeData = {
  activeVisitors: 23, // Currently on site
  recentPageViews: [
    { page: '/projects', timestamp: '2 seconds ago' },
    { page: '/services', timestamp: '5 seconds ago' },
  ],
  newContactForms: 1, // New unread
  systemStatus: 'operational', // or 'degraded', 'down'
};
```

---

## 📝 CONTENT MANAGEMENT MODULES

### 1. Projects Management

#### List View

```
┌─────────────────────────────────────────────────────────────────┐
│  Projects                                [+ New Project] [Export]│
├─────────────────────────────────────────────────────────────────┤
│  [Search...]  [Filter: All ▼]  [Sort: Date ▼]                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ☑ [Image] Project Title 1                    [Edit] [Delete]   │
│     Category: Web Development | Status: Published | Views: 1.2K │
│     Created: Jan 15, 2026                                        │
│                                                                   │
│  ☐ [Image] Project Title 2                    [Edit] [Delete]   │
│     Category: Mobile App | Status: Draft | Views: 0             │
│     Created: Jan 20, 2026                                        │
│                                                                   │
│  [Pagination: 1 2 3 ... 10]                                     │
└─────────────────────────────────────────────────────────────────┘
```

#### Create/Edit Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Create New Project                           [Save] [Preview]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Basic Information                                                │
│  ─────────────────                                               │
│  Title: [_________________________________]                       │
│  Slug: [_________________________________] (Auto-generated)       │
│  Category: [Web Development ▼]                                   │
│  Status: [○ Draft  ● Published]                                  │
│  Featured: [☑ Show on homepage]                                  │
│                                                                   │
│  Description                                                      │
│  ─────────────────                                               │
│  [Rich Text Editor with formatting tools]                        │
│                                                                   │
│  Client Information                                               │
│  ─────────────────                                               │
│  Client Name: [_________________________________]                 │
│  Industry: [Technology ▼]                                        │
│  Logo: [Upload] [Browse Media Library]                          │
│                                                                   │
│  Project Details                                                  │
│  ─────────────────                                               │
│  Year: [2026]  Duration: [3 months]  Team Size: [5]             │
│  Project URL: [_________________________________]                 │
│  GitHub URL: [_________________________________]                  │
│                                                                   │
│  Technologies                                                     │
│  ─────────────────                                               │
│  [+ Add Technology]                                              │
│  × Next.js  × React  × PostgreSQL  × TypeScript                  │
│                                                                   │
│  Media                                                            │
│  ─────────────────                                               │
│  Hero Image: [Upload] [Current: hero.jpg]                       │
│  Gallery: [Upload Multiple] [4 images uploaded]                 │
│                                                                   │
│  Case Study                                                       │
│  ─────────────────                                               │
│  Challenge: [Rich Text Editor]                                   │
│  Solution: [Rich Text Editor]                                    │
│  Outcome: [Rich Text Editor]                                     │
│                                                                   │
│  Metrics (Key Results)                                            │
│  ─────────────────                                               │
│  [+ Add Metric]                                                  │
│  • Conversions: [250%] increase                                  │
│  • Performance: [90] PageSpeed score                             │
│                                                                   │
│  SEO Settings                                                     │
│  ─────────────────                                               │
│  Meta Title: [_________________________________] (0/60 chars)     │
│  Meta Description: [___________________________] (0/160 chars)   │
│  OG Image: [Upload]                                              │
│                                                                   │
│  [Cancel] [Save as Draft] [Publish]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Features

- **Drag-and-drop image upload**
- **Auto-save every 30 seconds**
- **Preview before publish**
- **Version history** (rollback capability)
- **Duplicate project**
- **Bulk actions** (delete, publish, export)
- **Search and filter** (by category, status, date)
- **Sort** (by date, title, views, alphabetical)

### 2. Services Management

#### List View (Card Grid)

```
┌─────────────────────────────────────────────────────────────────┐
│  Services                                  [+ New Service]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ [Icon: Code] │  │ [Icon: Mobile]│  │ [Icon: Brain]│         │
│  │              │  │              │  │              │         │
│  │ Web Dev      │  │ Mobile Apps  │  │ AI/ML        │         │
│  │              │  │              │  │              │         │
│  │ ● Active     │  │ ● Active     │  │ ○ Inactive   │         │
│  │              │  │              │  │              │         │
│  │ [Edit] [↕]   │  │ [Edit] [↕]   │  │ [Edit] [↕]   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  [Drag to reorder]                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Create/Edit Form

- Title, subtitle, description
- Icon selection (searchable icon picker with 1000+ icons)
- Features list (add/remove/reorder)
- Process steps
- Deliverables
- Pricing information
- Related projects
- Order/position
- Active/Inactive toggle
- SEO settings

### 3. Testimonials Management

#### Features

- Client name, role, company
- Star rating (1-5)
- Testimonial content (rich text)
- Client avatar upload
- Link to related project
- Featured toggle
- Active/Inactive toggle
- Approval workflow

### 4. FAQs Management

#### Features

- Question & Answer (rich text)
- Category organization
- Related service link
- Reorderable list
- Analytics (view count, helpful votes)
- Active/Inactive toggle
- Bulk import from CSV
- Export to PDF

### 5. Client Logos Management

#### Grid View with Upload

- Drag-and-drop logo upload
- Automatic logo optimization
- Website link
- Industry categorization
- Related projects
- Display order
- Active/Inactive toggle

### 6. Stats Management

#### Features

- Label, value, suffix
- Description
- Icon selection
- Display order
- Active/Inactive toggle
- Used in About section

---

## 🎨 PAGE BUILDER

### Visual Page Builder Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Builder: Homepage                [Save] [Preview] [Publish]│
├─────────────────────────────────────────────────────────────────┤
│  Left Sidebar    │         Canvas          │    Right Sidebar    │
│  (Components)    │       (Preview)         │    (Settings)       │
├──────────────────┼─────────────────────────┼────────────────────┤
│                  │                         │                     │
│  [+ Add Block]   │  ┌───────────────────┐  │  Block Settings     │
│                  │  │  Hero Section     │  │  ───────────────   │
│  Layouts:        │  │  [Image Bg]       │  │  Type: Hero        │
│  • Hero          │  │  Welcome to       │  │                    │
│  • Features      │  │  ASAGUS           │  │  Title:            │
│  • Services      │  │  [CTA Button]     │  │  [_____________]   │
│  • Testimonials  │  └───────────────────┘  │                    │
│  • CTA           │           ↕              │  Background:       │
│  • Footer        │  ┌───────────────────┐  │  [Upload Image]    │
│                  │  │  Features Grid    │  │                    │
│  Custom:         │  │  [Icon] [Icon]    │  │  Button Text:      │
│  • Text          │  │  [Icon] [Icon]    │  │  [_____________]   │
│  • Image         │  └───────────────────┘  │                    │
│  • Video         │           ↕              │  [Delete Block]    │
│  • Code          │  ┌───────────────────┐  │                    │
│                  │  │  [+ Add Block]    │  │                    │
│                  │  └───────────────────┘  │                    │
│                  │                         │                     │
└──────────────────┴─────────────────────────┴────────────────────┘
```

### Page Builder Features

#### Available Blocks

1. **Hero Sections** (5+ variants)
   - Full-screen hero with CTA
   - Split hero (text + image)
   - Video hero background
   - Animated gradient hero
   - Minimal hero

2. **Content Blocks**
   - Rich text editor
   - Two-column layout
   - Three-column layout
   - Accordion/FAQ
   - Tabs

3. **Media Blocks**
   - Image gallery
   - Video embed (YouTube, Vimeo)
   - Slider/Carousel
   - Before/After comparison

4. **Feature Blocks**
   - Icon grid (2, 3, 4 columns)
   - Feature list with images
   - Timeline
   - Process steps

5. **Testimonial Blocks**
   - Testimonial slider
   - Grid layout
   - Single testimonial spotlight

6. **CTA Blocks**
   - Centered CTA
   - Split CTA (text + form)
   - Banner CTA
   - Floating CTA

7. **Form Blocks**
   - Contact form
   - Newsletter signup
   - Custom form builder

8. **Advanced Blocks**
   - Pricing table
   - Team members
   - Logo cloud
   - Stats/Numbers
   - Code snippet (syntax highlighted)
   - Custom HTML/CSS

#### Block Customization Options

```typescript
// Each block can be customized:
{
  // Layout
  containerWidth: '1200px' | '100%' | 'custom',
  padding: { top: 80, bottom: 80, left: 20, right: 20 },
  margin: { top: 0, bottom: 0 },
  
  // Styling
  backgroundColor: '#ffffff',
  backgroundImage: 'url(...)',
  textColor: '#000000',
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  
  // Animation
  animation: 'fade-in' | 'slide-up' | 'none',
  animationDelay: 0,
  
  // Responsive
  hideOnMobile: false,
  hideOnTablet: false,
  hideOnDesktop: false,
  
  // Custom CSS
  customCSS: '/* Your custom styles */',
}
```

#### Page Management Features

- **Templates**: Pre-built page templates (Landing, About, Service, Contact)
- **Version History**: Save and restore previous versions
- **A/B Testing**: Create variants and track performance
- **SEO Preview**: See how page appears in Google
- **Mobile Preview**: Switch between desktop, tablet, mobile views
- **Performance Score**: Real-time performance metrics
- **Accessibility Check**: WCAG compliance checker
- **Schedule Publishing**: Set future publish date/time

