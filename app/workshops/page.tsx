import Image from 'next/image';
import { Container } from '../components/Container';
import { WorkshopDescription } from '../components/WorkshopDescription';
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
            src="/img/clayclub/IMG_1034.jpg"
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

      {/* UPCOMING WORKSHOPS */}
      <section className="py-16 bg-background-alt">
        <Container>
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">Kommende Workshops</h2>

          <div className="space-y-12">

          <div className="bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image
                src="/img/workshops/Tapas.jpg"
                alt="Organic Tapas Set"
                fill
                className="object-cover saturate-[0.75]"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="space-y-2">
                   <span className="inline-block uppercase tracking-widest text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-sm">
                     Friday Night Clay Play
                   </span>
                   <h3 className="font-serif text-3xl md:text-4xl text-primary">Organic Tapas Set</h3>
                 </div>
                 <span className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                   59&nbsp;€
                 </span>
              </div>

              <p className="text-lg font-medium text-foreground">
                Fr. 25.09.2026 - 20 bis 23 Uhr
              </p>

              <WorkshopDescription
                heading="Töpfern. Anstoßen. Wochenende."
                summary={
                  <>
                    <p>
                      Bei meinem Friday Night Clay Play erwartet dich ein entspannter Abend mit Ton, kühlen Drinks und guter Gesellschaft. In gemütlicher Atmosphäre setzen wir gemeinsam ein kleines, unkompliziertes Töpferprojekt um – ohne Leistungsdruck, dafür mit viel Raum für Kreativität und einen entspannten Start ins Wochenende. Kopf aus, Wochenende an! 🍸
                    </p>
                    <p className="font-semibold text-foreground">Dieses Mal: Organic Tapas Set</p>
                  </>
                }
                details={
                  <>
                    <p>
                      Du kannst 3–5 kleine Schälchen herstellen und sie ganz nach deinen Vorstellungen formen und gestalten. Ob schlicht, organisch oder mit individueller Oberfläche – dir stehen verschiedene Möglichkeiten zur Strukturierung zur Verfügung. Auch Farbe kannst du direkt in dein Design integrieren.
                    </p>
                    <p>
                      Wir arbeiten mit einem wunderschönen beigefarbenen Ton mit dunklen Pünktchen, der deinen Stücken einen natürlichen, organischen Look verleiht.
                    </p>
                    <p>
                      Nach dem ersten Brand glasiere ich deine fertigen Stücke für dich mit einer transparenten Glasur, die den Ton schützt und seine natürliche Optik noch stärker zur Geltung bringt.
                    </p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <p>In der Teilnahmegebühr enthalten sind:</p>
                    <ul>
                      <li>alle Materialien</li>
                      <li>beide Brände</li>
                      <li>2 Getränke deiner Wahl</li>
                    </ul>
                    <p>
                      Weitere Getränke kannst du vor Ort zu einem kleinen Aufpreis genießen.
                    </p>
                    <p className="!mt-8">
                      Du möchtest deine Stücke lieber selbst glasieren? Wie bei allen meinen Workshops kannst du deine Keramik auch nach deinen eigenen Vorstellungen im Clay Club glasieren – gegen Aufpreis.
                    </p>
                    <p>
                      ClayClubbies erhalten einen Rabatt – sprich mich einfach darauf an. ;)
                    </p>
                    <p className="font-medium text-foreground">
                      Das Event findet ab 3 Teilnehmenden statt.
                    </p>
                    <p className="font-medium text-foreground">All levels welcome!</p>
                  </>
                }
              />

              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Organic Tapas Set" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image
                src="/img/workshops/IMG_1628.jpg"
                alt="Form & Finish"
                fill
                className="object-cover saturate-[0.7]"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="space-y-2">
                   <span className="inline-block uppercase tracking-widest text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-sm">
                     Keramikworkshop
                   </span>
                   <h3 className="font-serif text-3xl md:text-4xl text-primary">Form & Finish</h3>
                 </div>
                 <span className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                   119&nbsp;€
                 </span>
              </div>

              <p className="text-lg font-medium text-foreground">
                Sa. 03.10.2026 - 14 bis 17 Uhr<br />
                Sa. 07.11.2026 - 14 bis 17 Uhr
              </p>

              <WorkshopDescription
                summary={
                  <>
                    <p>
                      Du hast Lust, deine eigenen Ideen aus Ton zum Leben zu erwecken? Dann ist dieser Workshop genau das Richtige für dich!
                    </p>
                    <p>
                      An zwei Terminen hast du ganz in Ruhe die Möglichkeit, deine eigenen Keramikstücke zu gestalten – ohne vorgegebene Formen oder ein festes Projekt. Ob Tasse, Schale, Vase, Teller, Kerzenhalter oder etwas ganz anderes: Du entscheidest, was entstehen soll.
                    </p>
                  </>
                }
                details={
                  <>
                    <p className="font-semibold text-foreground">Termin 1 – Formen, was das Zeug hält</p>
                    <p>
                      Beim ersten Termin heißt es: Ton in die Hände und los!
                    </p>
                    <p>
                      Wir formen, bauen, drücken, rollen und verzieren – ganz nach deinen Vorstellungen. Ich zeige dir verschiedene Techniken und stehe dir mit Tipps und Unterstützung zur Seite. Du hast eine konkrete Idee? Perfekt! Du weißt noch nicht genau, was du machen möchtest? Auch kein Problem – gemeinsam finden wir heraus, was zu dir passt.
                    </p>
                    <p className="font-semibold text-foreground !mt-8">Termin 2 – Farbe ins Spiel bringen</p>
                    <p>
                      Nachdem deine Stücke ihren ersten Brand hinter sich haben, geht es beim zweiten Termin ans Glasieren.
                    </p>
                    <p>
                      Hier kannst du deine Keramik ganz individuell gestalten und aus verschiedenen Glasuren und Farben auswählen. Ob schlicht und einfarbig, bunt und verspielt oder mit besonderen Effekten – du entscheidest, wie deine fertigen Stücke aussehen sollen.
                    </p>
                    <p>
                      Zwischen den beiden Terminen kümmere ich mich um den ersten Brand deiner Keramik.
                    </p>
                    <p>
                      Du möchtest nicht nach Vorlage arbeiten, sondern einfach ausprobieren, gestalten und deine eigenen Ideen verwirklichen? Dann komm vorbei und mach Keramik ganz nach deinem Geschmack! 🤍
                    </p>
                    <p className="font-medium text-foreground">Keine Vorkenntnisse nötig – All levels welcome!</p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <ul>
                      <li>zwei Workshoptermine</li>
                      <li>individuelle Betreuung und Unterstützung</li>
                      <li>alle Materialien und Werkzeuge</li>
                      <li>erster und zweiter Brand</li>
                      <li>individuelle Glasur deiner Keramik</li>
                    </ul>
                  </>
                }
              />

              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Form & Finish" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image
                src="/img/workshops/Tassenstapel.jpg"
                alt="Mug Love"
                fill
                className="object-cover sepia-[0.3] saturate-[1.2]"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="space-y-2">
                   <span className="inline-block uppercase tracking-widest text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-sm">
                     Themenworkshop
                   </span>
                   <h3 className="font-serif text-3xl md:text-4xl text-primary">Mug Love</h3>
                 </div>
                 <span className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                   59&nbsp;€
                 </span>
              </div>

              <p className="text-lg font-medium text-foreground">
                So. 11.10.2026 - 14 bis 17 Uhr
              </p>

              <WorkshopDescription
                summary={
                  <>
                    <p>
                      Tassen, Tassen, Tassen – davon kann man nie genug bekommen! ☕️<br />
                      Und noch schöner ist es, wenn die eigene Lieblingstasse selbst gemacht ist. Genau dazu hast du in diesem Workshop die Möglichkeit!
                    </p>
                    <p>
                      Mit der Plattentechnik (ausgerollten Tonplatten) und verschiedenen „Schnittmustern“ kannst du deine ganz persönliche Tasse gestalten. Mit Henkel oder ohne, gemustert, bauchig, verspielt oder ganz schlicht – deiner Kreativität sind keine Grenzen gesetzt. Komm vorbei und mach dir deine Tasse genau so, wie sie dir gefällt!
                    </p>
                  </>
                }
                details={
                  <>
                    <p>
                      Erste Erfahrungen mit Ton sind von Vorteil, aber keine Voraussetzung. Mit ein bisschen Mut, Vorstellungskraft und Freude am Ausprobieren zaubern hier wirklich ALLE ihr ganz persönliches Keramikstück.
                    </p>
                    <p>
                      Nach dem ersten Brand glasiere ich deine Stücke für dich mit einer einfarbigen Glasur deiner Wahl.
                    </p>
                    <p>
                      Du möchtest deine Stücke lieber selbst glasieren? Kein Problem! Wie bei allen meinen Workshops kannst du deine Keramik auch selbst im Clay Club nach deinen eigenen Vorstellungen glasieren – gegen Aufpreis.
                    </p>
                    <p>
                      ClayClubbies erhalten einen Rabatt – sprich mich einfach darauf an. ;)
                    </p>
                    <p className="font-medium text-foreground">
                      Das Event findet ab 3 Teilnehmenden statt und ist auf 10 Teilnehmer*innen begrenzt.
                    </p>
                    <p className="font-medium text-foreground">All levels welcome! ✨</p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <ul>
                      <li>alle Materialien und Werkzeuge</li>
                      <li>beide Brände</li>
                      <li>einfarbige Glasur durch mich</li>
                    </ul>
                  </>
                }
              />

              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Mug Love" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image
                src="/img/workshops/Kitchen nah.jpg"
                alt="Little Helpers"
                fill
                className="object-cover saturate-[0.65]"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="space-y-2">
                   <span className="inline-block uppercase tracking-widest text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-sm">
                     Friday Night Clay Play
                   </span>
                   <h3 className="font-serif text-3xl md:text-4xl text-primary">Little Helpers</h3>
                 </div>
                 <span className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                   59&nbsp;€
                 </span>
              </div>

              <p className="text-lg font-medium text-foreground">
                Fr. 20.11.2026 - 20 bis 23 Uhr
              </p>

              <WorkshopDescription
                heading="Töpfern. Anstoßen. Wochenende."
                summary={
                  <>
                    <p>
                      Bei meinem Friday Night Clay Play erwartet dich ein entspannter Abend mit Ton, kühlen Drinks und guter Gesellschaft. In gemütlicher Atmosphäre setzen wir gemeinsam ein kleines, unkompliziertes Töpferprojekt um – ohne Leistungsdruck, dafür mit viel Raum für Kreativität und einen entspannten Start ins Wochenende. Kopf aus, Wochenende an! 🍸
                    </p>
                    <p className="font-semibold text-foreground">Dieses Mal: Little Helpers</p>
                  </>
                }
                details={
                  <>
                    <p>
                      Du kannst heute kleine Küchenhelfer herstellen und sie ganz nach deinen Vorstellungen formen und gestalten. Das kann eine Ingwer-/Knoblauchreibe sein, eine Löffelablage oder auch eine Zitruspresse. Ob schlicht, organisch oder mit individueller Oberfläche – dir stehen verschiedene Möglichkeiten zur Strukturierung zur Verfügung. Auch Farbe kannst du direkt in dein Design integrieren.
                    </p>
                    <p>
                      Wir arbeiten mit einem wunderschönen beigefarbenen Ton mit dunklen Pünktchen, der deinen Stücken einen natürlichen, organischen Look verleiht.
                    </p>
                    <p>
                      Nach dem ersten Brand glasiere ich deine fertigen Stücke für dich mit einer transparenten Glasur, die den Ton schützt und seine natürliche Optik noch stärker zur Geltung bringt.
                    </p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <p>In der Teilnahmegebühr enthalten sind:</p>
                    <ul>
                      <li>alle Materialien</li>
                      <li>beide Brände</li>
                      <li>2 Getränke deiner Wahl</li>
                    </ul>
                    <p>
                      Weitere Getränke kannst du vor Ort zu einem kleinen Aufpreis genießen.
                    </p>
                    <p className="!mt-8">
                      Du möchtest deine Stücke lieber selbst glasieren? Wie bei allen meinen Workshops kannst du deine Keramik auch nach deinen eigenen Vorstellungen im Clay Club glasieren – gegen Aufpreis.
                    </p>
                    <p>
                      ClayClubbies erhalten einen Rabatt – sprich mich einfach darauf an. ;)
                    </p>
                    <p className="font-medium text-foreground">
                      Das Event findet ab 3 Teilnehmenden statt.
                    </p>
                    <p className="font-medium text-foreground">All levels welcome!</p>
                  </>
                }
              />

              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Little Helpers" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
               <Image
                src="/20251116_130246.jpg"
                alt="Weihnachtswerkstatt"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="space-y-2">
                   <span className="inline-block uppercase tracking-widest text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-sm">
                     Themenworkshop
                   </span>
                   <h3 className="font-serif text-3xl md:text-4xl text-primary">Weihnachtswerkstatt</h3>
                 </div>
                 <span className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                   59&nbsp;€
                 </span>
              </div>

              <p className="text-lg font-medium text-foreground">
                So. 22.11.2026 - 14 bis 17 Uhr
              </p>

              <WorkshopDescription
                summary={
                  <>
                    <p>
                      Töpfern für die schönste Zeit des Jahres – willkommen in der Weihnachtswerkstatt! ✨
                    </p>
                    <p>
                      In diesem 3-stündigen Workshop kannst du deine ganz persönlichen Weihnachtsstücke aus Ton gestalten. Ob als selbstgemachtes Geschenk für deine Lieblingsmenschen oder als kleine Keramik-Schätze für dein eigenes Zuhause – hier darf nach Herzenslust ausprobiert und gestaltet werden.
                    </p>
                    <p>
                      Also: Schnapp dir deine Lieblingsmenschen, komm in Weihnachtsstimmung und töpfere schon mal die ersten Geschenke für unter den Weihnachtsbaum.
                    </p>
                  </>
                }
                details={
                  <>
                    <p>
                      Nach dem Workshop kümmere ich mich um den Rest: Deine fertigen Stücke werden von mir nach dem ersten Brand mit einer einfarbigen Glasur deiner Wahl glasiert und anschließend ein zweites Mal gebrannt.
                    </p>
                    <p>
                      Du möchtest deine Stücke lieber selbst glasieren? Kein Problem! Wie bei allen meinen Workshops kannst du deine Keramik auch selbst im Clay Club nach deinen eigenen Vorstellungen glasieren – gegen Aufpreis.
                    </p>
                    <p>
                      ClayClubbies erhalten einen Rabatt – sprich mich einfach darauf an.
                    </p>
                    <p className="font-medium text-foreground">
                      Das Event findet ab 3 Teilnehmenden statt und ist auf 10 Teilnehmer*innen begrenzt.
                    </p>
                    <p className="font-medium text-foreground">Keine Vorkenntnisse nötig – All levels welcome!</p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <ul>
                      <li>alle Materialien und Werkzeuge</li>
                      <li>eine große Auswahl an weihnachtlichen Vorlagen und Dekorationen</li>
                      <li>beide Brände</li>
                      <li>einfarbige Glasur deiner Wahl, aufgetragen von mir</li>
                    </ul>
                  </>
                }
              />

              <div className="pt-6">
                <a href="mailto:hello@claytopia.de?subject=Anmeldung Weihnachtswerkstatt" className="inline-block bg-primary text-white px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors">
                  Jetzt Anfragen
                </a>
              </div>
            </div>
          </div>

          </div>

        </Container>
      </section>

      {/* WEIHNACHTSWERKSTATT (vergangen — Template als Referenz)
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
                     <strong>Zusatzperson:</strong> + 40 € (max. 10 Personen)
                   </p>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>3 Stunden Workshopzeit &quot;freies Töpfern&quot;</li>
                     <li>Einführung in verschiedene Techniken</li>
                     <li>Individuelle Projektberatung</li>
                     <li>So viel Ton, wie du brauchst & Nutzung aller Materialien</li>
                     <li>Schrühbrand & einfarbige Glasur durch mich & Glasurbrand</li>
                   </ul>
                   <p className="italic text-xs">
                     Alternative: wenn ihr eure erstellte Keramik lieber selbst glasieren möchtet, könnt ihr das im Rahmen des ClayClubs machen. 

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
            <a href="tel:+491718336539" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="font-medium">Telefon:</span> +49 171 833 6539
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
}