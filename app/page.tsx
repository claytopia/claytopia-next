import { Container } from './components/Container';

export default function Home() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold mb-4">Willkommen bei Claytopia</h1>
      <p className="text-foreground-muted mb-8">
        Dein Keramik-Atelier für kreative Töpfer-Erlebnisse.
      </p>

      {/* Test scroll behavior - enough content to enable scrolling */}
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 bg-background-alt rounded-lg">
            <h2 className="text-xl font-medium mb-2">Abschnitt {i}</h2>
            <p className="text-foreground-muted">
              Dieser Platzhalter-Inhalt testet das Scroll-Verhalten des sticky Headers.
              Bei ausreichend Inhalt sollte der Header beim Scrollen sichtbar bleiben.
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
