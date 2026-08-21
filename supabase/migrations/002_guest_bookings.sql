-- ============================================================
-- GUEST BOOKINGS
-- Allow admins to add walk-in / phone guests without an account
-- or a club card. Such bookings occupy a seat but consume no card.
-- ============================================================

-- Make user_id / card_id optional so guest bookings can omit them
alter table bookings alter column user_id drop not null;
alter table bookings alter column card_id drop not null;

-- Store the guest's name directly on the booking
alter table bookings add column guest_name text;

-- A booking is either a member booking (has user_id) or a guest booking
-- (has guest_name). Enforce that exactly one identity is present.
alter table bookings add constraint bookings_identity_check
  check (
    (user_id is not null and guest_name is null)
    or
    (user_id is null and guest_name is not null)
  );

-- The active-booking uniqueness index referenced user_id, which is now
-- nullable. NULLs don't collide in a unique index, so guest bookings are
-- unaffected; member bookings keep their single-active-booking guarantee.

-- ============================================================
-- VIEW: session_attendees — include guests
-- ============================================================
create or replace view session_attendees as
  select b.session_id, p.first_name
  from bookings b
  join profiles p on p.id = b.user_id
  where b.status = 'active' and b.user_id is not null
  union all
  select b.session_id, b.guest_name as first_name
  from bookings b
  where b.status = 'active' and b.guest_name is not null;

grant select on session_attendees to authenticated;

-- ============================================================
-- FUNCTION: admin_book_guest (atomic — prevents overbooking)
-- ============================================================
create or replace function admin_book_guest(
  p_session_id uuid,
  p_guest_name text
)
returns void language plpgsql security definer as $$
declare
  v_count integer;
  v_max   integer;
begin
  if p_guest_name is null or btrim(p_guest_name) = '' then
    raise exception 'Guest name required';
  end if;

  -- Lock the session row to prevent concurrent overbooking
  select max_participants into v_max
  from sessions
  where id = p_session_id
  for update;

  if v_max is null then
    raise exception 'Session not found';
  end if;

  select count(*) into v_count
  from bookings
  where session_id = p_session_id and status = 'active';

  if v_count >= v_max then
    raise exception 'Session is fully booked';
  end if;

  insert into bookings (session_id, guest_name)
  values (p_session_id, btrim(p_guest_name));
end;
$$;

-- ============================================================
-- FUNCTION: admin_cancel_booking — handle guest bookings (no card)
-- ============================================================
create or replace function admin_cancel_booking(p_booking_id uuid)
returns void language plpgsql security definer as $$
declare v_card_id uuid;
begin
  select card_id into v_card_id from bookings where id = p_booking_id and status = 'active';
  update bookings set status = 'cancelled', cancelled_at = now() where id = p_booking_id;
  -- Refund unit only for member bookings that used a card
  if v_card_id is not null then
    update club_cards set used_units = used_units - 1 where id = v_card_id;
  end if;
end;
$$;
