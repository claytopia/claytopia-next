import { Container } from '@/app/components/Container'
import { UpdatePasswordForm } from './UpdatePasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Neues Passwort – Claytopia' }

export default function UpdatePasswordPage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Neues Passwort</h1>
          <p className="text-foreground-muted mb-10">Gib dein neues Passwort ein.</p>
          <UpdatePasswordForm />
        </div>
      </Container>
    </section>
  )
}
