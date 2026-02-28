# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Environment Setup (2 minutes)

Copy the example environment file and add your credentials:

```bash
cd c:\Users\user\Desktop\hinx
copy .env.local.example .env.local
```

Edit `.env.local` and add:
```env
RESEND_API_KEY=your_api_key_here
TO_EMAIL=your-email@example.com
```

**Get Resend API Key:**
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Navigate to API Keys
4. Create new key
5. Copy and paste into `.env.local`

### 2. Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Test the Website (2 minutes)

✅ **Check these features:**
- [ ] Hero section loads with animations
- [ ] Theme toggle (sun/moon icon) switches dark/light mode
- [ ] Smooth scroll to sections when clicking buttons
- [ ] Projects grid displays with hover effects
- [ ] About section shows services
- [ ] Contact form accepts input
- [ ] Form submission works (check your email!)

## 📝 Quick Customization

### Change Brand Name
Edit `components/hero-section.tsx`:
```tsx
<h1 className="font-display...">
  Your Brand Name  {/* Line 21 */}
</h1>
```

### Update Colors
Edit `tailwind.config.js`:
```js
colors: {
  brand: {
    blue: '#1D4DF1',  // Change this
    // ...
  }
}
```

### Add Your Projects
Edit `components/projects-section.tsx`:
```tsx
const projects = [
  {
    id: 1,
    title: 'Your Project',
    category: 'Category',
    description: 'Description here',
  },
  // Add more...
]
```

### Change Contact Email
Edit `.env.local`:
```env
TO_EMAIL=newemail@example.com
```

## 🎨 What's Included

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion animations
- ✅ Dark/Light mode
- ✅ Contact form with email
- ✅ Fully responsive
- ✅ SEO optimized
- ✅ Vercel-ready

## 🐛 Common Issues

### Port 3000 already in use
```bash
# Kill process and restart
npm run dev -- -p 3001
```

### Contact form not sending
- Check `.env.local` has correct `RESEND_API_KEY`
- Verify email in Resend dashboard
- Check browser console for errors

### Fonts not loading
- Clear browser cache
- Restart dev server
- Check internet connection (fonts load from Google)

## 📱 Test on Mobile

1. Find your local network IP:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address"

2. On mobile browser, visit:
   ```
   http://YOUR_IP:3000
   ```

## 🚢 Deploy Now

Ready to go live? See `DEPLOYMENT.md` for full guide.

Quick deploy:
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📚 Learn More

- Full README: `README.md`
- Deployment Guide: `DEPLOYMENT.md`
- Next.js Docs: https://nextjs.org/docs

## 🆘 Need Help?

Check these files:
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Deploy to Vercel
- `.env.local.example` - Environment variables template

---

**Pro Tip**: Use VS Code with these extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
