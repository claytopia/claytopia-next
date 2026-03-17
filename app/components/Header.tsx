import Link from 'next/link';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { navItems } from '../config/navigation';
import { AuthButton } from './AuthButton';
import { createClient } from '@/lib/supabase/server';

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            Claytopia
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link href="/members"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">
                Mitglieder
              </Link>
            )}
            <AuthButton isLoggedIn={isLoggedIn} />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
