# Vorlage: Mug Love (Themenworkshop)

Dieser Workshop-Block war bis zum 05.11.2026 auf der Workshop-Seite
(`app/workshops/page.tsx`) aktiv und wurde dort entfernt. Er ist hier
unverändert abgelegt, damit er jederzeit wieder eingesetzt werden kann.

## So aktivierst du ihn wieder

1. `app/workshops/page.tsx` öffnen.
2. Im Abschnitt `{/* UPCOMING WORKSHOPS */}` steht innerhalb von
   `<div className="space-y-12">` ein Workshop-Block pro Workshop.
3. Den Code unten an der passenden Stelle einfügen — die Blöcke stehen
   aufsteigend nach Datum sortiert.
4. Datum, Uhrzeit und Preis anpassen.

Das Bild `public/img/workshops/Tassenstapel.jpg` liegt weiterhin im Projekt.

## Der Block

```tsx
          <div id="mug-love" className="scroll-mt-24 bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
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
                Sa. 07.11.2026 - 14 bis 17 Uhr
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
                      Das Event findet ab 4 Teilnehmenden statt und ist auf 10 Teilnehmer*innen begrenzt.
                    </p>
                    <p className="font-medium text-foreground">All levels welcome! ✨</p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <ul>
                      <li>alle Materialien und Werkzeuge</li>
                      <li>individuelle Anleitung und Unterstützung</li>
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
```
