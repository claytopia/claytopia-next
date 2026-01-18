# Phase 2: Homepage Content - Research

**Researched:** 2026-01-18
**Domain:** Next.js Image Optimization, Hero Sections, Content Layout Patterns
**Confidence:** HIGH

## Summary

This research covers the technical implementation of the Claytopia homepage content: a full-viewport hero section with background image and slogan, four alternating offering sections, a prominent CTA, and an enhanced footer. The decisions from CONTEXT.md constrain the approach: full-width sections with alternating image positions, 100vh hero without CTA button, and multiple subtle CTAs throughout.

The standard approach uses Next.js Image component with `fill` mode for optimized responsive images, static imports for automatic blur placeholders, and CSS Grid for the sticky header + hero section combination. Tailwind CSS v4 utility classes handle the alternating layout pattern with `order-` classes for mobile/desktop reordering.

**Primary recommendation:** Use Next.js Image with static imports and `fill` mode for all images; implement sticky header + hero with CSS Grid spacer pattern; use Tailwind's `order-` utilities for alternating image/text sections.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/image | 16.x | Image optimization | Built-in automatic WebP/AVIF, responsive srcset, lazy loading |
| Tailwind CSS | 4.x | Styling | Already configured with @theme inline for design tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | latest | Conditional classnames | When building reusable components with variant styles |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next/image fill | CSS background-image | Loses optimization, responsive images, blur placeholder |
| Static imports | Remote images | Loses automatic blurDataURL, requires manual dimensions |
| CSS animations | framer-motion | Overkill for simple scroll indicator, adds bundle size |

**Installation:**
No new packages required. Next.js Image and Tailwind are already installed.

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   ├── Container.tsx      # Existing - max-w-6xl wrapper
│   ├── Header.tsx         # Existing - sticky header
│   ├── Footer.tsx         # Existing - needs enhancement
│   ├── Hero.tsx           # NEW - full viewport hero section
│   ├── OfferingSection.tsx # NEW - reusable offering section
│   ├── ScrollIndicator.tsx # NEW - animated scroll arrow
│   └── CTASection.tsx     # NEW - prominent CTA before footer
├── page.tsx               # Homepage composition
└── globals.css            # CSS variables, animations
```

### Pattern 1: Hero Section with Sticky Header

**What:** Full viewport hero that accounts for sticky header, using CSS Grid spacer technique.

**When to use:** When sticky header must remain functional while hero spans remaining viewport height.

**Example:**
```tsx
// Source: Smashing Magazine CSS Grid solution
// app/components/Hero.tsx
import Image from 'next/image';
import heroImage from '@/public/img/sliders/01.jpg'; // Static import

export function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Background image with blur placeholder */}
      <Image
        src={heroImage}
        alt="Finished pottery pieces at Claytopia"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-center blur-sm brightness-75"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center drop-shadow-lg">
          Time to get dirty
        </h1>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
```

### Pattern 2: Alternating Image/Text Sections

**What:** Full-width sections with image on alternating sides, responsive stacking on mobile.

**When to use:** For offering sections where visual variety maintains engagement.

**Example:**
```tsx
// Source: Tailwind CSS documentation on order utilities
// app/components/OfferingSection.tsx
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface OfferingSectionProps {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  href: string;
  imagePosition: 'left' | 'right';
}

export function OfferingSection({
  title,
  description,
  image,
  imageAlt,
  href,
  imagePosition,
}: OfferingSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image - stacks first on mobile, alternates on desktop */}
          <div className={`relative aspect-[4/3] ${
            imagePosition === 'right' ? 'md:order-2' : ''
          }`}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className={imagePosition === 'right' ? 'md:order-1' : ''}>
            <h2 className="text-3xl font-semibold mb-4">{title}</h2>
            <p className="text-foreground-muted mb-6 leading-relaxed">
              {description}
            </p>
            <a
              href={href}
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Mehr erfahren
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Pattern 3: Animated Scroll Indicator

**What:** Pure CSS animated arrow prompting user to scroll.

**When to use:** On full-viewport hero sections to hint at content below.

**Example:**
```tsx
// Source: CodePen bounce animation patterns
// app/components/ScrollIndicator.tsx
export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg
        className="w-8 h-8 text-white/80"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
}
```

