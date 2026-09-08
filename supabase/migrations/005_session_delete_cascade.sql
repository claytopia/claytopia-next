-- ============================================================
-- SESSION DELETE: CASCADE BOOKINGS
-- bookings.session_id was declared "on delete restrict". Cancelled
-- bookings keep their row (status = 'cancelled'), so any session that
-- ever had a booking could never be deleted — even after every
-- attendee (member or guest) had been removed.
--
-- Card units are tracked as a counter on club_cards (used_units) and
-- are refunded when a booking is cancelled, so booking rows of a
-- deleted session carry no accounting information. Let them go with
-- the session, exactly like waitlist rows already do.
-- ============================================================
alter table bookings
  drop constraint bookings_session_id_fkey,
  add constraint bookings_session_id_fkey
    foreign key (session_id) references sessions(id) on delete cascade;
