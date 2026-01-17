# Phase 1: Foundation - Research

**Researched:** 2026-01-17
**Domain:** Design system, responsive layout, navigation (Next.js 16.1.3 / React 19 / Tailwind CSS 4)
**Confidence:** HIGH

## Summary

This research covers the technical implementation of a design system foundation for Claytopia, a pottery studio website. The stack uses Next.js 16.1.3 with App Router, React 19, and Tailwind CSS 4 with its new CSS-first configuration approach.

Tailwind CSS v4 introduces a paradigm shift with the `@theme` directive for design tokens, eliminating the need for JavaScript configuration files. Custom colors, typography, and spacing are defined directly in CSS using special namespaces (`--color-*`, `--font-*`, etc.) that automatically generate corresponding utility classes. This approach aligns perfectly with the requirement for configurable color themes via CSS variables.

**Primary recommendation:** Use Tailwind v4's `@theme` directive with `:root` CSS variables for the color system, Plus Jakarta Sans for typography via `next/font/google`, and the `hamburger-react` library for an accessible animated hamburger menu with custom slide-out panel implementation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.x | Utility-first styling | Already installed; CSS-first config is the v4 standard |
| next/font/google | Built-in | Font optimization | Zero-config self-hosting, no layout shift, no Google requests |
| hamburger-react | 2.x | Animated hamburger icon | 1.5KB, accessible, CSS-only animations, TypeScript support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| focus-trap-react | Latest | Focus management for modals | For trapping focus in slide-out menu |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| hamburger-react | Custom SVG animation | More control but more code, accessibility must be hand-built |
| focus-trap-react | HTML `inert` attribute | `inert` is simpler but requires sibling DOM structure |
| Plus Jakarta Sans | Outfit | Outfit has 9 weights but no italic; Plus Jakarta has italics |

**Installation:**
```bash
npm install hamburger-react focus-trap-react
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── globals.css            # @theme definitions, CSS variables
├── layout.tsx             # Root layout with font config, Header
├── page.tsx               # Home page
├── components/
│   ├── Header.tsx         # Sticky header with logo + hamburger
│   ├── MobileMenu.tsx     # Slide-out navigation panel
│   ├── Footer.tsx         # Minimal footer
│   └── ui/                # Reusable design system components
│       ├── Button.tsx
│       ├── Container.tsx
│       └── Typography.tsx
```

### Pattern 1: CSS Variables with @theme Bridge
**What:** Define colors in `:root` for runtime flexibility, bridge to Tailwind via `@theme inline`
**When to use:** When colors need to be configurable or support future theming
**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

:root {
  /* Base color palette */
  --sage-50: #f6f7f4;
  --sage-100: #e8ebe3;
  --sage-200: #d4dbc9;
  --sage-500: #9caf88;
  --sage-600: #7d9468;
  --sage-700: #5f7550;

  --lilac-400: #c4a7d4;
  --lilac-500: #a47dab;
  --lilac-600: #8b5f94;

  --charcoal: #2d3436;
  --charcoal-light: #4a5054;

  /* Semantic tokens */
  --color-bg: var(--sage-50);
  --color-bg-alt: var(--sage-100);
  --color-text: var(--charcoal);
  --color-text-muted: var(--charcoal-light);
  --color-primary: var(--sage-600);
  --color-accent: var(--lilac-500);
}

@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
  --color-muted: var(--color-text-muted);

  --font-sans: var(--font-plus-jakarta-sans);
}
```

### Pattern 2: Next.js Font Configuration with CSS Variable
**What:** Load Google Font as variable font, expose via CSS variable for Tailwind
**When to use:** Always for self-hosted optimized fonts
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={plusJakartaSans.variable}>
      <body className="font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

### Pattern 3: Accessible Slide-Out Menu with Focus Trap
**What:** Hamburger button triggers slide-out panel with proper focus management
**When to use:** For full-screen or panel navigation overlays
**Example:**
```tsx
// Source: https://hamburger-react.netlify.app/ + accessibility best practices
'use client';

