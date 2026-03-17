# Claytopia Memberbereich Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a member area with Clay Club session booking, club card tracking, and an admin panel to the existing Claytopia Next.js site.

**Architecture:** Supabase provides Postgres (tables + RLS + stored procedures) and Auth (magic link + email/password + invitations). Next.js middleware guards routes by role. Server Actions handle all mutations (booking, cancellation, admin CRUD). Pages are server-rendered; only forms and interactive elements use `'use client'`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, `@supabase/ssr`, `@supabase/supabase-js`

---

## File Map

**New files to create:**

```
lib/
  supabase/
    client.ts           # createBrowserClient — for use in Client Components
    server.ts           # createServerClient — for Server Components + Server Actions
    types.ts            # Database type definitions (manual, not generated)

middleware.ts           # Route protection (root of project)

app/
  login/
    page.tsx            # Login form: email+password OR magic link
    LoginForm.tsx       # 'use client' form component
    actions.ts          # signInWithPassword, sendMagicLink
  invite/
    [token]/
      page.tsx          # Complete profile after invitation
      InviteForm.tsx    # 'use client' form: first_name, last_name, optional password
      actions.ts        # completeInvite
  members/
    layout.tsx          # Auth guard: redirect to /login if not logged in
    page.tsx            # Session list with booking UI
    SessionList.tsx     # 'use client' — booking interactions
    bookings/
      page.tsx          # My bookings + card status
    actions.ts          # bookSession, cancelBooking
  admin/
    layout.tsx          # Auth guard: redirect to /members if not admin
    page.tsx            # Dashboard: upcoming sessions with occupancy
    sessions/
      page.tsx          # Session list + create form
      SessionForm.tsx   # 'use client' create session form
      actions.ts        # createSession, deleteSession
    members/
      page.tsx          # Member list + invite form + card management
      InviteMemberForm.tsx  # 'use client'
      CardForm.tsx          # 'use client'
      actions.ts            # inviteMember, createCard, updateCard

supabase/
  migrations/
    001_initial_schema.sql  # All tables, enums, constraints, triggers, RLS, view, functions
```

**Files to modify:**

```
.env.example                    # Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
app/config/navigation.ts        # Add "Mitglieder" link (conditional: shown when logged in)
app/components/Header.tsx       # Show login/logout button based on auth state
```

---

## Task 1: Dependencies + Environment Variables

**Files:** `package.json`, `.env.example`, `.env.local`

- [ ] **Install Supabase packages**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Expected: packages added to `node_modules`, `package-lock.json` updated.

- [ ] **Create Supabase project** (manual step)

  1. Go to [supabase.com](https://supabase.com), sign in, create a new project named `claytopia`
  2. Wait for project to be ready (~2 min)
  3. Go to **Settings → API** and copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret — server only)

- [ ] **Add env vars to `.env.example`**

```bash
# Add to existing .env.example
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Add real values to `.env.local`** (not committed to git)

- [ ] **Verify `.gitignore` has `.env.local`**

```bash
grep ".env.local" .gitignore
```

- [ ] **Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "feat: add Supabase dependencies"
```

---

## Task 2: Database Schema + RLS

**Files:** `supabase/migrations/001_initial_schema.sql`

Run this SQL in the Supabase Dashboard → **SQL Editor**.

- [ ] **Create the migration file**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('admin', 'member');
create type card_type as enum ('5er', '10er', 'schnupper');
create type booking_status as enum ('active', 'cancelled');

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name  text not null,
  role       user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Auto-create profile row when a new auth.users row is inserted
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name)
  values (new.id, '', '');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CLUB CARDS
-- ============================================================
create table club_cards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        card_type not null,
  total_units integer not null check (total_units > 0),
  used_units  integer not null default 0
    check (used_units >= 0 and used_units <= total_units),
  valid_until date not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- SESSIONS
