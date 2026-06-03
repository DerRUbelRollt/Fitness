@echo off
REM Setup und Start für das .NET Backend

echo === Fitness API Backend Setup ===
echo.

cd /d "%~dp0\FitnessApi"

echo.
echo 'Dependencies installieren...'
call dotnet restore

echo.
echo 'Datenbank initialisieren...'
call dotnet ef database update

echo.
echo 'Backend starten...'
echo API laeuft auf: http://localhost:5000
echo Swagger UI: http://localhost:5000/swagger
echo.

call dotnet run
