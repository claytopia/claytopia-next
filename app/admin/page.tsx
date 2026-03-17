import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin – Claytopia' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, starts_at, max_participants')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(10)

  const sessionIds = sessions?.map(s => s.id) ?? []
  const { data: attendees } = sessionIds.length > 0
    ? await supabase
        .from('session_attendees')
        .select('session_id, first_name')
        .in('session_id', sessionIds)
    : { data: [] }

  const countBySession: Record<string, number> = {}
  for (const a of attendees ?? []) {
    countBySession[a.session_id] = (countBySession[a.session_id] ?? 0) + 1
  }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl text-foreground mb-2">Admin</h1>
          <div className="flex gap-6 mb-10 text-sm">
            <Link href="/admin/sessions" className="text-primary hover:underline">Termine verwalten →</Link>
            <Link href="/admin/members" className="text-primary hover:underline">Mitglieder verwalten →</Link>
          </div>

          <h2 className="font-serif text-2xl text-foreground mb-4">Nächste Termine</h2>
          {!sessions?.length ? (
            <p className="text-foreground-muted">Keine kommenden Termine.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => {
                const count = countBySession[s.id] ?? 0
                return (
                  <div key={s.id} className="border border-border rounded-sm p-4 flex justify-between items-center">
                    <span className="font-medium text-foreground text-sm">{formatDate(s.starts_at)} Uhr</span>
                    <span className="text-sm text-foreground-muted">
                      {count} / {s.max_participants} Plätze belegt
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
