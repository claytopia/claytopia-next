# Design: Einladungsmail erneut senden

**Datum:** 2026-04-20

## Ziel

Im Admin-Bereich (`/admin/members`) soll ein Button erscheinen, mit dem eine Einladungsmail erneut an einen Teilnehmer gesendet werden kann, der die Einladung noch nicht angenommen hat.

## Scope

Nur Mitglieder mit Status "Einladung ausstehend" (d.h. `profile.first_name` ist `null`) erhalten den Button.

## Komponenten

### 1. Server Action: `resendInvitation(email: string)`

**Datei:** `app/admin/members/actions.ts`

- Ruft `serviceSupabase.auth.admin.inviteUserByEmail(email, { redirectTo })` erneut auf
- Gibt `{ success: string }` oder `{ error: string }` zurück
- Supabase sendet dabei automatisch eine neue Einladungsmail

### 2. Client Component: `ResendInviteButton`

**Datei:** `app/admin/members/ResendInviteButton.tsx`

- Analog zu `DeleteCardButton`
- Props: `email: string`
- Bei Klick: `confirm('Einladungsmail erneut senden an <email>?')`
- Bei Bestätigung: ruft `resendInvitation(email)` auf
- Zeigt keinen persistenten Fehlerstatus (einfacher Alert bei Fehler)

### 3. Platzierung in `page.tsx`

- Button erscheint nur wenn `!profile.first_name` (Einladung ausstehend)
- Neben dem gelben "Einladung ausstehend"-Badge in der Mitgliederliste

## Fehlerbehandlung

- Supabase-Fehler werden als `alert()` im Browser angezeigt (konsistent mit dem einfachen UX-Muster der App)

## Was nicht geändert wird

- Bestehende `inviteMember`-Action und `InviteMemberForm` bleiben unverändert
- Keine Datenbank-Änderungen nötig
