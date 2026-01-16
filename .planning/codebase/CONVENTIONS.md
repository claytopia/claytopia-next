# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**
- React components: `PascalCase.tsx` (e.g., `page.tsx`, `layout.tsx`)
- Config files: `kebab-case.config.ts` or `kebab-case.config.mjs`
- CSS files: `kebab-case.css` (e.g., `globals.css`)

**Functions:**
- React components: PascalCase (e.g., `RootLayout`, `Home`)
- Utility functions: camelCase (not yet observed, follow standard)

**Variables:**
- Constants: camelCase (e.g., `geistSans`, `geistMono`)
- CSS custom properties: kebab-case with prefix (e.g., `--font-geist-sans`)

**Types:**
- Interfaces/Types: PascalCase
- Import type-only with `import type { X }` syntax

## Code Style

**Formatting:**
- Tool: None configured (no Prettier)
- Indentation: 2 spaces
- Quotes: Double quotes in JSX, double quotes in imports
- Semicolons: Implicit (no trailing semicolons observed)
- Line length: Flexible, long Tailwind class strings allowed

**Linting:**
- Tool: ESLint 9 with flat config
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Run: `npm run lint`

**TypeScript:**
- Config: `tsconfig.json`
- Strict mode: Enabled (`"strict": true`)
- Target: ES2017
- JSX: react-jsx (automatic runtime)

## Import Organization

**Order:**
1. Type imports (`import type { X } from "..."`)
2. External packages (`next`, `react`, etc.)
3. Relative imports (`./globals.css`)

**Path Aliases:**
- `@/*` maps to project root (e.g., `@/app/page`)
- Configured in `tsconfig.json`

## Error Handling

**Patterns:**
- Not yet established in codebase
- Recommend: Use Next.js error boundaries for component errors
- Recommend: Use `error.tsx` files in App Router for route-level errors

## Logging

**Framework:** None configured

**Patterns:**
- Use `console.log` for development debugging
- Remove before production
- Consider adding a logging library as the app grows

## Comments

**When to Comment:**
- Complex business logic
- Non-obvious code paths
- TODO items for future work

**JSDoc/TSDoc:**
- Not yet established
- Recommend for exported functions and components

## Function Design

**Components:**
- Use function declarations for page components: `export default function Name()`
- Destructure props inline with type annotation
- Example from `app/layout.tsx`:
```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ...
}
```

**Props Types:**
- Inline type definitions for simple props
- Use `Readonly<>` wrapper for immutability

## Module Design

**Exports:**
- Default exports for page components and layouts
- Named exports for utilities and types
- Metadata exported as named const: `export const metadata: Metadata = {...}`

**Barrel Files:**
- Not used currently
- Recommend creating `index.ts` files when adding `components/` or `lib/` directories

## Tailwind CSS Conventions

**Class Organization:**
- Layout classes first (flex, grid, positioning)
- Sizing classes (width, height, padding, margin)
- Visual classes (background, border, shadow)
- Typography classes (font, text)
- State classes (hover:, dark:, sm:, md:)

**Dark Mode:**
- Use `dark:` variant prefix
- CSS variables defined in `app/globals.css` for theme colors
- Use semantic color names: `--background`, `--foreground`

**Responsive Design:**
- Mobile-first approach
- Breakpoint prefixes: `sm:`, `md:`, `lg:`, etc.

## File Structure Conventions

**App Router:**
- `page.tsx` - Route page component
- `layout.tsx` - Shared layout wrapper
- `globals.css` - Global styles
- Keep route-specific components co-located with routes

**Recommended Additions:**
- `components/` - Shared React components
- `lib/` - Utility functions and helpers
- `types/` - Shared TypeScript types

---

*Convention analysis: 2026-01-16*