**CSS Animation (globals.css):**
```css
/* Tailwind's animate-bounce is built-in, but for custom timing: */
@keyframes scroll-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-12px) translateX(-50%);
  }
  60% {
    transform: translateY(-6px) translateX(-50%);
  }
}
```

### Anti-Patterns to Avoid

- **Using 100vh without considering sticky header:** Causes content overlap. Use CSS Grid spacer or `100svh` with proper layout.
- **Hardcoding header height in calc():** Becomes maintenance nightmare when header is responsive. Use CSS Grid pattern instead.
- **Not specifying sizes attribute:** Browser assumes 100vw, downloads unnecessarily large images.
- **Using `priority` on multiple images:** Only the LCP image (hero) should have priority. Others should lazy load.
- **Client components for static content:** Offering sections with no interactivity should be Server Components.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom image resizing | next/image | Automatic WebP/AVIF, responsive srcset, blur placeholder |
| Blur placeholders | Generate blurDataURL manually | Static imports | Next.js auto-generates for jpg/png/webp/avif |
| Responsive image sizing | Manual breakpoint media queries | next/image sizes attribute | Automatic srcset generation |
| Scroll indicator animation | JavaScript animation | CSS @keyframes + animate-bounce | Better performance, respects reduced-motion |
| Button hover effects | Custom transitions | Tailwind transition-colors/shadow | Consistent, accessible, configurable |

**Key insight:** Next.js Image component handles nearly all image complexity. Static imports unlock automatic blur placeholders without any additional work.

## Common Pitfalls

### Pitfall 1: Sticky Header Trapped in Container

**What goes wrong:** Sticky header stops working when wrapped in a container with hero for layout purposes.

**Why it happens:** `position: sticky` cannot escape its parent container boundaries.

**How to avoid:** Use CSS Grid spacer pattern (documented in Architecture Patterns) or keep header outside any height-constrained container.

**Warning signs:** Header scrolls away instead of sticking, or stops at unexpected position.

### Pitfall 2: Images Without Explicit Dimensions

**What goes wrong:** Layout shifts as images load, poor CLS score.

**Why it happens:** Browser doesn't know image dimensions until loaded.

**How to avoid:** Always use `fill` with sized parent, or explicit `width`/`height`. Static imports automatically provide dimensions.

**Warning signs:** Content jumping during page load, Lighthouse CLS warnings.

### Pitfall 3: Hero Image Not Loading Fast Enough

**What goes wrong:** Large hero image delays LCP, fails Core Web Vitals.

**Why it happens:** Default lazy loading waits until image enters viewport.

**How to avoid:** Add `priority` prop to hero image. Only use on ONE image per page.

**Warning signs:** LCP > 2.5 seconds, hero loads visibly after page appears.

### Pitfall 4: Mobile 100vh Issues

**What goes wrong:** Hero is too tall on mobile, address bar overlap.

**Why it happens:** `100vh` on iOS includes hidden browser UI height.

**How to avoid:** Use `100svh` (small viewport height) for consistent behavior, or `100dvh` for dynamic adjustment.

**Warning signs:** Hero too tall on initial mobile load, content hidden behind browser UI.

### Pitfall 5: Unnecessary Client Components

**What goes wrong:** Larger bundle, slower initial page load.

**Why it happens:** Adding `'use client'` to components that don't need interactivity.

**How to avoid:** Only add `'use client'` for components with useState, useEffect, event handlers, or browser APIs. Static content sections should remain Server Components.

**Warning signs:** Large JavaScript bundle, hydration warnings.

## Code Examples

Verified patterns from official sources:

### Next.js Image with Fill Mode (Hero)
```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image';
import heroImage from '@/public/img/sliders/01.jpg';

export function Hero() {
  return (
    <section className="relative h-[100svh] w-full">
      <Image
        src={heroImage}
        alt="Atmospheric pottery background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay content */}
    </section>
  );
}
```

### CTA Button with Hover Effects
```tsx
// Source: Tailwind CSS documentation + best practices
export function CTAButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-8 py-4
                 text-lg font-semibold text-white
                 bg-primary hover:bg-primary/90
                 rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {children}
    </a>
  );
}
```

