import { Container } from '../components/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz - Claytopia',
  description: 'Datenschutzerklärung von Claytopia Keramik-Werkraum.',
}

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-background flex-grow">
        <Container>
          <div className="max-w-2xl space-y-10">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12">Datenschutzerklärung</h1>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">1. Verantwortlicher</h2>
              <p className="text-foreground-muted leading-relaxed">
                Pia Kadasch<br />
                Claytopia Keramik-Werkraum<br />
                Stöcker Weg 54<br />
                51503 Rösrath<br />
                E-Mail: <a href="mailto:hello@claytopia.de" className="hover:text-primary transition-colors">hello@claytopia.de</a><br />
                Telefon: <a href="tel:+491718336539" className="hover:text-primary transition-colors">+49 171 833 6539</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">2. Allgemeines zur Datenverarbeitung</h2>
              <p className="text-foreground-muted leading-relaxed">
                Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
                Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich
                ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des
                Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer
                Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch
                gesetzliche Vorschriften gestattet ist.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">3. Hosting</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                Diese Website wird bei <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, USA)
                gehostet. Beim Besuch dieser Website erfasst Vercel automatisch Informationen in sogenannten
                Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind unter anderem:
              </p>
              <ul className="list-disc list-inside text-foreground-muted leading-relaxed mb-4 space-y-1">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Browsertyp und -version</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer-URL</li>
              </ul>
              <p className="text-foreground-muted leading-relaxed">
                Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse an der sicheren und effizienten Bereitstellung der Website). Vercel verarbeitet Daten
                unter anderem in den USA. Die Übermittlung erfolgt auf Grundlage der
                EU-Standardvertragsklauseln. Weitere Informationen finden Sie in der{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline">
                  Datenschutzerklärung von Vercel
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">4. Supabase (Authentifizierung & Datenbank)</h2>
              <p className="text-foreground-muted leading-relaxed">
                Für die Benutzerverwaltung und Datenspeicherung im Mitgliederbereich nutzen wir{' '}
                <strong>Supabase Inc.</strong> (970 Toa Payoh North #07-04, Singapore 318992). Bei der Registrierung
                und Nutzung des Mitgliederbereichs werden folgende Daten verarbeitet:
              </p>
              <ul className="list-disc list-inside text-foreground-muted leading-relaxed my-4 space-y-1">
                <li>E-Mail-Adresse</li>
                <li>Vor- und Nachname</li>
                <li>Buchungsdaten (Termine, Kartenstände)</li>
              </ul>
              <p className="text-foreground-muted leading-relaxed">
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Weitere Informationen
                finden Sie in der{' '}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline">
                  Datenschutzerklärung von Supabase
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">5. Kontaktformular</h2>
              <p className="text-foreground-muted leading-relaxed">
                Wenn Sie uns über das Kontaktformular kontaktieren, werden Ihre Angaben (Name, E-Mail-Adresse,
                ggf. Telefonnummer und Nachricht) per E-Mail an uns übermittelt. Die Daten werden ausschließlich
                zur Bearbeitung Ihres Anliegens verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
                (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                Beantwortung von Anfragen). Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes
                ihrer Erhebung nicht mehr erforderlich sind.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">6. Newsletter</h2>
              <p className="text-foreground-muted leading-relaxed">
                Wenn Sie sich für unseren Newsletter anmelden, werden Ihr Name und Ihre E-Mail-Adresse
                per E-Mail an uns übermittelt. Die Daten werden ausschließlich zum Versand des Newsletters
                verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Sie können Ihre
                Einwilligung jederzeit widerrufen, z.&nbsp;B. per E-Mail an{' '}
                <a href="mailto:hello@claytopia.de" className="text-primary hover:underline">hello@claytopia.de</a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">7. Schriftarten (Google Fonts)</h2>
              <p className="text-foreground-muted leading-relaxed">
                Diese Website nutzt die Schriftarten „Playfair Display" und „Lato" von Google. Die Schriften
                werden über <code className="text-sm bg-background-alt px-1 py-0.5 rounded-sm">next/font</code> beim
                Build-Prozess heruntergeladen und lokal von unserem Server ausgeliefert. Es findet <strong>keine
                Verbindung zu Google-Servern</strong> beim Besuch der Website statt.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">8. Ihre Rechte</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside text-foreground-muted leading-relaxed mb-4 space-y-1">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              </ul>
              <p className="text-foreground-muted leading-relaxed">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an{' '}
                <a href="mailto:hello@claytopia.de" className="text-primary hover:underline">hello@claytopia.de</a>.
                Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
                Ihrer personenbezogenen Daten zu beschweren.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-foreground mb-3">9. Cookies</h2>
              <p className="text-foreground-muted leading-relaxed">
                Diese Website verwendet ausschließlich technisch notwendige Cookies für den Betrieb des
                Mitgliederbereichs (Session-Cookies für die Authentifizierung). Es werden keine Tracking-
                oder Marketing-Cookies eingesetzt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse am Betrieb der Website).
              </p>
            </section>

            <p className="text-sm text-foreground-muted pt-4">
              Stand: Mai 2026
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}
