import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Container } from '@/app/components/Container'
import { InviteMemberForm } from './InviteMemberForm'
import { CardForm } from './CardForm'
import { updateCardUnits, updateCardValidUntil } from './actions'
import { DeleteCardButton } from './DeleteCardButton'
import { ResendInviteButton } from './ResendInviteButton'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mitglieder – Admin' }

const cardTypeLabel: Record<string, string> = {
  '5er': '5er',
  '10er': '10er',
  'schnupper': 'Schnupper',
}

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const serviceSupabase = createServiceClient()

  const [{ data: profiles }, { data: { users: authUsers } }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, first_name, last_name, role, created_at')
      .order('created_at', { ascending: true }),
    serviceSupabase.auth.admin.listUsers(),
  ])

  const emailById = Object.fromEntries(
    (authUsers ?? []).map(u => [u.id, u.email ?? ''])
  )

  const { data: cards } = await supabase
    .from('club_cards')
    .select('*')
    .order('created_at', { ascending: true })

  const cardsByUser = (cards ?? []).reduce<Record<string, typeof cards>>((acc, card) => {
    if (!card) return acc
    acc[card.user_id] = [...(acc[card.user_id] ?? []), card]
    return acc
  }, {})

  const members = profiles ?? []

  return (
    <section className="py-16 bg-background min-h-screen">
      <Container>
        <div className="max-w-3xl space-y-10">
          <h1 className="font-serif text-4xl text-foreground">Mitglieder</h1>

          <InviteMemberForm />

          <div className="space-y-6">
            {members.length === 0 && (
              <p className="text-foreground-muted">Noch keine Mitglieder eingeladen.</p>
            )}
            {members.map(profile => (
              <div key={profile.id} className="border border-border rounded-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {profile.first_name ? (
                      <p className="font-medium text-foreground">{profile.first_name} {profile.last_name}</p>
                    ) : (
                      <p className="font-medium text-foreground-muted italic">
                        {emailById[profile.id] ?? '—'}
                        <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm not-italic">Einladung ausstehend</span>
                        {emailById[profile.id] && (
                          <ResendInviteButton email={emailById[profile.id]} />
                        )}
                      </p>
                    )}
                    <p className="text-sm text-foreground-muted">
                      {emailById[profile.id] && profile.first_name ? emailById[profile.id] + ' · ' : ''}Eingeladen {new Date(profile.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(cardsByUser[profile.id] ?? []).map(card => (
                    <div key={card.id} className="bg-background-alt rounded-sm p-3 flex items-center gap-4">
                      <span className="text-xs font-medium text-foreground w-16">
                        {cardTypeLabel[card.type] ?? card.type}
                      </span>
                      <form action={async (fd: FormData) => {
                        'use server'
                        await updateCardValidUntil(card.id, fd.get('valid_until') as string)
                      }} className="flex items-center gap-2 text-xs flex-1">
                        <span className="text-foreground-muted">Gültig bis:</span>
                        <input name="valid_until" type="date"
                          defaultValue={card.valid_until}
                          className="border border-border rounded-sm px-1 py-0.5 text-xs bg-background" />
                        <button type="submit" className="text-xs text-primary hover:underline">Speichern</button>
                      </form>
                      <form action={async (fd: FormData) => {
                        'use server'
                        await updateCardUnits(card.id, Number(fd.get('used_units')))
                      }} className="flex items-center gap-2 text-xs">
                        <span className="text-foreground-muted">Verbraucht:</span>
                        <input name="used_units" type="number"
                          defaultValue={card.used_units} min={0} max={card.total_units}
                          className="w-12 border border-border rounded-sm px-1 py-0.5 text-xs text-center bg-background" />
                        <span className="text-foreground-muted">/ {card.total_units}</span>
                        <button type="submit" className="text-xs text-primary hover:underline">Speichern</button>
                      </form>
                      <DeleteCardButton cardId={card.id} />
                    </div>
                  ))}
                </div>

                <CardForm userId={profile.id} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
