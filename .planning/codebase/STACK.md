# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**
- TypeScript ^5 - All application code (`app/layout.tsx`, `app/page.tsx`, `next.config.ts`)

**Secondary:**
- CSS - Styling via Tailwind CSS (`app/globals.css`)

## Runtime

**Environment:**
- Node.js v24.10.0 (local development detected)
- Next.js 16.1.3 (App Router)

**Package Manager:**
- npm 11.6.1
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.3 - Full-stack React framework with App Router
- React 19.2.3 - UI library
- React DOM 19.2.3 - React DOM renderer

**Styling:**
- Tailwind CSS ^4 - Utility-first CSS framework
- @tailwindcss/postcss ^4 - PostCSS integration for Tailwind

**Build/Dev:**
- PostCSS - CSS processing (`postcss.config.mjs`)
- ESLint ^9 - Code linting
- eslint-config-next 16.1.3 - Next.js ESLint rules

## Key Dependencies

**Critical:**
- next 16.1.3 - Application framework, handles routing, SSR, bundling
- react 19.2.3 - Component rendering engine
- tailwindcss ^4 - All styling uses Tailwind utility classes

**Type Definitions:**
- @types/node ^20 - Node.js type definitions
- @types/react ^19 - React type definitions
- @types/react-dom ^19 - React DOM type definitions

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017
- Module: esnext with bundler resolution
- Strict mode: enabled
- Path alias: `@/*` maps to `./*`

**Next.js:**
- Config: `next.config.ts`
- Configuration: Default (no custom options set)

**ESLint:**
- Config: `eslint.config.mjs`
- Extends: eslint-config-next/core-web-vitals, eslint-config-next/typescript
- Flat config format (ESLint 9)

**PostCSS:**
- Config: `postcss.config.mjs`
- Plugins: @tailwindcss/postcss

**Tailwind:**
- Config: CSS-based (`app/globals.css` with `@import "tailwindcss"`)
- Uses @theme inline for custom properties
- Dark mode: prefers-color-scheme media query

## Platform Requirements

**Development:**
- Node.js 24.x (or compatible)
- npm for dependency management

**Production:**
- Vercel (implied by Next.js setup and Vercel branding in starter)
- Any Node.js-compatible hosting platform

## Scripts

**Available npm scripts:**
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Fonts

**Google Fonts (via next/font):**
- Geist - Sans-serif font (--font-geist-sans)
- Geist Mono - Monospace font (--font-geist-mono)

---

*Stack analysis: 2026-01-16*
