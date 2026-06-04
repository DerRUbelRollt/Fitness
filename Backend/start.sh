#!/bin/bash
# Setup und Start für das .NET Backend

echo "=== Fitness Setup ==="
echo ""

#Zum Laufwerk navigieren
D:

# Zu Projektverzeichnis navigieren frontend
cd D:\vsCode\Fitness

echo Fronetend wird gestartet ...
#Frontend starten
npm run dev

echo Backend wird gesatartet ...
cd D:\vsCode\Fitness\Backend\FitnessApi

echo "📦 Dependencies installieren..."
dotnet restore

echo ""
echo "🗄️  Datenbank initialisieren..."
dotnet ef database update

echo ""
echo "🚀 Backend starten..."
echo "   API läuft auf: http://localhost:5000"
echo "   Swagger UI: http://localhost:5000/swagger"
echo ""

dotnet run

