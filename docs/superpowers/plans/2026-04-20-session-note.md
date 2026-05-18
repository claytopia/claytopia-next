# Session-Kommentar für Admins – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admins können an Clay-Club-Terminen einen optionalen Kommentar hinterlegen, der im Memberbereich kursiv unter dem Datum erscheint.

**Architecture:** Neue nullable Spalte `note` in Supabase `sessions`-Tabelle; `createSession` liest das Feld optional; neue Server Action `updateSessionNote` (mit `.bind`-Muster) für nachträgliche Bearbeitung; neues Client-Component `EditNoteForm` in der Admin-Liste; `SessionList` zeigt die Notiz an.

**Tech Stack:** Next.js App Router, Supabase, React `useActionState`, `'use client'`

> **Hinweis:** Kein Test-Framework vorhanden (laut CLAUDE.md). TDD-Schritte entfallen — stattdessen manuelle Verifikation im Browser und `npm run build`.

---

## Dateiübersicht

| Aktion | Datei |
|--------|-------|
| Manuell in Supabase Dashboard | `sessions`-Tabelle: Spalte `note TEXT NULL` |
| Modify | `app/admin/sessions/actions.ts` |
| Modify | `app/admin/sessions/SessionForm.tsx` |
| Create | `app/admin/sessions/EditNoteForm.tsx` |
| Modify | `app/admin/sessions/page.tsx` |
| Modify | `app/members/SessionList.tsx` |

---

### Task 1: Supabase-Migration – Spalte `note` hinzufügen

**Files:**
- Supabase Dashboard → SQL Editor

- [ ] **Step 1: SQL im Supabase SQL Editor ausführen**

Im Supabase-Dashboard unter **SQL Editor** folgendes Statement ausführen:

```sql
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS note TEXT NULL;
```

Erwartet: `Success. No rows returned.`

- [ ] **Step 2: Spalte in Table Editor prüfen**

Im Supabase-Dashboard → **Table Editor** → `sessions` → Spalte `note` (type `text`, nullable) ist sichtbar.

---

### Task 2: Server Actions – `createSession` + `updateSessionNote`

**Files:**
- Modify: `app/admin/sessions/actions.ts`

- [ ] **Step 1: `note` in `createSession` beim Insert hinzufügen**

In `actions.ts` Zeile 12–18 ersetzen (den Bereich von `const berlinDate` bis zum `.insert(...)`):

```typescript
  const note = (formData.get('note') as string | null) || null

  const berlinDate = new Date(dateTime + ':00')
  const startsAt = berlinDate.toISOString()

  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .insert({ starts_at: startsAt, max_participants: maxParticipants, note })
```

- [ ] **Step 2: Neue Action `updateSessionNote` am Ende der Datei anfügen**

Nach der `deleteSession`-Funktion einfügen:

```typescript
export async function updateSessionNote(sessionId: string, prevState: unknown, formData: FormData) {
  const note = (formData.get('note') as string | null) || null

  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ note })
    .eq('id', sessionId)

  if (error) return { error: 'Kommentar konnte nicht gespeichert werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/members')
  return { success: true }
}
```

- [ ] **Step 3: Build prüfen**

```bash
npm run build
```

Erwartet: kein TypeScript-Fehler, Build erfolgreich.

- [ ] **Step 4: Commit**

```bash
git add app/admin/sessions/actions.ts
git commit -m "feat: session note – actions createSession + updateSessionNote"
```

---

### Task 3: `SessionForm` – Textarea für Kommentar ergänzen

**Files:**
- Modify: `app/admin/sessions/SessionForm.tsx`

- [ ] **Step 1: Textarea unterhalb des Grid-Blocks einfügen**

In `SessionForm.tsx` den Block nach `</div>` (Ende des `grid grid-cols-2`-Divs, Zeile ~22) und vor `{state?.error ...}` einfügen:

