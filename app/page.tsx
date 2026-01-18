import Image from 'next/image';
import { Container } from './components/Container';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/20241001_133949.jpg"
            alt="Claytopia Atelier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight drop-shadow-lg">
            Claytopia
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide mb-10 text-white/90 max-w-2xl mx-auto">
            Time to get dirty
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/clay-club" 
              className="px-8 py-3 bg-white text-stone-900 font-medium tracking-wide hover:bg-stone-100 transition-colors rounded-sm"
            >
              Clay Club
            </a>
            <a 
              href="/workshops" 
              className="px-8 py-3 border border-white text-white font-medium tracking-wide hover:bg-white/10 transition-colors rounded-sm"
            >
              Workshops
            </a>
          </div>
        </Container>
      </section>

      {/* INTRO / ABOUT SECTION */}
      <section className="py-24 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-[4/5] md:aspect-square">
              <Image
                src="/img/about/aboutme.png" 
                alt="Pia im Atelier"
                fill
                className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <span className="text-primary font-medium tracking-widest uppercase text-sm">Über Uns</span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Handmade with Love.
              </h2>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Willkommen bei Claytopia. Hier dreht sich alles um den Ton. 
                Ob du Anfänger bist oder schon Erfahrung hast – in unserem Atelier 
                findest du den Raum und die Ruhe, um deine kreativen Ideen in Keramik zu verwandeln.
              </p>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Wir glauben an die erdende Kraft des Töpferns und die Freude am Erschaffen 
                mit den eigenen Händen.
              </p>
              <div className="pt-4">
                <a href="/about" className="text-primary font-medium hover:text-primary/80 border-b border-primary/30 pb-1">
                  Mehr erfahren &rarr;
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 bg-background-alt">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Mein Angebot</h2>
            <p className="text-foreground-muted">
              Finde das passende Angebot für deine kreative Reise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <a href="/clay-club" className="group block space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/img/clayclub/20241001_133856.jpg"
                  alt="Clay Club"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">Clay Club</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  Jeden Dienstag und Donnerstag Abend, sowie Freitag Vormittag, öffne ich die Türen meines Ateliers für den Clay Club. In diesem freien Töpferangebot kannst du in kleiner, netter Runde deine eigenen Ideen, in deinem eigenen Tempo umsetzen.                </p>
              </div>
            </a>

            {/* Service 2 */}
            <a href="/brennservice" className="group block space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/img/brennservice/brennservice.jpg"
                  alt="Brennservice"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">Brennservice</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  Du töpferst gerne zuhause, hast aber keinen eigenen Brennofen? Dann nutze meinen Brennservice.                </p>
              </div>
            </a>

            {/* Service 3 */}
            <a href="/workshops" className="group block space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/img/clayclub/20250601_170257.jpg"
                  alt="Workshops"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">Workshops</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  Regelmäßig biete ich Workshops zu unterschiedlichen Themen an. Trage dich gerne in meinen Newsletter ein, um kein Event zu verpassen.                </p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* GALLERY / MOOD
      <section className="py-24">
        <Container>
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">Impressionen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative aspect-square">
              <Image src="/img/portfolio/work1.jpg" alt="Gallery 1" fill className="object-cover rounded-sm" />
            </div>
            <div className="relative aspect-square">
              <Image src="/img/portfolio/work2.jpg" alt="Gallery 2" fill className="object-cover rounded-sm" />
            </div>
            <div className="relative aspect-square">
              <Image src="/img/portfolio/work3.jpg" alt="Gallery 3" fill className="object-cover rounded-sm" />
            </div>
            <div className="relative aspect-square">
              <Image src="/img/portfolio/work4.jpg" alt="Gallery 4" fill className="object-cover rounded-sm" />
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-block border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
              Folge uns auf Instagram
            </a>
          </div>
        </Container>
      </section>
*/}
    </div>
  );
}