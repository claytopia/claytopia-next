'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Hamburger from 'hamburger-react'
import FocusTrap from 'focus-trap-react';
import Link from 'next/link';
import { navItems } from '../config/navigation';

import { Container } from './Container';

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
        <Hamburger
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
          <div 
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {/* Close Button Header */}
            <Container>
              <div className="flex h-20 items-center justify-end">
                <Hamburger
                  toggled={true}
                  toggle={closeMenu}
                  size={24}
                  color="currentColor"
                  label="Close menu"
                  rounded
                />
              </div>
            </Container>

            <nav
              className="flex flex-1 flex-col items-center justify-center pb-20"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              {/* Navigation links */}
              <ul className="flex flex-col items-center gap-6 mb-12">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="text-2xl font-serif font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Bottom section - contact info */}
              <div className="text-center">
                <div className="w-12 h-px bg-border mx-auto mb-6" />
                <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-3">
                  Kontakt
                </p>
                <a
                  href="tel:+491718336539"
                  className="block text-lg text-foreground hover:text-primary transition-colors mb-2"
                >
                  +49 171 833 6539
                </a>
                <a
                  href="mailto:hello@claytopia.de"
                  className="block text-lg text-foreground hover:text-primary transition-colors"
                >
                  hello@claytopia.de
                </a>
              </div>
            </nav>
          </div>
        </FocusTrap>,
        document.body
      )}
    </>
  );
}