-- ============================================================
create table sessions (
  id               uuid primary key default gen_random_uuid(),
  starts_at        timestamptz not null,
  max_participants integer not null default 5,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table bookings (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references sessions(id) on delete restrict,
  user_id      uuid not null references profiles(id) on delete cascade,
  card_id      uuid not null references club_cards(id) on delete restrict,
  status       booking_status not null default 'active',
  cancelled_at timestamptz,
  created_at   timestamptz not null default now()
);

-- Prevent simultaneous duplicate active bookings
create unique index bookings_active_unique
  on bookings (session_id, user_id)
  where status = 'active';

-- ============================================================
-- VIEW: booking attendees (first names only — visible to members)
-- ============================================================
create view session_attendees as
  select b.session_id, p.first_name
  from bookings b
  join profiles p on p.id = b.user_id
  where b.status = 'active';

-- ============================================================
-- FUNCTION: book_session (atomic — prevents overbooking)
-- ============================================================
create or replace function book_session(
  p_session_id uuid,
  p_user_id    uuid,
  p_card_id    uuid
)
returns void language plpgsql security definer as $$
declare
  v_count integer;
  v_max   integer;
begin
  -- Lock the session row to prevent concurrent overbooking
  select max_participants into v_max
  from sessions
  where id = p_session_id
  for update;

  if v_max is null then
    raise exception 'Session not found';
  end if;

  -- Count current active bookings
  select count(*) into v_count
  from bookings
  where session_id = p_session_id and status = 'active';

  if v_count >= v_max then
    raise exception 'Session is fully booked';
  end if;

  -- Insert booking
  insert into bookings (session_id, user_id, card_id)
  values (p_session_id, p_user_id, p_card_id);

  -- Deduct unit from card
  update club_cards
  set used_units = used_units + 1
  where id = p_card_id;
end;
$$;

-- ============================================================
-- FUNCTION: cancel_booking (refunds unit to original card)
-- ============================================================
create or replace function cancel_booking(
  p_booking_id uuid,
  p_user_id    uuid
)
returns void language plpgsql security definer as $$
declare
  v_card_id uuid;
begin
  -- Get the card used for this booking (verify ownership)
  select card_id into v_card_id
  from bookings
  where id = p_booking_id
    and user_id = p_user_id
    and status = 'active';

  if v_card_id is null then
    raise exception 'Booking not found or already cancelled';
  end if;

  -- Soft-delete booking
  update bookings
  set status = 'cancelled', cancelled_at = now()
  where id = p_booking_id;

  -- Refund unit to original card
  update club_cards
  set used_units = used_units - 1
  where id = v_card_id;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles   enable row level security;
alter table club_cards enable row level security;
alter table sessions   enable row level security;
alter table bookings   enable row level security;

-- Helper: is current user admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select role = 'admin' from profiles where id = auth.uid();
$$;

-- profiles
create policy "Own profile readable" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "Own profile writable" on profiles
  for update using (id = auth.uid());

-- club_cards
create policy "Own cards readable" on club_cards
  for select using (user_id = auth.uid() or is_admin());
create policy "Admin manages cards" on club_cards
  for all using (is_admin());

-- sessions
create policy "Sessions readable by authenticated" on sessions
  for select using (auth.uid() is not null);
create policy "Admin manages sessions" on sessions
  for all using (is_admin());

-- bookings
create policy "Own bookings readable" on bookings
  for select using (user_id = auth.uid() or is_admin());
create policy "Admin manages bookings" on bookings
  for all using (is_admin());

-- session_attendees view (first names only — all authenticated users)
grant select on session_attendees to authenticated;
```

- [ ] **Run migration in Supabase SQL Editor**

  1. Open [supabase.com](https://supabase.com) → your project → **SQL Editor**
  2. Paste the full SQL above and click **Run**
  3. Verify in **Table Editor** that 4 tables exist: `profiles`, `club_cards`, `sessions`, `bookings`

- [ ] **Create your admin profile** (manual step in SQL Editor)

After creating your Supabase Auth account (done in Task 5), run:
```sql
update profiles set role = 'admin', first_name = 'Pia', last_name = 'Kadasch'
where id = (select id from auth.users where email = 'hello@claytopia.de');
```

- [ ] **Commit migration file**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add database schema, RLS, and stored procedures"
```

---

## Task 3: Supabase Client Utilities + Types

**Files:** `lib/supabase/types.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`

- [ ] **Create `lib/supabase/types.ts`**

```typescript
export type UserRole = 'admin' | 'member'
export type CardType = '5er' | '10er' | 'schnupper'
export type BookingStatus = 'active' | 'cancelled'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
}

export interface ClubCard {
  id: string
  user_id: string
  type: CardType
  total_units: number
  used_units: number
  valid_until: string
  created_at: string
}

export interface Session {
  id: string
  starts_at: string
  max_participants: number
  created_at: string
}

export interface Booking {
  id: string
  session_id: string
  user_id: string
  card_id: string
  status: BookingStatus
  cancelled_at: string | null
  created_at: string
}

export interface SessionAttendee {
  session_id: string
  first_name: string
}
```

- [ ] **Create `lib/supabase/client.ts`** (for use in Client Components only)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Create `lib/supabase/server.ts`** (for use in Server Components and Server Actions)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {} // Server Component — mutations are ignored
        },
      },
    }
  )
}

/** Service-role client — bypasses RLS. Server-side only, never send to client. */
export function createServiceClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

- [ ] **Commit**

```bash
git add lib/
git commit -m "feat: add Supabase client utilities and types"
```

---

## Task 4: Middleware (Route Protection)

**Files:** `middleware.ts` (project root)

- [ ] **Create `middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /members and /admin
  if ((path.startsWith('/members') || path.startsWith('/admin')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect /admin — check role
  if (path.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/members', request.url))
    }
  }

  // Redirect logged-in users away from /login
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/members', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/members/:path*', '/admin/:path*', '/login'],
}
```

- [ ] **Verify locally**: `npm run dev`, open `http://localhost:3000/members` — should redirect to `/login`.

