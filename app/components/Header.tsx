import { Container } from './Container';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo/wordmark - left */}
          <a href="/" className="text-xl font-semibold tracking-tight text-foreground">
            Claytopia
          </a>

          {/* Hamburger placeholder - will be replaced by MobileMenu in Plan 03 */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-background-alt"
            aria-label="Menu"
          >
            {/* Simple hamburger icon placeholder */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  );
}
