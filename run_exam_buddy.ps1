# Exam Buddy PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "            EXAM BUDDY ACADEMIC AI" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Kill any dangling processes on port 3000, 3001, 8000, 8001
Write-Host "[1/5] Checking and freeing ports 3000, 3001, 8000, and 8001..." -ForegroundColor Yellow
$ports = 3000, 3001, 8000, 8001
foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($conn in $conns) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# 2. Start FastAPI Backend on Port 8001
Write-Host "[2/5] Starting FastAPI Backend on http://127.0.0.1:8001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload"

Start-Sleep -Seconds 2

# 3. Start Vite Frontend on Port 3000
Write-Host "[3/5] Starting Vite Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

# 4. Start Redirect Helpers
Write-Host "[4/5] Starting Redirect Helpers..." -ForegroundColor Green
Start-Process powershell -WindowStyle Hidden -ArgumentList "-Command", "cd '$root'; node redirect_server.cjs"

Start-Sleep -Seconds 3

# 5. Open in default browser
Write-Host "[5/5] Opening http://localhost:3000/ in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Exam Buddy is running!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000/" -ForegroundColor Gray
Write-Host " Backend:  http://127.0.0.1:8001/" -ForegroundColor Gray
Write-Host "===================================================" -ForegroundColor Cyan
