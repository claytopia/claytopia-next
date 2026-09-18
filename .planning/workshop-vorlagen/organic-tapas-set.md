# Vorlage: Organic Tapas Set (Friday Night Clay Play)

Dieser Workshop-Block war bis zum 18.09.2026 auf der Workshop-Seite
(`app/workshops/page.tsx`) aktiv und wurde dort entfernt. Er ist hier
unverändert abgelegt, damit er jederzeit wieder eingesetzt werden kann.

## So aktivierst du ihn wieder

1. `app/workshops/page.tsx` öffnen.
2. Im Abschnitt `{/* UPCOMING WORKSHOPS */}` steht innerhalb von
   `<div className="space-y-12">` ein Workshop-Block pro Workshop.
3. Den Code unten an der passenden Stelle einfügen — die Blöcke stehen
   aufsteigend nach Datum sortiert.
4. Datum, Uhrzeit und Preis anpassen. Der Text sagt „Dieses Mal: Organic
   Tapas Set“, das Thema also gegebenenfalls ändern.

Das Bild `public/img/workshops/Tapas.jpg` liegt weiterhin im Projekt und
wird auch als Grundlage für das Newsletter-Hero (`Tapas-hero.jpg`) genutzt.

## Der Block

```tsx
          <div id="organic-tapas-set" className="scroll-mt-24 bg-background rounded-sm shadow-lg ring-1 ring-primary/20 border-t-4 border-primary overflow-hidden flex flex-col lg:flex-row">
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
                      Du kannst eine mittelgroße Servierplatte oder 3–5 kleine Schälchen herstellen und sie ganz nach deinen Vorstellungen formen und gestalten. Ob schlicht, organisch oder mit individueller Oberfläche – dir stehen verschiedene Möglichkeiten zur Strukturierung zur Verfügung. Auch Farbe kannst du direkt in dein Design integrieren.
                    </p>
                    <p>
                      Wir arbeiten mit einem wunderschönen beigefarbenen Ton mit dunklen Pünktchen, der deinen Stücken einen natürlichen, organischen Look verleiht.
                    </p>
                    <p>
                      Nach dem ersten Brand glasiere ich deine fertigen Stücke für dich mit einer transparenten Glasur, die den Ton schützt und seine natürliche Optik noch stärker zur Geltung bringt.
                    </p>
                    <p className="font-semibold text-foreground !mt-8">Das ist inklusive</p>
                    <ul>
                      <li>alle Materialien und Werkzeuge</li>
                      <li>individuelle Anleitung und Unterstützung</li>
                      <li>beide Brände</li>
                      <li>transparente Glasur durch mich</li>
                      <li>1 Begrüßungsgetränk + 1 Getränk nach Wahl</li>
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
                      Das Event findet ab 4 Teilnehmenden statt.
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
```
