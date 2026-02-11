# ASAGUS - AI, Cybersecurity & Web Development Solutions

A production-ready, modern Next.js platform with a complete microservices-based admin panel for managing content, analytics, users, and more.

---

## 🚀 Quick Start (Run from root)

### ✅ Database is Ready!
Your PostgreSQL database is already set up with:
- All tables created
- Roles & permissions configured
- Admin user seeded

### Run the Application
```bash
# Run everything together
pnpm dev:all              # Main site + Admin panel + All services

# OR run separately
pnpm dev                  # Main site only → http://localhost:3000
pnpm dev:admin            # Admin panel only → http://localhost:3001
```

### 🔑 Admin Login
- **URL:** http://localhost:3001
- **Email:** admin@asagus.com
- **Password:** Admin@2026Secure!

### All Commands
| Command | What It Does |
|---------|-------------|
| `pnpm install:all` | Install all dependencies |
| `pnpm dev` | Main website only (port 3000) |
| `pnpm dev:all` | Everything together |
| `pnpm admin:docker` | Start Docker containers |
| `pnpm admin:db` | Setup database + seed |
| `pnpm build:all` | Build for production |

---

## 🏗️ Project Structure

```
ASAGUS/
├── app/                  # Main website (Next.js 16)
├── components/           # UI components
├── admin-panel/          # Microservices admin (separate)
│   ├── services/         # Auth, Content, Analytics services
│   ├── frontend/         # Admin dashboard (Next.js 15)
│   └── packages/         # Shared DB & types
└── README.md (you are here)
```

---

## 🎨 Design Features

