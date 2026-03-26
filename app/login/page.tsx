import { Container } from '../components/Container'
import { LoginForm } from './LoginForm'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Anmelden – Claytopia' }

export default function LoginPage() {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">Willkommen zurück</h1>
          <p className="text-foreground-muted mb-10">Melde dich an um deine Termine zu verwalten.</p>
          
          <LoginForm />
          <div className="bg-clay-50 border border-border px-5 py-4 mt-8 mb-8">
            <p className="text-sm font-medium text-foreground mb-1">Noch kein Mitglied?</p>
            <p className="text-sm text-foreground-muted">
              Du möchtest dem Clay Club beitreten oder einen Schnuppertermin vereinbaren?{' '}
              <Link href="/contact" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
                Schreib mir gerne
              </Link>
              {' '}— ich freue mich!
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
