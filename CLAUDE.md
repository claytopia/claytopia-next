# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

**Claytopia** is a Next.js 16 marketing site for a German pottery atelier using the App Router with TypeScript and Tailwind CSS v4.

### Key architectural patterns

- **App Router** — all pages live in `app/` as `page.tsx` files with a shared root layout (`app/layout.tsx`) that wraps every page in `<Header>` and `<Footer>`.
- **Server Actions** — the contact form (`app/contact/actions.ts`) uses `'use server'` + Nodemailer for email sending. No database; no API routes.
- **Client components** — only components requiring interactivity (mobile menu, contact form) use `'use client'`. The mobile menu mounts via a React portal with focus trapping (`focus-trap-react`).
- **Navigation config** — `app/config/navigation.ts` exports the single nav items array shared between `Header` and `MobileMenu`.

### Styling

Tailwind v4 with a custom design system defined via `@theme inline` in `app/globals.css`. Key tokens:
- Colors: `--clay-*` scale (earthy off-whites to dark browns) + `--terra-*` terracotta accents; semantic aliases (`--primary`, `--background`, `--foreground`, etc.)
- Fonts: `--font-serif` (Playfair Display) for headings, `--font-sans` (Lato) for body — loaded via `next/font/google` in root layout
- Border radius: `0.25rem` throughout (squared studio aesthetic)

### Environment variables

Copy `.env.example` to `.env.local` and fill in SMTP credentials:
```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_RECEIVER
```

The contact form action checks for `SMTP_USER` and `SMTP_PASS` at runtime; the form degrades gracefully if they are missing.

### Content & planning

Project requirements, roadmap, and current phase status live in `.planning/`. German-language content source documents (`about.md`, `clayclub.md`, `workshops.md`, `brennservice.md`) sit at the repo root.