import { useState, useEffect } from 'react';
import { Squeeze } from 'hamburger-react';
import FocusTrap from 'focus-trap-react';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <Squeeze
        toggled={isOpen}
        toggle={setIsOpen}
        size={24}
        color="var(--color-text)"
        label="Navigation menu"
        rounded
      />

      {isOpen && (
        <FocusTrap>
          <div
            className="fixed inset-0 z-50 bg-background"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            {/* Slide-from-right panel */}
            <nav className="absolute right-0 top-0 h-full w-80 max-w-full
                          bg-background shadow-xl transform transition-transform
                          duration-300 ease-out">
              {/* Menu content */}
            </nav>
          </div>
        </FocusTrap>
      )}
    </>
  );
}
```

### Pattern 4: Mobile-First Responsive Classes
**What:** Unprefixed classes for mobile, prefixed for larger screens
**When to use:** Always (Tailwind v4 default approach)
**Example:**
```html
<!-- Source: https://tailwindcss.com/docs/responsive-design -->
<!-- Mobile: flex-col, tablet+: flex-row -->
<div class="flex flex-col md:flex-row gap-4">
  <!-- Mobile: full width, tablet+: half width -->
  <div class="w-full md:w-1/2">...</div>
</div>

<!-- Mobile: text-lg, tablet+: text-xl, desktop+: text-2xl -->
<h1 class="text-lg md:text-xl lg:text-2xl font-semibold">...</h1>
```

### Anti-Patterns to Avoid
- **Using `sm:` for mobile styles:** `sm:` means 640px+, not "small screens". Unprefixed is mobile.
- **Defining colors only in @theme without :root:** Loses ability to reference colors outside Tailwind utilities.
- **JavaScript-based menu animations:** CSS transitions are more performant; use `transform` and `opacity`.
- **Missing focus management in overlays:** Always trap focus and handle Escape key.
- **Forgetting body scroll lock:** Open overlays should prevent background scrolling.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hamburger animation | Custom SVG + CSS keyframes | hamburger-react | 14 animation styles, accessible, 1.5KB |
| Focus trapping | Manual focus management | focus-trap-react or `inert` | Edge cases with tab cycling, shadow DOM |
| Font loading | Self-hosted static files | next/font/google | Automatic subsetting, FOUT prevention, CLS optimization |
| Contrast checking | Manual calculation | WebAIM Contrast Checker | WCAG algorithm is non-trivial |
| Responsive breakpoints | Custom media queries | Tailwind v4 variants | Already configured, mobile-first |

**Key insight:** The hamburger menu accessibility requirements (ARIA attributes, keyboard support, focus management, screen reader announcements) are deceptively complex. Libraries handle the edge cases.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Configuration Confusion
**What goes wrong:** Trying to use `tailwind.config.js` or expecting JS-based config
**Why it happens:** v4 fundamentally changed to CSS-first; most tutorials are for v3
**How to avoid:** Use `@theme` directive in CSS file, not JS config
**Warning signs:** Errors about missing config, utilities not generating

### Pitfall 2: Color Contrast Failures
**What goes wrong:** Text unreadable on sage green backgrounds
**Why it happens:** Sage green (#9CAF88) fails WCAG with white text
**How to avoid:** Use charcoal/near-black text on sage; verify with contrast checker
**Warning signs:** Contrast ratio below 4.5:1 for body text

### Pitfall 3: Font Variable Not Available
**What goes wrong:** Font fallback shows instead of Plus Jakarta Sans
**Why it happens:** CSS variable not properly bridged to Tailwind
**How to avoid:** Use `@theme inline` to resolve variable, apply class to html element
**Warning signs:** Browser DevTools shows fallback font-family

### Pitfall 4: Menu Accessibility Gaps
**What goes wrong:** Screen readers can access hidden menu, no keyboard nav
**Why it happens:** CSS `display: none` or `visibility: hidden` not applied
**How to avoid:** Use `aria-hidden` on closed menu, focus-trap when open
**Warning signs:** Tab key reaches hidden elements

### Pitfall 5: Mobile-First Misunderstanding
**What goes wrong:** Styles only apply on large screens, mobile is broken
**Why it happens:** Using `sm:` prefix thinking it means "small screens"
**How to avoid:** Write unprefixed classes for mobile, add prefixes for larger
**Warning signs:** Mobile layout is wrong, desktop is correct

## Code Examples

Verified patterns from official sources:

### Complete globals.css Design System
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

/* ============================================
   COLOR SYSTEM
   ============================================ */

:root {
  /* Sage green palette - earthy, warm */
  --sage-50: oklch(0.96 0.02 130);   /* Light background tint */
  --sage-100: oklch(0.93 0.03 130);
  --sage-200: oklch(0.88 0.05 130);
  --sage-500: oklch(0.72 0.08 130);  /* Primary sage */
  --sage-600: oklch(0.62 0.09 130);  /* Darker for text on light */
  --sage-700: oklch(0.52 0.08 130);

  /* Lilac accent palette */
  --lilac-400: oklch(0.75 0.10 310);
  --lilac-500: oklch(0.65 0.12 310); /* Primary accent */
  --lilac-600: oklch(0.55 0.12 310);

  /* Neutrals */
  --charcoal: oklch(0.25 0.01 250);
  --charcoal-muted: oklch(0.40 0.01 250);

  /* Semantic tokens */
  --background: var(--sage-50);
  --background-alt: var(--sage-100);
  --foreground: var(--charcoal);
  --foreground-muted: var(--charcoal-muted);
  --primary: var(--sage-600);
  --accent: var(--lilac-500);
  --accent-hover: var(--lilac-600);
}

/* ============================================
   TAILWIND THEME BRIDGE
   ============================================ */

@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-background-alt: var(--background-alt);
  --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);

  /* Typography */
  --font-sans: var(--font-plus-jakarta-sans), system-ui, sans-serif;

  /* Custom spacing if needed */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}

/* ============================================
   BASE STYLES
   ============================================ */

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
```

