-- ============================================================
-- WAITLIST
-- Members can join a session's waitlist when it is fully booked.
-- When a seat frees up, the first eligible waitlist entry (one that
-- still has a valid card with a remaining unit) is automatically
-- promoted to a real booking. A valid card is required to join.
-- ============================================================

create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

alter table waitlist enable row level security;

-- Members see their own waitlist rows; admins see all.
create policy "Own waitlist readable" on waitlist
  for select using (user_id = auth.uid() or is_admin());
create policy "Admin manages waitlist" on waitlist
  for all using (is_admin());

-- ============================================================
-- HELPER: does the user have a valid card with a remaining unit?
-- ============================================================
create or replace function has_available_card(p_user_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from club_cards
    where user_id = p_user_id
      and valid_until >= current_date
      and used_units < total_units
  );
$$;

-- ============================================================
-- FUNCTION: join_waitlist
-- Requires: session full, user not already booked/waitlisted,
-- and user has a valid card with a remaining unit.
-- ============================================================
create or replace function join_waitlist(
  p_session_id uuid,
  p_user_id    uuid
)
returns void language plpgsql security definer as $$
declare
  v_max   integer;
  v_count integer;
begin
  select max_participants into v_max from sessions where id = p_session_id;
  if v_max is null then
    raise exception 'Session not found';
  end if;

  if not has_available_card(p_user_id) then
    raise exception 'No valid card';
  end if;

  -- Already actively booked?
  if exists (
    select 1 from bookings
    where session_id = p_session_id and user_id = p_user_id and status = 'active'
  ) then
    raise exception 'Already booked';
  end if;

  select count(*) into v_count
  from bookings
  where session_id = p_session_id and status = 'active';

  if v_count < v_max then
    raise exception 'Session not full';
  end if;

  insert into waitlist (session_id, user_id)
  values (p_session_id, p_user_id)
  on conflict (session_id, user_id) do nothing;
end;
$$;

-- ============================================================
-- FUNCTION: leave_waitlist
-- ============================================================
create or replace function leave_waitlist(
  p_session_id uuid,
  p_user_id    uuid
)
returns void language plpgsql security definer as $$
begin
  delete from waitlist
  where session_id = p_session_id and user_id = p_user_id;
end;
$$;

-- ============================================================
-- FUNCTION: promote_from_waitlist
-- Called after a seat frees up. Walks the waitlist in order and
-- promotes the first entry whose owner still has a valid card with
-- a remaining unit (booking it + deducting the unit). Entries that
-- can no longer be booked are removed. Returns the promoted user_id
-- (or null if nobody was promoted) so the caller can send an email.
-- ============================================================
create or replace function promote_from_waitlist(p_session_id uuid)
returns uuid language plpgsql security definer as $$
declare
  v_max      integer;
  v_count    integer;
  v_entry    record;
  v_card_id  uuid;
begin
  -- Lock the session to avoid concurrent promotions / overbooking
  select max_participants into v_max
  from sessions where id = p_session_id for update;
  if v_max is null then
    return null;
  end if;

  select count(*) into v_count
  from bookings
  where session_id = p_session_id and status = 'active';

  -- Only promote if there is a free seat
  if v_count >= v_max then
    return null;
  end if;

  for v_entry in
    select id, user_id from waitlist
    where session_id = p_session_id
    order by created_at asc
  loop
    -- Find the oldest valid card with a remaining unit
    select id into v_card_id
    from club_cards
    where user_id = v_entry.user_id
      and valid_until >= current_date
      and used_units < total_units
    order by created_at asc
    limit 1;

    if v_card_id is null then
      -- Can no longer be booked → drop from waitlist and try next
      delete from waitlist where id = v_entry.id;
      continue;
    end if;

    -- Promote: create booking, deduct unit, remove from waitlist
    insert into bookings (session_id, user_id, card_id)
    values (p_session_id, v_entry.user_id, v_card_id);

    update club_cards set used_units = used_units + 1 where id = v_card_id;

    delete from waitlist where id = v_entry.id;

    return v_entry.user_id;
  end loop;

  return null;
end;
$$;

-- ============================================================
-- FUNCTION: cancel_booking (member) — now returns promoted user_id
-- Return type changes from void -> uuid, so the old function must be
-- dropped first (this only removes the function definition, not data).
-- ============================================================
drop function if exists cancel_booking(uuid, uuid);
create or replace function cancel_booking(
  p_booking_id uuid,
  p_user_id    uuid
)
returns uuid language plpgsql security definer as $$
declare
  v_card_id    uuid;
  v_session_id uuid;
begin
  select card_id, session_id into v_card_id, v_session_id
  from bookings
  where id = p_booking_id
    and user_id = p_user_id
    and status = 'active';

  if v_session_id is null then
    raise exception 'Booking not found or already cancelled';
  end if;

  update bookings
  set status = 'cancelled', cancelled_at = now()
  where id = p_booking_id;

  if v_card_id is not null then
    update club_cards set used_units = used_units - 1 where id = v_card_id;
  end if;

  return promote_from_waitlist(v_session_id);
end;
$$;

-- ============================================================
-- FUNCTION: admin_cancel_booking — now returns promoted user_id
-- Return type changes from void -> uuid, so drop the old one first
-- (removes only the function definition, not any data).
-- ============================================================
drop function if exists admin_cancel_booking(uuid);
create or replace function admin_cancel_booking(p_booking_id uuid)
returns uuid language plpgsql security definer as $$
declare
  v_card_id    uuid;
  v_session_id uuid;
begin
  select card_id, session_id into v_card_id, v_session_id
  from bookings where id = p_booking_id and status = 'active';

  if v_session_id is null then
    return null;
  end if;

  update bookings set status = 'cancelled', cancelled_at = now() where id = p_booking_id;

  if v_card_id is not null then
    update club_cards set used_units = used_units - 1 where id = v_card_id;
  end if;

  return promote_from_waitlist(v_session_id);
end;
$$;

-- ============================================================
-- FUNCTION: admin_cancel_booking_no_promote
-- Used when deleting a whole session, where promoting a waitlist
-- entry would create a fresh active booking that blocks the delete.
-- ============================================================
create or replace function admin_cancel_booking_no_promote(p_booking_id uuid)
returns void language plpgsql security definer as $$
declare v_card_id uuid;
begin
  select card_id into v_card_id from bookings where id = p_booking_id and status = 'active';
  if not found then return; end if;
  update bookings set status = 'cancelled', cancelled_at = now() where id = p_booking_id;
  if v_card_id is not null then
    update club_cards set used_units = used_units - 1 where id = v_card_id;
  end if;
end;
$$;
