import Image from 'next/image';
import { Container } from '../components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Über Claytopia - Pia & das Atelier",
  description: "Erfahre mehr über Claytopia, Pia und die Philosophie dahinter. Ein Raum für Kreativität, Entspannung und Töpfern ohne Druck.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/about/atelier01.png"
            alt="Claytopia Atelier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
            Über Claytopia
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-white/90">
            Schön, dass du da bist!
          </p>
        </Container>
      </section>

      {/* INTRO / PERSONAL SECTION */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Column */}
            <div className="relative aspect-[4/5] md:aspect-square lg:order-2">
              <div className="absolute inset-0 bg-stone-100 rounded-sm transform translate-x-4 translate-y-4 -z-10" />
              <Image 
                src="/img/about/aboutme.png" 
                alt="Pia von Claytopia" 
                fill 
                className="object-cover rounded-sm"
              />
            </div>

            {/* Text Column */}
            <div className="space-y-6 text-lg text-foreground-muted leading-relaxed lg:order-1">
              <p>
                Ich bin Pia und habe CLAYTOPIA ins Leben gerufen, um meine Leidenschaft für das Töpfern mit anderen zu teilen. Seit 2021 arbeite ich mit Ton und liebe es, Menschen für dieses wunderbare Handwerk zu begeistern.
              </p>
              <p>
                Obwohl ich schon mein ganzes Leben gerne in unterschiedlichen Bereichen kreativ tätig bin, hatte ich lange keinen wirklichen Kontakt zu Ton. Erst während meiner Arbeit als Sozialarbeiterin im ambulant betreuten Wohnen kam ich durch eine Klientin mit dem Töpfern in Berührung – und es war sehr schnell um mich geschehen.
              </p>
              <p>
                Ich liebe die Vielfältigkeit, die das Arbeiten mit Ton bietet: Dass im Prinzip jede Form möglich ist und es unzählige Herangehensweisen gibt. Dass Töpfern sowohl einen künstlerischen als auch einen technischen Anteil hat. Dass es Planung braucht, aber auch Raum für Spontanität lässt. Dass man konzentriert arbeitet – und dabei trotzdem wunderbar den Kopf frei bekommt.
              </p>
              
              <blockquote className="border-l-4 border-primary/30 pl-6 italic text-xl text-foreground font-serif my-8">
                &bdquo;Der ganze Schaffensprozess ist wie Yoga – nur dass man am Ende einen Kaffee daraus trinken kann. Es flowed einfach.&ldquo;
              </blockquote>
            </div>

          </div>
        </Container>
      </section>

      {/* MISSION SECTION */}
      <section className="py-20 bg-background-alt">
        <Container>
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-foreground">CLAYTOPIA - ein Raum für alle</h2>
            <div className="prose prose-lg text-foreground-muted mx-auto">
              <p>
                Mit CLAYTOPIA möchte ich genau diesen Flow weitergeben. Deshalb ist CLAYTOPIA kein klassisches Töpferatelier – hier geht es nicht darum, perfekte Stücke zu produzieren, Keramik zu verkaufen oder Kurse nach Leistungsstand zu absolvieren. Vielmehr möchte ich einen Raum bieten, in dem du kreativ sein kannst – frei von Druck, mit Zeit für dich und Platz für deine Ideen. Hier darf ausprobiert, verworfen, neu gedacht, gemeinsam gelernt und individuell gestaltet werden.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
               <Image 
                src="/img/about/atelier02.png" 
                alt="Atelier Detail" 
                fill 
                className="object-cover"
              />
            </div>
             <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
               <Image 
                src="/img/about/atelier03.png" 
                alt="Atelier Stimmung" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 text-lg text-foreground-muted leading-relaxed">
            <p>
              CLAYTOPIA bietet dir dafür ein flexibles Setting, das sich gut in deinen Alltag integrieren lässt – als kreative Auszeit, bewusste Me-Time oder einfach, um Neues zu entdecken. Es geht nicht um Perfektion, sondern ums Machen, Spüren und die Freude am Entstehen.
            </p>
            <p>
              CLAYTOPIA versteht sich als offener, inklusiver Ort für Menschen jeden Alters, jeder Herkunft und Identität. Egal ob Anfängerin oder Fortgeschrittener, jung oder alt, introvertiert oder gesellig – bei CLAYTOPIA geht es um Verbindung: mit dir selbst, mit dem Material und – wenn du magst – mit anderen.
            </p>
          </div>
        </Container>
      </section>

      {/* OUTRO SECTION */}
      <section className="py-20">
        <Container className="text-center">
          <p className="text-2xl font-serif text-foreground mb-4">
            Wenn du Lust hast, den Ton zwischen deinen Fingern zu spüren, kreativ zu werden und vielleicht sogar ein bisschen bei dir selbst anzukommen – dann bist du bei CLAYTOPIA genau richtig.
          </p>
          <div className="mt-12">
            <p className="text-xl font-medium mb-2">Ich freu mich auf dich!</p>
            <p className="font-serif text-4xl text-primary">Pia</p>
          </div>
        </Container>
      </section>

    </div>
  );
}
