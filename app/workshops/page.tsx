import Image from 'next/image';
import { Container } from '../components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Workshops - Claytopia",
  description: "Entdecke unsere Töpfer-Workshops in Rösrath. Hands On Clay, Weihnachtswerkstatt und individuelle Gruppen-Workshops.",
};

export default function WorkshopsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/clayclub/20250606_003442.jpg"
            alt="Claytopia Workshops"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
            Workshops
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-white/90">
            Kreative Auszeit mit Ton.
          </p>
        </Container>
      </section>

      {/* INTRO SECTION */}
      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg text-foreground-muted leading-relaxed">
              Hier findest du eine Übersicht der anstehenden Workshops. Aktuell ist es leider noch nicht möglich meine Workshops direkt online zu buchen, deshalb schreib mir gerne eine E-Mail über <a href="mailto:hello@claytopia.de" className="text-primary hover:underline">hello@claytopia.de</a> oder eine Nachricht per WhatsApp und ich melde mich so schnell wie möglich bei dir zurück!
            </p>
          </div>
        </Container>
      </section>

      {/* UPCOMING WORKSHOPS
      <section className="py-16 bg-background-alt">
        <Container>
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">Kommende Workshops</h2>
          
          <div className="bg-background rounded-sm shadow-sm overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image 
                src="/img/clayclub/20241001_133856.jpg" 
                alt="Weihnachtswerkstatt" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <h3 className="font-serif text-2xl md:text-3xl text-primary">HANDS ON CLAY: Weihnachtswerkstatt</h3>
                 <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                   23.11.2025 • 59€
                 </span>
              </div>
              
              <p className="text-lg font-medium text-foreground">
                23.11.2025 - 11 bis 14:30 Uhr
              </p>

              <div className="prose prose-lg text-foreground-muted">
                <p>
                  Gönn dir drei Stunden kreatives Arbeiten mit Ton und gestalte handgemachte Stücke, die Freude schenken. 
                  In der Weihnachtswerkstatt gibt es keine Vorgaben, aber viel Raum zum Ausprobieren. 
                  Der Workshop richtet sich an Anfänger*innen und Fortgeschrittene.
                </p>
                <p>
                  Alle Materialien sind in der Teilnahmegebühr enthalten: Ton (so viel du brauchst), die Nutzung aller Werkzeuge, 
                  beide Brände, sowie das einfarbige Glasieren durch mich.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                   <h4 className="font-serif text-xl mb-2">Was dich erwartet</h4>
                   <p className="text-sm text-foreground-muted">
                     Du arbeitest selbstständig und entscheidest, was du herstellen möchtest. 
                     Ich unterstütze dich bei der Umsetzung und stelle zahlreiche Arbeitsmittel zur Verfügung. 
                     Es können Objekte bis etwa zur Größe einer Bowl entstehen.
                   </p>
                </div>
                <div>
                   <h4 className="font-serif text-xl mb-2">Wie es weitergeht</h4>
                   <p className="text-sm text-foreground-muted">
                     Nach dem Workshop trocknen deine Stücke rund zehn Tage. Anschließend glasiere ich sie einfarbig und brenne sie ein zweites Mal. 
                     Alternativ kannst du deine Stücke im Clay Club selbst glasieren.
                   </p>
                </div>
              </div>
              
              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Weihnachtswerkstatt" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

        </Container>
      </section>
*/}
      {/* INDIVIDUAL WORKSHOPS */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Info Text */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl md:text-4xl">Individuelle Workshops</h2>
              <p className="text-lg text-foreground-muted">
                Individuelle Workshops sind für Gruppen von 1 bis 10 Personen buchbar. Der Preis richtet sich nach dem zeitlichen Umfang, der Teilnehmerzahl und dem gewünschten Aufwand.
              </p>
              <p className="text-foreground-muted">
                Für euer persönliches Töpfer-Erlebnis erstelle ich euch gerne ein individuelles Angebot – ganz nach euren Vorstellungen. Ob ihr frei drauflos töpfern möchtet, ein gemeinsames Thema festlegt (z.B. Weihnachten, Frühling, Lieblingstasse) oder ein bestimmtes Produkt entstehen soll.
              </p>
               <p className="text-foreground-muted">
                Schreibt mir einfach eure Idee, und ich melde mich mit einem passenden Vorschlag zurück. Ich freu mich auf euch!
              </p>
              
              <div className="bg-stone-50 p-6 rounded-sm border-l-4 border-primary/20 mt-8">
                <h3 className="font-serif text-xl mb-4 text-foreground">Beispiel: &quot;Basis-Workshop&quot;</h3>
                <div className="space-y-4 text-sm text-foreground-muted">
                   <p>
                     <strong>Grundpreis:</strong> 150 € (für 1 Person) <br/>
                     <strong>Zusatzperson:</strong> + 30 € (max. 10 Personen)
                   </p>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>3 Stunden Workshopzeit &quot;freies Töpfern&quot;</li>
                     <li>Einführung in verschiedene Techniken</li>
                     <li>Individuelle Projektberatung</li>
                     <li>So viel Ton, wie du brauchst & Nutzung aller Materialien</li>
                     <li>Schrühbrand & einfarbige Glasur durch mich & Glasurbrand</li>
                   </ul>
                   <p className="italic text-xs">
                     Alternativ: Wenn du deine Keramik selbst farbig glasieren möchtest, kannst du das im Rahmen des Clay Clubs machen.
                   </p>
                </div>
              </div>

            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-square rounded-sm overflow-hidden shadow-sm">
               <Image 
                src="/img/clayclub/20250521_132413.jpg"
                alt="Töpfern im Workshop" 
                fill 
                className="object-cover"
              />
            </div>

          </div>
        </Container>
      </section>

      {/* CONTACT CTA */}
      <section className="py-24 bg-background-alt">
        <Container className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Interesse geweckt?</h2>
          <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto">
             Hast du Fragen zu den Workshops oder möchtest ein individuelles Angebot?
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-lg">
            <a href="mailto:hello@claytopia.de" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="font-medium">E-Mail:</span> hello@claytopia.de
            </a>
            <a href="tel:+491778336539" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="font-medium">Telefon:</span> +49 177 833 6539
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
}