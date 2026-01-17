# Claytopia

## What This Is

A modern, mobile-first website for Claytopia, a pottery atelier in Germany run by Pia Kadasch. The site showcases the studio's offerings (Clay Club, Brennservice, Workshops, Group Events) and converts visitors into community members through inspiring content and easy contact options.

This is a migration from the existing static HTML/CSS/JS site (claytopia.github.io) to Next.js with a fresh, contemporary design.

## Core Value

**Make visitors want to become part of the Claytopia community** - whether that's joining Clay Club, using the firing service, or booking a workshop. The site should inspire and make reaching out effortless.

## Current Milestone: v1.0 Homepage & Foundation

**Goal:** Build the homepage and establish design/technical foundation for the full site.

**Target features:**
- Homepage with hero, 4 offering sections (full visual sections with teasers), CTA, footer
- Hamburger menu navigation (mobile-first)
- Design system: earthy tones, warm/authentic feel, responsive
- Technical foundation: image optimization, SEO, Schema.org, cookie banner

**Design decisions:**
- Full sections for each offering (not cards) with teaser text and links to subpages
- Hamburger menu for navigation
- Minimal footer (contact, address, quick links only)
- Basic analytics requiring DSGVO cookie consent

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with hero, offerings overview, and clear CTAs
- [ ] About page introducing Pia and the Claytopia story
- [ ] Clay Club page with times, pricing, and what's included
- [ ] Brennservice page with pricing, process, and technical details
- [ ] Workshops page with offerings and details
- [ ] Group Events page (JGA, birthdays, team events) with inquiry option
- [ ] Contact page with form, phone, email, WhatsApp, address, and map
- [ ] Impressum (legal requirement)
- [ ] Mobile-first responsive design
- [ ] Modern, warm, authentic visual design (earthy tones, handcrafted feel)
- [ ] Fast performance (Lighthouse > 90)
- [ ] SEO optimization with proper metadata
- [ ] DSGVO-compliant cookie banner

### Out of Scope

- Online booking/payment system (Stripe) — future enhancement, keep contact-based flow for v1
- Newsletter signup system — can add later
- Real-time chat — contact form sufficient
- Video content — photos only for v1
- OAuth/user accounts — not needed for contact-based model
- Mobile app — web-first

## Context

**Existing site:** claytopia.github.io (static HTML/CSS/JS)
**Target audience:** Creative people in Germany looking for pottery as hobby or event experience
**Brand voice:** Personal, inviting, low-barrier ("Time to get dirty")
**Visual direction:** Handmade, authentic, warm — natural/earthy tones, atelier photos

**Current conversion flow:**
1. Visitor discovers Claytopia
2. Gets inspired by offerings and atmosphere
3. Contacts via form, phone (+49 171 833 6539), email (hello@claytopia.de), or WhatsApp
4. Pia handles scheduling and communication personally

**Technical context:**
- Fresh Next.js 16.1.3 scaffold with App Router
- React 19, Tailwind CSS 4
- Deployment target: Vercel
- See `.planning/codebase/` for detailed tech analysis

## Constraints

- **Tech stack**: Next.js with App Router, Tailwind CSS, TypeScript — already set up
- **Deployment**: Vercel (implied by Next.js, good fit for static/SSR hybrid)
- **Language**: German content, German audience
- **Legal**: DSGVO compliance required (cookie banner, privacy policy considerations)
- **Performance**: Lighthouse score > 90 per project spec
- **Design**: Mobile-first, must look good on phones first

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Contact-based conversion (no booking system) | Keeps v1 simple, Pia prefers personal communication | — Pending |
| Next.js App Router | Already scaffolded, modern approach, good DX | — Pending |
| Tailwind CSS v4 | Already configured, utility-first speeds up development | — Pending |
| Vercel deployment | Natural fit for Next.js, easy CI/CD | — Pending |

---
*Last updated: 2026-01-17 after v1.0 milestone planning*
