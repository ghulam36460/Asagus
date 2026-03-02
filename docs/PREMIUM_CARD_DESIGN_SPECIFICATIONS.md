# Premium Service/Feature Card Design Specifications
## Research from Top 10 Tech Websites (2025–2026)

> **Target stack**: Next.js 14+ / React 18+ / Tailwind CSS / Framer Motion  
> **Theme**: Dark-first (matching existing Asagus codebase)

---

## Table of Contents
1. [Stripe](#1-stripe)
2. [Linear](#2-linear)
3. [Vercel](#3-vercel)
4. [Raycast](#4-raycast)
5. [Arc Browser](#5-arc-browser)
6. [Resend](#6-resend)
7. [Clerk](#7-clerk)
8. [Supabase](#8-supabase)
9. [Planetscale / Neon](#9-planetscale--neon)
10. [Apple Developer](#10-apple-developer)
11. [SYNTHESIS — Top 5 Patterns Combined](#synthesis--the-ultimate-premium-card)
12. [Ready-to-Use CSS / Tailwind / Framer Code](#ready-to-use-implementation)

---

## 1. Stripe

### Card Dimensions & Layout
- **Card sizes**: Two tiers — large hero cards (~588×440px) and compact product cards (~384×320px)
- **Padding**: `32px 32px 0` (top/sides), illustration bleeds to bottom
- **Border-radius**: `16px` (2025 update from their previous 12px)
- **Grid gap**: `24px` between cards
- **Layout**: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))`

### Background Treatment
- **Base**: `#0A2540` (Stripe's signature dark navy) — NOT pure black
- **Card background**: Multi-layer:
  ```css
  background:
    linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 50%),
    rgba(15, 40, 70, 0.6);
  ```
- **Subtle noise texture**: SVG filter with `<feTurbulence baseFrequency="0.65" numOctaves="3" />` at 3-4% opacity
- **NO glassmorphism** — Stripe uses opaque surfaces with subtle gradients

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.08)`
- **Hover**: Animated gradient border using `conic-gradient` trick:
  ```css
  /* Outer wrapper approach */
  background: conic-gradient(from var(--angle), #635BFF, #80E9FF, #7A73FF, #635BFF);
  --angle: 0deg;
  animation: stripe-border-spin 3s linear infinite;
  padding: 1px;
  border-radius: 17px; /* parent = child radius + border width */
  ```
- **Hover glow**: `box-shadow: 0 8px 32px rgba(99, 91, 255, 0.15), 0 0 0 1px rgba(99, 91, 255, 0.2)`

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Category label | 12px / 0.75rem | 600 | `#80E9FF` | `0.08em` (uppercase) |
| Card title | 24px / 1.5rem | 600 | `#FFFFFF` | `-0.02em` |
| Description | 16px / 1rem | 400 | `rgba(255,255,255,0.65)` | `0em` |
| CTA link | 16px / 1rem | 500 | `#635BFF` | `0em` |
| Line-height | — | — | — | Body: 1.6, Headings: 1.25 |

### Hover Micro-Interactions
```css
.stripe-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s ease;
}
.stripe-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(99, 91, 255, 0.2);
}
```
- **CTA arrow**: `translateX(4px)` on hover with `transition: 0.2s ease`
- **Illustration**: Subtle `scale(1.02)` with `transition: 0.6s ease`

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary accent | `#635BFF` | CTAs, active borders, icon glow |
| Cyan accent | `#80E9FF` | Category labels, secondary highlights |
| Green accent | `#24B47E` | Success states, metric highlights |
| Surface dark | `#0A2540` | Card backgrounds |
| Text primary | `#FFFFFF` | Headings |
| Text secondary | `rgba(255,255,255,0.65)` | Body copy |

### Icon Treatment
- **Style**: Custom outline icons, 2px stroke, 20-24px
- **Glow effect**: `filter: drop-shadow(0 0 8px rgba(99, 91, 255, 0.5))`
- **Background pill**: `rgba(99, 91, 255, 0.12)` with `border: 1px solid rgba(99, 91, 255, 0.2)`, `border-radius: 8px`, `padding: 8px`

### Unique Elements
- **Product illustration** at bottom of card that bleeds into border radius with `overflow: hidden`
- **Animated number counters** on stat cards (count-up with easing)
- **Subtle parallax** on illustration layer (moves 2-3px on mouse)

---

## 2. Linear

### Card Dimensions & Layout
- **Card sizes**: Feature showcase cards ~480×380px; compact cards ~320×240px
- **Padding**: `24px` uniform (Linear loves consistency)
- **Border-radius**: `12px` — deliberately more conservative than peers
- **Grid gap**: `16px` (tighter than most competitors)
- **Layout**: Named CSS Grid areas with asymmetric sizes

### Background Treatment
- **Base page**: `#0A0A0A` (near-black, not navy)
- **Card background**: Single-layer, nearly flat:
  ```css
  background: rgba(255, 255, 255, 0.03);
  /* Alternatively: #141414 */
  ```
- **NO gradients on card surface** — Linear's philosophy is extreme restraint
- **Subtle inner shadow for depth**: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.06)` — barely visible
- **Hover**: `border-color: rgba(255, 255, 255, 0.12)` — SUBTLE increase only
- **NO animated borders** — this is Linear's signature: restraint

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Section label | 13px | 500 | `rgba(255,255,255,0.45)` | `0em` |
| Card title | 20px | 500 | `rgba(255,255,255,0.95)` | `-0.02em` |
| Description | 15px | 400 | `rgba(255,255,255,0.5)` | `0em` |
| **Font family** | Inter Variable | — | — | — |
| Line-height | — | — | — | Body: 1.55, Headings: 1.3 |

### Hover Micro-Interactions
```css
.linear-card {
  transition: background 0.2s ease, border-color 0.2s ease;
}
.linear-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}
/* NO transform, NO scale, NO translateY — Linear avoids these */
```
- **Content shifts**: None. Linear keeps cards static on hover.
- **Interactive elements inside**: Links get `color: #5E6AD2` on hover

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Brand violet | `#5E6AD2` | Active states, links, badges |
| Surface | `#141414` or `rgba(255,255,255,0.03)` | Card bg |
| Text primary | `rgba(255,255,255,0.95)` | Headings |
| Text secondary | `rgba(255,255,255,0.5)` | Body, labels |
| Text tertiary | `rgba(255,255,255,0.35)` | Metadata |
| Border | `rgba(255,255,255,0.06)` | Card borders |

### Unique Elements
- **Product screenshot embeds** are the centrepiece — cards frame real UI
- **Purple dot indicators** (`6px` circles) for status/type categorisation
- **Monospaced code snippets** inside feature cards
- **The "less is more" principle**: No shadows, no glow, no noise — purity

---

## 3. Vercel

### Card Dimensions & Layout
- **Bento grid**: Asymmetric, mixed sizes — `1×1 (320×320)`, `2×1 (664×320)`, `2×2 (664×664)`
- **Padding**: `24px` on standard, `32px` on hero-size cards
- **Border-radius**: `12px` uniform
- **Grid gap**: `24px`
- **Layout**: `grid-template-columns: repeat(4, 1fr)` with `grid-column: span 2` on wider cards

### Background Treatment
- **Base**: `#000000` (pure black — Vercel's signature)
- **Card background**:
  ```css
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.01)
  );
  ```
- **Spotlight effect** — radial gradient follows cursor on the entire grid:
  ```css
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.06),
    transparent 40%
  );
  ```

### Border Effects — **Shimmer Border** (Vercel's signature)
```css
/* The famous Vercel shimmer border technique */
.vercel-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Group-level shimmer that reveals on hover */
.vercel-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    250px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.12),
    transparent 60%
  );
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}
.vercel-grid:hover::before {
  opacity: 1;
}
```

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Eyebrow | 12px | 500 | `#888888` | `0.04em` (uppercase) |
| Card title | 20px | 600 | `#EDEDED` | `-0.02em` |
| Description | 14px | 400 | `#888888` | `0em` |
| Stat number | 48px | 700 | `#FFFFFF` | `-0.04em` |
| **Font family** | Geist (custom) | — | — | — |
| Line-height | — | — | — | Body: 1.6, Headings: 1.2 |

### Hover Micro-Interactions
```css
.vercel-card {
  transition: border-color 0.15s ease;
}
.vercel-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}
/* The shimmer is the interaction — not the card itself */
```

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Pure white | `#FFFFFF` | Key headings only |
| Foreground | `#EDEDED` | Primary text |
| Muted | `#888888` | Secondary text, descriptions |
| Surface | `rgba(255,255,255,0.04)` | Card bg |
| Border | `rgba(255,255,255,0.08)` | Default borders |
| Shimmer | `rgba(255,255,255,0.12)` | Hover border highlight |

### Unique Elements
- **Cursor-tracking shimmer across entire grid** — ALL card borders glow near cursor
- **Rainbow spectrum accent** on hero elements: `linear-gradient(90deg, #FF0080, #7928CA, #FF0080)`
- **Geist Mono** for code blocks, numbers, and terminal-style content
- **The triangle motif** as a recurring geometric element

---

## 4. Raycast

### Card Dimensions & Layout
- **Command cards**: ~400×200px (wide format, mimicking the app)
- **Feature cards**: ~360×420px (portrait)
- **Padding**: `20px 24px`
- **Border-radius**: `16px` (macOS-inspired, notably rounder)
- **Grid gap**: `20px`

### Background Treatment
- **Frosted glass** (their signature):
  ```css
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  ```
- **Inner glow layer**:
  ```css
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  ```
- **Grain overlay**: SVG noise at 5% opacity blended with `mix-blend-mode: overlay`

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.08)`
- **Hover**: `1px solid rgba(255, 255, 255, 0.14)`
- **Active/Featured**: Rainbow gradient border:
  ```css
  border-image: linear-gradient(135deg, #FF6363, #FFC531, #59D499, #56C2FF, #A78BFA) 1;
  /* Or using the pseudo-element trick for border-radius compatibility */
  ```

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Command name | 14px | 500 | `#FFFFFF` | `0em` |
| Description | 13px | 400 | `rgba(255,255,255,0.55)` | `0.01em` |
| Section title | 28px | 700 | `#FFFFFF` | `-0.03em` |
| Shortcut keys | 12px | 500 | `rgba(255,255,255,0.7)` | `0.02em` |
| **Font family** | Inter, SF Pro | — | — | — |

### Hover Micro-Interactions
```css
.raycast-card {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              background 0.2s ease,
              box-shadow 0.2s ease;
}
.raycast-card:hover {
  transform: translateY(-2px) scale(1.01);
  background: rgba(40, 40, 40, 0.8);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Red | `#FF6363` | Destructive actions, emoji accents |
| Yellow | `#FFC531` | Warnings, star/featured |
| Green | `#59D499` | Success, active |
| Blue | `#56C2FF` | Links, info |
| Purple | `#A78BFA` | AI features |
| Surface glass | `rgba(30,30,30,0.7)` | Card bg |

### Unique Elements
- **macOS-native feel**: Cards mimic actual macOS window panels
- **Keyboard shortcut badges**: `⌘K` styled as mini pill elements with `background: rgba(255,255,255,0.1)`, `border-radius: 4px`, `padding: 2px 6px`
- **Extension icons**: 32×32px with `border-radius: 8px` (app icon style)
- **Blue glass backdrop**: Featured areas use `rgba(56, 194, 255, 0.08)` as bg with blur

---

## 5. Arc Browser

### Card Dimensions & Layout
- **Feature cards**: ~420×380px (generous white space)
- **Padding**: `40px` (notably more than competitors)
- **Border-radius**: `24px` (the largest in this group — signature Arc boldness)
- **Grid gap**: `24px`

### Background Treatment
- **Bold solid colours** (Arc's signature — they use COLOUR, not glass):
  ```css
  /* Each card gets a distinct pastel/vivid background: */
  background: #F4E7FF;  /* Lavender */
  background: #E7F5FF;  /* Sky blue */
  background: #FFE7E7;  /* Rose pink */
  background: #E7FFE7;  /* Mint green */
  ```
- **Dark mode variant**: Shifts to deep saturated versions:
  ```css
  background: #1A0F2E;  /* Deep purple */
  background: #0F1A2E;  /* Deep blue */
  background: #2E0F1A;  /* Deep rose */
  ```

### Border Effects
- **Default**: `none` — Arc removes borders on coloured cards
- **Hover**: Subtle `box-shadow: 0 0 0 2px rgba(0,0,0,0.06)` (light) or `rgba(255,255,255,0.1)` (dark)
- **Focus ring**: `outline: 3px solid #007AFF; outline-offset: 2px`

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Card title | 28px | 700 | `#1A1A1A` (or white on dark) | `-0.03em` |
| Description | 17px | 400 | `rgba(0,0,0,0.7)` | `0em` |
| Badge text | 11px | 600 | accent colour | `0.06em` (uppercase) |
| **Font family** | Inter Variable | — | — | — |

### Hover Micro-Interactions
```css
.arc-card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), /* spring overshoot */
              box-shadow 0.35s ease;
}
.arc-card:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}
```

### Unique Elements
- **Colourful, opinionated cards** — the opposite of the dark-glass trend
- **Rounded everything**: 24px radius corners feel soft and approachable
- **Illustration-forward**: Large hero illustrations take 60% of card area
- **Playful spring overshoot** on hover: `cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## 6. Resend

### Card Dimensions & Layout
- **Feature cards**: ~560×400px (wide, cinematic)
- **Code preview cards**: ~480×320px
- **Padding**: `32px` with extra `48px` top on hero cards
- **Border-radius**: `16px`
- **Grid gap**: `24px`

### Background Treatment
- **Pure black base**: `#000000`
- **Card surface**: Near-black with ultra-subtle warm undertone:
  ```css
  background: #0A0A0A;
  /* Or: rgba(255, 255, 255, 0.02) */
  ```
- **Signature light ray**: Above-fold hero has a luminous vertical light ray:
  ```css
  background: radial-gradient(
    ellipse 200px 600px at 50% 0%,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  ```

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.06)`
- **Featured card**: `1px solid rgba(255, 255, 255, 0.1)`
- **Code block border**: `1px solid rgba(255, 255, 255, 0.08)` with syntax-highlighted interior

### Typography Hierarchy
| Element | Size | Weight | Color | Letter-spacing |
|---------|------|--------|-------|----------------|
| Card title | 24px | 600 | `#FFFFFF` | `-0.02em` |
| Description | 16px | 400 | `#A1A1AA` | `0em` |
| Code text | 14px | 400 | `#E4E4E7` (varies by syntax) | `0em` |
| **Font family** | Inter | — | — | — |
| **Code font** | JetBrains Mono / Fira Code | — | — | — |

### Hover Micro-Interactions
```css
.resend-card {
  transition: border-color 0.15s ease, box-shadow 0.3s ease;
}
.resend-card:hover {
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.03);
}
/* Resend is EXTREMELY minimal — micro-interactions are near-invisible */
```

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Brand accent | `#00A3FF` | CTAs, links |
| White | `#FFFFFF` | Headings |
| Gray 400 | `#A1A1AA` | Body text |
| Gray 800 | `#27272A` | Card background highlights |
| Surface | `#0A0A0A` | Primary background |

### Unique Elements
- **Code previews ARE the design** — syntax-highlighted blocks as hero content
- **Terminal-style animations**: Typing cursor, line-by-line reveal
- **SDK selector tabs** at top of feature cards
- **Monochrome minimalism** — colour is used only for the brand blue CTA

---

## 7. Clerk

### Card Dimensions & Layout
- **Auth showcase cards**: ~480×360px
- **Feature grid cards**: ~380×300px
- **Padding**: `28px`
- **Border-radius**: `16px`
- **Grid gap**: `20px`

### Background Treatment
- **Dual-mode design** (light and dark, both excellent):
  ```css
  /* Dark */
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  /* Light */
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
  ```
- **Purple radial glow** (signature, on featured cards):
  ```css
  background: radial-gradient(
    circle at 30% 20%,
    rgba(99, 91, 255, 0.08),
    transparent 60%
  );
  ```

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.08)`
- **Hover**: `1px solid rgba(107, 78, 255, 0.3)` (brand purple shift)

### Typography Hierarchy
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Card title | 22px | 600 | white or `#1A1523` |
| Description | 15px | 400 | `rgba(255,255,255,0.6)` |
| **Font** | Inter | — | — |

### Hover Micro-Interactions
```css
.clerk-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.clerk-card:hover {
  transform: translateY(-3px);
  border-color: rgba(107, 78, 255, 0.3);
  box-shadow: 0 16px 48px rgba(107, 78, 255, 0.1);
}
```

### Unique Elements
- **Live auth UI previews** embedded in cards (sign-in forms, user avatars)
- **"Powered by Clerk" badge** as social proof within cards
- **Purple accent ecosystem** — everything is tuned to their violet

---

## 8. Supabase

### Card Dimensions & Layout
- **Product cards**: ~420×380px (tall format)
- **Feature grid**: 6 cards, `grid-template-columns: repeat(3, 1fr)`
- **Padding**: `32px`
- **Border-radius**: `8px` (deliberately tighter — database tool aesthetic)
- **Grid gap**: `16px`

### Background Treatment
- **Dark green-tinted base**: `#0D0D0D` with green undertone
- **Card surface**:
  ```css
  background: linear-gradient(
    180deg,
    hsl(153, 10%, 8%) 0%,
    hsl(153, 10%, 5%) 100%
  );
  ```
- **Neon glow layer** (their signature):
  ```css
  .supabase-glow::after {
    content: '';
    position: absolute;
    top: -1px; right: -1px; bottom: -1px; left: -1px;
    background: linear-gradient(135deg, #3ECF8E 0%, transparent 50%);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .supabase-glow:hover::after {
    opacity: 1;
  }
  ```

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.05)`
- **Hover**: Neon border glow:
  ```css
  border-color: rgba(62, 207, 142, 0.3);
  box-shadow: 0 0 30px rgba(62, 207, 142, 0.08);
  ```

### Typography Hierarchy
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Product name | 24px | 600 | `#EDEDED` |
| Description | 15px | 400 | `#8F8F8F` |
| Feature label | 13px | 500 | `#3ECF8E` (neon green) |

### Hover Micro-Interactions
```css
.supabase-card:hover {
  border-color: rgba(62, 207, 142, 0.3);
  box-shadow: 0 0 30px rgba(62, 207, 142, 0.08), 0 20px 40px rgba(0,0,0,0.3);
}
/* Product illustration: scale(1.03) with transition: 0.5s ease */
```

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Brand green | `#3ECF8E` | Accent, neon glow, CTAs |
| Dark green | `#1C7D4E` | Subdued green accents |
| Surface | `hsl(153,10%,6%)` | Card bg |
| Text primary | `#EDEDED` | Headings |
| Text secondary | `#8F8F8F` | Body |

### Unique Elements
- **Product visual compositions** as card illustrations (not generic icons)
- **Neon green glow** from bottom-left corner as signature accent
- **Framework logos** in card footers showing compatibility
- **Open source badge** styling with GitHub star count

---

## 9. Planetscale / Neon

### Card Dimensions & Layout
- **Database showcase cards**: ~480×380px
- **Padding**: `32px`
- **Border-radius**: `12px`
- **Grid gap**: `24px`

### Background Treatment (Neon)
- **Dark base**: `#0C0C0C` with cyan/teal undertone
- **Card surface**:
  ```css
  background: rgba(255, 255, 255, 0.02);
  ```
- **Signature neon glow** (the "Neon" in the name):
  ```css
  .neon-glow-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    background: conic-gradient(
      from 180deg,
      transparent 60%,
      #00E699 75%,
      #00D4FF 85%,
      transparent 95%
    );
    animation: neon-spin 4s linear infinite;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .neon-glow-card:hover::before {
    opacity: 1;
  }
  @keyframes neon-spin {
    to { transform: rotate(360deg); }
  }
  ```

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.06)`
- **Hover**: Rotating conic gradient border (see above)
- **Featured**: Persistent glow: `box-shadow: 0 0 60px rgba(0, 230, 153, 0.1)`

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Feature title | 24px | 600 | `#FFFFFF` |
| Description | 15px | 400 | `#A0A0A0` |
| Metric value | 40px | 700 | `#00E699` (neon green) |
| Code/SQL | 14px mono | 400 | syntax-highlighted |

### Unique Elements
- **Spinning conic gradient border** — the most dramatic border effect in the space
- **SQL syntax previews** as card content
- **Branching diagrams** (database branching visualised in cards)
- **Neon green + cyan gradient**: `linear-gradient(135deg, #00E699, #00D4FF)`

---

## 10. Apple Developer

### Card Dimensions & Layout
- **WWDC feature cards**: ~480×340px (16:11 ratio, cinematic)
- **Padding**: `24px`
- **Border-radius**: `20px` (Apple's signature larger radius since iOS 14)
- **Grid gap**: `20px`

### Background Treatment
- **Vibrancy/frosted glass** (the original glassmorphism):
  ```css
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  ```
- **Dark variant**:
  ```css
  background: rgba(30, 30, 30, 0.72);
  backdrop-filter: blur(40px) saturate(180%);
  ```

### Border Effects
- **Default**: `1px solid rgba(255, 255, 255, 0.18)` — relatively strong
- **NO animated borders** — Apple never does.
- **NO visible hover borders** — vibrancy shift IS the border change

### Typography Hierarchy
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Card title | 22px | 600 | `#F5F5F7` |
| Description | 15px | 400 | `rgba(255,255,255,0.7)` |
| Eyebrow | 12px | 600 | Multi-colour gradient text |
| **Font family** | SF Pro Display / SF Pro Text | — | — |

### Hover Micro-Interactions
```css
.apple-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.apple-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```
- **Very restrained** — Apple prefers scale over translate

### Unique Elements
- **High-blur backdrop-filter** (`40px blur`) — heavier than any competitor
- **Gradient text** on labels: `-webkit-background-clip: text`
- `saturate(200%)` making colours pop behind the frost
- **Multi-colour icon tinting** to match WWDC rainbow palette

---

---

# SYNTHESIS — The Ultimate Premium Card

## The 5 Most Impactful Patterns to Combine

After analysing all 10 companies, these are the 5 highest-impact patterns ordered by "scroll-stopping" power:

### Pattern 1: Cursor-Tracking Spotlight Border (from Vercel)
**Why it works**: Creates a sense of life — the cards feel aware of the user.

### Pattern 2: Animated Gradient Border Rotation (from Neon/Stripe)
**Why it works**: The spinning conic gradient creates dramatic premium feel.

### Pattern 3: Multi-Layer Glass Surface (from Raycast + Apple)
**Why it works**: Depth without heaviness — frosted surfaces feel premium and native.

### Pattern 4: Spring-Physics Hover Lift (from Arc + Stripe)
**Why it works**: Non-linear animation creates organic, memorable movement.

### Pattern 5: Noise Grain Texture Overlay (from Raycast + Linear)
**Why it works**: Breaks the "flat digital" feel — adds analog warmth.

---

# Ready-to-Use Implementation

## Complete CSS Variables System

```css
:root {
  /* ─── Colours ─── */
  --card-bg: rgba(255, 255, 255, 0.03);
  --card-bg-hover: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(255, 255, 255, 0.15);
  --card-radius: 16px;
  --card-padding: 32px;
  
  /* ─── Accent (customise per card) ─── */
  --accent-rgb: 29, 77, 241;         /* Asagus brand blue */
  --accent: rgb(var(--accent-rgb));
  --accent-glow: rgba(var(--accent-rgb), 0.15);
  --accent-subtle: rgba(var(--accent-rgb), 0.08);
  
  /* ─── Text ─── */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-tertiary: rgba(255, 255, 255, 0.35);
  
  /* ─── Glass ─── */
  --glass-bg: rgba(15, 15, 20, 0.7);
  --glass-blur: 24px;
  --glass-saturate: 180%;
  --glass-inner-border: rgba(255, 255, 255, 0.06);
  
  /* ─── Animation ─── */
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  
  /* ─── Noise ─── */
  --noise-opacity: 0.04;
  
  /* ─── Glow ─── */
  --spotlight-size: 350px;
  --border-glow-size: 200px;
}
```

## Noise Texture SVG (Base64 Inline)

```css
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  opacity: var(--noise-opacity);
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
```

## Animated Gradient Border

```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.gradient-border-wrapper {
  position: relative;
  border-radius: var(--card-radius);
  padding: 1px;
  background: conic-gradient(
    from var(--angle),
    transparent 40%,
    rgba(var(--accent-rgb), 0.5) 50%,
    rgba(var(--accent-rgb), 0.8) 55%,
    transparent 65%
  );
  animation: border-rotate 4s linear infinite;
}

.gradient-border-wrapper > .card-inner {
  border-radius: calc(var(--card-radius) - 1px);
  background: var(--glass-bg);
  /* This creates the illusion of a gradient border */
}

@keyframes border-rotate {
  to {
    --angle: 360deg;
  }
}

/* Dormant by default, animate on hover */
.gradient-border-wrapper {
  background: var(--card-border); /* flat fallback */
}
.gradient-border-wrapper:hover {
  background: conic-gradient(
    from var(--angle),
    transparent 40%,
    rgba(var(--accent-rgb), 0.5) 50%,
    rgba(var(--accent-rgb), 0.8) 55%,
    transparent 65%
  );
  animation: border-rotate 4s linear infinite;
}
```

## Cursor-Following Spotlight (JavaScript + CSS)

```typescript
// Hook: useSpotlight.ts
import { useRef, useCallback } from 'react'

export function useSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  return { containerRef, handleMouseMove }
}
```

```css
/* Spotlight on card surface */
.spotlight-card {
  position: relative;
  overflow: hidden;
}
.spotlight-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: radial-gradient(
    var(--spotlight-size) circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(var(--accent-rgb), 0.08),
    transparent 40%
  );
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.spotlight-card:hover::before {
  opacity: 1;
}

/* Spotlight on card border (Vercel-style group effect) */
.spotlight-grid {
  position: relative;
}
.spotlight-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    var(--border-glow-size) circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
    rgba(255, 255, 255, 0.06),
    transparent 40%
  );
  pointer-events: none;
  z-index: 10;
}
```

## Complete Framer Motion Variants

```typescript
// Premium card animation variants

export const cardRevealVariant = {
  hidden: {
    y: 32,
    opacity: 0,
    scale: 0.97,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 0.8,
      delay: i * 0.08, // 80ms stagger
    },
  }),
}

export const cardHoverVariant = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)',
  },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
}

export const contentLiftVariant = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: 0.05, // slight delay after card lift
    },
  },
}

export const ctaArrowVariant = {
  rest: { x: 0, opacity: 0.7 },
  hover: {
    x: 4,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
      delay: 0.1,
    },
  },
}

export const iconGlowVariant = {
  rest: {
    filter: 'drop-shadow(0 0 0px rgba(var(--accent-rgb), 0))',
  },
  hover: {
    filter: 'drop-shadow(0 0 12px rgba(var(--accent-rgb), 0.5))',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// Staggered metric badge reveal (inside card)
export const metricBadgeVariant = {
  hidden: { y: 8, opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
      delay: 0.15 + i * 0.06,
    },
  }),
}
```

## Full Tailwind CSS Card Class Composition

```css
/* Add to your global CSS or a Tailwind @layer */

@layer components {
  /* ─── Premium Card Base ─── */
  .premium-card {
    @apply relative overflow-hidden;
    border-radius: var(--card-radius, 16px);
    background: var(--glass-bg, rgba(15, 15, 20, 0.7));
    backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturate, 180%));
    -webkit-backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturate, 180%));
    border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
    padding: var(--card-padding, 32px);
    transition:
      border-color 0.3s var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 0.3s var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .premium-card:hover {
    border-color: var(--card-border-hover, rgba(255, 255, 255, 0.15));
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(var(--accent-rgb, 29, 77, 241), 0.12);
  }

  /* ─── Inner shine (top edge catches light) ─── */
  .premium-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.1) 70%,
      transparent
    );
    pointer-events: none;
    z-index: 2;
  }

  /* ─── Category Label (Stripe-inspired) ─── */
  .card-label {
    @apply inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider;
    color: rgb(var(--accent-rgb));
    background: rgba(var(--accent-rgb), 0.1);
    border: 1px solid rgba(var(--accent-rgb), 0.2);
    padding: 4px 12px;
    border-radius: 999px;
  }

  /* ─── Card Title ─── */
  .card-title {
    @apply text-xl font-semibold;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  /* ─── Card Description ─── */
  .card-description {
    @apply text-sm leading-relaxed;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* ─── Icon Container ─── */
  .card-icon-wrap {
    @apply flex items-center justify-center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(var(--accent-rgb), 0.1);
    border: 1px solid rgba(var(--accent-rgb), 0.15);
    color: rgb(var(--accent-rgb));
    transition: filter 0.3s ease;
  }
  .premium-card:hover .card-icon-wrap {
    filter: drop-shadow(0 0 10px rgba(var(--accent-rgb), 0.4));
  }

  /* ─── CTA Link ─── */
  .card-cta {
    @apply inline-flex items-center gap-1 text-sm font-medium;
    color: rgb(var(--accent-rgb));
    transition: gap 0.2s ease;
  }
  .premium-card:hover .card-cta {
    gap: 8px;
  }
}
```

## Complete Responsive Bento Grid

```css
@layer components {
  .premium-bento {
    display: grid;
    gap: 20px;
    padding: 0 20px;
    max-width: 1280px;
    margin: 0 auto;
    
    /* Mobile: single column */
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .premium-bento {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    /* First card spans full width as hero */
    .premium-bento > :first-child {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 1024px) {
    .premium-bento {
      grid-template-columns: repeat(3, 1fr);
    }
    /* Hero card: 2 columns wide */
    .premium-bento > :first-child {
      grid-column: span 2;
    }
    /* Optional: make one card tall */
    .premium-bento > :nth-child(3) {
      grid-row: span 2;
    }
  }
}
```

---

## Final "Wow Factor" Recipe

The following is the exact layering order for maximum visual impact:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 7 — Noise grain overlay (mix-blend-mode: overlay)│
│  Layer 6 — Cursor spotlight (radial gradient, z:5)      │
│  Layer 5 — Top-edge shine (linear gradient 1px, z:4)    │
│  Layer 4 — Content (text, icons, CTA — z:3)             │
│  Layer 3 — Accent radial glow (z:2, top-left corner)    │
│  Layer 2 — Glass surface (backdrop-filter + bg, z:1)    │
│  Layer 1 — Animated gradient border (z:0, outer wrap)   │
│  Layer 0 — Deep shadow (box-shadow, on :hover)          │
└─────────────────────────────────────────────────────────┘
```

### Micro-Interaction Choreography (Timing)

When the user hovers on a card, the animations fire in this order:

| Step | What happens | Delay | Duration | Easing |
|------|-------------|-------|----------|--------|
| 0 | Border brightens | 0ms | 150ms | ease |
| 1 | Card lifts (translateY -6px) | 0ms | 300ms | spring(400, 25) |
| 2 | Shadow deepens | 0ms | 300ms | ease-out |
| 3 | Spotlight reveals | 0ms | 300ms | ease |
| 4 | Gradient border starts rotating | 50ms | ∞ (4s/rev) | linear |
| 5 | Content block lifts -4px | 50ms | 250ms | spring(300, 20) |
| 6 | Icon glow appears | 80ms | 300ms | ease-out |
| 7 | CTA arrow slides +4px | 100ms | 200ms | spring(500, 15) |
| 8 | Metric badges stagger in | 150ms+ | 220ms each | spring(200, 18) |

### Leave/Exit Animation

| Step | What happens | Duration | Easing |
|------|-------------|----------|--------|
| 0 | Gradient border stops & fades | 300ms | ease-out |
| 1 | Card settles back (y: 0) | 350ms | spring(200, 20) |
| 2 | Spotlight fades | 300ms | ease |
| 3 | Shadow returns to rest | 300ms | ease |

### Performance Notes
- `will-change: transform, box-shadow` on `.premium-card`
- `contain: layout style paint` on the card grid
- Use `@media (prefers-reduced-motion: reduce)` to disable all transforms and animated borders
- `backdrop-filter` is GPU-composited — no layout thrash
- Limit animated gradient borders to 3 visible cards maximum (avoid GPU overload)

---

## Exact Colour Codes Summary — Premium Card Palette

```css
:root {
  /* Backgrounds */
  --bg-page: #050505;
  --bg-card: rgba(12, 12, 15, 0.8);
  --bg-card-hover: rgba(18, 18, 22, 0.85);
  
  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);
  --border-accent: rgba(var(--accent-rgb), 0.3);
  
  /* Accent Presets */
  --accent-blue-rgb: 29, 77, 241;     /* Asagus brand: #1D4DF1 */
  --accent-violet-rgb: 99, 91, 255;    /* Stripe-inspired */
  --accent-cyan-rgb: 128, 233, 255;    /* Cool tech */
  --accent-green-rgb: 62, 207, 142;    /* Supabase-style */
  --accent-rose-rgb: 255, 99, 99;      /* Warm/creative */
  --accent-amber-rgb: 255, 197, 49;    /* Warning/energy */
  
  /* Text */
  --text-heading: rgba(255, 255, 255, 0.95);
  --text-body: rgba(255, 255, 255, 0.55);
  --text-muted: rgba(255, 255, 255, 0.35);
  
  /* Shadows */
  --shadow-rest: 0 4px 20px rgba(0, 0, 0, 0.2);
  --shadow-hover: 0 20px 60px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(var(--accent-rgb), 0.12);
}
```

---

## Quick Reference — What to Steal from Each Company

| Company | Steal This | Don't Copy This |
|---------|-----------|-----------------|
| **Stripe** | Gradient border rotation, Navy dark palette, CTA arrow micro-interaction | Complex multi-card illustration system |
| **Linear** | Extreme typographic restraint, Disciplined opacity scale | Their "boring on purpose" hover states |
| **Vercel** | Cursor-tracking shimmer across grid, Bento asymmetry | Over-reliance on pure black |
| **Raycast** | Frosted glass + grain texture, Keyboard badge styling | macOS-specific iconography |
| **Arc** | Spring overshoot easing, Bold border-radius (24px) | Full colour backgrounds (unless you want light mode) |
| **Resend** | Terminal typing animations, Code-as-content cards | Over-minimalism (invisible interactions) |
| **Clerk** | Purple radial glow on featured cards, Auth UI preview | Single-colour accent ecosystem |
| **Supabase** | Corner neon glow, Green accent on dark | Tight 8px border-radius |
| **Neon** | Spinning conic gradient border, Neon colour pairing | Excessive glow intensity |
| **Apple** | 40px blur glassmorphism, Scale-on-hover (not translate) | System font reliance |
