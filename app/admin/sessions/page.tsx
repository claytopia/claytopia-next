import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { SessionForm } from './SessionForm'
import { DeleteSessionButton } from './DeleteSessionButton'
import { EditNoteForm } from './EditNoteForm'
import { AdminAttendees } from './AdminAttendees'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Termine – Admin' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminSessionsPage() {
  const supabase = await createClient()

  const [{ data: sessions }, { data: profiles }, { data: allCards }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, starts_at, max_participants, note')
      .order('starts_at', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .order('first_name'),
    supabase
      .from('club_cards')
      .select('id, user_id, type, total_units, used_units, valid_until'),
  ])

  const sessionIds = sessions?.map(s => s.id) ?? []

  // Fetch full booking details (not just the view) so we have booking IDs + user IDs
  const { data: bookings } = sessionIds.length > 0
    ? await supabase
        .from('bookings')
        .select('id, session_id, user_id')
        .in('session_id', sessionIds)
        .eq('status', 'active')
    : { data: [] }

  const profileById = Object.fromEntries(
    (profiles ?? []).map(p => [p.id, p])
  )

  type Attendee = { bookingId: string; userId: string; firstName: string; lastName: string }
  const attendeesBySession: Record<string, Attendee[]> = {}
  for (const b of bookings ?? []) {
    const p = profileById[b.user_id]
    if (!p) continue
    attendeesBySession[b.session_id] = [
      ...(attendeesBySession[b.session_id] ?? []),
      { bookingId: b.id, userId: b.user_id, firstName: p.first_name, lastName: p.last_name },
    ]
  }

  const members = (profiles ?? [])
    .filter(p => p.first_name) // exclude unregistered invites
    .map(p => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }))

  const cards = (allCards ?? []).map(c => ({
    id: c.id,
    userId: c.user_id,
    type: c.type,
    remaining: c.total_units - c.used_units,
    validUntil: c.valid_until,
  }))

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
                  const sessionAttendees = attendeesBySession[s.id] ?? []
                  const count = sessionAttendees.length
                  const names = sessionAttendees.map(a => a.firstName)
                  return (
                    <div key={s.id} className="border border-border rounded-sm p-4">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</p>
                          <p className="text-xs text-foreground-muted mt-0.5">
                            {count}/{s.max_participants} Plätze
                          </p>
                        </div>
                        <DeleteSessionButton
                          sessionId={s.id}
                          attendeeCount={count}
                          attendeeNames={names}
                        />
                      </div>
                      <AdminAttendees
                        sessionId={s.id}
                        attendees={sessionAttendees}
                        members={members}
                        cards={cards}
                      />
                      <EditNoteForm sessionId={s.id} currentNote={s.note} />
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
