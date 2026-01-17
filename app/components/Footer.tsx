import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background-alt py-8">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Contact info */}
          <div className="text-sm text-foreground-muted">
            <p className="font-medium text-foreground">Claytopia</p>
            <p>Keramik-Atelier</p>
          </div>

          {/* Quick links placeholder - will be populated in Phase 2 */}
          <nav className="flex gap-4 text-sm text-foreground-muted">
            <a href="/impressum" className="hover:text-foreground">Impressum</a>
            <a href="/datenschutz" className="hover:text-foreground">Datenschutz</a>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-foreground-muted">
          &copy; {new Date().getFullYear()} Claytopia. Alle Rechte vorbehalten.
        </div>
      </Container>
    </footer>
  );
}
