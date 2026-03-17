import { Container } from '../components/Container'
import { LoginForm } from './LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Anmelden – Claytopia' }

export default function LoginPage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Willkommen zurück</h1>
          <p className="text-foreground-muted mb-10">Melde dich an um deine Termine zu verwalten.</p>
          <LoginForm />
        </div>
      </Container>
    </section>
  )
}
