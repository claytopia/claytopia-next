import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { SessionForm } from './SessionForm'
import { DeleteSessionButton } from './DeleteSessionButton'
import { EditNoteForm } from './EditNoteForm'
import { EditMaxParticipantsForm } from './EditMaxParticipantsForm'
import { AdminAttendees } from './AdminAttendees'
import { SessionList } from './SessionList'
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

  const now = new Date()

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
        .select('id, session_id, user_id, guest_name')
        .in('session_id', sessionIds)
        .eq('status', 'active')
    : { data: [] }

  const profileById = Object.fromEntries(
    (profiles ?? []).map(p => [p.id, p])
  )

  type Attendee = { bookingId: string; userId: string | null; firstName: string; lastName: string; isGuest: boolean }
  const attendeesBySession: Record<string, Attendee[]> = {}
  for (const b of bookings ?? []) {
    if (b.guest_name) {
      attendeesBySession[b.session_id] = [
        ...(attendeesBySession[b.session_id] ?? []),
        { bookingId: b.id, userId: null, firstName: b.guest_name, lastName: '', isGuest: true },
      ]
      continue
    }
    const p = profileById[b.user_id]
    if (!p) continue
    attendeesBySession[b.session_id] = [
      ...(attendeesBySession[b.session_id] ?? []),
      { bookingId: b.id, userId: b.user_id, firstName: p.first_name, lastName: p.last_name, isGuest: false },
    ]
  }

  const members = (profiles ?? [])
    .filter(p => p.first_name) // exclude unregistered invites
    .map(p => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }))

  // Waitlist per session, in order, with member names
  const { data: waitlistRows } = sessionIds.length > 0
    ? await supabase
        .from('waitlist')
        .select('session_id, user_id, created_at')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true })
    : { data: [] }

  const waitlistBySession: Record<string, string[]> = {}
  for (const w of waitlistRows ?? []) {
    const p = profileById[w.user_id]
    const name = p ? `${p.first_name} ${p.last_name}`.trim() : 'Unbekannt'
    waitlistBySession[w.session_id] = [...(waitlistBySession[w.session_id] ?? []), name]
  }

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
              <SessionList
                items={sessions.map(s => {
                  const sessionAttendees = attendeesBySession[s.id] ?? []
                  const count = sessionAttendees.length
                  const names = sessionAttendees.map(a => a.firstName)
                  const waitlist = waitlistBySession[s.id] ?? []
                  return {
                    id: s.id,
                    isPast: new Date(s.starts_at) < now,
                    node: (
                      <div key={s.id} id={`session-${s.id}`} className="border border-border rounded-sm p-4 scroll-mt-24 target:border-primary">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <p className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</p>
                            <div className="mt-1">
                              <EditMaxParticipantsForm
                                sessionId={s.id}
                                currentMax={s.max_participants}
                                activeCount={count}
                              />
                            </div>
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
                        {waitlist.length > 0 && (
                          <div className="mt-3 border-t border-border pt-2">
                            <p className="text-xs font-medium text-foreground-muted mb-1">
                              Warteliste ({waitlist.length})
                            </p>
                            <ol className="text-xs text-foreground-muted space-y-0.5 list-decimal list-inside">
                              {waitlist.map((name, i) => (
                                <li key={i}>{name}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ),
                  }
                })}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
