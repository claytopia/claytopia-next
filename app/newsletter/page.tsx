import { Container } from '../components/Container'
import { NewsletterForm } from './NewsletterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter - Claytopia',
  description: 'Melde dich zum Claytopia Newsletter an und erfahre als Erste/r von neuen Workshops, Terminen und Neuigkeiten aus dem Keramik-Werkraum.',
}

export default function NewsletterPage() {
  return (
    <section className="py-20 bg-background min-h-screen">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Newsletter</h1>
          <p className="text-foreground-muted mb-10">
            Erfahre als Erste/r von neuen Workshops, Clay Club Terminen und Neuigkeiten aus dem Werkraum.
          </p>
          <div className="bg-stone-50 p-8 rounded-sm">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
