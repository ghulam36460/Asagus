# ASAGUS Frontend Web Application Audit Report

## Executive Summary
Comprehensive audit of `/apps/web/` frontend application covering components, hooks, lib utilities, and app pages. The codebase shows solid architectural patterns but has several code quality, accessibility, and TypeScript issues that should be addressed.

---

## 1. CODE QUALITY ISSUES

### 1.1 Unused Imports & Dead Code

**`apps/web/components/analytics.tsx`** (Line 44-48)
- `trackEvent()`, `trackFormSubmission()`, `trackButtonClick()`, `trackSectionView()` exported but **never used** anywhere in codebase
- Recommendation: Remove unused exports or document their intended use

**`apps/web/components/announcement-bar.tsx`** (Line 2)
- Import of `X` from lucide-react is unused; button uses custom SVG icon instead
- Remove: `import { X } from "lucide-react"`

**`apps/web/components/CardCarousel.tsx`**
- Needs review for unused state/props after examining full file

**`apps/web/components/floating-navbar.tsx`** (Line 9)
- NavLink `/products` and `/research-development` routes don't exist in app structure
- These links are broken navigation targets

### 1.2 Inconsistent Naming & Patterns

**Component naming inconsistency:**
- `CardCarousel.tsx` (PascalCase) ✓
- `CarouselCard.tsx` (PascalCase) ✓
- `ProjectGrid.tsx` (PascalCase) ✓
- `project-modal.tsx` (kebab-case) ✗ - Inconsistent with others
- `service-modal.tsx` (kebab-case) ✗ - Inconsistent
- `contact-section.tsx` (kebab-case) ✗ - Inconsistent

**Recommendation:** Standardize all component filenames to PascalCase (e.g., `ProjectModal.tsx`, `ServiceModal.tsx`)

### 1.3 Magic Numbers & Hard-coded Values

**`apps/web/components/animated-background.tsx`** (Lines 10-70)
- 36 hardcoded neuron positions with percentage values
- Lacks documentation or constants for grid calculations
- Recommendation: Create a configuration object or utility function

**`apps/web/components/bento-services-section.tsx`**
- Multiple hardcoded animation delays, durations, and stiffness values
- Recommendation: Extract to a constants file: `ANIMATION_DEFAULTS.ts`

**`apps/web/components/services-showcase.tsx`** (Line 51)
- Hardcoded hex color fallback: `'59,130,246'` should be a constant

**`apps/web/components/SurfCarousel.tsx`** (Lines 39-85)
- Card data hardcoded in component; should be externalized to `/data/` directory

### 1.4 Missing Error Boundaries

- **No Error Boundary components** exist in the codebase
- Components like `CardCarousel`, `SurfCarousel`, and `neural-visual-scene` could fail silently
- Recommendation: Create `apps/web/components/error-boundary.tsx` and wrap error-prone sections

### 1.5 Unused Dependencies Pattern

**`apps/web/components/smooth-scroll.tsx`** (Line 37)
```typescript
gsap.ticker.remove(() => {})  // Empty callback — likely dead code
```
Should be:
```typescript
gsap.ticker.remove(lenis.raf)
```

---

## 2. TYPESCRIPT ISSUES

### 2.1 Use of `any` Type

