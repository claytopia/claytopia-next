import { Container } from './Container';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo/wordmark - left */}
          <a href="/" className="font-serif text-2xl font-medium tracking-tight text-foreground">
            Claytopia
          </a>

          {/* Navigation menu */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
