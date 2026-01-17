Projektbeschreibung: Migration Claytopia zu Next.js
1. Aufgabe: Ziel ist es die bestehende Webseite Claytopia (claytopia.github.io) von einem statischen HTML/CSS/JS Setup zu einer modernen Next.js Applikation zu migrieren. Dabei sollen Inhalte und Funktionalitäten erhalten bleiben bzw. verbessert werden.

2. Thema & Konzept

   Claytopia ist eine Webseite für ein Töpferatelier in Deutschland, betrieben von Pia Kadasch. Das Konzept fokussiert sich auf:

Clay Club - Regelmäßige offene Töpferangebote (Dienstag/Donnerstag abends, Freitag vormittags)
Brennservice - Keramikbrennservice für Hobbytöpfer ohne eigenen Ofen
Workshops - Veranstaltungen zu verschiedenen Töpferthemen
Gruppen-Events - Individuelle Töpferworkshops für JGA, Kindergeburtstage, Teamevents

Zielgruppe: Kreative Menschen, die Töpfern als Hobby oder kreatives Event erleben möchten. Die Ansprache ist persönlich, einladend und niedrigschwellig ("Time to get dirty").
3Look & Feel
   Visuelle Gestaltung

Stil: Handgemacht, authentisch, warm und einladend
Farbschema: Natürliche, erdige Töne (Tonfarben, warme Brauntöne, gedeckte Pastelltöne)
Typografie: Klar lesbar, modern aber mit handwerklichem Touch
Bildsprache: Authentische Fotos aus dem Atelier, Keramikarbeiten, Workshopsituationen
Atmosphäre: Kreativ, entspannt, gemeinschaftlich, persönlich

UX/UI Prinzipien

Einfache, intuitive Navigation
Mobile-first Ansatz (viele User werden mobil zugreifen)
Schnelle Ladezeiten
Klare Call-to-Actions (Anmeldung Clay Club, Kontaktaufnahme)
Barrierearm

3. Benötigte Unterseiten
   3.1 Startseite (/)
   Inhalte:

Hero-Section mit Slogan "Time to get dirty"
Übersicht der vier Hauptangebote (Clay Club, Brennservice, Workshops, Gruppen-Events)
Teaser-Bilder und Kurzbeschreibungen
CTA "Komm in den Club!"
Footer mit Kontaktdaten und Adresse

3.2 About (/about)
Inhalte:

Über Pia Kadasch (Atelierbetreiberin)
Geschichte von Claytopia
Philosophie & Arbeitsweise
Atelier-Fotos
Persönliche Story

3.3 Clay Club (/clay-club)
Inhalte:

Detaillierte Beschreibung des Clay Club Konzepts
Öffnungszeiten (Dienstag, Donnerstag abends, Freitag vormittags)
Preise & Konditionen
Was ist enthalten? (Material, Werkzeug, Brennservice)
Anmeldeformular oder Kontaktmöglichkeit
FAQ zum Clay Club
Galerie mit Teilnehmerarbeiten

3.4 Brennservice (/brennservice)
Inhalte:

Beschreibung des Services
Preisliste (nach Größe/Gewicht)
Ablauf (Anlieferung, Abholung, Brennzeiten)
Technische Details (Brenntemperaturen, Ofengröße)
Anmeldeformular für Brennaufträge
FAQ zum Brennservice

3.5 Workshops (/workshops)
Inhalte:

Übersicht aktueller und kommender Workshops
Workshop-Kategorien/Themen
Detailansichten einzelner Workshops mit:

Beschreibung
Termine
Dauer
Preis
Teilnehmerzahl
Anmeldung


Newsletter-Anmeldung für Workshop-Updates
Galerie vergangener Workshops

3.6 Gruppen-Events (/gruppen-events oder /private-events)
Inhalte:

Beschreibung der Event-Möglichkeiten
Beispiel-Szenarien (JGA, Kindergeburtstag, Teambuilding)
Flexible Gestaltungsmöglichkeiten
Information zu externen Locations
Anfrage-Formular für individuelle Angebote
Referenzen/Testimonials
Bildergalerie vergangener Events

3.7 Kontakt (/kontakt)
Inhalte:

Kontaktformular
Telefonnummer: +49 171 833 6539
E-Mail: hello@claytopia.de
Adresse mit Google Maps Integration
Anfahrtsbeschreibung
Öffnungszeiten/Erreichbarkeit
Social Media Links (falls vorhanden)

3.8 Rechtliches

Impressum (/impressum)



4. Technische Anforderungen für Next.js Migration
   Core Features

Image Optimization: Next.js Image-Komponente für optimale Ladezeiten
SEO: Meta-Tags, Open Graph, Structured Data für lokales Business
Responsive Design: Mobile-first mit Tailwind CSS oder CSS Modules
Performance: Lighthouse Score > 90

Funktionale Anforderungen

Cookie-Banner (DSGVO-konform)

Hosting & Deployment

Vercel (empfohlen für Next.js)
Automatisches Deployment via GitHub
Custom Domain claytopia.de