**`apps/web/components/hero-section.tsx`** (Line 36-39)
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof window !== 'undefined' && (window as any).gtag) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag('event', name)
}
```
- Using `any` with eslint-disable suppressions is poor practice
- **Better approach:** Create proper type definitions in `window.d.ts`

**`apps/web/components/live-chat.tsx`** (Line 6)
```typescript
interface Window {
  $crisp?: any[]
  dataLayer: any[]
}
```
- Both properties use `any`
- Define proper types: `CrispMessage[]`, `DataLayerEvent[]`

**`apps/web/components/services-section.tsx`** (Lines 7, 79)
```typescript
const [selectedService, setSelectedService] = useState<any>(null)
const handleServiceClick = (service: any) => {
```
- Should use proper `Service` interface with discriminated union types

**`apps/web/components/services-showcase.tsx`** (Line 63)
- `useSpotlight()` hook position state uses implicit types; should have explicit `{ x: number; y: number; visible: boolean }`

### 2.2 Missing Type Definitions

**`apps/web/lib/validation.ts`** (Line 44)
```typescript
export const validateField = (
  value: string,
  rules: ValidationRule[]
): string | null => {
```
- Return type is too broad; should be: `ValidationError | null`

**`apps/web/app/api/cards/[id]/route.ts`** (Line 7)
```typescript
type Params = { params: Promise<{ id: string }> }
```
- Non-standard type naming; should use: `Params` or `RouteParams` consistently

**`apps/web/app/api/contact/route.ts`** (Line 20)
```typescript
const { fullName, email, phone, service, message } = body
```
- No type guard on destructured values
- Should validate `body` against interface before destructuring

### 2.3 Missing Return Types

**`apps/web/components/neural-visual.tsx`** (Line 63)
```typescript
export function NeuralVisual({ className = '' }: NeuralVisualProps) {
```
- Missing explicit return type `JSX.Element | null`

**`apps/web/lib/scroll-reveal.ts`** (Lines 11, 96)
- Functions `initScrollReveal()` and `destroyScrollReveal()` have no return type annotations

**Multiple components** lack explicit return type annotations on main export functions

---

## 3. ERROR HANDLING

### 3.1 Missing Error Handling

**`apps/web/components/live-chat.tsx`** (Line 31-33)
```typescript
const script = document.createElement('script')
script.src = 'https://client.crisp.chat/l.js'
script.async = true
document.getElementsByTagName('head')[0].appendChild(script)  // ❌ No null check
```
- `getElementsByTagName('head')[0]` could be undefined
- Should handle: `const head = document.querySelector('head'); if (head) { head.appendChild(script) }`

**`apps/web/app/api/cards/route.ts`** (Line 37)
```typescript
} catch {
  return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
}
```
- Error object is ignored; should log error for debugging

**`apps/web/app/api/cards/[id]/route.ts`** (Line 22)
```typescript
} catch {
  return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
}
```
- Same issue: silent error swallowing

**`apps/web/components/contact-section.tsx`** (Line 65-71)
- Toast message auto-clears but doesn't persist error context
- Should keep error longer or show more details

**`apps/web/lib/projects-api.ts`** (Lines 94-96)
```typescript
} catch {
  return []
}
```
- Returns empty array on ANY error; no logging
- Network timeout and 404 treated identically

### 3.2 Unhandled Promise Rejections

**`apps/web/components/smooth-scroll.tsx`** (Line 28)
```typescript
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
```
- `lenis.raf()` may throw; no error handling

**`apps/web/components/hero-section.tsx`** (Line 41)
```typescript
window.dispatchEvent(new CustomEvent(name))
```
- No try-catch around event dispatch

### 3.3 Missing Validation

**`apps/web/app/api/newsletter/route.ts`** (Line 9)
```typescript
const { email } = body
```
- Should validate `body` is object before destructuring

**`apps/web/app/api/contact/route.ts`** (Line 19)
- Form fields validated individually but no whitespace trimming for names/emails

---

## 4. ACCESSIBILITY ISSUES

### 4.1 Missing ARIA Labels & Semantic HTML

**`apps/web/components/CardCarousel.tsx`** (Lines 35-36)
```tsx
<motion.div
  onClick={onClick}