- **Brand Colors**: Blue (#1D4DF1), Black (#000000), White (#FFFFFF)
- **Typography**: Audiowide (display), PT Sans Caption (body)
- **Animations**: Framer Motion for smooth interactions
- **Theming**: Dark/Light mode with next-themes
- **Responsive**: Optimized for all devices (mobile, tablet, desktop)

## 📋 Pages & Sections

### Homepage
1. **Hero Section** - Animated introduction with pulsing glow and stats
2. **Projects Section** - Featured projects with links to case studies
3. **Client Logos** - Infinite scrolling carousel of trusted clients
4. **About Section** - Services and agency approach
5. **Testimonials Section** - Client reviews with ratings and stats
6. **FAQ Section** - Accordion with 8 common questions
7. **Newsletter Section** - Email subscription with validation
8. **Contact Section** - Form with validation and email delivery
9. **Footer** - Social links and legal pages

### Additional Pages
10. **Portfolio** (`/portfolio`) - Filterable project grid with search
11. **Project Case Studies** (`/projects/[slug]`) - Detailed project pages with metrics, challenges, solutions, and testimonials
12. **Privacy Policy** (`/privacy`) - Comprehensive privacy page
13. **Terms of Service** (`/terms`) - Legal terms page

### Features
- **Scroll Progress Bar** - Visual reading progress indicator
- **Live Chat** - Crisp chat widget integration (optional)

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Installation

1. Clone the repository or navigate to the project:
```bash
cd c:\Users\user\Desktop\hinx
```

2. Install dependencies (already done):
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Resend API key (get it from https://resend.com)
   - Add the email address to receive contact form and newsletter submissions
   - (Optional) Add Google Analytics Measurement ID

```env
RESEND_API_KEY=your_actual_api_key
CONTACT_EMAIL=your-email@example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🏃‍♂️ Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

This project is optimized for Vercel deployment:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `NEXT_PUBLIC_GA_ID` (optional)
4. Deploy!

See `DEPLOYMENT.md` for detailed deployment instructions.

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## 📝 Project Structure

```
hinx/
├── app/
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form API endpoint
│   │   └── newsletter/
│   │       └── route.ts          # Newsletter API endpoint
│   ├── privacy/
│   │   └── page.tsx              # Privacy Policy page
│   ├── terms/
│   │   └── page.tsx              # Terms of Service page
│   ├── layout.tsx                # Root layout with fonts & theme
│   ├── page.tsx                  # Main page (all sections)
│   ├── globals.css               # Global styles & CSS variables
│   ├── sitemap.ts                # SEO sitemap
│   └── manifest.ts               # PWA manifest
├── components/
│   ├── hero-section.tsx          # Hero with animations
│   ├── projects-section.tsx      # Projects grid
│   ├── about-section.tsx         # About & services
│   ├── testimonials-section.tsx  # Client testimonials
│   ├── faq-section.tsx           # FAQ accordion
│   ├── newsletter-section.tsx    # Email subscription
│   ├── contact-section.tsx       # Contact form with validation
│   ├── footer.tsx                # Footer with legal links
│   ├── analytics.tsx             # Google Analytics
│   ├── toast.tsx                 # Notification system
│   ├── spinner.tsx               # Loading indicator
│   ├── theme-toggle.tsx          # Dark/Light mode switch
│   ├── theme-provider.tsx        # Theme context provider
│   ├── button.tsx                # Reusable button component
│   └── section.tsx               # Section wrapper component
├── lib/
│   └── validation.ts             # Form validation utilities
├── public/                       # Static assets
├── .env.local                    # Environment variables (not in git)
├── .env.local.example            # Environment template
├── tailwind.config.js            # Tailwind configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── README.md                     # This file
├── CONTENT_GUIDE.md              # Content customization guide
├── ANIMATIONS.md                 # Animation documentation
├── PERFORMANCE.md                # Performance optimization guide
├── DEPLOYMENT.md                 # Vercel deployment guide
└── PRE_DEPLOYMENT_CHECKLIST.md   # Pre-launch checklist
```

## 🎯 Content Customization

See `CONTENT_GUIDE.md` and `PRE_DEPLOYMENT_CHECKLIST.md` for comprehensive customization instructions.

### Quick Updates

Edit the respective component files:
- Hero: `components/hero-section.tsx`
- Projects: `components/projects-section.tsx`
- About: `components/about-section.tsx`
- Testimonials: `components/testimonials-section.tsx`
- FAQ: `components/faq-section.tsx`
- Newsletter: `components/newsletter-section.tsx`
- Contact: `components/contact-section.tsx`
- Footer: `components/footer.tsx`
- Privacy: `app/privacy/page.tsx`
- Terms: `app/terms/page.tsx`

### Adding Images

1. Place images in the `public/` folder
2. Import and use with Next.js Image component:
```tsx
import Image from 'next/image'

<Image 
  src="/your-image.jpg" 
  alt="Description"
  width={500}
  height={300}
/>
```

### Updating Colors

Edit `tailwind.config.js` and `app/globals.css` to change the color scheme.

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📧 Email Setup (Contact Form & Newsletter)

The contact form and newsletter use [Resend](https://resend.com) for email delivery:

1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@example.com
   ```
4. For production, verify your domain in Resend to send from your own domain

**Features:**
- Contact form sends inquiry details to your email
- Newsletter sends welcome email to subscriber + notification to you
- Both include validation and error handling

## ⚡ Performance Optimizations

- ✅ Next.js App Router for optimal loading
- ✅ Font optimization with `next/font`
- ✅ Image optimization with `next/image`
- ✅ Code splitting and lazy loading
- ✅ CSS variables for theming
- ✅ Reduced motion support for accessibility
- ✅ SEO optimized with sitemap and metadata
- ✅ PWA manifest for mobile installation
- ✅ Optimized animations with Framer Motion

See `PERFORMANCE.md` for detailed optimization guide.

## 🌙 Theme Toggle

The theme toggle button (top-right) allows users to switch between dark and light modes. The preference is saved in localStorage.

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Animation Features

- Hero pulsing glow effect
- Scroll progress indicator with spring physics
- Infinite client logo carousel
- Scroll-triggered section animations
- Smooth section navigation
- Card hover transitions
- FAQ accordion animations
- Portfolio filter transitions
- Form validation feedback
- Toast notifications
- Loading spinners

See `ANIMATIONS.md` for technical details.

## 🔐 Security & Validation

- Client-side form validation with error messages
- Server-side validation for all form submissions
- Email format validation (regex)
- Phone number validation
- Required field validation
- XSS protection with email sanitization
- Environment variables for sensitive data
- Rate limiting ready (add Upstash Redis if needed)

## ✅ Development Status

### Phase 1 - Core Features (Complete)
- ✅ Next.js project setup with TypeScript
- ✅ Tailwind CSS configuration
- ✅ Custom fonts (Audiowide, PT Sans Caption)
- ✅ Brand colors implementation
- ✅ Hero section with animations
- ✅ Projects section
- ✅ About section
- ✅ Contact form with Resend integration
- ✅ Theme toggle (dark/light mode)

### Phase 2 - Enhanced UX (Complete)
- ✅ Advanced animations (pulsing glow, scroll-triggered)
- ✅ Footer with social links
- ✅ Toast notification system
- ✅ Loading spinner component
- ✅ SEO optimization (sitemap, metadata)
- ✅ PWA manifest
- ✅ Accessibility improvements
- ✅ Comprehensive documentation

### Phase 3 - Professional Features (Complete)
- ✅ Google Analytics integration
- ✅ Testimonials section
- ✅ FAQ accordion
- ✅ Enhanced form validation
- ✅ Newsletter subscription
- ✅ Privacy Policy page
- ✅ Terms of Service page
- ✅ Footer legal links

### Phase 4 - Advanced Features (Complete)
- ✅ Dynamic project case study pages
- ✅ Portfolio page with filtering and search
- ✅ Client logo carousel with infinite scroll
- ✅ Live chat integration (Crisp)
- ✅ Scroll progress indicator
- ✅ Enhanced navigation and internal linking

**Status:** 🚀 Feature Complete & Production Ready!

## 📚 Documentation

- **README.md** - This file (project overview)
- **CONTENT_GUIDE.md** - How to customize all content
- **ANIMATIONS.md** - Animation system documentation
- **PERFORMANCE.md** - Performance optimization guide
- **DEPLOYMENT.md** - Vercel deployment guide
- **PRE_DEPLOYMENT_CHECKLIST.md** - Pre-launch checklist

## 🚀 Quick Start

1. Install dependencies: `npm install`
2. Set up `.env.local` with Resend API key
3. Run development server: `npm run dev`
4. Customize content (see CONTENT_GUIDE.md)
5. Deploy to Vercel (see DEPLOYMENT.md)

## 📄 License

This project is built for Brand Alchemy. All rights reserved.

## 🆘 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using Next.js 15 + TypeScript + Tailwind CSS + Framer Motion**
