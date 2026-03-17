import { Container } from '@/app/components/Container'
import { InviteForm } from './InviteForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Konto einrichten – Claytopia' }

export default function InvitePage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Herzlich willkommen!</h1>
          <p className="text-foreground-muted mb-10">
            Richte kurz dein Konto ein — dann kann es losgehen.
          </p>
          <InviteForm />
        </div>
      </Container>
    </section>
  )
}