```
- `motion.div` is clickable but missing `role="button"` and `tabIndex={0}`
- Should be interactive element or have proper ARIA attributes

**`apps/web/components/portfolio-filter.tsx`** (Lines 67-86)
- Search input missing `aria-label` or associated `<label>`

**`apps/web/components/project-modal.tsx`** (Line 36)
```tsx
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] overflow-hidden"
initial={{ opacity: 0 }}
```
- Modal backdrop missing `role="presentation"` and `aria-hidden="true"`

**`apps/web/components/testimonials-section.tsx`** (Line 78)
```tsx
<article ... >
```
- Good use of semantic `<article>` tags ✓

### 4.2 Keyboard Navigation Issues

**`apps/web/components/bento-services-section.tsx`**
- Video cards with hover interactions missing keyboard focus styles
- Should have visible `:focus-visible` indicators

**`apps/web/components/floating-navbar.tsx`**
- Mobile menu button missing `aria-expanded` attribute (line 17-18 area)
- Links should have visible focus rings on keyboard tab

**`apps/web/components/faq-section.tsx`** (Line 85-86) ✓
```tsx
aria-expanded={openId === faq.id}
aria-controls={`faq-answer-${faq.id}`}
```
- GOOD: Proper ARIA attributes for disclosure pattern

### 4.3 Color Contrast Issues

**`apps/web/components/announcement-bar.tsx`** (Line 48-54)
```tsx
<span style={{
  fontSize: "0.82rem",
  color: "rgba(255,255,255,0.8)",  // May fail WCAG AA on dark bg
  ...
}}
```
- `rgba(255,255,255,0.8)` on `rgba(20,14,40,0.2)` background may have insufficient contrast

**`apps/web/components/services-showcase.tsx`**
- Multiple gradient text overlays with potential contrast issues
- Need WCAG AA verification for all text over colored backgrounds

### 4.4 Missing Focus Management

**`apps/web/components/project-modal.tsx`** (Lines 46-52)
- Modal doesn't trap focus; keyboard users can tab outside modal
- Missing: `onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}`
- Should use focus trap library or implement manually

**`apps/web/components/service-modal.tsx`**
- Same issue as ProjectModal

### 4.5 Image Alt Text

**`apps/web/components/hero-section.tsx`** (Line not shown in expanded text)
- NeuralVisual component has `aria-hidden="true"` ✓

**`apps/web/components/project-page-client.tsx`** (Line 107-109)
```tsx
<img
  src={image}
  alt={`${project.title} - View ${i + 1}`}
```
- Good alt text ✓

**`apps/web/components/floating-navbar.tsx`** (Line 88-95)
```tsx
<Image
  src="/logo.png"
  alt="ASAGUS logo"
```
- Good ✓

---

## 5. COMPONENT DESIGN PROBLEMS

### 5.1 Prop Drilling & State Management

**`apps/web/components/services-section.tsx`** vs **`apps/web/components/services-showcase.tsx`**
- Both components manage similar modal state independently
- Should share a context or custom hook: `useServiceModal()`

**`apps/web/components/portfolio-filter.tsx`** (Lines 12-15)
```typescript
const [selectedCategory, setSelectedCategory] = useState('All')
const [searchQuery, setSearchQuery] = useState('')
const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
```
- Three related filter states; should be unified: `useFilterState()`

### 5.2 Large Component Files

- `apps/web/components/bento-services-section.tsx` - **~700 lines** - Too large
- `apps/web/components/services-showcase.tsx` - **~870 lines** - Too large
- `apps/web/components/SurfCarousel.tsx` - **~572 lines** - Too large
- `apps/web/components/portfolio-filter.tsx` - **~453 lines** - Too large

**Recommendation:** Break into smaller sub-components:
- `BentoServicesSection` → `BentoServiceCard`, `BentoGrid`
- `ServicesShowcase` → `ServiceCard`, `ServiceGrid`, `SpotlightEffect`
- `SurfCarousel` → `CarouselCard`, `DragIndicator`, `Navigation`

### 5.3 Tight Coupling

**`apps/web/components/contact-section.tsx`** couples:
- Form validation logic (should use custom hook)
- API communication (should use custom hook)
- UI rendering
- Toast notifications

**Better pattern:**
```typescript
const useContactForm = () => { /* validation + API */ }
const useToastNotification = () => { /* toast state */ }
export function ContactSection() {
  const form = useContactForm()
  const toast = useToastNotification()
  // Just render
}
```

### 5.4 Missing Custom Hooks

Common patterns that should be extracted:

1. **`useWindowSize()`** - Used in multiple components, should be centralized
2. **`useIntersectionObserver()`** - Scroll reveal, lazy loading
3. **`useLocalStorage()`** - Theme persistence
4. **`useAsync()`** - API calls in multiple places
5. **`useClickOutside()`** - Modal/menu dismiss logic

### 5.5 Inconsistent Component Patterns

**Props interface definitions:**
- Some use `interface ComponentProps extends HTMLAttributes` ✓
- Some use `interface ComponentProps { children: React.ReactNode }` (limited)
- Some don't have any props interface and use inline typing

**Recommendation:** Standardize all props interfaces:
```typescript
interface ComponentProps extends React.PropsWithChildren {
  variant?: 'primary' | 'secondary'
  className?: string
}
```

---

## 6. INCONSISTENT PATTERNS

### 6.1 API Error Handling

**Inconsistent patterns across route handlers:**

`apps/web/app/api/contact/route.ts` - Has detailed error handling ✓
`apps/web/app/api/newsletter/route.ts` - Has detailed error handling ✓
`apps/web/app/api/cards/route.ts` - Silent error swallowing ✗
`apps/web/app/api/cards/[id]/route.ts` - Silent error swallowing ✗

**Recommendation:** Create shared API error handling utility

### 6.2 Animation Configuration

**Inconsistent animation definitions:**

`apps/web/components/bento-services-section.tsx`:
```typescript
transition: { type: 'spring', stiffness: 48, damping: 28, mass: 1.1, delay: i * 0.11 }
```

`apps/web/components/hero-section.tsx`:
```typescript
transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
```

`apps/web/components/SurfCarousel.tsx`:
```typescript
transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
```

**Recommendation:** Create `lib/animation-config.ts` with consistent presets

### 6.3 Style Application

**Inconsistent styling approaches:**

1. **Inline styles**: `about-section.tsx`, `announcement-bar.tsx`
2. **Tailwind classes**: `button.tsx`, `input.tsx`
3. **styled-jsx**: `client-logos.tsx`, `service-modal.tsx`
4. **CSS variables**: `floating-navbar.tsx`
5. **Mixed**: Most components use all 4 approaches

**Recommendation:** Use primarily Tailwind with styled-jsx for complex animations only

### 6.4 Form Validation

**Different patterns:**

`apps/web/lib/validation.ts` - Custom validation library (good ✓)
`apps/web/app/api/contact/route.ts` - Inline regex validation
`apps/web/app/api/newsletter/route.ts` - Inline regex validation

**Recommendation:** Use `validation.ts` utilities in ALL form validation

### 6.5 Data Fetching

**Different fetch patterns:**

```typescript
// Pattern 1: fetch with no-store (contact form, portfolio)
const response = await fetch(url, { cache: 'no-store' })

