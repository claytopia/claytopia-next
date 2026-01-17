'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  // Track when component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="relative z-[60]">
        <Squeeze
          toggled={isOpen}
          toggle={setIsOpen}
          size={24}
          color="currentColor"
          label="Navigation menu"
          rounded
        />
      </div>

      {/* Overlay and slide-out panel - rendered via portal to escape header stacking context */}
      {mounted && isOpen && createPortal(
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
          }}
        >
          <div className="fixed inset-0 z-50">
            {/* Backdrop overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Slide-out panel */}
            <div
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[calc(100%-3rem)] shadow-2xl"
              style={{ backgroundColor: '#e8ebe3', height: '100vh' }}
            >
              <nav
                className="relative h-full flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                style={{ backgroundColor: '#e8ebe3' }}
              >
                {/* Panel header with close button */}
                <div className="h-16 flex-shrink-0 flex items-center justify-end px-4" style={{ backgroundColor: '#e8ebe3' }}>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                    aria-label="Menü schließen"
                  >
                    <svg
                      className="h-6 w-6 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation links */}
                <ul className="flex-1 px-6 py-4" style={{ backgroundColor: '#e8ebe3' }}>
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className="block px-4 py-3 text-lg font-medium text-foreground
                                   rounded-xl transition-colors duration-150
                                   hover:bg-white/50
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Bottom section - contact info */}
                <div className="flex-shrink-0 px-6 pb-8" style={{ backgroundColor: '#e8ebe3' }}>
                  <div className="border-t border-foreground/10 pt-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-3">
                      Kontakt
                    </p>
                    <a
                      href="tel:+491718336539"
                      className="block text-sm text-foreground hover:text-accent transition-colors"
                    >
                      +49 171 833 6539
                    </a>
                    <a
                      href="mailto:hello@claytopia.de"
                      className="mt-1 block text-sm text-foreground hover:text-accent transition-colors"
                    >
                      hello@claytopia.de
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </FocusTrap>,
        document.body
      )}
    </>
  );
}
