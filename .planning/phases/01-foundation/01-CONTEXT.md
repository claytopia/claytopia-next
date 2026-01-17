# Phase 1: Foundation - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Design system, responsive layout, and navigation components. Visitors see a professional, mobile-first site with warm Claytopia branding and intuitive navigation. This phase establishes the visual foundation that all content pages will build upon.

</domain>

<decisions>
## Implementation Decisions

### Color Palette
- Primary: Earthy green / sage (dominant color)
- Accent: Lilac (for CTAs, highlights, interactive elements)
- Background: Light sage (subtle green tint throughout)
- Text: Near-black charcoal (high contrast for readability)
- Colors must be configurable via CSS variables / Tailwind config for easy changes later

### Typography
- Headings: Modern sans-serif, clean and contemporary
- Weight: Medium and balanced (regular body, semi-bold headings)
- German text: Allow natural word wrapping (no special hyphenation)

### Navigation Behavior
- Hamburger menu on ALL devices (mobile and desktop) — consistent experience
- Menu animation: Slide from right
- Menu items: Main offerings only — Clay Club, Brennservice, Workshops, Events, Kontakt
- Header: Sticky (always visible when scrolling)
- Header contents: Logo/wordmark (left) + hamburger icon (right)

### Claude's Discretion
- Specific font family choices (Google Fonts or system fonts)
- Body text font (same as headings or complementary serif)
- Exact color hex values within the green/sage/lilac palette
- Spacing system and sizing scale
- Animation timing and easing for menu

</decisions>

<specifics>
## Specific Ideas

- Green + lilac is intentionally distinctive — not typical pottery brown/terracotta
- Keep header minimal (just logo + hamburger) to maximize visual space for photography
- Design system should support easy color theme changes in the future

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-01-17*