- [ ] **Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware for route protection"
```

---

## Task 5: Login Page

**Files:** `app/login/page.tsx`, `app/login/LoginForm.tsx`, `app/login/actions.ts`

- [ ] **Create `app/login/actions.ts`**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithPassword(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'E-Mail oder Passwort falsch.' }
  redirect('/members')
}

export async function sendMagicLink(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/members` },
  })

  if (error) return { error: 'E-Mail konnte nicht gesendet werden.' }
  return { success: 'Magic Link wurde gesendet! Schau in dein Postfach.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

- [ ] **Add `NEXT_PUBLIC_SITE_URL` to `.env.local` and `.env.example`**

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

(Set to `https://claytopia.de` in Vercel production environment variables.)

- [ ] **Create `app/login/LoginForm.tsx`**

```typescript
'use client'

import { useActionState } from 'react'
import { signInWithPassword, sendMagicLink } from './actions'

export function LoginForm() {
  const [passwordState, passwordAction, passwordPending] = useActionState(signInWithPassword, null)
  const [magicState, magicAction, magicPending] = useActionState(sendMagicLink, null)

  return (
    <div className="space-y-8">
      {/* Password login */}
      <form action={passwordAction} className="space-y-4">
        <h2 className="font-serif text-xl text-foreground">Mit Passwort anmelden</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">E-Mail</label>
          <input name="email" type="email" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Passwort</label>
          <input name="password" type="password" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {passwordState?.error && (
          <p className="text-sm text-red-600">{passwordState.error}</p>
        )}
        <button type="submit" disabled={passwordPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          {passwordPending ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-foreground-muted bg-background px-2">oder</div>
      </div>

      {/* Magic link */}
      <form action={magicAction} className="space-y-4">
        <h2 className="font-serif text-xl text-foreground">Magic Link anfordern</h2>
        <p className="text-sm text-foreground-muted">Wir senden dir einen Einmal-Link per E-Mail.</p>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">E-Mail</label>
          <input name="email" type="email" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {magicState?.error && <p className="text-sm text-red-600">{magicState.error}</p>}
        {magicState?.success && <p className="text-sm text-green-700">{magicState.success}</p>}
        <button type="submit" disabled={magicPending}
          className="w-full border border-primary text-primary py-2 rounded-sm text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50">
          {magicPending ? 'Sende...' : 'Magic Link senden'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Create `app/login/page.tsx`**

```typescript
import { Container } from '../components/Container'
import { LoginForm } from './LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Anmelden – Claytopia' }

export default function LoginPage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Willkommen zurück</h1>
          <p className="text-foreground-muted mb-10">Melde dich an um deine Termine zu verwalten.</p>
          <LoginForm />
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Add password reset link to `LoginForm.tsx`** — below the password field, add:

```typescript
<div className="text-right">
  <a href="/reset-password" className="text-xs text-foreground-muted hover:text-primary">
    Passwort vergessen?
  </a>
</div>
```

Then create `app/reset-password/page.tsx` with a simple form that calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })`. Supabase handles the full reset email flow natively — no custom token logic needed.

- [ ] **Verify**: `npm run dev` → open `http://localhost:3000/login` — page renders. Try wrong credentials — error message appears.

- [ ] **Commit**

```bash
git add app/login/ app/reset-password/
git commit -m "feat: add login page (password + magic link + password reset)"
```

---

## Task 6: Invite Page

**Files:** `app/invite/[token]/page.tsx`, `app/invite/[token]/InviteForm.tsx`, `app/invite/[token]/actions.ts`

- [ ] **Create `app/invite/[token]/actions.ts`**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeInvite(prevState: unknown, formData: FormData) {
  const firstName = (formData.get('first_name') as string).trim()
  const lastName = (formData.get('last_name') as string).trim()
  const password = (formData.get('password') as string).trim()

  if (!firstName || !lastName) return { error: 'Bitte Vor- und Nachname eingeben.' }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) return { error: 'Ungültiger oder abgelaufener Einladungslink. Bitte Pia kontaktieren.' }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', user.id)

  if (profileError) return { error: 'Fehler beim Speichern des Profils.' }

  // Optionally set password
  if (password) {
    if (password.length < 6) return { error: 'Passwort muss mindestens 6 Zeichen haben.' }
    const { error: pwError } = await supabase.auth.updateUser({ password })
    if (pwError) return { error: 'Passwort konnte nicht gesetzt werden.' }
  }

  redirect('/members')
}
```

- [ ] **Create `app/invite/[token]/InviteForm.tsx`**

```typescript
'use client'

import { useActionState } from 'react'
import { completeInvite } from './actions'

export function InviteForm() {
  const [state, action, pending] = useActionState(completeInvite, null)

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Vorname *</label>
          <input name="first_name" type="text" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nachname *</label>
          <input name="last_name" type="text" required
            className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Passwort <span className="text-foreground-muted font-normal">(optional, mind. 6 Zeichen)</span>
        </label>
        <input name="password" type="password" minLength={6}
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <p className="text-xs text-foreground-muted mt-1">Ohne Passwort kannst du dich jederzeit per Magic Link anmelden.</p>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {pending ? 'Speichern...' : 'Profil anlegen & loslegen'}
      </button>
    </form>
  )
}
```

- [ ] **Create `app/invite/[token]/page.tsx`**

```typescript
import { Container } from '@/app/components/Container'
import { InviteForm } from './InviteForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Konto einrichten – Claytopia' }

