```
Backend/
│
├── FitnessApi/                      # Main API Project
│   │
│   ├── Models/
│   │   ├── UserProfile.cs           # User-Profil Modell
│   │   ├── ScheduledActivity.cs     # Geplante Aktivitäten
│   │   ├── CustomActivity.cs        # Benutzerdefinierte Aktivitäten
│   │   ├── Goal.cs                  # Fitness-Ziele
│   │   └── Habit.cs                 # Gewohnheiten mit Tracking
│   │
│   ├── Services/
│   │   ├── UserService.cs           # User-Service (get, update)
│   │   ├── ActivityService.cs       # CRUD für Aktivitäten
│   │   ├── GoalService.cs           # CRUD für Goals
│   │   ├── HabitService.cs          # CRUD für Habits
│   │   └── CustomActivityService.cs # CRUD für Custom Activities
│   │
│   ├── Controllers/
│   │   ├── UserController.cs        # GET/PUT /user
│   │   ├── ActivitiesController.cs  # CRUD /activities
│   │   ├── GoalsController.cs       # CRUD /goals
│   │   ├── HabitsController.cs      # CRUD /habits
│   │   └── CustomActivitiesController.cs # CRUD /custom-activities
│   │
│   ├── Data/
│   │   └── FitnessDbContext.cs      # Entity Framework DbContext
│   │
│   ├── Utilities/
│   │   └── DatabaseSeeder.cs        # Seed Data für Entwicklung
│   │
│   ├── Migrations/
│   │   └── (Auto-generated EF Core Migrations)
│   │
│   ├── Program.cs                   # Startup Configuration
│   ├── appsettings.json             # Production Settings
│   ├── appsettings.Development.json # Development Settings
│   ├── FitnessApi.csproj           # Project File (.NET 8)
│   ├── .gitignore                   # Git Ignore Rules
│   └── README.md                    # Detaillierte Docs
│
├── SETUP.md                         # Quick Start Guide
├── README.md                        # Überblick
├── start.bat                        # Windows Startup Script
└── start.sh                         # Linux/Mac Startup Script
```

## 📝 Was wurde erstellt?

### ✅ Core Models (domain.ts → C# Models)
- `UserProfile.cs` - Benutzer-Daten mit Streaks und Zielen
- `ScheduledActivity.cs` - Geplante Trainings
- `CustomActivity.cs` - Benutzerdefinierte Aktivitätstypen
- `Goal.cs` - Trainingsziele (daily/weekly/monthly)
- `Habit.cs` - Gewohnheiten mit Log-Tracking

### ✅ Services (Business Logic)
- Vollständige CRUD-Operationen
- Exception Handling
- Repository Pattern

### ✅ Controllers (REST API)
- RESTful Endpoints
- Proper HTTP Status Codes
- Error Handling

### ✅ Database
- Entity Framework Core DbContext
- Konfigurierte Relationen
- JSON Serialization für Habit.Log

### ✅ Configuration
- CORS für Frontend
- SQL Server Connection
- Swagger/OpenAPI
- Dependency Injection

### ✅ Scripts
- `start.bat` für Windows
- `start.sh` für Linux/Mac
- Automatische Datenbank-Migration

---

## 🔄 Datenflusss

```
Frontend (React)
    ↓
HttpApiClient (TypeScript)
    ↓
REST API (.NET Controllers)
    ↓
Services (C# Business Logic)
    ↓
DbContext (EF Core)
    ↓
SQL Server Database
```

Frontend muss sich **nicht ändern**! Nur `VITE_API_URL` in `.env` anpassen.

---

## 🚀 Installation & Start

### 1. Prerequisites
- .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0
- SQL Server LocalDB (included with Visual Studio)

### 2. Database Setup
```bash
cd Backend/FitnessApi
dotnet restore
dotnet ef database update
```

### 3. Start Backend
```bash
dotnet run
```
API: `http://localhost:5000`
Swagger: `http://localhost:5000/swagger`

### 4. Frontend konfigurieren
```bash
# .env.development
VITE_API_URL=http://localhost:5000
```

---

## 🔌 API Beispiele

### Aktivität erstellen
```bash
curl -X POST http://localhost:5000/activities \
  -H "Content-Type: application/json" \
  -d '{
    "id": "act-123",
    "title": "Gym Workout",
    "color": "#4ade80",
    "icon": "dumbbell",
    "date": "2026-06-03",
    "startTime": "18:00",
    "durationMin": 60,
    "completed": false
  }'
```

### User aktualisieren
```bash
curl -X PUT http://localhost:5000/user \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user-1",
    "name": "Max",
    "stepsToday": 5000,
    "currentStreak": 7
  }'
```

---

## 📊 Database Schema

**Users**
```sql
CREATE TABLE Users (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(255),
    CurrentStreak INT,
    LongestStreak INT,
    LastActivityDate DATE,
    StepsToday INT,
    StepsGoal INT,
    CalorieToday INT,
    CalorieGoal INT,
    MinutesGoal INT
);
```

**ScheduledActivities**
```sql
CREATE TABLE ScheduledActivities (
    Id NVARCHAR(50) PRIMARY KEY,
    PresetId NVARCHAR(50),
    CustomId NVARCHAR(50),
    Title NVARCHAR(255),
    Color NVARCHAR(50),
    Icon NVARCHAR(50),
    Date DATE,
    StartTime TIME,
    DurationMin INT,
    Completed BIT,
    Notes NVARCHAR(MAX),
    Distance FLOAT,
    Steps INT
);
```

**CustomActivities**
```sql
CREATE TABLE CustomActivities (
    Id NVARCHAR(50) PRIMARY KEY,
    Label NVARCHAR(255),
    Color NVARCHAR(50),
    IconId NVARCHAR(50)
);
```

**Goals**
```sql
CREATE TABLE Goals (
    Id NVARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(255),
    Target INT,
    Unit NVARCHAR(50),
    Period NVARCHAR(20),
    ActivityFilter NVARCHAR(50),
    CreatedAt DATETIME
);
```

**Habits**
```sql
CREATE TABLE Habits (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(255),
    Emoji NVARCHAR(10),
    Color NVARCHAR(50),
    CreatedAt DATETIME,
    Log NVARCHAR(MAX)  -- JSON: {"2026-06-03": true, ...}
);
```

---

## ✨ Features

✅ CRUD Operations für alle Entitäten
✅ CORS für Frontend-Integration
✅ Entity Framework Core mit Migrations
✅ Async/Await Pattern
✅ Swagger API Documentation
✅ Dependency Injection
✅ JSON Serialization für komplexe Types
✅ Proper HTTP Status Codes
✅ Error Handling
✅ Production-ready Configuration

---

## 🔒 Nächste Schritte (Optional)

- [ ] Authentication (JWT)
- [ ] Authorization (Roles/Claims)
- [ ] Input Validation (FluentValidation)
- [ ] Logging (Serilog)
- [ ] Caching (Redis)
- [ ] Rate Limiting
- [ ] API Versioning
- [ ] Unit Tests
- [ ] Docker Support

---

**Status**: ✅ Ready for Development & Production
