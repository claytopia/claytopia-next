'use client';

import { useState, useEffect, useCallback } from 'react';
import { Squeeze } from 'hamburger-react';
import FocusTrap from 'focus-trap-react';

const navItems = [
  { href: '/clay-club', label: 'Clay Club' },
  { href: '/brennservice', label: 'Brennservice' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/events', label: 'Events' },
  { href: '/kontakt', label: 'Kontakt' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Hamburger button */}
      <div className="relative z-50">
        <Squeeze
          toggled={isOpen}
          toggle={setIsOpen}
          size={24}
          color="currentColor"
          label="Navigation menu"
          rounded
        />
      </div>

      {/* Overlay and slide-out panel */}
      {isOpen && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
          }}
        >
          <div className="fixed inset-0 z-40">
            {/* Backdrop overlay */}
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Slide-out panel */}
            <nav
              className="absolute right-0 top-0 h-full w-80 max-w-[calc(100%-3rem)] bg-background shadow-xl
                         transform transition-transform duration-300 ease-out"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              {/* Panel header with close area */}
              <div className="flex h-16 items-center justify-end px-4">
                {/* The hamburger button handles close via toggle */}
              </div>

              {/* Navigation links */}
              <ul className="px-4 py-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="block px-4 py-4 text-lg font-medium text-foreground
                                 rounded-lg hover:bg-background-alt
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Bottom section - contact info */}
              <div className="absolute bottom-8 left-0 right-0 px-8">
                <div className="border-t border-foreground/10 pt-6">
                  <p className="text-sm text-foreground-muted">Kontakt</p>
                  <a
                    href="tel:+491718336539"
                    className="mt-2 block text-foreground hover:text-accent"
                  >
                    +49 171 833 6539
                  </a>
                  <a
                    href="mailto:hello@claytopia.de"
                    className="mt-1 block text-foreground hover:text-accent"
                  >
                    hello@claytopia.de
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </FocusTrap>
      )}
    </>
  );
}
