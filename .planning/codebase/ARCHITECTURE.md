# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Next.js App Router (Server Components by Default)

**Key Characteristics:**
- File-system based routing via `app/` directory
- React Server Components (RSC) as default rendering strategy
- No explicit client/server separation - components are server-side unless marked `"use client"`
- Minimal architecture - fresh create-next-app scaffold with no custom abstractions yet

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Location: `app/`
- Contains: Page components, layouts, and global styles
- Depends on: React, Next.js Image component
- Used by: Next.js router (automatic)

**Routing Layer:**
- Purpose: URL-to-component mapping
- Location: `app/` (file-system based)
- Contains: `page.tsx` files define routes, `layout.tsx` files define layouts
- Depends on: Next.js App Router conventions
- Used by: Browser navigation, internal links

**Static Assets Layer:**
- Purpose: Serve static files directly
- Location: `public/`
- Contains: SVG icons, favicon
- Depends on: Nothing
- Used by: Image components, direct URL references

## Data Flow

**Page Render Flow:**

1. Request hits Next.js server
2. Router matches URL to `app/[route]/page.tsx`
3. Layout components wrap page (`app/layout.tsx`)
4. Server Component renders on server (default)
5. HTML + RSC payload sent to client

**State Management:**
- No state management implemented
- React state (useState/useReducer) available for future client components
- No global state library configured

## Key Abstractions

**Root Layout:**
- Purpose: Wraps all pages with common HTML structure, fonts, global CSS
- Examples: `app/layout.tsx`
- Pattern: Next.js Layout pattern - receives `children` prop

**Page Component:**
- Purpose: Represents a routable view
- Examples: `app/page.tsx`
- Pattern: Default export function component

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx`
- Triggers: All page requests
- Responsibilities: HTML shell, font loading, global styles

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Render landing page content

**Next.js Config:**
- Location: `next.config.ts`
- Triggers: Build and dev server start
- Responsibilities: Framework configuration (currently empty)

## Error Handling

**Strategy:** Default Next.js error handling

**Patterns:**
- No custom error boundaries implemented
- No `error.tsx` or `not-found.tsx` files created
- Relies on Next.js default 404 and error pages

## Cross-Cutting Concerns

**Logging:** Not implemented - use browser console or add server logging

**Validation:** Not implemented - add when forms are introduced

**Authentication:** Not implemented - not required per project spec

**Styling:** Tailwind CSS v4 via PostCSS, global CSS variables in `app/globals.css`

**SEO:** Basic metadata export in `app/layout.tsx` - expand with page-specific metadata

## Future Architecture Considerations

Based on `projekt-beschreibung.md`, the following architectural patterns will need to be added:

**Planned Routes:**
- `/about`
- `/clay-club`
- `/brennservice`
- `/workshops`
- `/gruppen-events`
- `/kontakt`
- `/impressum`

**Planned Features Requiring Architecture:**
- Contact forms (server actions or API routes)
- Workshop listings (data fetching pattern)
- Image galleries (Next.js Image optimization)
- Google Maps integration (client component)
- Cookie banner (client component with persistence)

---

*Architecture analysis: 2026-01-16*