### Enhanced Footer Structure
```tsx
// Source: Best practices compilation
export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background-alt py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontakt</h3>
            <address className="not-italic text-sm text-foreground-muted space-y-2">
              <p>Claytopia Keramik-Atelier</p>
              <p>Am Domhof 17a</p>
              <p>51503 Rösrath</p>
              <p className="mt-4">
                <a href="tel:+491718336539" className="hover:text-foreground">
                  +49 171 833 6539
                </a>
              </p>
              <p>
                <a href="mailto:hello@claytopia.de" className="hover:text-foreground">
                  hello@claytopia.de
                </a>
              </p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Angebot</h3>
            <nav className="space-y-2 text-sm text-foreground-muted">
              <a href="/clay-club" className="block hover:text-foreground">Clay Club</a>
              <a href="/brennservice" className="block hover:text-foreground">Brennservice</a>
              <a href="/workshops" className="block hover:text-foreground">Workshops</a>
              <a href="/events" className="block hover:text-foreground">Gruppen-Events</a>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Rechtliches</h3>
            <nav className="space-y-2 text-sm text-foreground-muted">
              <a href="/impressum" className="block hover:text-foreground">Impressum</a>
              <a href="/datenschutz" className="block hover:text-foreground">Datenschutz</a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/10 text-center text-sm text-foreground-muted">
          &copy; {new Date().getFullYear()} Claytopia. Alle Rechte vorbehalten.
        </div>
      </Container>
    </footer>
  );
}
```

### Responsive Order Utilities (Tailwind v4)
```tsx
// Source: Tailwind CSS documentation
// For alternating sections:
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* On mobile: image first (natural order) */}
  {/* On desktop: image on right side */}
  <div className="md:order-2">
    <Image ... />
  </div>
  <div className="md:order-1">
    {/* Text content */}
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 100vh for full viewport | 100svh/100dvh | 2023+ | Fixes mobile browser UI issues |
| priority prop | loading="eager" or priority | Next.js 16 | priority still works, loading="eager" preferred |
| Separate blur generation | Static imports with placeholder="blur" | Next.js 13+ | Zero config blur placeholders |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 | CSS-first configuration |
| tailwind.config.js | @theme inline in CSS | Tailwind v4 | No separate config file needed |

**Deprecated/outdated:**
- **Manual blurDataURL generation for static images:** Unnecessary with static imports
- **@tailwind base/components/utilities:** Replaced by single @import in Tailwind v4
- **JavaScript-based scroll animations:** Pure CSS @keyframes preferred for performance

## Open Questions

Things that couldn't be fully resolved:

1. **Hero image selection**
   - What we know: Images exist in `/public/img/sliders/` and `/public/img/portfolio/`
   - What's unclear: Which specific image best represents "finished pottery pieces, blurred for atmospheric effect"
   - Recommendation: Let planner/implementer choose from available slider images, apply CSS blur

2. **Exact offering section content**
   - What we know: 4 offerings (Clay Club, Brennservice, Workshops, Gruppen-Events), 3-4 sentences each
   - What's unclear: Actual German copy for descriptions
   - Recommendation: Use placeholder text in plan, expect content in implementation or from user

## Sources

### Primary (HIGH confidence)
- [Next.js Image Component Documentation](https://nextjs.org/docs/app/api-reference/components/image) - fill mode, priority, sizes, placeholder
- [Next.js Image Optimization Guide](https://nextjs.org/docs/app/getting-started/images) - static imports, blur placeholders
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/upgrade-guide) - @theme inline, order utilities

### Secondary (MEDIUM confidence)
- [Smashing Magazine: Sticky Headers + Full-Height Elements](https://www.smashingmagazine.com/2024/09/sticky-headers-full-height-elements-tricky-combination/) - CSS Grid spacer solution
- [Modern Viewport Units Guide](https://ishadeed.com/article/new-viewport-units/) - svh, lvh, dvh units
- [Next.js Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - when to use each

### Tertiary (LOW confidence)
- [CodePen scroll arrow examples](https://codepen.io/bisaillonyannick/pen/pvZeGg) - animation patterns
- [TailwindFlex CTA examples](https://tailwindflex.com/tag/call-to-action) - button design inspiration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js Image and Tailwind are the established tools, well-documented
- Architecture: HIGH - Patterns verified against official documentation
- Pitfalls: HIGH - Based on documented issues and official recommendations

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - stable technologies, unlikely to change significantly)
