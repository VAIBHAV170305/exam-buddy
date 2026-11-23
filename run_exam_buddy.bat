@echo off
title Exam Buddy - Launcher
echo ===================================================
echo             EXAM BUDDY ACADEMIC AI
echo ===================================================
echo.
echo [1/5] Freeing ports 3000, 3001, 8000, and 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

cd /d "%~dp0"

echo [2/5] Starting FastAPI Backend on http://127.0.0.1:8001...
start "Exam Buddy Backend (Port 8001)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload"

ping -n 3 127.0.0.1 >nul

echo [3/5] Starting Vite Frontend on http://localhost:3000...
start "Exam Buddy Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo [4/5] Starting Port 3001/8000 -> 3000 Redirect Helper...
start "Exam Buddy Redirects" /min node redirect_server.cjs

ping -n 4 127.0.0.1 >nul

echo [5/5] Opening http://localhost:3000 in your browser...
echo.
echo ===================================================
echo  Exam Buddy is running!
echo  Frontend: http://localhost:3000/
echo  Backend:  http://127.0.0.1:8001/
echo ===================================================
start "" "http://localhost:3000/"
