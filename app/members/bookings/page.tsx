import { createClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meine Buchungen – Claytopia' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

export default async function MyBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, created_at, sessions(starts_at)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const { data: cards } = await supabase
    .from('club_cards')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  const cardTypeLabel: Record<string, string> = {
    '5er': '5er-Karte',
    '10er': '10er-Karte',
    'schnupper': 'Schnupperkarte',
  }

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-2xl space-y-12">
          <div className="flex items-center gap-4">
            <Link href="/members" className="text-sm text-foreground-muted hover:text-primary">← Termine</Link>
          </div>

          <div>
            <h1 className="font-serif text-4xl text-foreground mb-8">Meine Buchungen</h1>
            {!bookings?.length ? (
              <p className="text-foreground-muted">Du hast noch keine Buchungen.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map(b => {
                  const session = (b.sessions as unknown) as { starts_at: string } | null
                  return (
                    <div key={b.id}
                      className={`border border-border rounded-sm p-4 flex justify-between items-center ${b.status === 'cancelled' ? 'opacity-50' : ''}`}>
                      <p className="font-medium text-foreground text-sm">
                        {session ? formatDate(session.starts_at) + ' Uhr' : '—'}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-border text-foreground-muted'}`}>
                        {b.status === 'active' ? 'Aktiv' : 'Storniert'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl text-foreground mb-6">Meine Club-Karten</h2>
            {!cards?.length ? (
              <p className="text-foreground-muted">Keine Club-Karte vorhanden. Kontaktiere Pia.</p>
            ) : (
              <div className="space-y-3">
                {cards.map(card => {
                  const remaining = card.total_units - card.used_units
                  const expired = card.valid_until < today
                  return (
                    <div key={card.id} className={`border border-border rounded-sm p-4 ${expired ? 'opacity-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{cardTypeLabel[card.type] ?? card.type}</p>
                          <p className="text-sm text-foreground-muted mt-0.5">
                            {remaining} von {card.total_units} Einheiten verbleibend
                            {expired && ' · Abgelaufen'}
                          </p>
                        </div>
                        <div className="text-right text-sm text-foreground-muted">
                          <p>Gültig bis</p>
                          <p className="font-medium text-foreground">
                            {new Date(card.valid_until).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 bg-secondary rounded-sm h-2">
                        <div
                          className={`h-2 rounded-sm transition-all ${expired ? 'bg-border' : 'bg-primary'}`}
                          style={{ width: `${(remaining / card.total_units) * 100}%` }}
                        />
                      </div>
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
