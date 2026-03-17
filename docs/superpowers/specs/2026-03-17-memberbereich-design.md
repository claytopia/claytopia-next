# Design: Claytopia Memberbereich

**Datum:** 2026-03-17
**Status:** Approved

## Überblick

Ein Memberbereich für die Claytopia-Website, über den Teilnehmer:innen Clay-Club-Termine einsehen und buchen können. Pia verwaltet Termine, Mitglieder und Club-Karten über einen Admin-Bereich.

## Tech-Stack-Erweiterung

Auf dem bestehenden Next.js 16 / TypeScript / Tailwind v4 Stack:

- **Supabase** — Postgres-Datenbank + Auth (Magic Link + Email/Passwort)
- **Supabase Auth** — Einladungssystem, Sessions, Row Level Security

## Datenmodell

### `profiles`
Erweiterung von `auth.users` (Supabase).

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid (FK auth.users) | Primary Key |
| `first_name` | text | Vorname (wird anderen Mitgliedern angezeigt) |
| `role` | enum: `admin` / `member` | Zugangsebene |
| `created_at` | timestamptz | — |

### `club_cards`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid (FK profiles) | Besitzer:in |
| `type` | enum: `5er` / `10er` / `schnupper` | Kartentyp |
| `total_units` | integer | Gesamteinheiten (5, 10 oder 2) |
| `used_units` | integer | Verbrauchte Einheiten (manuell korrigierbar) |
| `valid_until` | date | Ablaufdatum (6 Monate ab Kauf) |
| `created_at` | timestamptz | — |

### `sessions`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primary Key |
| `date` | date | Datum des Termins |
| `start_time` | time | Startzeit |
| `max_participants` | integer | Max. Teilnehmerzahl (default: 5) |
| `created_at` | timestamptz | — |

### `bookings`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primary Key |
| `session_id` | uuid (FK sessions) | Gebuchter Termin |
| `user_id` | uuid (FK profiles) | Buchende Person |
| `created_at` | timestamptz | — |

## Routen & Seiten

### Öffentliche Seiten
| Route | Beschreibung |
|---|---|
| `/login` | Email + Passwort oder Magic Link anfordern |
| `/invite/[token]` | Erster Login nach Einladung: Vorname setzen, optional Passwort |

### Memberbereich (eingeloggt, role: member oder admin)
| Route | Beschreibung |
|---|---|
| `/members` | Buchungsübersicht: alle kommenden Termine als kompakte Liste |
| `/members/bookings` | Meine Buchungen + Karten-Status |

### Admin-Bereich (eingeloggt, role: admin)
| Route | Beschreibung |
|---|---|
| `/admin` | Dashboard: nächste Termine mit Belegungsübersicht |
| `/admin/sessions` | Termine erstellen, löschen, max. Teilnehmerzahl anpassen |
| `/admin/members` | Mitgliederliste, Einladung per Email, Karten verwalten |

## Auth-Flow

1. Pia lädt Mitglied per Email ein (aus `/admin/members`)
2. Supabase sendet Einladungsmail mit Magic Link
3. Mitglied klickt Link → `/invite/[token]`: Vorname eingeben, optional Passwort setzen
4. Danach: Login per Email + Passwort **oder** neuen Magic Link anfordern

## Booking UI

Kompakte Listenansicht (`/members`):
- Jeder Termin: Datum, Uhrzeit, Vornamen der bereits Angemeldeten, Anzahl freier Plätze
- Ausgebuchte Termine sind deaktiviert (visuell ausgegraut, kein Buchen-Button)
- Eigene Buchungen sind markiert (z.B. "Du bist dabei")

## Abmeldung

Mitglieder können sich von einem gebuchten Termin abmelden. Eine Abmeldefrist (z.B. 24h vorher) kann konfiguriert werden.

## Karten-Tracking

- Pro Buchung wird automatisch eine Einheit von der aktiven Karte abgezogen
- Mitglieder ohne aktive Karte (oder mit 0 verbleibenden Einheiten) können nicht buchen
- Pia kann `used_units` im Admin-Bereich manuell korrigieren

## Zugriffsregeln

- `/members/*` → nur eingeloggte Nutzer:innen (alle Rollen)
- `/admin/*` → nur role: `admin`
- Nicht eingeloggte Nutzer:innen werden zu `/login` weitergeleitet
- Eingeloggte Nicht-Admins, die `/admin` aufrufen, werden zu `/members` weitergeleitet

## Out of Scope

- Zahlungsabwicklung (Club-Karten werden außerhalb des Systems verkauft)
- Push-Benachrichtigungen
- Warteliste für ausgebuchte Termine
