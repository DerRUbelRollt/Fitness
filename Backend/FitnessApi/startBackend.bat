@echo off
REM Setup und Start für das .NET Backend

echo "=== Fitness Setup ==="
echo ""

echo "📦 Dependencies installieren..."
call dotnet restore

echo ""
echo "🗄️  Datenbank initialisieren..."
call dotnet ef database update

echo ""
echo "🚀 Backend starten..."
echo "   API läuft auf: http://localhost:5000"
echo "   Swagger UI: http://localhost:5000/swagger"
echo ""

call dotnet run
