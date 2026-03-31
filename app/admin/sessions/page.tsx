import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { SessionForm } from './SessionForm'
import { DeleteSessionButton } from './DeleteSessionButton'
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
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, starts_at, max_participants')
    .order('starts_at', { ascending: true })

  const sessionIds = sessions?.map(s => s.id) ?? []
  const { data: attendees } = sessionIds.length > 0
    ? await supabase
        .from('session_attendees')
        .select('session_id, first_name')
        .in('session_id', sessionIds)
    : { data: [] }

  const countBySession: Record<string, number> = {}
  const namesBySession: Record<string, string[]> = {}
  for (const a of attendees ?? []) {
    countBySession[a.session_id] = (countBySession[a.session_id] ?? 0) + 1
    namesBySession[a.session_id] = [...(namesBySession[a.session_id] ?? []), a.first_name]
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
                      <DeleteSessionButton
                        sessionId={s.id}
                        attendeeCount={count}
                        attendeeNames={names}
                      />
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