```tsx
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Kommentar (optional)</label>
        <textarea name="note" rows={2} placeholder="z.B. Themenabend: Adventswerkstatt"
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      </div>
```

Die vollständige Datei nach der Änderung:

```tsx
'use client'

import { useActionState } from 'react'
import { createSession } from './actions'

export function SessionForm() {
  const [state, action, pending] = useActionState(createSession, null)

  return (
    <form action={action} className="border border-border rounded-sm p-6 space-y-4 bg-background">
      <h2 className="font-serif text-xl text-foreground">Neuen Termin anlegen</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Datum & Uhrzeit</label>
          <input name="starts_at" type="datetime-local" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Max. Teilnehmer</label>
          <input name="max_participants" type="number" defaultValue={5} min={1} max={20}
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Kommentar (optional)</label>
        <textarea name="note" rows={2} placeholder="z.B. Themenabend: Adventswerkstatt"
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Termin erstellt!</p>}
      <button type="submit" disabled={pending}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {pending ? 'Erstellen...' : 'Termin erstellen'}
      </button>
    </form>
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
git add app/admin/sessions/SessionForm.tsx
git commit -m "feat: session note – Kommentar-Textarea in SessionForm"
```

---

### Task 4: `EditNoteForm` – neues Client-Component erstellen

**Files:**
- Create: `app/admin/sessions/EditNoteForm.tsx`

- [ ] **Step 1: Datei erstellen**

```tsx
'use client'

import { useActionState } from 'react'
import { updateSessionNote } from './actions'

export function EditNoteForm({ sessionId, currentNote }: {
  sessionId: string
  currentNote: string | null
}) {
  const boundAction = updateSessionNote.bind(null, sessionId)
  const [state, action, pending] = useActionState(boundAction, null)

  return (
    <form action={action} className="mt-2">
      <textarea
        name="note"
        defaultValue={currentNote ?? ''}
        rows={2}
        placeholder="Kommentar (optional)"
        className="w-full border border-border rounded-sm px-2 py-1 text-xs text-foreground-muted bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <div className="flex items-center gap-2 mt-1">
        <button type="submit" disabled={pending}
          className="text-xs text-primary hover:underline disabled:opacity-50">
          {pending ? 'Speichern...' : 'Speichern'}
        </button>
        {state?.success && <span className="text-xs text-green-700">Gespeichert</span>}
        {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
      </div>
    </form>
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
git add app/admin/sessions/EditNoteForm.tsx
git commit -m "feat: session note – EditNoteForm Client-Component"
```

---

### Task 5: Admin-Terminliste – `note` im Select + `EditNoteForm` einbinden

**Files:**
- Modify: `app/admin/sessions/page.tsx`

- [ ] **Step 1: Import für `EditNoteForm` hinzufügen**

In `page.tsx` Zeile 4 nach `import { DeleteSessionButton } from './DeleteSessionButton'` einfügen:

```typescript
import { EditNoteForm } from './EditNoteForm'
```

- [ ] **Step 2: `note` in den Supabase-Select aufnehmen**

In `page.tsx` den `.select(...)` von Zeile 19 ändern:

```typescript
    .select('id, starts_at, max_participants, note')
```

- [ ] **Step 3: `EditNoteForm` unterhalb jedes Termins einbinden**

Den bestehenden `<div key={s.id} ...>`-Block (Zeile 54–67) so erweitern, dass `EditNoteForm` direkt nach dem `<div>` mit Datum und Teilnehmern erscheint. Die gesamte `.map()`-Rückgabe soll danach so aussehen:

```tsx
                  return (
                    <div key={s.id} className="border border-border rounded-sm p-4 gap-4">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</p>
                          <p className="text-xs text-foreground-muted mt-0.5">
                            {count}/{s.max_participants} Plätze · {names.join(', ') || 'keine Anmeldungen'}
                          </p>
                        </div>
                        <DeleteSessionButton
                          sessionId={s.id}
                          attendeeCount={count}
                          attendeeNames={names}
                        />
                      </div>
                      <EditNoteForm sessionId={s.id} currentNote={s.note} />
                    </div>
                  )
```

