# 📱 FitFlow - Fitness Tracking Anwendung
## Vollständige Dokumentation - Wie alles funktioniert

**Version:** 1.0  
**Datum:** Juni 2026  
**Sprache:** Deutsch  

---

## 📑 Inhaltsverzeichnis
1. [Überblick](#überblick)
2. [Kalender - Aktivitäten planen und tracken](#kalender---aktivitäten-planen-und-tracken)
3. [Ziele - Fortschritt verfolgen](#ziele---fortschritt-verfolgen)
4. [Habits - Tägliche Gewohnheiten](#habits---tägliche-gewohnheiten)
5. [Statistiken - Deine Erfolge analysieren](#statistiken---deine-erfolge-analysieren)
6. [Architektur & Technisches](#architektur--technisches)

---

## Überblick

**FitFlow** ist eine moderne Fitness-Tracking-Webseite, die dir hilft, deine sportlichen Aktivitäten, persönliche Ziele und täglichen Gewohnheiten zu verwalten. Die Anwendung bietet vier Hauptbereiche:

- **📅 Kalender**: Plane und verwalte deine Trainingseinheiten
- **🎯 Ziele**: Setze messbare Ziele und verfolge deinen Fortschritt
- **✅ Habits**: Etabliere tägliche Gewohnheiten mit Streak-Tracking
- **📊 Statistiken**: Analysiere deine Performance mit detaillierten Diagrammen

Die App funktioniert mit einem **React-Frontend** (TypeScript) und einem **.NET-Backend** mit MySQL-Datenbank für maximale Zuverlässigkeit und Skalierbarkeit.

### Technologie-Stack
```
Frontend:  React 18 + TypeScript + TanStack Router + Tailwind CSS
Backend:   .NET 6+ API + Entity Framework Core + MySQL
State:     Context API + Custom Service Layer
UI:        Shadcn/ui Components + Framer Motion (Animationen)
```

---

## Kalender - Aktivitäten planen und tracken

### 📌 Überblick

Der Kalender ist das Herzstück von FitFlow. Hier kannst du:
- ✅ Trainingseinheiten eintragen
- 📅 Zwischen Monat-, Woche- und Tagesansicht wechseln
- 🔄 Aktivitäten zwischen Tagen verschieben (Drag & Drop)
- ✔️ Trainings als abgeschlossen markieren
- 🗑️ Aktivitäten löschen
- 📊 Dauer, Strecke und Schritte erfassen

### 🎨 Drei Ansichtsmodi

#### 1. **Monatsansicht** 📆
- Zeigt einen ganzen Monat im Kalender-Grid
- Jeder Tag zeigt alle Aktivitäten als farbige Icons
- Einfaches Navigieren zwischen Monaten
- Perfekt für die Übersicht über dein ganzes Training
- Farbige Codes für verschiedene Sportarten

**Wie es funktioniert:**
```
[Monat-Grid]
Mo Di Mi Do Fr Sa So
                   1
 2  3  4  5  6  7  8  (Tage mit Icons)
 
🏃 = Laufen (Orange)
🚴 = Radfahren (Blau)
🏊 = Schwimmen (Cyan)
...
```

#### 2. **Wochenansicht** 📊
- Zeigt 7 Tage in einer horizontalen Liste
- Detailliertere Darstellung als die Monatsansicht
- Jeder Tag kann angeklappt werden für mehr Details
- Perfekt zum Vergleich von Trainingstagen in der Woche

**Layout:**
```
Woche 24 • 10.06. – 16.06.
Mo: 🏃 45min  |  Di: 🚴 60min  |  Mi: Ruhe  |  ...
```

#### 3. **Tagesansicht** 🎯
- Fokussiert auf einen einzelnen Tag
- Zeigt alle Aktivitäten in voller Detailansicht
- Perfekt zum genauen Tracken eines Tages
- Einfaches Hinzufügen neuer Aktivitäten für diesen Tag

### ➕ Aktivität hinzufügen - Die "Quick Add Dialog"

Wenn du auf `+ Aktivität hinzufügen` klickst oder auf ein Datum doppelklickst, öffnet sich ein Modal-Dialog:

#### Schritt 1: Sportart wählen
```
[Preset-Aktivitäten]          [Eigene Aktivitäten]
🏃 Laufen                      Boxing (selbst erstellt)
🚴 Radfahren                   Klettern (selbst erstellt)
🏊 Schwimmen
🏋️ Krafttraining
...
```

**Preset-Aktivitäten** (vordefiniert):
- Laufen: Dauer, optional Strecke
- Radfahren: Dauer, optional Strecke
- Schwimmen: Dauer
- Krafttraining: Dauer
- Yoga: Dauer
- Fußball: Dauer
- Basketball: Dauer
- und viele mehr...

Jede Sportart hat:
- 🎨 Eine eindeutige Farbe
- 📍 Ein Icon
- 📊 Standard-Trainungsdauer

#### Schritt 2: Details eintragen
```
Datum:       [10.06.2026] ◄─► Wechselbar
Uhrzeit:     [18:00] ◄─► Start der Trainingseinheit
Dauer (min): [45] ◄─► Trainngsdauer in Minuten
[Strecke]:   [5.2 km] ◄─► Nur bei Laufen/Radfahren
[Schritte]:  [8500] ◄─► Optional bei manchen Aktivitäten
```

#### Schritt 3: Abschließen
- Klick auf "Hinzufügen" speichert die Aktivität
- Toast-Benachrichtigung: "Laufen hinzugefügt • 10.06. • 18:00 • 45 min"
- Dialog schließt sich automatisch
- Aktivität erscheint sofort im Kalender

### 🎨 Eigene Aktivitäten erstellen

Du kannst eigene Sportarten definieren (z.B. "Boxen", "Klettern"):

**Prozess:**
1. Klick auf "+ Neue Aktivität" im Dialog
2. Gib einen Namen ein (z.B. "Boxen")
3. Wähle ein Icon aus einer Liste
4. Wähle eine Farbe für deine Aktivität
5. Klick "Erstellen"
6. Die neue Aktivität erscheint in der "Eigene" Kategorie

```
Neue Aktivität erstellen:
─────────────────────────
Name: [Boxen]
Icon: [💪] [🎯] [⚡] [🔥] [💣]
Farbe: [Orange] [Rot] [Lila] [Grün] [Blau]
```

Diese eigenen Aktivitäten werden **lokal gespeichert** und stehen immer zur Verfügung.

### 🖱️ Drag & Drop - Aktivitäten verschieben

Eine der praktischsten Funktionen: Du kannst Aktivitäten zwischen Tagen **verschieben**!

**Wie es funktioniert:**
```
Schritt 1: Klick und halte auf eine Aktivität
Schritt 2: Ziehe die Aktivität auf einen anderen Tag
Schritt 3: Lasse los - Aktivität wird automatisch verschoben

Beispiel:
Montag: [🏃 45min] ──Drag──> Dienstag
Das Training wird von Montag zu Dienstag verschoben.
```

Dies ist perfekt, wenn du ein Training verschieben möchtest, aber das ursprüngliche Datum behalten willst oder wenn du die Planung neu organisieren musst.

### ✅ Aktivitäten als erledigt markieren

Neben jeder Aktivität gibt es einen **Checkbox**:
- **Leeres Kästchen ☐** = Training nicht erledigt
- **Häkchen ✅** = Training erledigt

**Wichtig:** Nur **abgeschlossene Aktivitäten** werden:
- 📊 In den Statistiken gezählt
- 🎯 Zum Fortschritt deiner Ziele beigetragen
- 🏆 Bei deinen Streaks berücksichtigt

**Warum?** So kannst du Trainings planen, aber nur abgeschlossene zählen für deine Erfolge.

### 🗑️ Aktivitäten löschen

Klick auf das Papierkorb-Icon neben einer Aktivität, um sie zu löschen:
- ❌ Wird sofort entfernt (kein Undo!)
- 📊 Entfernt sich aus Statistiken und Zielen
- 💾 Änderung wird mit dem Backend synchronisiert

---

## Ziele - Fortschritt verfolgen

### 📌 Überblick

Im **Ziele-Bereich** definierst du messbare Trainingsziele und siehst deinen Fortschritt in Echtzeit:

```
🎯 Beispiele für Ziele:
├─ 3 Trainings pro Woche
├─ 300 Lauf-Minuten pro Monat
├─ 50.000 Schritte pro Woche
├─ 10 Yoga-Sessions pro Woche
└─ Nur Laufen-Trainings zählen (150 Minuten)
```

### ➕ Wie du ein Ziel erstellst

Klick auf **"Neues Ziel"** Button:

```
Dialog: Neues Ziel
───────────────────
Titel:        [z.B. "3x Laufen pro Woche"]
Zielwert:     [3] ◄─► Die Anzahl
Einheit:      [Einheiten] ◄─► Was wird gezählt?
              ├─ Trainings-Sessionen
              ├─ Minuten
              ├─ Kilometer
              └─ ...
Zeitraum:     [Woche] ◄─► Wann setzt sich das Ziel zurück?
              ├─ Tag (täglich)
              ├─ Woche (wöchentlich)
              └─ Monat (monatlich)
Filter (Optional): [Laufen] ◄─► Nur bestimmte Sportarten zählen?
```

### 📊 Wie Fortschritt berechnet wird

Das System **berechnet automatisch** deinen Fortschritt basierend auf deinen abgeschlossenen Aktivitäten:

#### Beispiel 1: "3 Trainings pro Woche"
```
Diese Woche:
Mo: ✅ Laufen (45min)          ← Zählt als 1 Training
Di: ☐ Geplantes Radfahren      ← Nicht abgeschlossen, zählt nicht
Mi: ✅ Yoga (30min)            ← Zählt als 1 Training
Do: -
Fr: ✅ Krafttraining (60min)   ← Zählt als 1 Training
Sa: -
So: -

Fortschritt: 3 von 3 ✅ ERREICHT!
```

#### Beispiel 2: "300 Lauf-Minuten pro Monat"
```
Diese Woche:
Mo: ✅ Laufen 45min
Di: ✅ Laufen 60min
Mi: ✅ Radfahren 40min         ← Zählt NICHT (kein Laufen)
Do: ✅ Laufen 50min

Fortschritt: 45 + 60 + 50 = 155 von 300 Minuten (51%)
```

#### Beispiel 3: "50.000 Schritte pro Woche"
```
Wenn du Aktivitäten mit Schritten trackst:
Mo: ✅ Laufen 8500 Schritte
Di: ✅ Laufen 10.000 Schritte
Mi: ✅ Radfahren 3500 Schritte

Fortschritt: 8500 + 10000 + 3500 = 22.000 von 50.000 Schritte (44%)
```

### 🎯 Ziel-Eigenschaften

Jedes Ziel zeigt dir:

```
┌─────────────────────────┐
│ 3x Trainieren pro Woche │
├─────────────────────────┤
│ Fortschritt: ████░░ 3/3 │
│ Status: ✅ ERREICHT!    │
│ Zeitraum: Woche         │
└─────────────────────────┘

┌──────────────────────────┐
│ 300 Lauf-Minuten/Monat   │
├──────────────────────────┤
│ Fortschritt: ██░░░░ 155m │
│ Status: 51% Fortschritt  │
│ Bis Ziel: 145 Minuten    │
└──────────────────────────┘
```

**Farbe des Ziel-Cards:**
- 🟦 **Blau** = Ziel nicht erreicht (normal)
- 🟩 **Grün** = Ziel erreicht! ✨

### 🗑️ Ziel löschen

Hover über ein Ziel-Card und klick auf das Papierkorb-Icon um es zu löschen.

### 🔄 Automatisches Zurücksetzen

Ziele setzen sich **automatisch zurück** basierend auf ihrem Zeitraum:
- ⏰ **Täglich**: Setzt sich jeden Tag um Mitternacht zurück
- 📅 **Wöchentlich**: Setzt sich jeden Montag zurück
- 🗓️ **Monatlich**: Setzt sich am 1. des Monats zurück

Du brauchst dich darum nicht zu kümmern - das System macht das automatisch!

### 💡 Best Practices für Ziele

1. **Spezifisch sein**: "3 Trainings pro Woche" statt nur "Trainieren"
2. **Realistisch**: Ziele sollten erreichbar aber herausfordernd sein
3. **Verschiedene Zeiträume**: Mix aus täglichen, wöchentlichen und monatlichen Zielen
4. **Regelmäßig überprüfen**: Schau dir deine Fortschritte an und passe bei Bedarf an

---

## Habits - Tägliche Gewohnheiten

### 📌 Überblick

Der **Habit Tracker** hilft dir, tägliche Gewohnheiten zu etablieren und zu verfolgen. Im Gegensatz zu Trainings sind Habits einfache **Ja/Nein-Aufgaben**:

```
✅ Beispiele für Habits:
├─ 2L Wasser trinken
├─ Meditation (10 min)
├─ Dehnübungen
├─ Früh ins Bett gehen
├─ Gesund frühstücken
├─ 10.000 Schritte gehen
└─ Kein Alkohol
```

**Der Schlüssel:** Streaks aufbauen! Je länger du ein Habit durchhältst, desto motivierender wird es. 🔥

### ➕ Neuen Habit erstellen

Klick auf **"Neuer Habit"** Button:

```
Dialog: Neuer Habit
──────────────────
Name:   [z.B. "2L Wasser trinken"]
Emoji:  [💧] ◄─► Visual Icon für dein Habit
        Optionen: 💧 💪 🧘 🏃 🚴 🌙 🥗 📚 🚫 ☀️ 🧠 ❤️
Farbe:  [Blau] ◄─► Farbe für visuelle Unterscheidung
```

**Was jedes Feld bedeutet:**
- **Name**: Der Habit-Name (z.B. "Dehnübungen")
- **Emoji**: Ein Emoji für schnelle visuelle Erkennung
- **Farbe**: Farbcode für die Visualisierung im Tracker

### 📊 Die Habit-Übersicht

Nach der Erstellung sieht ein Habit so aus:

```
💧 2L Wasser trinken
─────────────────────────────────────────
Aktueller Streak: 🔥 12 Tage
Bester Streak: 🏆 28 Tage

[Heatmap mit 91 Tagen]
Ma Di Mi Do Fr Sa So | Ma Di Mi Do Fr Sa So | ...
🟩 🟩 🟩 🟩 🟩 🟩 ⬜ | 🟩 🟩 ⬜ 🟩 🟩 🟩 🟩 | ...

30-Tage Statistik: 24/30 Tage (80% Erfolgsquote)
```

### ✅ Habit abhaken

**Das Wichtigste:** Jeden Tag ein Häkchen setzen!

```
Beispiel-Woche:
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ Mo   │ Di   │ Mi   │ Do   │ Fr   │ Sa   │ So   │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ ✅   │ ✅   │ ✅   │ ❌   │ ✅   │ ✅   │ ✅   │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘

Klick auf einen Tag zum Abhaken/Abhebeln.
```

**Wichtig:** 
- Wenn du einen Tag **auslässt**, setzt sich dein **Streak zurück**!
- Der Streak zählt nur **konsekutive Tage** (ununterbrochen)
- Ein unterbrochener Streak ist nicht verloren - der beste Streak wird gespeichert

### 🔥 Streaks verstehen

#### Aktueller Streak
```
Heute: 8. Juni (Sonntag)
Aktueller Streak = Wie viele Tage hintereinander?

Beispiel-Szenario:
Sa 7.6: ✅ (1 Tag)
So 8.6: ✅ (2 Tage)
Mo 9.6: ✅ (3 Tage)
Di 10.6: ✅ (4 Tage)
Mi 11.6: ❌ Vergessen! Streak gebrochen!
Do 12.6: ✅ (1 Tag - neuer Streak beginnt)

Aktueller Streak: 1 Tag (neu gestartet)
Bester Streak: 4 Tage (gespeichert)
```

#### Bester Streak
```
Das ist die längste ununterbrochene Serie, die du je erreicht hast!
- Wird NICHT zurückgesetzt wenn der aktuelle Streak bricht
- Nur motivierend
- Zeigt dir dein volles Potenzial
```

### 📅 91-Tage Heatmap

Die Heatmap visualisiert deine Aktivität der letzten 91 Tage:

```
🟩 = Habit heute erledigt (konsistent!)
⬜ = Habit heute nicht erledigt
```

**Auf einen Blick siehst du:**
- Deine Konsistenz
- Muster (z.B. "Wochenenden fallen mir schwer")
- Wie lange dein Streak ist (grüne Linie)

```
Typisches Muster:
┌────────────────────────────────────────┐
│ Letzter Monat: 🟩 🟩 🟩 ⬜ 🟩 🟩 🟩   │ (Super konsistent!)
│ Vorvoriger M.: 🟩 🟩 ⬜ ⬜ 🟩 🟩 🟩   │ (Noch gut)
│ Vor 3 Monaten: 🟩 🟩 🟩 🟩 🟩 🟩 ⬜   │ (Fast perfekt)
└────────────────────────────────────────┘
```

### 📊 30-Tage Erfolgsquote

```
30-Tage Statistik: 24/30 Tage (80%)

Das bedeutet:
- Von den letzten 30 Tagen
- Hast du den Habit 24x erledigt
- Das sind 80% Erfolgsquote
- Pretty good! 🎉
```

Dies ist sehr praktisch um zu sehen:
- Wie konsistent du wirklich bist
- Über welche Zeiträume
- Ob du besser wirst oder schlechter

### 🗑️ Habit löschen

Klick auf das Papierkorb-Icon neben einem Habit um ihn zu löschen:
- ❌ Wird sofort entfernt
- 📊 Alle bisherigen Daten werden gelöscht
- ⚠️ Nicht rückgängig zu machen!

### 💡 Best Practices für Habits

1. **Klein anfangen**: Lieber ein Habit perfekt machen als viele zu hacken
2. **Spezifisch**: "2L Wasser" statt "mehr trinken"
3. **Tägliche Routine**: Beste Zeit ist immer gleich (z.B. morgens)
4. **Mit Aktivitäten verknüpfen**: z.B. nach dem Zähneputzen trinken
5. **21-Tage Regel**: Nach 21 Tagen wird's automatisch zur Gewohnheit
6. **Sichtbar machen**: Setze dein Emoji an sichtbarer Stelle

---

## Statistiken - Deine Erfolge analysieren

### 📌 Überblick

Die **Statistik-Seite** zeigt dir eine umfassende Übersicht deiner Trainings-Performance mit Diagrammen und Metriken:

```
📊 Statistiken Dashboard zeigt:
├─ Wöchentliche Trainings-Übersicht (Bar-Chart)
├─ Aktivitäts-Verteilung (Pie-Chart)
├─ 30-Tage Trend (Area-Chart)
├─ Wichtige Metriken (Cards)
└─ Habit-Statistiken (Streak Info)
```

### 📈 1. Wöchentliche Trainings-Übersicht

**Was wird angezeigt:**
```
Bar-Chart: Trainings-Minuten pro Tag dieser Woche

      Minuten
        100 |    ┏━┓
         80 |    ┃ ┃
         60 |  ┏━╋━╋━┓
         40 |  ┃ ┃ ┃ ┃
         20 |  ┃ ┃ ┃ ┃
          0 |  ┃ ┃ ┃ ┃
            └──┴─┴─┴─┴──...
              Mo Di Mi Do Fr Sa So
```

**Berechnung:**
```
Für jeden Tag dieser Woche:
- Zähle alle ✅ abgeschlossenen Aktivitäten
- Addiere ihre Minuten
- Zeige das als Balken
```

**Beispiel:**
```
Montag:   45min (Laufen) = 45min-Balken
Dienstag: 30min (Yoga) + 60min (Radfahren) = 90min-Balken
Mittwoch: 0min = kein Balken
```

**Nutzen:** Schnell sehen, wie trainiert du diese Woche warst!

### 🥧 2. Aktivitäts-Verteilung (Pie-Chart)

**Was wird angezeigt:**
Ein Kreis-Diagramm, das zeigt: Wie viel Prozent deiner Trainingszeit geht auf welche Sportart?

```
Pie-Chart:
        🟠 Laufen 40%
        🔵 Radfahren 30%
        🟢 Yoga 20%
        🟣 Krafttraining 10%
```

**Berechnung:**
```
1. Nimm alle ✅ abgeschlossenen Trainings (insgesamt)
2. Berechne für jede Sportart: Gesamtminuten
3. Berechne den Prozentsatz jeder Sportart
4. Zeige als Pie-Chart mit Farben
```

**Beispiel:**
```
Gesamttrainings letzte 30 Tage: 450 Minuten

Laufen:        180 Minuten = 40% (Orange)
Radfahren:     135 Minuten = 30% (Blau)
Yoga:          90 Minuten  = 20% (Grün)
Krafttraining: 45 Minuten  = 10% (Lila)

Pie-Chart zeigt diese Verteilung!
```

**Nutzen:** Siehst du, ob du zu einseitig trainierst oder ausgewogen?

### 📉 3. 30-Tage Trend (Area-Chart)

**Was wird angezeigt:**
Ein Linien-Diagramm mit der Entwicklung deiner Trainingsminuten über 30 Tage:

```
Minuten
  100 |    ╱╲
   80 |   ╱  ╲     ╱╲
   60 |  ╱    ╲   ╱  ╲    ╱
   40 |        ╲ ╱    ╲  ╱
   20 |         ╱      ╲╱
    0 |_____________________
      Tag1 Tag2 Tag3 ... Tag30
```

**Berechnung:**
```
Für jeden der letzten 30 Tage:
- Zähle alle ✅ abgeschlossenen Aktivitäten
- Addiere ihre Minuten
- Plotte einen Punkt
- Verbinde die Punkte zu einer Linie
```

**Beispiel-Szenario:**
```
Tag 1:  45 Minuten (1 Lauf-Training)
Tag 2:  90 Minuten (Yoga + Radfahren)
Tag 3:  0 Minuten (Ruhe)
Tag 4:  120 Minuten (Krafttraining + Yoga)
Tag 5:  60 Minuten (Ein schnelles Training)
...
Linie zeigt deine Schwankungen!
```

**Nutzen:** 
- Erkennst du Muster? (z.B. "Montags trainiere ich mehr")
- Verbesserst du dich im Durchschnitt?
- Wann war deine beste Woche?

### 🎯 4. Wichtige Metriken (Info-Cards)

```
┌──────────────────────┐┌──────────────────────┐
│ 🔥 Längster Streak   ││ ⏱️ Gesamtminuten    │
│ 12 Tage             ││ 2.850 Minuten       │
│ (Habit Tracker)     ││ (Alle Trainings)    │
└──────────────────────┘└──────────────────────┘

┌──────────────────────┐┌──────────────────────┐
│ 📊 Gesamt Trainings  ││ 💪 Häufigste Sport  │
│ 38 Sessions         ││ Laufen (40%)        │
│ (Letzte 30 Tage)    ││                     │
└──────────────────────┘└──────────────────────┘
```

**Was bedeutet jede Metrik:**

| Metrik | Bedeutung | Berechnung |
|--------|-----------|-----------|
| 🔥 Längster Streak | Längste ununterbrochene Tage mit Habit-Checkmarks | Max. konsekutive Tage aus allen Habits |
| ⏱️ Gesamtminuten | Wie viele Minuten hast du insgesamt trainiert? | Summe aller ✅ abgeschlossenen Aktivitäten |
| 📊 Gesamt Trainings | Wie viele einzelne Trainings-Sessions? | Anzahl aller ✅ abgeschlossenen Trainings |
| 💪 Häufigste Sport | Welche Sportart trainierst du am liebsten? | Sportart mit den meisten Minuten |

### 📱 Responsive Design

Die Statistik-Seite passt sich automatisch an dein Gerät an:

```
🖥️ Desktop:  Alle 3 Charts nebeneinander
📱 Tablet:   2 Charts nebeneinander, 1 darunter
📱 Handy:    Alle Charts untereinander (vertikal)
```

Die Diagramme sind **interaktiv** - du kannst:
- Hovern über Balken/Segmente um Details zu sehen
- Bei manchen Charts zoomen (je nach Browser)
- Legende an/aus clicken

### 📊 Daten-Quellen

Alle Statistiken werden **aus deinen Trainings-Daten berechnet**:

```
Quelle: 
└─ Alle Aktivitäten im System
   ├─ Gefiltert: Nur ✅ "completed" = true
   ├─ Nach Datum
   ├─ Nach Sportart
   └─ Nach Dauer/Metriken
```

**Wichtig:** Nur abgeschlossene Aktivitäten zählen!
- ☐ Geplante Trainings = Ignoriert
- ✅ Abgeschlossene Trainings = Zählt

### 🔄 Automatische Aktualisierung

Die Statistiken aktualisieren sich **in Echtzeit**:
```
Du fügst neue Aktivität hinzu
          ↓
System speichert sie
          ↓
Diagramme aktualisieren automatisch
          ↓
Neue Metriken werden berechnet
```

Kein manuelles Refresh nötig!

### 💡 Wie man Statistiken interpretiert

```
Gutes Zeichen:
✅ 30-Tage Trend steigt = Du wirst mehr
✅ Pie-Chart ausgewogen = Abwechslungsreiches Training
✅ Wöchentliche Balken hoch = Konstantes Training

Zu verbessern:
❌ 30-Tage Trend fällt = Motivation sinkt?
❌ Pie-Chart einseitig = Zu viel von einer Sportart
❌ Wöchentliche Balken niedrig = Zu wenig Training
```

---

## Architektur & Technisches

### 🏗️ Systemaufbau

```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│  Browser-Anwendung mit UI-Komponenten      │
├─────────────────────────────────────────────┤
│                State Management             │
│  Store (Context API) + Services Layer      │
├─────────────────────────────────────────────┤
│              HTTP API Client                │
│         Kommunikation mit Backend           │
├─────────────────────────────────────────────┤
│     Backend (.NET 6+ + Entity Framework)    │
│          REST API Endpoints                 │
├─────────────────────────────────────────────┤
│         MySQL Datenbank                     │
│      Persistente Datenspeicherung           │
└─────────────────────────────────────────────┘
```

### 💾 Datenmodelle

```
Benutzer (User)
├─ id: string (eindeutig)
├─ name: string (Dein Name)
├─ currentStreak: number (Aktueller Habit-Streak)
├─ longestStreak: number (Bester Habit-Streak)
├─ stepsToday: number (Heutige Schritte)
├─ stepsGoal: number (Ziel-Schritte pro Tag)
├─ calorieToday: number (Heutige Kalorien)
├─ calorieGoal: number (Ziel-Kalorien)
└─ minutesGoal: number (Trainings-Minuten Ziel)

Aktivität (ScheduledActivity)
├─ id: string
├─ title: string (Name der Sportart)
├─ date: string (YYYY-MM-DD)
├─ startTime: string (HH:MM)
├─ durationMin: number (Minuten)
├─ completed: boolean (Erledigt?)
├─ color: string (Hex-Farbe)
├─ icon: string (Icon-ID)
├─ distance?: number (Kilometer)
├─ steps?: number (Schritte)
└─ presetId | customId (Sportart-Referenz)

Ziel (Goal)
├─ id: string
├─ title: string
├─ target: number (Zielwert)
├─ unit: string (Einheit: "Trainings", "Minuten")
├─ period: "day"|"week"|"month"
└─ activityFilter?: string (Nur bestimmte Sportarten)

Habit
├─ id: string
├─ name: string
├─ emoji: string (z.B. "💧")
├─ color: string (Farbe)
├─ log: Record<date, boolean> (Täglich: true/false)
├─ createdAt: string
└─ streak (berechnet aus log)
```

### 🔄 Datenfluss

```
Benutzer interagiert mit UI
         ↓
React Komponente aufgerufen
         ↓
Store-Methode aufgerufen (z.B. addActivity)
         ↓
Service-Layer verarbeitet
         ↓
HTTP Request an Backend
         ↓
Backend validiert & speichert in DB
         ↓
Response zurück an Frontend
         ↓
Store aktualisiert sich
         ↓
React re-rendert UI
         ↓
Benutzer sieht Änderung!
```

### 🛡️ Offline-Funktionalität

FitFlow funktioniert auch ohne Internet!

```
Online-Modus:
- Änderungen werden sofort mit Backend synchronisiert
- Alle Daten sind aktuell

Offline-Modus:
- Änderungen werden lokal gespeichert
- Wird automatisch mit Backend synchronisiert wenn wieder Online
- Fallback zu Seed-Daten wenn nötig

Der Benutzer merkt keinen Unterschied!
```

### 📱 Responsive Design

```
Desktop (1200px+)
├─ Sidebar links (Navigation)
├─ Hauptinhalt rechts (breit)
└─ Volle Diagramme sichtbar

Tablet (768-1199px)
├─ Sidebar kann eingeklappt werden
├─ Diagramme gestapelt
└─ Angepasste Layouts

Handy (<768px)
├─ Bottom Navigation statt Sidebar
├─ Vollbild Inhalt
├─ Diagramme vertikal
└─ Touch-optimierte Buttons
```

### 🎨 Design-System

**Farben:**
```
Primär:        Blau (#3b82f6)
Sekundär:      Orange (#f97316)
Grün:          Erfolg (#22c55e)
Rot:           Fehler (#ef4444)
Grau:          Neutral/Muted (#78716c)
```

**Komponenten:**
- Buttons mit Hover-Effekt
- Input-Felder mit Validierung
- Modal-Dialoge mit Blur-Backdrop
- Toast-Benachrichtigungen
- Loading-States
- Error-Handling

### ⚡ Performance

```
Optimierungen:
✅ Lazy Loading (Komponenten laden bei Bedarf)
✅ Memoization (Funktionen werden gecacht)
✅ Virtual Scrolling (Große Listen rendert nur sichtbare Items)
✅ API Caching (Responses werden zwischengespeichert)
✅ Bundle Splitting (JS wird in mehrere Dateien aufgeteilt)
✅ CSS Optimierung (Tailwind CSS Purging)
```

---

## 🚀 Schnell-Start Guide

### Installation & Setup

```bash
# 1. Repository klonen
git clone [repo-url]
cd Fitness

# 2. Frontend-Dependencies installieren
npm install

# 3. Backend starten
cd Backend/FitnessApi
dotnet run

# 4. Frontend starten (neues Terminal)
npm run dev

# 5. Browser öffnen
http://localhost:5173
```

### Erste Schritte

```
1. Profil erstellen/anpassen (Settings)
2. Ziele definieren (Ziele-Seite)
3. Erste Aktivität hinzufügen (Kalender)
4. Trainings mit Häkchen abhaken (Aktivität abschließen)
5. Habits starten (Habit Tracker)
6. Statistiken anschauen (Statistiken-Seite)
```

---

## 📝 Zusammenfassung

| Bereich | Funktion | Nutzen |
|---------|----------|--------|
| **Kalender** | Trainings planen & tracken | Übersicht über deine Sporteinheiten |
| **Ziele** | Messbare Ziele setzen | Motivation & klare Struktur |
| **Habits** | Tägliche Gewohnheiten | Konsistenz & Routine aufbauen |
| **Statistiken** | Daten visualisieren | Fortschritt analysieren |

---

## 🎯 Häufig gestellte Fragen

**F: Warum werden nur abgeschlossene Aktivitäten gezählt?**  
A: So kannst du flexibel planen, aber nur realisierte Trainings beeinflussen deine Statistiken. Realistischer!

**F: Was passiert wenn ich einen Habit-Tag verpasse?**  
A: Dein Streak setzt sich zurück, aber dein Bester Streak bleibt gespeichert.

**F: Kann ich Aktivitäten später bearbeiten?**  
A: Ja! Du kannst Aktivitäten aktualisieren oder löschen.

**F: Funktioniert die App offline?**  
A: Ja! Daten werden lokal gespeichert und synchronisiert wenn online.

**F: Wo werden meine Daten gespeichert?**  
A: In der MySQL Datenbank (Backend). Lokal werden auch Fallback-Daten cached.

---

## 📞 Support & Feedback

Hast du Fragen oder Verbesserungsvorschläge?  
Dokumentation letztes Update: Juni 2026
