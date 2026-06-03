# .NET Backend für Fitness App

Vollständiger REST API Backend mit C# und Entity Framework Core.

## 🚀 Quick Start

### Windows
```bash
.\start.bat
```

### macOS / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manuell
```bash
cd FitnessApi
dotnet restore
dotnet ef database update
dotnet run
```

Backend läuft auf: **http://localhost:5000**  
Swagger UI: **http://localhost:5000/swagger**

---

## 📁 Struktur

```
Backend/
├── FitnessApi/
│   ├── Models/                    # Entity Models (UserProfile, Activity, etc.)
│   ├── Controllers/               # API Endpoints
│   ├── Services/                  # Business Logic
│   ├── Data/                      # DbContext
│   ├── Utilities/                 # Helpers
│   ├── Migrations/                # EF Core Migrations (auto)
│   ├── Program.cs                 # Startup
│   ├── appsettings.json           # Configuration
│   └── FitnessApi.csproj         # Project File
├── README.md                      # Dokumentation
├── start.sh                       # Linux/Mac Start
└── start.bat                      # Windows Start
```

---

## 🔗 Frontend-Integration

Im Frontend nur die Umgebungsvariable setzen:

**.env.development**
```
VITE_API_URL=http://localhost:5000
```

**.env.production**
```
VITE_API_URL=https://api.yourdomain.com
```

**Das war's!** Der Frontend ändert sich nicht automatisch!

---

## 📋 API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| GET | `/user` | Aktuelle User-Daten |
| PUT | `/user` | User aktualisieren |
| GET | `/activities` | Alle Aktivitäten |
| POST | `/activities` | Aktivität erstellen |
| PUT | `/activities/{id}` | Aktivität aktualisieren |
| DELETE | `/activities/{id}` | Aktivität löschen |
| GET | `/goals` | Alle Goals |
| POST | `/goals` | Goal erstellen |
| GET | `/habits` | Alle Habits |
| POST | `/habits` | Habit erstellen |
| GET | `/custom-activities` | Alle Custom Activities |
| POST | `/custom-activities` | Custom Activity erstellen |

---

## 🔧 Troubleshooting

**Fehler: "Connection refused"**
- SQL Server nicht läuft? LocalDB starten: `sqllocaldb start`
- Connection String in `appsettings.json` prüfen

**Fehler: "EF Core Migration"**
```bash
cd FitnessApi
dotnet ef database drop --force
dotnet ef database update
```

**Port schon belegt?**
```bash
# In Program.cs ändern:
app.Run("http://localhost:5001");
```

---

## 📚 Weitere Dokumentation

- [FitnessApi/README.md](./FitnessApi/README.md) - Detaillierte Backend-Docs
- [Models](./FitnessApi/Models/) - Entity Models
- [Controllers](./FitnessApi/Controllers/) - API Endpoints

---

**Status**: ✅ Produktionsreif und mit Frontend getestet