export default function InvitePage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Herzlich willkommen!</h1>
          <p className="text-foreground-muted mb-10">
            Richte kurz dein Konto ein — dann kann es losgehen.
          </p>
          <InviteForm />
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Configure Supabase redirect URL** (manual step)

  In Supabase Dashboard → **Authentication → URL Configuration**:
  - Add `http://localhost:3000/invite/**` to **Redirect URLs**
  - Add `https://claytopia.de/invite/**` for production

- [ ] **Commit**

```bash
git add app/invite/
git commit -m "feat: add invite flow (complete profile after invitation)"
```

---

## Task 7: Members Layout (Auth Guard)

**Files:** `app/members/layout.tsx`

- [ ] **Create `app/members/layout.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <>{children}</>
}
```

- [ ] **Commit**

```bash
git add app/members/layout.tsx
git commit -m "feat: add members layout with auth guard"
```

---

## Task 8: Sessions List + Booking

**Files:** `app/members/page.tsx`, `app/members/SessionList.tsx`, `app/members/actions.ts`

- [ ] **Create `app/members/actions.ts`**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bookSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  // Find oldest valid card with remaining units
  // Note: Supabase JS client doesn't support column-to-column comparisons directly,
  // so we fetch all valid cards and filter in JS.
  const today = new Date().toISOString().split('T')[0]
  const { data: cards } = await supabase
    .from('club_cards')
    .select('id, used_units, total_units')
    .eq('user_id', user.id)
    .gte('valid_until', today)
    .order('created_at', { ascending: true })

  const card = cards?.find(c => c.used_units < c.total_units) ?? null

  if (!card) return { error: 'Keine aktive Club-Karte mit verbleibenden Einheiten.' }

  // Use the atomic stored procedure
  const { error } = await supabase.rpc('book_session', {
    p_session_id: sessionId,
    p_user_id: user.id,
    p_card_id: card.id,
  })

  if (error) {
    if (error.message.includes('fully booked')) return { error: 'Dieser Termin ist leider ausgebucht.' }
    return { error: 'Buchung fehlgeschlagen. Bitte versuche es erneut.' }
  }

  revalidatePath('/members')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet.' }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
  })

  if (error) return { error: 'Stornierung fehlgeschlagen.' }

  revalidatePath('/members')
  revalidatePath('/members/bookings')
  return { success: true }
}
```


- [ ] **Create `app/members/SessionList.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { bookSession, cancelBooking } from './actions'

interface SessionWithBooking {
  id: string
  starts_at: string
  max_participants: number
  attendeeNames: string[]
  activeBookingCount: number
  myBookingId: string | null
  hasActiveCard: boolean
}