- [ ] **Step 4: Build prüfen**

```bash
npm run build
```

Erwartet: kein TypeScript-Fehler.

- [ ] **Step 5: Manuelle Verifikation im Browser**

```bash
npm run dev
```

`/admin/sessions` öffnen:
- Jeder Termin zeigt eine Textarea für den Kommentar
- Bestehende Termine ohne Note: Textarea leer
- Nach Eingabe und Klick "Speichern": Seite revalidiert, kurze "Gespeichert"-Rückmeldung erscheint
- Beim Anlegen eines neuen Termins mit Kommentar: Kommentar wird gespeichert (in Supabase prüfen)

- [ ] **Step 6: Commit**

```bash
git add app/admin/sessions/page.tsx
git commit -m "feat: session note – Admin-Liste mit EditNoteForm"
```

---

### Task 6: Member-Ansicht – `note` in `SessionList` anzeigen

**Files:**
- Modify: `app/members/SessionList.tsx`

> **Hinweis:** `app/members/page.tsx` verwendet bereits `select('*')` und `...s`-Spread, daher fließt `note` automatisch durch — keine Änderung an `page.tsx` nötig.

- [ ] **Step 1: `note` zum `SessionWithBooking`-Interface hinzufügen**

In `SessionList.tsx` das Interface (Zeile 6–14) erweitern:

```typescript
interface SessionWithBooking {
  id: string
  starts_at: string
  max_participants: number
  note: string | null
  attendeeNames: string[]
  activeBookingCount: number
  myBookingId: string | null
  hasActiveCard: boolean
}
```

- [ ] **Step 2: Note-Anzeige unterhalb des Datums einfügen**

Im Session-Block direkt nach `<p className="font-medium text-foreground">{formatBerlinTime(session.starts_at)} Uhr</p>` (Zeile 69) einfügen:

```tsx
              {session.note && (
                <p className="text-sm text-foreground-muted italic mt-0.5">{session.note}</p>
              )}
```

Der vollständige `<div className="min-w-0">`-Block sieht danach so aus:

```tsx
            <div className="min-w-0">
              <p className="font-medium text-foreground">{formatBerlinTime(session.starts_at)} Uhr</p>
              {session.note && (
                <p className="text-sm text-foreground-muted italic mt-0.5">{session.note}</p>
              )}
              <p className="text-sm text-foreground-muted mt-0.5">
                {session.attendeeNames.length > 0
                  ? `${session.attendeeNames.join(', ')} · `
                  : 'Noch niemand · '}
                {full
                  ? <span className="text-foreground-muted">ausgebucht</span>
                  : <span className={freeSpots <= 2 ? 'text-primary font-medium' : 'text-foreground-muted'}>
                      {freeSpots} {freeSpots === 1 ? 'Platz' : 'Plätze'} frei
                    </span>
                }
              </p>
              {errors[session.id] && <p className="text-xs text-red-600 mt-1">{errors[session.id]}</p>}
            </div>
```

- [ ] **Step 3: Build prüfen**

```bash
npm run build
```

Erwartet: kein TypeScript-Fehler.

- [ ] **Step 4: Manuelle Verifikation im Browser**

`/members` öffnen (als eingeloggtes Member):
- Termine ohne Note: keine kursive Zeile
- Termine mit Note (zuvor in Admin gesetzt): kursive Note erscheint direkt unter dem Datum, oberhalb der Teilnehmernamen-Zeile

Beispiel-Darstellung:
```
Fr., 28. August · 13:00 Uhr
Themenabend: Adventswerkstatt
Noch niemand · 5 Plätze frei
```

- [ ] **Step 5: Commit**

```bash
git add app/members/SessionList.tsx
git commit -m "feat: session note – Notiz in Member-Terminliste anzeigen"
```
