# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

```
claytopia/
├── app/                    # Next.js App Router - pages, layouts, styles
│   ├── favicon.ico         # Site favicon
│   ├── globals.css         # Global styles and Tailwind config
│   ├── layout.tsx          # Root layout (HTML shell, fonts)
│   └── page.tsx            # Home page component
├── public/                 # Static assets served at root URL
│   ├── file.svg            # Icon asset
│   ├── globe.svg           # Icon asset
│   ├── next.svg            # Next.js logo
│   ├── vercel.svg          # Vercel logo
│   └── window.svg          # Icon asset
├── .planning/              # Project planning documentation
│   └── codebase/           # Codebase analysis documents
├── eslint.config.mjs       # ESLint flat config
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS config (Tailwind)
├── tsconfig.json           # TypeScript configuration
└── projekt-beschreibung.md # Project requirements (German)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router directory - all routes and UI components
- Contains: Page components, layouts, global CSS, favicon
- Key files: `layout.tsx` (root layout), `page.tsx` (home), `globals.css` (styles)

**`public/`:**
- Purpose: Static assets accessible via direct URL
- Contains: SVG icons, images
- Key files: Access via `/filename.svg` in browser

**`.planning/`:**
- Purpose: Documentation for development planning
- Contains: Codebase analysis, implementation plans
- Key files: `codebase/ARCHITECTURE.md`, `codebase/STRUCTURE.md`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout wrapping all pages
- `app/page.tsx`: Home page (route: `/`)

**Configuration:**
- `next.config.ts`: Next.js framework config
- `tsconfig.json`: TypeScript compiler options with `@/*` path alias
- `eslint.config.mjs`: ESLint rules (Next.js + TypeScript presets)
- `postcss.config.mjs`: PostCSS plugins (Tailwind CSS)

**Styling:**
- `app/globals.css`: Global styles, CSS variables, Tailwind import

**Assets:**
- `public/*.svg`: Static images/icons
- `app/favicon.ico`: Browser tab icon

## Naming Conventions

**Files:**
- React components: `kebab-case.tsx` (Next.js convention for routes)
- Config files: `lowercase.config.{ts,mjs}`
- TypeScript: `.tsx` for JSX, `.ts` for non-JSX

**Directories:**
- Route segments: `kebab-case` (e.g., `clay-club`, `gruppen-events`)
- Special Next.js dirs: lowercase (`app`, `public`)

**Components:**
- Function names: `PascalCase` (e.g., `Home`, `RootLayout`)
- Default export for pages and layouts

## Where to Add New Code

**New Page/Route:**
- Create: `app/[route-name]/page.tsx`
- Example: `app/about/page.tsx` for `/about`
- Include metadata export for SEO

**New Layout for Route Group:**
- Create: `app/[route-name]/layout.tsx`
- Wraps all pages in that route segment

**Shared Components:**
- Create: `app/components/[ComponentName].tsx` (recommended convention)
- Alternative: `components/` at root level
- Import with: `@/app/components/ComponentName` or `@/components/ComponentName`

**Server Actions (Forms):**
- Create: `app/actions/[action-name].ts`
- Or inline in page file with `"use server"` directive

**API Routes:**
- Create: `app/api/[endpoint]/route.ts`
- Export named functions: `GET`, `POST`, etc.

**Utilities/Helpers:**
- Create: `lib/[utility-name].ts`
- Import with: `@/lib/utility-name`

**Types:**
- Create: `types/[domain].ts`
- Import with: `@/types/domain`

**Static Assets:**
- Add to: `public/`
- Reference: `/filename.ext` in code

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes (by `next build` and `next dev`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning documents
- Generated: By planning tools
- Committed: Yes (project documentation)

## Path Alias

**Configured alias:** `@/*` maps to `./*` (project root)

**Usage examples:**
```typescript
import { Component } from '@/app/components/Component'
import { helper } from '@/lib/helpers'
import type { User } from '@/types/user'
```

## Recommended Directory Structure (as project grows)

```
claytopia/
├── app/
│   ├── (marketing)/        # Route group for marketing pages
│   │   ├── about/
│   │   ├── clay-club/
│   │   ├── brennservice/
│   │   ├── workshops/
│   │   ├── gruppen-events/
│   │   └── kontakt/
│   ├── (legal)/            # Route group for legal pages
│   │   └── impressum/
│   ├── api/                # API routes if needed
│   ├── components/         # Shared UI components
│   └── actions/            # Server actions
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
├── public/
│   └── images/             # Organized image assets
└── ...config files
```

---

*Structure analysis: 2026-01-16*