### Sticky Header Component
```tsx
// Source: Standard React pattern with Tailwind
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo/wordmark - left */}
        <a href="/" className="text-xl font-semibold text-foreground">
          Claytopia
        </a>

        {/* Hamburger - right */}
        <MobileMenu />
      </div>
    </header>
  );
}
```

### Accessible Link in Navigation
```tsx
// Source: ARIA best practices
<a
  href="/clay-club"
  className="block px-4 py-3 text-lg font-medium text-foreground
             hover:bg-background-alt focus:bg-background-alt
             focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
>
  Clay Club
</a>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | @theme in CSS | Tailwind v4 (2024) | All config in CSS, no JS needed |
| RGB/HSL colors | OKLCH colors | Tailwind v4 (2024) | Better perceptual uniformity, easier contrast |
| next/font manual setup | Built-in optimization | Next.js 13+ | Zero-config font optimization |
| Custom focus trap code | inert attribute | 2023 browser support | Native HTML attribute for focus isolation |
| @apply for components | Direct utility classes | Ongoing | @apply discouraged for most cases |

**Deprecated/outdated:**
- `tailwind.config.js`: Still works but CSS-first is the v4 standard
- HSL/RGB in Tailwind: OKLCH is the new default for better color science
- Manual font preloading: next/font handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **Exact OKLCH values for sage/lilac palette**
   - What we know: General hex ranges for sage (#9CAF88) and lilac (#A47DAB)
   - What's unclear: Precise OKLCH conversions that maintain intended warmth
   - Recommendation: Convert in browser DevTools, verify contrast ratios, adjust L value for accessibility

2. **Focus-trap-react vs native inert attribute**
   - What we know: Both work; inert requires sibling DOM structure
   - What's unclear: Whether Next.js App Router layout structure supports inert well
   - Recommendation: Start with focus-trap-react for guaranteed compatibility

3. **Hamburger animation variant preference**
   - What we know: 14 options available (Squeeze, Spin, Cross, etc.)
   - What's unclear: Which feels most "artisan pottery" appropriate
   - Recommendation: Squeeze or Cross for clean, minimal feel; test with users

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Theme Documentation](https://tailwindcss.com/docs/theme) - @theme directive, CSS variables, namespaces
- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) - Mobile-first, breakpoints, ranges
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - Google Fonts, CSS variables
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) - 4.5:1 normal, 3:1 large text
- [hamburger-react Official Demo](https://hamburger-react.netlify.app/) - Props, accessibility features

### Secondary (MEDIUM confidence)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verified tool for WCAG compliance
- [Plus Jakarta Sans on Fontsource](https://fontsource.org/fonts/plus-jakarta-sans) - Weight range, subsets confirmed
- [React Focus Management Patterns](https://blog.logrocket.com/build-accessible-modal-focus-trap-react/) - focus-trap-react usage

### Tertiary (LOW confidence)
- Font pairing recommendations for artisan brands - WebSearch only, subjective
- Exact OKLCH color conversions - Need manual verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation verified
- Architecture: HIGH - Tailwind v4 docs + Next.js patterns
- Pitfalls: HIGH - Well-documented migration issues
- Color values: MEDIUM - Need contrast verification
- Font choice: MEDIUM - Subjective but well-reasoned

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - stable technologies)
