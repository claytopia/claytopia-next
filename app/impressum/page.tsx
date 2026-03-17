import { Container } from '../components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Impressum - Claytopia",
  description: "Impressum und Anbieterkennzeichnung von Claytopia Keramik-Atelier.",
};

export default function ImpressumPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-background flex-grow">
        <Container>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12">Impressum</h1>

            <section className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="text-foreground-muted leading-relaxed">
                Pia Kadasch<br />
                Claytopia Keramik-Atelier<br />
                Stöcker Weg 54<br />
                51503 Rösrath
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-3">Kontakt</h2>
              <p className="text-foreground-muted leading-relaxed">
                Telefon: <a href="tel:+491718336539" className="hover:text-primary transition-colors">+49 171 833 6539</a><br />
                E-Mail: <a href="mailto:hello@claytopia.de" className="hover:text-primary transition-colors">hello@claytopia.de</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-3">Umsatzsteuer</h2>
              <p className="text-foreground-muted leading-relaxed">
                Als Kleinunternehmen im Sinne von § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl text-foreground mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
              <p className="text-foreground-muted leading-relaxed">
                Pia Kadasch<br />
                Stöcker Weg 54<br />
                51503 Rösrath
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">Haftungsausschluss</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </div>
  );
}
