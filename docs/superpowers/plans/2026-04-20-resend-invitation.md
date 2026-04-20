# Einladungsmail erneut senden – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Im Admin-Bereich einen Button hinzufügen, der eine erneute Einladungsmail an Mitglieder mit ausstehender Einladung sendet.

**Architecture:** Neue `resendInvitation` Server Action in `actions.ts`, neues `ResendInviteButton` Client Component analog zu `DeleteCardButton`, Button wird in `page.tsx` nur für Mitglieder mit `!profile.first_name` angezeigt.

**Tech Stack:** Next.js 15 App Router, Supabase Auth Admin API, React `'use client'`

> **Hinweis:** Kein Test-Framework vorhanden (laut CLAUDE.md). TDD-Schritte entfallen — stattdessen manuelle Verifikation im Browser.

---

## Dateiübersicht

| Aktion | Datei |
|--------|-------|
| Modify | `app/admin/members/actions.ts` |
| Create | `app/admin/members/ResendInviteButton.tsx` |
| Modify | `app/admin/members/page.tsx` |

---

### Task 1: Server Action `resendInvitation` hinzufügen

**Files:**
- Modify: `app/admin/members/actions.ts`

- [ ] **Step 1: Funktion am Ende von `actions.ts` einfügen**

Füge nach `updateCardUnits` folgende Funktion ein:

```typescript
export async function resendInvitation(email: string) {
  const serviceSupabase = createServiceClient()
  const { error } = await serviceSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/invite`,
  })
  if (error) return { error: `Einladung fehlgeschlagen: ${error.message}` }
  return { success: `Einladungsmail erneut an ${email} gesendet.` }
}
```

- [ ] **Step 2: Build prüfen**

```bash
npm run build
```

Erwartet: kein TypeScript-Fehler, Build erfolgreich.

- [ ] **Step 3: Commit**

```bash
git add app/admin/members/actions.ts
git commit -m "feat: resendInvitation server action"
```

---

### Task 2: `ResendInviteButton` Component erstellen

**Files:**
- Create: `app/admin/members/ResendInviteButton.tsx`

- [ ] **Step 1: Datei erstellen**

```tsx
'use client'

import { resendInvitation } from './actions'

export function ResendInviteButton({ email }: { email: string }) {
  async function handleClick() {
    if (!confirm(`Einladungsmail erneut senden an ${email}?`)) return
    const result = await resendInvitation(email)
    if (result.error) alert(result.error)
  }

  return (
    <button type="button" onClick={handleClick}
      className="text-xs text-primary hover:underline ml-2">
      Erneut senden
    </button>
  )
}
```

- [ ] **Step 2: Build prüfen**

```bash
npm run build
```

Erwartet: kein TypeScript-Fehler.

- [ ] **Step 3: Commit**

```bash
git add app/admin/members/ResendInviteButton.tsx
git commit -m "feat: ResendInviteButton component"
```

---

### Task 3: Button in Mitgliederliste einbinden

**Files:**
- Modify: `app/admin/members/page.tsx`

- [ ] **Step 1: Import hinzufügen**

In `page.tsx` bei den bestehenden Imports einfügen:

```typescript
import { ResendInviteButton } from './ResendInviteButton'
```

- [ ] **Step 2: Button neben "Einladung ausstehend"-Badge einfügen**

Den bestehenden Block (Zeile ~67):

```tsx
<p className="font-medium text-foreground-muted italic">
  {emailById[profile.id] ?? '—'}
  <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm not-italic">Einladung ausstehend</span>
</p>
```

Ersetzen durch:

```tsx
<p className="font-medium text-foreground-muted italic">
  {emailById[profile.id] ?? '—'}
  <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm not-italic">Einladung ausstehend</span>
  {emailById[profile.id] && (
    <ResendInviteButton email={emailById[profile.id]} />
  )}
</p>
```

- [ ] **Step 3: Build und manuelle Verifikation**

```bash
npm run build
npm run dev
```

Im Browser `/admin/members` öffnen:
- Button "Erneut senden" erscheint nur bei Mitgliedern mit "Einladung ausstehend"
- Klick öffnet Bestätigungsdialog mit E-Mail-Adresse
- Bei Bestätigung: Supabase sendet erneute Einladungsmail (ggf. im Supabase-Dashboard unter Authentication → Users prüfen)
- Bei Abbruch: nichts passiert

- [ ] **Step 4: Commit**

```bash
git add app/admin/members/page.tsx
git commit -m "feat: Einladungsmail erneut senden – Button in Mitgliederliste"
```
