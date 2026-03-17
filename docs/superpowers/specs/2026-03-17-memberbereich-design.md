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

Alle Zeitangaben werden als `timestamptz` in UTC gespeichert und in der Anzeige nach Europe/Berlin (CET/CEST) konvertiert.

### `profiles`
Erweiterung von `auth.users` (Supabase). Wird per Trigger bei Registrierung angelegt.

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid (FK auth.users) PK | Primary Key |
| `first_name` | text NOT NULL | Vorname (wird anderen Mitgliedern angezeigt) |
| `last_name` | text NOT NULL | Nachname (nur für Pia sichtbar im Admin-Bereich, nicht im Member-UI) |
| `role` | enum: `admin` / `member` NOT NULL default `member` | Zugangsebene |
| `created_at` | timestamptz | — |

### `club_cards`
Werden von Pia manuell über den Admin-Bereich angelegt, nachdem eine Karte außerhalb des Systems verkauft wurde.

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Primary Key |
| `user_id` | uuid (FK profiles) NOT NULL | Besitzer:in |
| `type` | enum: `5er` / `10er` / `schnupper` NOT NULL | Kartentyp |
| `total_units` | integer NOT NULL CHECK (total_units > 0) | Gesamteinheiten (5, 10 oder 2) |
| `used_units` | integer NOT NULL default 0 CHECK (used_units >= 0 AND used_units <= total_units) | Verbrauchte Einheiten (manuell korrigierbar) |
| `valid_until` | date NOT NULL | Ablaufdatum (6 Monate ab Kauf) |
| `created_at` | timestamptz | — |

**Karten-Regeln:**
- Ein Mitglied kann mehrere Karten haben; beim Buchen wird die älteste noch gültige Karte mit verbleibenden Einheiten verwendet
- Abgelaufene Karten werden nicht übertragen
- Keine Übertragung ungenutzter Einheiten auf neue Karten

### `sessions`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Primary Key |
| `starts_at` | timestamptz NOT NULL | Startzeitpunkt (UTC gespeichert, Anzeige in Europe/Berlin) |
| `max_participants` | integer NOT NULL default 5 | Max. Teilnehmerzahl |
| `created_at` | timestamptz | — |

### `bookings`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | Primary Key |
| `session_id` | uuid (FK sessions) NOT NULL | Gebuchter Termin |
| `user_id` | uuid (FK profiles) NOT NULL | Buchende Person |
| `card_id` | uuid (FK club_cards) NOT NULL | Karte von der die Einheit abgezogen wurde |
| `status` | enum: `active` / `cancelled` NOT NULL default `active` | Buchungsstatus |
| `cancelled_at` | timestamptz | Zeitpunkt der Stornierung (null wenn aktiv) |
| `created_at` | timestamptz | — |

**Constraint:** UNIQUE(session_id, user_id) WHERE status = 'active' — verhindert gleichzeitige Doppelbuchungen, erlaubt aber erneutes Buchen nach Stornierung.

Buchungen werden soft-deleted (status = `cancelled`), nie hard-deleted. Stornierungen erstatten die Einheit immer auf die in `card_id` referenzierte Karte zurück — unabhängig von deren aktuellem Status.

Buchungen werden als Postgres-Transaktion durchgeführt um Race Conditions bei gleichzeitigen Buchungen zu verhindern (CHECK auf Kapazität + `used_units` Update atomar).

## Routen & Seiten

### Öffentliche Seiten
| Route | Beschreibung |
|---|---|
| `/login` | Email + Passwort oder Magic Link anfordern |
| `/invite/[token]` | Erster Login nach Einladung: Vorname eingeben, optional Passwort setzen |

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
2. Supabase sendet Einladungsmail mit Magic Link (gültig 24h)
3. Mitglied klickt Link → `/invite/[token]`: Vorname eingeben, optional Passwort setzen
4. Danach: Login per Email + Passwort **oder** neuen Magic Link anfordern
5. Abgelaufener Einladungslink (>24h) → Supabase gibt Fehler zurück → `/invite/[token]` zeigt Fehlermeldung mit Hinweis, Pia zu kontaktieren

**Passwort:** Supabase-Standard (mind. 6 Zeichen). Passwort-Vergessen-Flow über Supabase nativ. Mitglieder ohne Passwort fordern auf der Login-Seite einen neuen Magic Link an.

## Booking UI

Kompakte Listenansicht (`/members`):
- Jeder Termin: Datum, Uhrzeit, Vornamen der bereits Angemeldeten, Anzahl freier Plätze
- Ausgebuchte Termine: ausgegraut, kein Buchen-Button
- Eigene aktive Buchungen: "Du bist dabei" + Abmelden-Button
- Kein aktives Kartenkontingent: Buchen-Button deaktiviert mit Hinweis "Keine aktive Club-Karte"

## Abmeldung

- Mitglieder können aktive Buchungen stornieren (bis 24h vor Termin)
- Stornierung setzt `bookings.status = 'cancelled'` und erstattet die Einheit zurück (`used_units -= 1`)
- Nach der 24h-Frist ist der Abmelden-Button nicht mehr sichtbar

## Karten-Tracking

- Pro Buchung: `used_units += 1` auf der ältesten gültigen Karte mit Resteinheiten
- Pro Stornierung: `used_units -= 1` (Einheit wird zurückgegeben)
- Pia kann `used_units` im Admin-Bereich manuell korrigieren
- Mitglieder sehen auf `/members/bookings` ihre Karte(n) mit Resteinheiten und Ablaufdatum

## Zugriffsregeln (Row Level Security)

| Tabelle | Lesen | Schreiben |
|---|---|---|
| `profiles` | Nur eigenes Profil (member); alle Profile (admin) | Nur eigenes Profil |
| `club_cards` | Nur eigene Karten (member); alle (admin) | Nur admin |
| `sessions` | Alle eingeloggte Nutzer | Nur admin |
| `bookings` | Eigene Buchungen (member); alle (admin) | Eigene aktive Buchungen (member, nur status-Änderung); alle (admin) |

Vornamen anderer Mitglieder für die Buchungsanzeige werden über eine separate, schreibgeschützte View abgefragt (nur `first_name` und `session_id` — kein `last_name` oder andere Profildaten).

## Termin-Löschung (Admin)

- Termine **ohne** Buchungen: können direkt gelöscht werden
- Termine **mit** aktiven Buchungen: Admin wird gewarnt; Bestätigung erforderlich; alle aktiven Buchungen werden storniert (Einheiten erstattet); keine automatische Benachrichtigung an Mitglieder (Pia informiert manuell)

## Out of Scope

- Zahlungsabwicklung (Club-Karten werden außerhalb des Systems verkauft)
- Push-Benachrichtigungen / automatische Email-Erinnerungen
- Warteliste für ausgebuchte Termine
- Daten-Archivierung alter Termine
