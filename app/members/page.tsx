import { createClient } from '@/lib/supabase/server'
import { Container } from '../components/Container'
import { SessionList } from './SessionList'
import { buildDisplayNameMap, nameKey } from '@/lib/names'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Termine – Claytopia Memberbereich' }

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  const { data: myBookings } = await supabase
    .from('bookings')
    .select('id, session_id')
    .eq('user_id', user!.id)
    .eq('status', 'active')

  const sessionIds = sessions?.map(s => s.id) ?? []

  const { data: attendees } = sessionIds.length > 0
    ? await supabase
        .from('session_attendees')
        .select('session_id, first_name, last_name')
        .in('session_id', sessionIds)
    : { data: [] }

  // Disambiguate names across ALL members (the universe), so a member is shown
  // with as much of their last name as needed to tell them apart from other
  // members sharing the same first name — even when booked alone.
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('first_name, last_name')

  const displayNameMap = buildDisplayNameMap(
    (allProfiles ?? [])
      .filter(p => p.first_name)
      .map(p => ({ firstName: p.first_name, lastName: p.last_name }))
  )

  const bookingCountBySession: Record<string, number> = {}
  const namesBySession: Record<string, string[]> = {}
  for (const a of attendees ?? []) {
    bookingCountBySession[a.session_id] = (bookingCountBySession[a.session_id] ?? 0) + 1
    // Guests (no last name / not a member) fall back to their first name.
    const display = displayNameMap.get(nameKey(a.first_name, a.last_name)) ?? a.first_name
    namesBySession[a.session_id] = [...(namesBySession[a.session_id] ?? []), display]
  }

  const myBookingBySession = Object.fromEntries(
    (myBookings ?? []).map(b => [b.session_id, b.id])
  )

  // Waitlist: count per session + this member's position (1-based) if enrolled.
  const { data: waitlistRows } = sessionIds.length > 0
    ? await supabase
        .from('waitlist')
        .select('session_id, user_id, created_at')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true })
    : { data: [] }

  const waitlistCountBySession: Record<string, number> = {}
  const myWaitlistPositionBySession: Record<string, number> = {}
  for (const w of waitlistRows ?? []) {
    const pos = (waitlistCountBySession[w.session_id] ?? 0) + 1
    waitlistCountBySession[w.session_id] = pos
    if (w.user_id === user!.id) {
      myWaitlistPositionBySession[w.session_id] = pos
    }
  }

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
    waitlistCount: waitlistCountBySession[s.id] ?? 0,
    myWaitlistPosition: myWaitlistPositionBySession[s.id] ?? null,
    hasActiveCard,
  }))

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="font-serif text-4xl text-foreground mb-2">Kommende Termine</h1>
              <p className="text-foreground-muted">Melde dich für einen Clay Club Termin an.</p>
            </div>
            <Link href="/members/bookings" className="text-sm text-primary hover:underline mt-2">
              Meine Buchungen →
            </Link>
          </div>
          <SessionList sessions={sessionsWithData} hasActiveCard={hasActiveCard} />
        </div>
      </Container>
    </section>
  )
}
