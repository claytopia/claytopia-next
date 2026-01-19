import Image from 'next/image';
import { Container } from '../components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Clay Club - Claytopia",
  description: "Der Clay Club: Dein offenes Keramik-Atelier in Rösrath. Flexibel töpfern in Gemeinschaft.",
};

export default function ClayClubPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/clayclub/20250606_003442.jpg"
            alt="Clay Club Atelier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
            Clay Club
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-white/90">
            Gemeinsam kreativ sein im offenen Atelier.
          </p>
        </Container>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Main Text */}
            <div className="space-y-12">
              
              {/* Was ist der Clay Club? */}
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">Was ist der Clay Club?</h2>
                <div className="prose prose-lg text-foreground-muted space-y-4">
                  <p>
                    Der Clay Club ist ein offenes, regelmäßig stattfindendes Töpferangebot, bei dem sich Gleichgesinnte treffen, um gemeinsam kreativ zu sein, sich auszutauschen und voneinander zu lernen.
                  </p>
                  <p>
                    Ob Anfängerin oder Fortgeschrittener – im Clay Club ist jede*r willkommen! Wir arbeiten überwiegend mit Aufbautechniken, was dir viel gestalterischen Freiraum lässt und sich besonders gut für individuelles, freies Arbeiten eignet. In entspannter Atmosphäre kannst du deine eigenen Ideen umsetzen oder dich von anderen inspirieren lassen. Ich bin bei jedem Termin als Ansprechpartnerin für dich da, du arbeitest jedoch eigenverantwortlich und gestaltest deine Projekte ganz nach deinen Vorstellungen.
                  </p>
                </div>
              </div>

              {/* Was erwartet dich? */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-foreground">Was erwartet dich?</h3>
                <ul className="list-disc list-outside pl-5 space-y-2 text-foreground-muted text-lg">
                  <li>Freies Töpfern ohne feste Vorgaben</li>
                  <li>Austausch mit anderen Töpferbegeisterten</li>
                  <li>Entspannte, kreative Atmosphäre</li>
                  <li>Flexible Teilnahme durch Club-Karten-System</li>
                  <li>Du kannst alle Materialien und Werkzeuge vor Ort nutzen</li>
                  <li>Ton und Glasuren sind im Preis inbegriffen</li>
                </ul>
              </div>

              {/* Mitmachen */}
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground pt-4">Mitmachen</h2>
                <div className="prose prose-lg text-foreground-muted space-y-4">
                  <p>
                    Der Clay Club findet an folgenden Tagen in meinem Atelier in Rösrath-Hoffnungsthal statt:
                  </p>
                  <ul className="list-none space-y-2 font-medium text-foreground pl-0">
                    <li>Dienstags: 19 - 22 Uhr</li>
                    <li>Donnerstags: 19 - 22 Uhr</li>
                    <li>Freitags: 10 - 13 Uhr</li>
                  </ul>
                  <p>
                    Du entscheidest flexibel, an welchen Tagen du teilnehmen möchtest – auch mehrmals pro Woche ist möglich. Die Teilnehmerzahl ist aktuell auf 5 Personen pro Termin begrenzt, es gilt: first come, first served.
                  </p>
                  <p>
                    Die Anmeldung erfolgt über einen Terminplaner-Link, den du nach dem Kauf deiner ersten Club-Karte von mir erhältst. Kommst du zum ersten Mal, schreib mich gerne per Signal oder WhatsApp an.
                  </p>
                  <p className="text-sm italic">
                    Der Clay Club findet in der Regel auch während der Ferien und an Feiertagen statt – außer ich bin selbst verreist. Sollte ein Termin einmal entfallen, kündige ich das rechtzeitig an. Entsprechende Tage erscheinen dann auch nicht im Terminplaner.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Images & Cards */}
            <div className="space-y-8">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                 <Image 
                    src="/img/clayclub/20241001_133856.jpg" 
                    alt="Arbeiten im Clay Club" 
                    fill 
                    className="object-cover"
                 />
              </div>
               <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                 <Image 
                    src="/img/clayclub/20250521_133103.jpg" 
                    alt="Tonarbeiten" 
                    fill 
                    className="object-cover"
                 />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 bg-background-alt">
        <Container>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Kosten</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 10er Karte */}
            <div className="bg-background p-6 rounded-sm shadow-sm flex flex-col">
              <div className="relative aspect-video mb-6 rounded-sm overflow-hidden bg-stone-100">
                <Image 
                  src="/img/clayclub/10er-karte.jpg" 
                  alt="10er Karte" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl mb-2">10er Karte</h3>
              <p className="text-3xl font-light mb-4">200,-€</p>
              <p className="text-foreground-muted text-sm flex-grow">
                Flexibel einsetzbar, 6 Monate gültig. Teilbar mit bis zu 3 Personen.
              </p>
            </div>

            {/* 5er Karte */}
            <div className="bg-background p-6 rounded-sm shadow-sm flex flex-col">
              <div className="relative aspect-video mb-6 rounded-sm overflow-hidden bg-stone-100">
                <Image 
                  src="/img/clayclub/5er-karte.jpg" 
                  alt="5er Karte" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl mb-2">5er Karte</h3>
              <p className="text-3xl font-light mb-4">120,-€</p>
              <p className="text-foreground-muted text-sm flex-grow">
                 Flexibel einsetzbar, 6 Monate gültig. Teilbar mit bis zu 2 Personen.
              </p>
            </div>

            {/* Schnuppertermin */}
            <div className="bg-background p-6 rounded-sm shadow-sm flex flex-col">
              <div className="relative aspect-video mb-6 rounded-sm overflow-hidden bg-stone-100">
                <Image 
                  src="/img/clayclub/schnuppertöpfern.jpg" 
                  alt="Schnuppertöpfern" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl mb-2">Schnuppertermin</h3>
              <p className="text-3xl font-light mb-4">25,-€</p>
              <p className="text-foreground-muted text-sm flex-grow">
                Maximal 2x möglich. Beim anschließenden Kauf einer Club-Karte werden 25,-€ angerechnet.
              </p>
            </div>

          </div>

          <div className="max-w-3xl mx-auto mt-12 space-y-6 text-foreground-muted leading-relaxed">
            <p>
              <strong>+ individuelle Kosten für Brände</strong>
            </p>
            <p>
              Die Club-Karten sind ab Kaufdatum 6 Monate gültig und flexibel einsetzbar. Sie sind personenbezogen und nicht übertragbar. Allerdings könnt ihr euch eine Karte teilen – Voraussetzung ist, dass alle Namen bereits beim Kauf der Karte angegeben werden.
            </p>
            <p>
              Im Preis enthalten ist die Nutzung aller Werkzeuge und Materialien in meinem Atelier – inklusive Ton und Glasuren. Die meisten meiner Glasuren sind tafelgeschirrgeeignet.
            </p>
            <p>
              Die Brennkosten werden zusätzlich zum Kartenpreis berechnet und richten sich danach, wie viel du produzierst (Größe/Gewicht). Als Club-Karteninhaber*in erhältst du <strong>20% Rabatt</strong> auf die regulären Brennservice-Preise.
            </p>
            <p>
               Jedes Werkstück durchläuft zwei Brennvorgänge:
               <br/>1. Schrühbrand bei 950°C (nach dem Trocknen)
               <br/>2. Glasurbrand bei ca. 1220°C (nach dem Glasieren)
            </p>
          </div>

        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24">
        <Container className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Kontakt & Anmeldung</h2>
          <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto">
            Du hast Fragen oder möchtest dich anmelden? Dann melde dich gerne bei mir!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-lg">
            <a href="mailto:hello@claytopia.de" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="font-medium">E-Mail:</span> hello@claytopia.de
            </a>
            <a href="tel:+491718336539" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="font-medium">Telefon:</span> +49 171 833 6539
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
}
