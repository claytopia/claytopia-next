# External Integrations

**Analysis Date:** 2026-01-16

## APIs & External Services

**None detected:**
- This is a fresh Next.js starter project
- No external API clients or SDKs installed
- No third-party service integrations configured

## Data Storage

**Databases:**
- None configured
- No ORM or database client packages installed

**File Storage:**
- Local filesystem only (static assets in `public/`)

**Caching:**
- None (Next.js built-in caching only)

## Authentication & Identity

**Auth Provider:**
- None configured
- No authentication library installed

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- Console only (default)

**Analytics:**
- None configured

## CI/CD & Deployment

**Hosting:**
- Vercel (implied by Next.js defaults)
- No `.vercel` directory present
- No deployment configuration files

**CI Pipeline:**
- None configured
- No GitHub Actions, CircleCI, or other CI config files

## Environment Configuration

**Required env vars:**
- None (no `.env` files present)
- `.gitignore` excludes `.env*` files

**Secrets location:**
- Not configured
- Use `.env.local` for local development secrets when needed

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

## Third-Party Integrations To Consider

When building out this application, common integrations include:

**Database:**
- Prisma + PostgreSQL/MySQL
- Drizzle + PostgreSQL
- Supabase

**Authentication:**
- NextAuth.js / Auth.js
- Clerk
- Supabase Auth

**Payments:**
- Stripe

**Email:**
- Resend
- SendGrid

**File Storage:**
- Vercel Blob
- AWS S3
- Cloudinary

**Analytics:**
- Vercel Analytics
- PostHog
- Plausible

---

*Integration audit: 2026-01-16*
