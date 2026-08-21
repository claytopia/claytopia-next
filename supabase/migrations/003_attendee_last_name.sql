-- ============================================================
-- VIEW: session_attendees — expose last_name for disambiguation
-- Members with the same first name need progressive last-name
-- disclosure in attendee lists (e.g. "Eva Sot." vs "Eva Sol.").
-- Guests have no last name.
-- ============================================================
create or replace view session_attendees as
  select b.session_id, p.first_name, p.last_name
  from bookings b
  join profiles p on p.id = b.user_id
  where b.status = 'active' and b.user_id is not null
  union all
  select b.session_id, b.guest_name as first_name, null::text as last_name
  from bookings b
  where b.status = 'active' and b.guest_name is not null;

grant select on session_attendees to authenticated;