// Pattern 2: fetch with revalidate (projects, services)
const response = await fetch(url, { next: { revalidate: 60 } })

// Pattern 3: Inline hook fetch (useCards.ts)
fetch('/api/cards', { cache: 'no-store' })
```

**Recommendation:** Create `lib/api-client.ts` with consistent fetch wrapper

---

## SUMMARY TABLE

| Category | Severity | Count | Examples |
|----------|----------|-------|----------|
| Unused imports/code | Low | 5 | analytics.tsx, announcement-bar.tsx |
| TypeScript `any` type | Medium | 4 | hero-section.tsx, live-chat.tsx, services-section.tsx |
| Missing error handling | High | 8 | live-chat.tsx, api routes, smooth-scroll.tsx |
| Accessibility issues | Medium | 6 | CardCarousel, modals, focus management |
| Component size | Medium | 4 | Files >400 lines |
| Inconsistent patterns | Low | 6 | API errors, animations, styling |

---

## PRIORITY RECOMMENDATIONS

### CRITICAL (Fix Immediately)
1. Add error boundaries for Three.js components
2. Fix error handling in API routes (cards, newsletter)
3. Remove `any` types and create proper type definitions
4. Fix focus management in modals (keyboard accessibility)

### HIGH (Next Sprint)
1. Refactor large components (>400 lines) into smaller pieces
2. Create shared hooks: `useContactForm`, `useServiceModal`, `useFilterState`
3. Implement consistent API error handling pattern
4. Extract animation constants to configuration file
5. Fix broken navigation links (`/products`, `/research-development`)

### MEDIUM (Ongoing)
1. Standardize component file naming (all PascalCase)
2. Add color contrast verification for WCAG AA compliance
3. Create shared hooks: `useWindowSize`, `useAsync`, `useLocalStorage`
4. Extract hardcoded data to data files
5. Add explicit return type annotations to all functions

### LOW (Nice to Have)
1. Create reusable animation preset library
2. Consolidate style approaches (prefer Tailwind + styled-jsx)
3. Document component APIs and prop interfaces
4. Add storybook for component isolation/testing

---

