#!/bin/bash
# Setup und Start für das .NET Backend

echo "=== Fitness API Backend Setup ==="
echo ""

# Zu Projektverzeichnis navigieren
cd "$(dirname "$0")/FitnessApi"

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
