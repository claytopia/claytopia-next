# Codebase Concerns

**Analysis Date:** 2026-01-16

## Tech Debt

**Boilerplate Placeholder Content:**
- Issue: The codebase contains only Create Next App boilerplate with no actual Claytopia business logic implemented
- Files: `app/page.tsx`, `app/layout.tsx`
- Impact: The entire application needs to be built from scratch; no reusable business logic exists
- Fix approach: Implement the pages and features described in `projekt-beschreibung.md`

**Default Metadata Not Updated:**
- Issue: Layout metadata still shows "Create Next App" title and description instead of Claytopia branding
- Files: `app/layout.tsx` (lines 15-18)
- Impact: Poor SEO; confusing user experience; unprofessional appearance
- Fix approach: Update metadata with proper Claytopia title, description, and Open Graph tags

**External Links to Vercel/Next.js Templates:**
- Issue: Page contains promotional links to Vercel deployment and Next.js learning resources that should be removed
- Files: `app/page.tsx` (lines 21-60)
- Impact: Irrelevant content for end users; will need complete replacement
- Fix approach: Replace entire page content with Claytopia homepage design

## Known Bugs

**None identified** - Codebase is too minimal (boilerplate only) to contain bugs.

## Security Considerations

**Missing Security Headers:**
- Risk: No security headers configured (CSP, X-Frame-Options, etc.)
- Files: `next.config.ts` (empty configuration)
- Current mitigation: None
- Recommendations: Add security headers via Next.js config or middleware

**No Form Handling Infrastructure:**
- Risk: Project requires contact forms, booking forms per `projekt-beschreibung.md`; no validation or CSRF protection setup
- Files: None exist yet
- Current mitigation: None
- Recommendations: Implement form handling with proper validation (e.g., zod) and CSRF protection when building forms

**Missing Cookie Consent:**
- Risk: GDPR compliance required per project description; no cookie consent banner implemented
- Files: None exist
- Current mitigation: None
- Recommendations: Implement DSGVO-compliant cookie consent before adding analytics or third-party services

**Environment Variables Not Documented:**
- Risk: No `.env.example` file; future developers won't know required configuration
- Files: Missing `.env.example`
- Current mitigation: `.env*` properly gitignored
- Recommendations: Create `.env.example` with required variables as external services are added

## Performance Bottlenecks

**No Current Bottlenecks** - Boilerplate app is too minimal to have performance issues.

**Future Concerns:**
- Image optimization will be critical for workshop/gallery photos
- Lighthouse score > 90 required per project spec
- Mobile-first performance important for target audience

## Fragile Areas

**None identified** - No business logic exists to be fragile.

## Scaling Limits

**Not Applicable** - No backend services, database, or state management implemented yet.

**Future Considerations:**
- Workshop booking system will need proper data storage
- Contact forms will need backend handling or external service
- Image galleries will need CDN/optimization strategy

## Dependencies at Risk

**@types/node Version Mismatch:**
- Risk: Current @types/node is 20.x but latest is 25.x; minor type definition gaps possible
- Impact: Minimal - type definitions only
- Migration plan: Update when convenient, no urgency

**No Other Dependency Risks:**
- All dependencies are current Next.js 16.1.3 ecosystem
- Zero npm audit vulnerabilities
- React 19.2.3 and Tailwind CSS 4 are latest stable versions

## Missing Critical Features

**All Core Pages Missing:**
- Problem: None of the required pages from project spec exist
- Blocks: Entire website launch
- Required pages:
  - `/about` - About Pia Kadasch
  - `/clay-club` - Clay Club offerings
  - `/brennservice` - Firing service
  - `/workshops` - Workshop listings
  - `/gruppen-events` - Group events
  - `/kontakt` - Contact page
  - `/impressum` - Legal imprint

**Contact Form Not Implemented:**
- Problem: No contact form or booking system
- Blocks: User inquiries, workshop registrations

**Google Maps Integration Missing:**
- Problem: Required per spec but not implemented
- Blocks: Location/directions feature on contact page

**Newsletter Signup Missing:**
- Problem: Required per spec for workshop updates
- Blocks: Marketing/engagement capability

**Image Assets Missing:**
- Problem: Only default Next.js/Vercel SVGs in `/public`
- Blocks: Visual design; atelier photos, workshop images needed

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: Everything - zero test files in project
- Files: No `*.test.*` or `*.spec.*` files outside node_modules
- Risk: No regression protection as features are added
- Priority: Medium - implement testing framework before significant feature development

**No Test Configuration:**
- Missing jest.config.* or vitest.config.*
- No test script in package.json beyond linting
- Recommendation: Add Vitest or Jest configuration when beginning feature development

---

*Concerns audit: 2026-01-16*
