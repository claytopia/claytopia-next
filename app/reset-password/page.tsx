import { Container } from '../components/Container'
import { ResetPasswordForm } from './ResetPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Passwort zurücksetzen – Claytopia' }

export default function ResetPasswordPage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Passwort zurücksetzen</h1>
          <p className="text-foreground-muted mb-10">Gib deine E-Mail ein — wir senden dir einen Reset-Link.</p>
          <ResetPasswordForm />
        </div>
      </Container>
    </section>
  )
}
