import Image from 'next/image';
import { Container } from '../components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Brennservice - Claytopia",
  description: "Professioneller Brennservice für deine Keramik in Rösrath. Schrühbrand und Glasurbrand im 125l Kittec Toploader.",
};

export default function BrennservicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/brennservice/brennservice.jpg"
            alt="Brennservice Ofen"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
            Brennservice
          </h1>
            {/*
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-white/90">
            Wir geben deinem Ton den letzten Schliff.
          </p>
          */}
        </Container>
      </section>

      {/* OFFER SECTION */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Was biete ich an?</h2>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Ich brenne in einem Kittec Toploader mit einem Fassungsvermögen von 125 Litern. 
                Der Nutzraum hat einen Durchmesser von 59cm und eine Höhe von 46cm. 
                Das Be- und Entladen des Ofens übernehme grundsätzlich ich.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-stone-50 p-8 rounded-sm">
                <h3 className="font-serif text-2xl mb-4 text-primary">Schrühbrand (950°C)</h3>
                <p className="text-foreground-muted">
                  Der erste Brand deiner vollständig getrockneten Tonarbeiten. 
                  Nach dem Schrühbrand sind die Stücke bereit zum Glasieren.
                </p>
              </div>
              <div className="bg-stone-50 p-8 rounded-sm">
                <h3 className="font-serif text-2xl mb-4 text-primary">Glasurbrand (1220° - 1240°C)</h3>
                <p className="text-foreground-muted mb-4">
                  Der zweite Brand, bei dem die Glasur eingebrannt wird. Er verleiht der Keramik eine wasserdichte Oberfläche.
                  Den Glasurbrand fahre ich normalerweise zwischen 1220° und 1240°C.
                </p>
                <p className="text-sm italic text-foreground-muted">
                  Falls du eine bestimmte Brenntemperatur in diesem Bereich wünschst, lässt sich das nach Absprache bestimmt einrichten.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 bg-background-alt">
        <Container>
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Preise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Einzelstücke Schrühbrand */}
            <div className="bg-background p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
              <h3 className="font-serif text-2xl mb-2">Schrühbrand</h3>
              <p className="text-sm text-foreground-muted mb-4">Einzelstücke</p>
              <p className="text-4xl font-light mb-2">8,-€</p>
              <p className="text-sm text-foreground-muted">pro kg</p>
            </div>

            {/* Einzelstücke Glasurbrand */}
            <div className="bg-background p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
              <h3 className="font-serif text-2xl mb-2">Glasurbrand</h3>
              <p className="text-sm text-foreground-muted mb-4">Einzelstücke</p>
              <p className="text-4xl font-light mb-2">11,-€</p>
              <p className="text-sm text-foreground-muted">pro kg</p>
            </div>

            {/* Gesamter Ofen */}
            <div className="bg-background p-8 rounded-sm shadow-sm flex flex-col items-center text-center lg:col-span-1 md:col-span-2">
              <h3 className="font-serif text-2xl mb-2">Gesamter Ofen</h3>
              <p className="text-sm text-foreground-muted mb-4">125 Liter</p>
              <div className="space-y-2">
                <p className="text-lg">Schrühbrand: <strong>85,-€</strong></p>
                <p className="text-lg">Glasurbrand: <strong>110,-€</strong></p>
              </div>
              <p className="text-xs text-foreground-muted mt-4">Temperatur nach Wahl</p>
            </div>

          </div>

          <div className="text-center mt-8">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
              Clay Club-Karteninhaber*innen erhalten 20% Rabatt auf den kg-Preis!
            </span>
          </div>
        </Container>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div>
                <h2 className="font-serif text-3xl md:text-4xl mb-8">So funktioniert&apos;s</h2>
                <div className="space-y-6 text-foreground-muted text-lg">
                  <div className="flex gap-4">
                    <span className="font-serif text-4xl text-primary/30 font-bold">1</span>
                    <p>
                      Melde dich gerne per E-Mail, Signal oder WhatsApp, um einen Termin zur Übergabe deiner gut durchgetrockneten Stücke in meinem Atelier zu vereinbaren.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-serif text-4xl text-primary/30 font-bold">2</span>
                    <p>
                      Ich brenne, sobald ein Ofen vollständig befüllt ist. In der Regel musst du nicht länger als 3 Wochen warten.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-serif text-4xl text-primary/30 font-bold">3</span>
                    <p>
                      Nach dem Brand wiege ich deine Stücke (grammgenau, mind. 1kg bei kleinen Mengen). Ein Kaffeebecher wiegt ca. 180-250g, eine Müslischale ca. 350-450g.
                    </p>
                  </div>
                   <div className="flex gap-4">
                    <span className="font-serif text-4xl text-primary/30 font-bold">4</span>
                    <p>
                      Sobald alles fertig ist, informiere ich dich für einen Abholtermin. Bezahlung bar oder per PayPal (zzgl. Gebühr) vor Ort.
                    </p>
                  </div>
                </div>
             </div>

             <div className="bg-stone-50 p-8 rounded-sm text-sm text-foreground-muted space-y-4 border-l-4 border-primary/20">
                <h3 className="font-serif text-xl text-foreground mb-4">Wichtige Spielregeln</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Trocknung:</strong> Stücke müssen komplett durchgetrocknet sein (min. 10 Tage).</li>
                  <li><strong>Wandstärke:</strong> Maximal 2 cm, um Bersten zu vermeiden.</li>
                  <li><strong>Material:</strong> Nur geeigneten Ton und Glasuren verwenden!</li>
                  <li><strong>Markierung:</strong> Markiere ALLE deine Werkstücke eindeutig.</li>
                  <li><strong>Standflächen:</strong> Müssen unglasiert sein (0,3cm Rand lassen). Glasierte Standflächen werden nicht gebrannt.</li>
                </ul>
                <p className="italic mt-4">
                  Bitte halte dich an diese Regeln, um Schäden am Ofen und anderen Werken zu vermeiden.
                </p>
             </div>
          </div>
        </Container>
      </section>

      {/* DISCLAIMER SECTION */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="max-w-4xl mx-auto text-sm text-foreground-muted space-y-4">
             <h3 className="font-bold text-foreground">Haftungsausschluss und Umgang mit Schäden</h3>
             <p>
               Ich übernehme keine Haftung für Beschädigungen oder Risse, die durch den Brennvorgang oder das Be- und Entladen des Ofens entstehen. Ton ist ein natürliches Material, bei dem Schäden nie ganz ausgeschlossen werden können.
             </p>
             <p>
               Sollten Schäden an meinem Ofen, den Ofenplatten oder anderem Zubehör durch dein Werkstück (z.B. falscher Ton, ablaufende Glasur) verursacht werden, stelle ich die entstandenen Kosten in Rechnung (z.B. Reinigung Ofenplatte 25,-€/Std, Austausch 85,-€).
             </p>
          </div>
        </Container>
      </section>

      {/* CONTACT CTA */}
      <section className="py-24">
        <Container className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Noch Fragen?</h2>
          <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto">
             Möchtest du einen Termin vereinbaren oder bist unsicher, ob dein Ton/Glasur passt? Meld dich einfach!
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
