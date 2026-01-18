import Image from 'next/image';
import { Container } from '../components/Container';
import { ContactForm } from './ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kontakt - Claytopia",
  description: "Nimm Kontakt auf mit Claytopia. Wir freuen uns auf deine Nachricht! Atelier in Rösrath-Hoffnungsthal.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/kontakt.jpg"
            alt="Kontakt Claytopia"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
            Kontakt
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-white/90">
            Wir freuen uns von dir zu hören.
          </p>
        </Container>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Contact Info & Map Placeholder */}
            <div className="space-y-12">
              
              <div>
                <h2 className="font-serif text-3xl mb-6 text-foreground">Hier findest du uns</h2>
                <div className="space-y-6 text-lg text-foreground-muted">
                  <p>
                    <strong>Claytopia Keramik-Atelier</strong><br/>
                    Rösrath-Hoffnungsthal<br/>
                    (Genaue Adresse bei Terminvereinbarung)
                  </p>
                  <div className="space-y-2">
                    <a href="mailto:hello@claytopia.de" className="block hover:text-primary transition-colors">
                      <span className="font-medium text-foreground">E-Mail:</span> hello@claytopia.de
                    </a>
                    <a href="tel:+491778336539" className="block hover:text-primary transition-colors">
                      <span className="font-medium text-foreground">Telefon:</span> +49 177 833 6539
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-foreground">Öffnungszeiten</h3>
                <p className="text-foreground-muted">
                  Unser Atelier ist während der Clay Club Zeiten und zu Workshops geöffnet.<br/>
                  Besuche außerhalb dieser Zeiten bitte nur nach Vereinbarung.
                </p>
                <ul className="text-sm space-y-1 text-foreground-muted mt-2">
                   <li><strong className="text-foreground">Di & Do:</strong> 19:00 - 22:00 Uhr</li>
                   <li><strong className="text-foreground">Fr:</strong> 10:00 - 13:00 Uhr</li>
                </ul>
              </div>

              {/* Map Image / Visual Placeholder */}
              <div className="relative aspect-video rounded-sm overflow-hidden bg-stone-100 shadow-sm">
                 <Image 
                    src="/img/location-pin.png" 
                    alt="Standort Rösrath" 
                    fill 
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-sm">
                      Rösrath-Hoffnungsthal
                    </span>
                  </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-stone-50 p-8 md:p-10 rounded-sm">
              <h2 className="font-serif text-3xl mb-2 text-foreground">Schreib uns</h2>
              <p className="text-foreground-muted mb-8">
                Du hast Fragen zu Workshops, dem Clay Club oder möchtest einfach Hallo sagen?
              </p>
              
              <ContactForm />

            </div>

          </div>
        </Container>
      </section>

    </div>
  );
}
