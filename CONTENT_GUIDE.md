# Content Customization Guide

This guide will help you update the website content quickly and easily.

## 📝 Text Content

### Hero Section
**File**: `components/hero-section.tsx`

**Brand Name** (Line ~23):
```tsx
<h1 className="font-display...">
  Brand Alchemy  // Change this to your agency name
</h1>
```

**Tagline** (Lines ~30-34):
```tsx
<span className="text-brand-blue">WE CREATE BRANDS</span>
<span className="text-white">THAT PEOPLE WANT</span>
<span className="text-brand-blue">TALK ABOUT</span>
```

**Description** (Line ~42):
```tsx
We combine creativity with a scientific approach...
// Update with your unique value proposition
```

**Statistics** (Lines ~73-87):
- **+8** years experience → Update to your years
- **+156** projects → Update to your project count
- **+$12** million → Update to your value metric

### Projects Section
**File**: `components/projects-section.tsx`

**Projects Array** (Lines ~9-36):
```tsx
const projects = [
  {
    id: 1,
    title: 'Your Project Name',
    category: 'Service Category',
    description: 'Project description...',
    tags: ['Tech1', 'Tech2', 'Tech3'],
  },
  // Add more projects...
]
```

**To add a new project**:
1. Copy an existing project object
2. Change the `id` to next number
3. Update all fields
4. Add relevant technology tags

### About Section
**File**: `components/about-section.tsx`

**Services** (Lines ~9-18):
Update the service names and icons:
```tsx
const services = [
  { name: 'Your Service', icon: '🎯' },
  // Add or modify services
]
```

**Our Approach** (Lines ~27-32):
```tsx
<p className="text-lg...">
  We combine creativity...  // Update your approach
</p>
```

**Our Goal** (Lines ~38-45):
```tsx
<p className="text-gray-600...">
  Using creative and innovative...  // Update your goal
</p>
```

**Our Mission** (Lines ~48-54):
```tsx
<p className="text-gray-600...">
  To help businesses unlock...  // Update your mission
</p>
```

### Contact Section
**File**: `components/contact-section.tsx`

**Social Links** (Lines ~52-58):
```tsx
const socialLinks = [
  { name: 'FACEBOOK', url: 'https://facebook.com/yourpage' },
  { name: 'TWITTER', url: 'https://twitter.com/yourhandle' },
  // Update with your actual social media URLs
]
```

### Footer
**File**: `components/footer.tsx`

**Footer Links** (Lines ~8-29):
```tsx
const footerLinks = {
  company: [
    { label: 'About Us', href: '#about' },
    // Add or modify links
  ],
  services: [
    { label: 'Brand Strategy', href: '#' },
    // Add or modify services
  ],
  social: [
    { label: 'Facebook', href: 'https://facebook.com/yourpage' },
    // Add actual URLs
  ],
}
```

## 🎨 Brand Colors

**File**: `tailwind.config.js`

```js
colors: {
  brand: {
    blue: '#1D4DF1',    // Primary color
    black: '#000000',   // Dark mode background
    white: '#FFFFFF',   // Light mode background
  },
}
```

**File**: `app/globals.css`

```css
:root {
  --brand-blue: #1D4DF1;    // Update primary color
  --brand-black: #000000;
  --brand-white: #FFFFFF;
}
```

## 🖼️ Images

### Adding Project Images

1. Place images in `public/images/projects/`
2. Update project objects in `components/projects-section.tsx`:

```tsx
{
  id: 1,
  title: 'Project Name',
  image: '/images/projects/project-1.jpg',  // Add this
  // ... rest of fields
}
```

3. Display in component:
```tsx
import Image from 'next/image'

<Image 
  src={project.image} 
  alt={project.title}
  width={600}
  height={400}
  className="rounded-lg"
/>
```

### Logo

Place your logo in `public/`:
```
public/
  └── logo.svg (or .png)
```

Update in hero or navigation:
```tsx
<Image src="/logo.svg" alt="Brand Logo" width={150} height={50} />
```

## 📧 Email Configuration

**File**: `.env.local`

```env
RESEND_API_KEY=re_your_actual_key_here
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=hello@yourdomain.com
```

**Get Resend API Key**:
1. Sign up at https://resend.com
2. Verify your email
3. Go to API Keys section
4. Create new API key
5. Copy and paste into `.env.local`

**For production**:
1. Verify your domain in Resend
2. Update `FROM_EMAIL` to use your domain
3. Set environment variables in Vercel

## 📄 SEO & Metadata

**File**: `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "Your Agency - Your Tagline",
  description: "Your compelling description...",
  keywords: ["keyword1", "keyword2", "keyword3"],
  // Update all metadata fields
}
```

**File**: `app/sitemap.ts`

```tsx
const baseUrl = 'https://yourdomain.com'  // Update with your domain
```

**File**: `public/robots.txt`

```txt
Sitemap: https://yourdomain.com/sitemap.xml  // Update domain
```

## 🌐 Social Media Meta Tags

**File**: `app/layout.tsx`

```tsx
openGraph: {
  title: "Your Agency Name",
  description: "Your description",
  url: "https://yourdomain.com",
  // Add your domain and details
},
twitter: {
  card: "summary_large_image",
  title: "Your Agency Name",
  creator: "@yourhandle",  // Update Twitter handle
},
```

## 📱 PWA Settings

**File**: `app/manifest.ts`

```tsx
return {
  name: 'Your Agency - Full Name',
  short_name: 'Your Agency',
  description: 'Your description...',
  // Update all fields
}
```

## 🎯 Quick Checklist

Before going live, update:

- [ ] Hero brand name and tagline
- [ ] Statistics (years, projects, value)
- [ ] Project portfolio items
- [ ] Service offerings
- [ ] About section text
- [ ] Social media links (all occurrences)
- [ ] Footer links and copyright
- [ ] Email configuration (.env.local)
- [ ] SEO metadata (title, description, keywords)
- [ ] Domain in sitemap and robots.txt
- [ ] Twitter/Facebook handles in metadata
- [ ] Brand colors (if different)
- [ ] Logo image
- [ ] Project images

## 💡 Tips

### Adding New Sections

1. Create new component in `components/`
2. Import and add to `app/page.tsx`:
```tsx
import { NewSection } from "@/components/new-section"

// In component:
<NewSection />
```

### Changing Color Scheme

1. Update `tailwind.config.js` colors
2. Update CSS variables in `app/globals.css`
3. Search and replace color references if needed

### Adding Blog or Case Studies

Create new routes:
```
app/
  └── blog/
      ├── page.tsx        // Blog list
      └── [slug]/
          └── page.tsx    // Individual post
```

## 🆘 Common Questions

**Q: How do I change fonts?**
A: Update in `app/layout.tsx`, replace font imports and variables.

**Q: How do I add more pages?**
A: Create new folders in `app/` directory (Next.js App Router).

**Q: How do I modify animations?**
A: Edit Framer Motion properties in component files.

**Q: Contact form not working?**
A: Check `.env.local` has correct `RESEND_API_KEY` and `TO_EMAIL`.

**Q: How do I add Google Analytics?**
A: Add tracking code to `app/layout.tsx` using `next/script`.

---

**Need help?** Check:
- `README.md` for setup instructions
- `DEPLOYMENT.md` for deployment guide
- Next.js docs: https://nextjs.org/docs
