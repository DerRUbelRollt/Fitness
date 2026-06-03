# Fitness API Backend

REST API für die Fitness-App, geschrieben in C# mit .NET 8.

**Zur kompletten Dokumentation siehe: [README.md](./README.md)**

## Quick Start

```bash
dotnet restore
dotnet ef database update
dotnet run
```

Backend läuft auf: `http://localhost:5000`  
Swagger: `http://localhost:5000/swagger`

## Verbindung mit Frontend

Im Frontend (.env Datei):
```
VITE_API_URL=http://localhost:5000
```

Das war's! Kein weiterer Frontend-Code muss geändert werden.

---

**Status**: ✅ Produktionsreif
