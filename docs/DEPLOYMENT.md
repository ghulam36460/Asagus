# Vercel Deployment Guide

## ✅ Phase 3 Complete - Ready for Production

All features have been implemented:
- ✅ Google Analytics integration
- ✅ Testimonials section with ratings
- ✅ FAQ accordion
- ✅ Enhanced form validation
- ✅ Newsletter subscription
- ✅ Privacy Policy page
- ✅ Terms of Service page
- ✅ Footer links to legal pages

## Prerequisites

1. GitHub/GitLab/Bitbucket account
2. Vercel account (sign up at https://vercel.com)
3. Resend API key (from https://resend.com)

## Step 1: Push to Git Repository

```bash
cd c:\Users\user\Desktop\hinx
git add .
git commit -m "Initial commit - Brand Alchemy website"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Step 2: Import to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=your-email@example.com
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (optional)
   ```

6. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? hinx (or your choice)
# Directory? ./
# Override settings? No

# Add environment variables
vercel env add RESEND_API_KEY
vercel env add CONTACT_EMAIL
vercel env add NEXT_PUBLIC_GA_ID

# Deploy to production
vercel --prod
```

## Step 3: Configure Resend (Important!)

### For Testing (Development)
- Use `onboarding@resend.dev` as FROM_EMAIL
- Limited to 1 email per day

### For Production (Recommended)
1. Verify your domain in Resend:
   - Go to https://resend.com/domains
   - Add your domain (e.g., `yourdomain.com`)
   - Add DNS records as instructed
   - Wait for verification

2. Update environment variables in Vercel:
   - Set verified domain email as sender
   - Emails are sent from "Brand Alchemy" with your domain

## Step 4: Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] Theme toggle works (dark/light mode)
- [ ] All sections are visible and responsive
- [ ] Contact form submits successfully with validation
- [ ] Newsletter subscription works
- [ ] Email arrives at CONTACT_EMAIL address
- [ ] Privacy and Terms pages load correctly
- [ ] FAQ accordion functions properly
- [ ] Testimonials section displays correctly
- [ ] Test on mobile devices
- [ ] Check performance with Lighthouse
- [ ] Verify SSL certificate is active
- [ ] Test Google Analytics tracking (if configured)

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key from Resend | `re_123abc...` |
| `CONTACT_EMAIL` | Where form/newsletter emails go | `hello@yourdomain.com` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID (optional) | `G-XXXXXXXXXX` |

## Vercel Configuration File (Optional)

Create `vercel.json` if you need custom configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "RESEND_API_KEY": "@resend-api-key",
    "CONTACT_EMAIL": "@contact-email",
    "NEXT_PUBLIC_GA_ID": "@ga-id"
  }
}
```

## Custom Domain Setup

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed:
   - **A Record**: Point to Vercel's IP
   - **CNAME**: Point to `cname.vercel-dns.com`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Review build logs in Vercel dashboard

### Contact Form Not Working
- Verify `RESEND_API_KEY` is set correctly
- Check API key has proper permissions
- Ensure `CONTACT_EMAIL` is valid
- Check Vercel function logs for errors
- Test with a simple email first

### Newsletter Not Working
- Same checks as contact form
- Verify welcome email template is correct
- Check Resend dashboard for delivery status

### Fonts Not Loading
- Fonts are optimized via `next/font` - no action needed
- Check that Google Fonts API is accessible

### Images Not Displaying
- Ensure images are in `public/` folder
- Use correct paths: `/image.jpg` (not `./public/image.jpg`)
- Configure `next.config.ts` if using external images

## Performance Tips

1. **Image Optimization**: Already using Next.js Image component
2. **Font Loading**: Already optimized with `next/font`
3. **Code Splitting**: Automatic with Next.js App Router
4. **Caching**: Configured by Vercel automatically

## Monitoring

### Vercel Analytics (Free)
Enable in project settings for:
- Page views
- Load times
- Core Web Vitals

### Vercel Speed Insights
Shows real user performance metrics

## Support

- Vercel Docs: https://vercel.com/docs
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs

## Quick Deploy Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Open project in browser
vercel open
```

---

**Note**: After first deployment, Vercel will automatically deploy on every git push to your main branch.
