@echo off
echo Starting MoodMirror Application...
echo.

echo Starting Backend Server...
cd backend
start "MoodMirror Backend" cmd /k "npm run dev"

echo.
echo Starting Frontend Server...
cd ..
start "MoodMirror Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul 