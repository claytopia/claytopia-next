import { createClient } from '@/lib/supabase/server'
import { Container } from '../components/Container'
import { SessionList } from './SessionList'
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
        .select('session_id, first_name')
        .in('session_id', sessionIds)
    : { data: [] }

  const bookingCountBySession: Record<string, number> = {}
  const namesBySession: Record<string, string[]> = {}
  for (const a of attendees ?? []) {
    bookingCountBySession[a.session_id] = (bookingCountBySession[a.session_id] ?? 0) + 1
    namesBySession[a.session_id] = [...(namesBySession[a.session_id] ?? []), a.first_name]
  }

  const myBookingBySession = Object.fromEntries(
    (myBookings ?? []).map(b => [b.session_id, b.id])
  )

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
