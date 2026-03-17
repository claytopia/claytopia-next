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
-- FUNCTION: admin_cancel_booking (no ownership check — for admin use)
-- ============================================================
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