function formatBerlinTime(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isWithin24h(iso: string) {
  return new Date(iso).getTime() - Date.now() < 24 * 60 * 60 * 1000
}

export function SessionList({ sessions, hasActiveCard }: {
  sessions: SessionWithBooking[]
  hasActiveCard: boolean
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleBook(sessionId: string) {
    setLoadingId(sessionId)
    setErrors(e => ({ ...e, [sessionId]: '' }))
    const result = await bookSession(sessionId)
    if (result?.error) setErrors(e => ({ ...e, [sessionId]: result.error }))
    setLoadingId(null)
  }

  async function handleCancel(bookingId: string, sessionId: string) {
    setLoadingId(sessionId)
    const result = await cancelBooking(bookingId)
    if (result?.error) setErrors(e => ({ ...e, [sessionId]: result.error }))
    setLoadingId(null)
  }

  if (sessions.length === 0) {
    return <p className="text-foreground-muted">Keine kommenden Termine geplant.</p>
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => {
        const full = session.activeBookingCount >= session.max_participants
        const isBooked = !!session.myBookingId
        const tooLate = isWithin24h(session.starts_at)
        const freeSpots = session.max_participants - session.activeBookingCount

        return (
          <div key={session.id}
            className={`border border-border rounded-sm p-4 flex items-center justify-between gap-4 ${full && !isBooked ? 'opacity-60 bg-background-alt' : 'bg-background'}`}>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{formatBerlinTime(session.starts_at)} Uhr</p>
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

            <div className="shrink-0">
              {isBooked ? (
                tooLate ? (
                  <span className="text-sm text-primary font-medium">Du bist dabei</span>
                ) : (
                  <button
                    onClick={() => handleCancel(session.myBookingId!, session.id)}
                    disabled={loadingId === session.id}
                    className="text-sm border border-border text-foreground-muted px-3 py-1.5 rounded-sm hover:border-foreground transition-colors disabled:opacity-50">
                    {loadingId === session.id ? '...' : 'Abmelden'}
                  </button>
                )
              ) : full ? (
                <span className="text-sm text-foreground-muted">Voll</span>
              ) : !hasActiveCard ? (
                <span className="text-sm text-foreground-muted" title="Keine aktive Club-Karte">Keine Karte</span>
              ) : (
                <button
                  onClick={() => handleBook(session.id)}
                  disabled={loadingId === session.id}
                  className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loadingId === session.id ? '...' : 'Buchen'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Create `app/members/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Container } from '../components/Container'
import { SessionList } from './SessionList'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Termine – Claytopia Memberbereich' }

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Upcoming sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  // My active bookings
  const { data: myBookings } = await supabase
    .from('bookings')
    .select('id, session_id')
    .eq('user_id', user!.id)
    .eq('status', 'active')

  // Attendee first names per session
  const { data: attendees } = await supabase
    .from('session_attendees')
    .select('session_id, first_name')
    .in('session_id', sessions?.map(s => s.id) ?? [])

  // Active bookings count per session (from attendees view)
  const bookingCountBySession: Record<string, number> = {}
  const namesBySession: Record<string, string[]> = {}
  for (const a of attendees ?? []) {
    bookingCountBySession[a.session_id] = (bookingCountBySession[a.session_id] ?? 0) + 1
    namesBySession[a.session_id] = [...(namesBySession[a.session_id] ?? []), a.first_name]
  }

  const myBookingBySession = Object.fromEntries(
    (myBookings ?? []).map(b => [b.session_id, b.id])
  )

  // Check if user has an active card
  const today = new Date().toISOString().split('T')[0]
  const { data: cards } = await supabase
    .from('club_cards')
    .select('id, used_units, total_units')
    .eq('user_id', user!.id)
    .gte('valid_until', today)

  const hasActiveCard = (cards ?? []).some(c => c.used_units < c.total_units)

  const sessionsWithData = (sessions ?? []).map(s => ({
    ...s,
    attendeeNames: namesBySession[s.id] ?? [],
    activeBookingCount: bookingCountBySession[s.id] ?? 0,
    myBookingId: myBookingBySession[s.id] ?? null,
    hasActiveCard,
  }))

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl text-foreground mb-2">Kommende Termine</h1>
          <p className="text-foreground-muted mb-10">Melde dich für einen Clay Club Termin an.</p>
          <SessionList sessions={sessionsWithData} hasActiveCard={hasActiveCard} />
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Verify**: Log in as a member, open `/members` — sessions list renders (empty if none created yet). Create a test session in Supabase Table Editor (`sessions` table), reload page — session appears.

- [ ] **Commit**

```bash
git add app/members/page.tsx app/members/SessionList.tsx app/members/actions.ts
git commit -m "feat: add member session list with booking action"
```

---

## Task 9: My Bookings Page

**Files:** `app/members/bookings/page.tsx`

- [ ] **Create `app/members/bookings/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meine Buchungen – Claytopia' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

export default async function MyBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, created_at, sessions(starts_at)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const { data: cards } = await supabase
    .from('club_cards')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  const cardTypeLabel = { '5er': '5er-Karte', '10er': '10er-Karte', 'schnupper': 'Schnupperkarte' }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl space-y-12">
          <div>
            <h1 className="font-serif text-4xl text-foreground mb-8">Meine Buchungen</h1>
            {!bookings?.length ? (
              <p className="text-foreground-muted">Du hast noch keine Buchungen.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map(b => {
                  const session = b.sessions as { starts_at: string } | null
                  return (
                    <div key={b.id} className={`border border-border rounded-sm p-4 flex justify-between items-center ${b.status === 'cancelled' ? 'opacity-50' : ''}`}>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {session ? formatDate(session.starts_at) + ' Uhr' : '—'}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-border text-foreground-muted'}`}>
                        {b.status === 'active' ? 'Aktiv' : 'Storniert'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-6">Meine Club-Karten</h2>
            {!cards?.length ? (
              <p className="text-foreground-muted">Keine Club-Karte vorhanden. Kontaktiere Pia.</p>
            ) : (
              <div className="space-y-3">
                {cards.map(card => {
                  const remaining = card.total_units - card.used_units
                  const expired = card.valid_until < today
                  return (
                    <div key={card.id} className={`border border-border rounded-sm p-4 ${expired ? 'opacity-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{cardTypeLabel[card.type as keyof typeof cardTypeLabel]}</p>
                          <p className="text-sm text-foreground-muted mt-0.5">
                            {remaining} von {card.total_units} Einheiten verbleibend
                          </p>
                        </div>
                        <div className="text-right text-sm text-foreground-muted">
                          <p>Gültig bis</p>
                          <p className="font-medium text-foreground">
                            {new Date(card.valid_until).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 bg-secondary rounded-sm h-2">
                        <div
                          className={`h-2 rounded-sm transition-all ${expired ? 'bg-border' : 'bg-primary'}`}
                          style={{ width: `${(remaining / card.total_units) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add app/members/bookings/page.tsx
git commit -m "feat: add my bookings and card status page"
```

---

## Task 10: Admin Layout

**Files:** `app/admin/layout.tsx`

- [ ] **Create `app/admin/layout.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/members')

  return <>{children}</>
}
```

- [ ] **Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add admin layout with role guard"
```

---

## Task 11: Admin Dashboard

**Files:** `app/admin/page.tsx`

- [ ] **Create `app/admin/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin – Claytopia' }

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, starts_at, max_participants')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(10)

  const { data: attendees } = await supabase
    .from('session_attendees')
    .select('session_id, first_name')
    .in('session_id', sessions?.map(s => s.id) ?? [])

  const countBySession: Record<string, number> = {}
  for (const a of attendees ?? []) {
    countBySession[a.session_id] = (countBySession[a.session_id] ?? 0) + 1
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin', weekday: 'short', day: 'numeric',
      month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl text-foreground mb-2">Admin</h1>
          <div className="flex gap-4 mb-10 text-sm">
            <Link href="/admin/sessions" className="text-primary hover:underline">Termine verwalten →</Link>
            <Link href="/admin/members" className="text-primary hover:underline">Mitglieder verwalten →</Link>
          </div>

          <h2 className="font-serif text-2xl text-foreground mb-4">Nächste Termine</h2>
          {!sessions?.length ? (
            <p className="text-foreground-muted">Keine kommenden Termine.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => {
                const count = countBySession[s.id] ?? 0
                return (
                  <div key={s.id} className="border border-border rounded-sm p-4 flex justify-between items-center">
                    <span className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</span>
                    <span className="text-sm text-foreground-muted">
                      {count} / {s.max_participants} Plätze belegt
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin dashboard"
```

---

## Task 12: Admin Sessions Management

**Files:** `app/admin/sessions/page.tsx`, `app/admin/sessions/SessionForm.tsx`, `app/admin/sessions/actions.ts`

- [ ] **Add `admin_cancel_booking` to the migration** — run this SQL in Supabase SQL Editor (in addition to the migration from Task 2):

```sql
create or replace function admin_cancel_booking(p_booking_id uuid)
returns void language plpgsql security definer as $$
declare v_card_id uuid;
begin
  select card_id into v_card_id from bookings where id = p_booking_id and status = 'active';
  if v_card_id is null then return; end if;
  update bookings set status = 'cancelled', cancelled_at = now() where id = p_booking_id;
  update club_cards set used_units = used_units - 1 where id = v_card_id;
end;
$$;
```

Also append this function to `supabase/migrations/001_initial_schema.sql` so it's part of the version-controlled schema.

- [ ] **Create `app/admin/sessions/actions.ts`**

```typescript
'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSession(prevState: unknown, formData: FormData) {
  const dateTime = formData.get('starts_at') as string // "2026-03-18T19:00"
  const maxParticipants = Number(formData.get('max_participants')) || 5

  if (!dateTime) return { error: 'Datum und Uhrzeit erforderlich.' }

  // Convert local Berlin time to UTC
  const berlinDate = new Date(dateTime + ':00')
  const startsAt = berlinDate.toISOString()

  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .insert({ starts_at: startsAt, max_participants: maxParticipants })

  if (error) return { error: 'Termin konnte nicht erstellt werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

export async function deleteSession(sessionId: string) {
  // Use service client: admin must be able to cancel any user's bookings (bypasses RLS)
  const serviceSupabase = createServiceClient()

  // Get active bookings for this session
  const { data: activeBookings } = await serviceSupabase
    .from('bookings')
    .select('id')
    .eq('session_id', sessionId)
    .eq('status', 'active')

  // Cancel all active bookings and refund units via admin_cancel_booking function
  for (const booking of activeBookings ?? []) {
    await serviceSupabase.rpc('admin_cancel_booking', { p_booking_id: booking.id })
  }

  // Now delete the session (no active bookings remain)
  const { error } = await serviceSupabase.from('sessions').delete().eq('id', sessionId)
  if (error) return { error: 'Termin konnte nicht gelöscht werden.' }

  revalidatePath('/admin/sessions')
  revalidatePath('/admin')
  revalidatePath('/members')
  return { success: true }
}

- [ ] **Create `app/admin/sessions/SessionForm.tsx`**

```typescript
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

- [ ] **Create `app/admin/sessions/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { SessionForm } from './SessionForm'
import { deleteSession } from './actions'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Termine – Admin' }

export default async function AdminSessionsPage() {
  const supabase = await createClient()
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, starts_at, max_participants')
    .order('starts_at', { ascending: true })

  const { data: attendees } = await supabase
    .from('session_attendees')
    .select('session_id, first_name')
    .in('session_id', sessions?.map(s => s.id) ?? [])

  const countBySession: Record<string, number> = {}
  const namesBySession: Record<string, string[]> = {}
  for (const a of attendees ?? []) {
    countBySession[a.session_id] = (countBySession[a.session_id] ?? 0) + 1
    namesBySession[a.session_id] = [...(namesBySession[a.session_id] ?? []), a.first_name]
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin', weekday: 'long', day: 'numeric',
      month: 'long', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl space-y-10">
          <h1 className="font-serif text-4xl text-foreground">Termine</h1>
          <SessionForm />
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-4">Alle Termine</h2>
            {!sessions?.length ? (
              <p className="text-foreground-muted">Noch keine Termine angelegt.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map(s => {
                  const count = countBySession[s.id] ?? 0
                  const names = namesBySession[s.id] ?? []
                  return (
                    <div key={s.id} className="border border-border rounded-sm p-4 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</p>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {count}/{s.max_participants} Plätze · {names.join(', ') || 'keine Anmeldungen'}
                        </p>
                      </div>
                      <form action={async () => { 'use server'; await deleteSession(s.id) }}>
                        <button type="submit"
                          className="text-xs text-foreground-muted border border-border px-3 py-1.5 rounded-sm hover:border-red-400 hover:text-red-600 transition-colors">
                          Löschen
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/sessions/
git commit -m "feat: add admin session management (create/delete)"
```

---

## Task 13: Admin Members + Card Management

**Files:** `app/admin/members/page.tsx`, `app/admin/members/InviteMemberForm.tsx`, `app/admin/members/CardForm.tsx`, `app/admin/members/actions.ts`

- [ ] **Create `app/admin/members/actions.ts`**

```typescript
'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inviteMember(prevState: unknown, formData: FormData) {
  const email = (formData.get('email') as string).trim()
  if (!email) return { error: 'E-Mail erforderlich.' }

  const serviceSupabase = createServiceClient()
  const { error } = await serviceSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/invite`,
  })

  if (error) return { error: `Einladung fehlgeschlagen: ${error.message}` }
  revalidatePath('/admin/members')
  return { success: `Einladung an ${email} gesendet.` }
}

export async function createCard(prevState: unknown, formData: FormData) {
  const userId = formData.get('user_id') as string
  const type = formData.get('type') as string
  const totalUnits = Number(formData.get('total_units'))
  const validUntil = formData.get('valid_until') as string

  if (!userId || !type || !totalUnits || !validUntil) return { error: 'Alle Felder erforderlich.' }

  const supabase = await createClient()
  const { error } = await supabase.from('club_cards').insert({
    user_id: userId, type, total_units: totalUnits, valid_until: validUntil,
  })

  if (error) return { error: 'Karte konnte nicht erstellt werden.' }
  revalidatePath('/admin/members')
  return { success: true }
}

export async function updateCardUnits(cardId: string, usedUnits: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('club_cards')
    .update({ used_units: usedUnits })
    .eq('id', cardId)

  if (error) return { error: 'Karte konnte nicht aktualisiert werden.' }
  revalidatePath('/admin/members')
  return { success: true }
}
```

- [ ] **Create `app/admin/members/InviteMemberForm.tsx`**

```typescript
'use client'

import { useActionState } from 'react'
import { inviteMember } from './actions'

export function InviteMemberForm() {
  const [state, action, pending] = useActionState(inviteMember, null)

  return (
    <form action={action} className="flex gap-3 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-foreground mb-1">Mitglied einladen</label>
        <input name="email" type="email" required placeholder="email@beispiel.de"
          className="w-full border border-border rounded-sm px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <button type="submit" disabled={pending}
        className="bg-primary text-primary-foreground px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0">
        {pending ? '...' : 'Einladen'}
      </button>
      {state?.error && <p className="text-sm text-red-600 mt-1">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700 mt-1">{state.success}</p>}
    </form>
  )
}
```

- [ ] **Create `app/admin/members/CardForm.tsx`**

```typescript
'use client'

import { useActionState } from 'react'
import { createCard } from './actions'

export function CardForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(createCard, null)

  // Default valid_until: 6 months from today
  const defaultValidUntil = new Date(Date.now() + 183 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0]

  return (
    <form action={action} className="grid grid-cols-4 gap-2 items-end mt-3">
      <input type="hidden" name="user_id" value={userId} />
      <div>
        <label className="block text-xs text-foreground-muted mb-1">Typ</label>
        <select name="type"
          className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm">
          <option value="5er">5er-Karte</option>
          <option value="10er">10er-Karte</option>
          <option value="schnupper">Schnupperkarte</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-foreground-muted mb-1">Einheiten</label>
        <input name="total_units" type="number" defaultValue={5} min={1}
          className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm" />
      </div>
      <div>
        <label className="block text-xs text-foreground-muted mb-1">Gültig bis</label>
        <input name="valid_until" type="date" defaultValue={defaultValidUntil}
          className="w-full border border-border rounded-sm px-2 py-1.5 bg-background text-foreground text-sm" />
      </div>
      <button type="submit" disabled={pending}
        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-sm text-xs font-medium hover:bg-primary/90 disabled:opacity-50">
        {pending ? '...' : 'Karte anlegen'}
      </button>
      {state?.error && <p className="text-xs text-red-600 col-span-4">{state.error}</p>}
    </form>
  )
}
```

- [ ] **Create `app/admin/members/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { InviteMemberForm } from './InviteMemberForm'
import { CardForm } from './CardForm'
import { updateCardUnits } from './actions'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mitglieder – Admin' }

export default async function AdminMembersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, created_at')
    .order('created_at', { ascending: true })

  const { data: cards } = await supabase
    .from('club_cards')
    .select('*')
    .order('created_at', { ascending: true })

  const cardsByUser = (cards ?? []).reduce<Record<string, typeof cards>>((acc, card) => {
    if (!card) return acc
    acc[card.user_id] = [...(acc[card.user_id] ?? []), card]
    return acc
  }, {})

  const cardTypeLabel = { '5er': '5er', '10er': '10er', 'schnupper': 'Schnupper' }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-3xl space-y-10">
          <h1 className="font-serif text-4xl text-foreground">Mitglieder</h1>

          <InviteMemberForm />

          <div className="space-y-6">
            {(profiles ?? []).filter(p => p.role === 'member').map(profile => (
              <div key={profile.id} className="border border-border rounded-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-foreground">{profile.first_name} {profile.last_name}</p>
                    <p className="text-sm text-foreground-muted">Mitglied seit {new Date(profile.created_at).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {(cardsByUser[profile.id] ?? []).map(card => (
                    <div key={card.id} className="bg-background-alt rounded-sm p-3 flex items-center gap-4">
                      <span className="text-xs font-medium text-foreground">
                        {cardTypeLabel[card.type as keyof typeof cardTypeLabel]}
                      </span>
                      <span className="text-xs text-foreground-muted flex-1">
                        Gültig bis {new Date(card.valid_until).toLocaleDateString('de-DE')}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-foreground-muted">Verbraucht:</span>
                        <form action={async (fd: FormData) => {
                          'use server'
                          await updateCardUnits(card.id, Number(fd.get('used_units')))
                        }}>
                          <input name="used_units" type="number"
                            defaultValue={card.used_units} min={0} max={card.total_units}
                            className="w-12 border border-border rounded-sm px-1 py-0.5 text-xs text-center bg-background" />
                          <span className="mx-1 text-foreground-muted">/ {card.total_units}</span>
                          <button type="submit" className="text-xs text-primary hover:underline">Speichern</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>

                <CardForm userId={profile.id} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add app/admin/members/
git commit -m "feat: add admin member management (invite + card management)"
```

---

## Task 14: Header — Login/Logout Link

**Files:** `app/components/Header.tsx`, `app/components/AuthButton.tsx`

The header is a server component. Add an `AuthButton` client component that shows a logout button when logged in.

- [ ] **Create `app/components/AuthButton.tsx`**

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!isLoggedIn) {
    return (
      <a href="/login"
        className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
        Anmelden
      </a>
    )
  }

  return (
    <button onClick={handleSignOut}
      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
      Abmelden
    </button>
  )
}
```

- [ ] **Update `app/components/Header.tsx`**

Add to imports:
```typescript
import { createClient } from '../lib/supabase/server'  // wait, this is a server component — OK
import { AuthButton } from './AuthButton'
```

Make the Header async and add auth check:
```typescript
export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  // ...
```

Add to the desktop nav (after navItems loop):
```typescript
{isLoggedIn && (
  <Link href="/members"
    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
    Mitglieder
  </Link>
)}
<AuthButton isLoggedIn={isLoggedIn} />
```

- [ ] **Verify**: Open the site — "Anmelden" link visible. After login — "Mitglieder" + "Abmelden" visible.

- [ ] **Commit**

```bash
git add app/components/Header.tsx app/components/AuthButton.tsx
git commit -m "feat: add auth state to header (login/logout link)"
```

---

## Task 15: Vercel Deployment + Final Verification

- [ ] **Add production env vars in Vercel Dashboard**

  Go to Vercel project → Settings → Environment Variables. Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SITE_URL` = `https://claytopia.de`

- [ ] **Update Supabase redirect URLs for production**

  In Supabase Dashboard → Authentication → URL Configuration:
  - Site URL: `https://claytopia.de`
  - Redirect URLs: add `https://claytopia.de/invite/**` and `https://claytopia.de/members`

- [ ] **Push and deploy**

```bash
git push
```

- [ ] **End-to-end verification checklist**

  - [ ] `/login` loads, wrong credentials → error message
  - [ ] Magic link → email arrives, click → redirected to `/members`
  - [ ] `/members` shows upcoming sessions
  - [ ] Book a session → "Du bist dabei" shown, spot count decreases
  - [ ] Cancel booking → spot restored
  - [ ] `/members/bookings` shows booking history + card status
  - [ ] `/admin` accessible with admin account, redirects members
  - [ ] Create session in `/admin/sessions` → appears in `/members`
  - [ ] Invite member from `/admin/members` → email arrives
  - [ ] Invited member completes `/invite/...` → profile created
  - [ ] Add card to member in `/admin/members` → member can book
  - [ ] Delete session with active bookings → bookings cancelled, units refunded
