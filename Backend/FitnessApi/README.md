# FitnessApi Backend (.NET C#)

Vollständiges REST API Backend für die Fitness-App. Basiert auf dem TypeScript domain.ts Model.

## Voraussetzungen

- .NET 8 SDK
- SQL Server (LocalDB oder vollständig)
- Visual Studio oder Visual Studio Code

## Setup

### 1. Projekt erstellen (Falls noch nicht geschehen)

```bash
cd Backend
dotnet new webapi -n FitnessApi
cd FitnessApi
```

### 2. Dependencies installieren

```bash
dotnet restore
```

### 3. Datenbank erstellen

#### Option A: Mit Entity Framework Migrations (empfohlen)

```bash
# Terminal in FitnessApi-Verzeichnis öffnen
dotnet ef database update
```

Dies erstellt die Datenbank automatisch mit allen Tables.

#### Option B: Manuelles SQL Script

Führe dieses SQL in SQL Server Management Studio aus:

```sql
CREATE DATABASE FitnessAppDb;

USE FitnessAppDb;

-- Users Table
CREATE TABLE Users (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(255),
    CurrentStreak INT DEFAULT 0,
    LongestStreak INT DEFAULT 0,
    LastActivityDate DATE,
    StepsToday INT DEFAULT 0,
    StepsGoal INT DEFAULT 10000,
    CalorieToday INT DEFAULT 0,
    CalorieGoal INT DEFAULT 2100,
    MinutesGoal INT DEFAULT 60
);

-- Scheduled Activities Table
CREATE TABLE ScheduledActivities (
    Id NVARCHAR(50) PRIMARY KEY,
    PresetId NVARCHAR(50),
    CustomId NVARCHAR(50),
    Title NVARCHAR(255) NOT NULL,
    Color NVARCHAR(50),
    Icon NVARCHAR(50),
    Date DATE NOT NULL,
    StartTime TIME,
    DurationMin INT,
    Completed BIT DEFAULT 0,
    Notes NVARCHAR(MAX),
    Distance FLOAT,
    Steps INT
);

-- Custom Activities Table
CREATE TABLE CustomActivities (
    Id NVARCHAR(50) PRIMARY KEY,
    Label NVARCHAR(255) NOT NULL,
    Color NVARCHAR(50),
    IconId NVARCHAR(50)
);

-- Goals Table
CREATE TABLE Goals (
    Id NVARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Target INT,
    Unit NVARCHAR(50),
    Period NVARCHAR(20),
    ActivityFilter NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Habits Table
CREATE TABLE Habits (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Emoji NVARCHAR(10),
    Color NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    Log NVARCHAR(MAX)
);
```

### 4. Backend starten

```bash
dotnet run
```

Das Backend läuft dann auf `https://localhost:5001` (HTTPS) oder `http://localhost:5000` (HTTP).

Swagger UI: `http://localhost:5000/swagger/index.html`

---

## REST API Endpoints

### User
```
GET    /user           → Aktuelle User-Daten abrufen
PUT    /user           → User-Daten aktualisieren
```

### Activities (Geplante Aktivitäten)
```
GET    /activities             → Alle Aktivitäten abrufen
GET    /activities/{id}        → Spezifische Aktivität abrufen
POST   /activities             → Neue Aktivität erstellen
PUT    /activities/{id}        → Aktivität aktualisieren
DELETE /activities/{id}        → Aktivität löschen
```

### Goals
```
GET    /goals                  → Alle Goals abrufen
GET    /goals/{id}             → Spezifisches Goal abrufen
POST   /goals                  → Neues Goal erstellen
PUT    /goals/{id}             → Goal aktualisieren
DELETE /goals/{id}             → Goal löschen
```

### Habits
```
GET    /habits                 → Alle Habits abrufen
GET    /habits/{id}            → Spezifisches Habit abrufen
POST   /habits                 → Neues Habit erstellen
PUT    /habits/{id}            → Habit aktualisieren
DELETE /habits/{id}            → Habit löschen
```

### Custom Activities
```
GET    /custom-activities      → Alle Custom Activities abrufen
GET    /custom-activities/{id} → Spezifische Custom Activity abrufen
POST   /custom-activities      → Neue Custom Activity erstellen
PUT    /custom-activities/{id} → Custom Activity aktualisieren
DELETE /custom-activities/{id} → Custom Activity löschen
```

---

## Frontend-Konfiguration

Im Frontend (src/) nur die `.env` Variable ändern:

```bash
# .env.production
VITE_API_URL=http://localhost:5000
# oder bei Deploy:
VITE_API_URL=https://dein-backend.com
```

Das ist alles! Der Frontend ändert sich nicht, der HttpApiClient kümmert sich um den Rest.

---

## Architektur

```
Controllers/         → HTTP Endpoints
├─ UserController
├─ ActivitiesController
├─ GoalsController
├─ HabitsController
└─ CustomActivitiesController

Services/           → Business Logic
├─ UserService
├─ ActivityService
├─ GoalService
├─ HabitService
└─ CustomActivityService

Models/             → Entity Models
├─ UserProfile
├─ ScheduledActivity
├─ CustomActivity
├─ Goal
└─ Habit

Data/
└─ FitnessDbContext  → Entity Framework DbContext
```

---

## Debugging

Falls es Fehler gibt:

1. **Connection String prüfen**: `appsettings.json`
2. **SQL Server läuft?**: LocalDB oder Server prüfen
3. **Migrations**: `dotnet ef database update --verbose`
4. **Logs**: Browser Console und Backend Konsole prüfen

---

## Production Deployment

```bash
# Build
dotnet publish -c Release

# Publish-Ordner hochladen auf Server
```

Stelle sicher, dass:
- SQL Server Zugang konfiguriert ist
- CORS Origins korrekt in `appsettings.json` sind
- Environment Variables für Prod gesetzt sind

---

## Weiterführung

- Authentication/Authorization hinzufügen (JWT)
- Pagination für große Listen
- Caching Layer
- API Rate Limiting
- Logging & Monitoring
