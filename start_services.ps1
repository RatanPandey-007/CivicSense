# Startup Script for Civic Sense Platform
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   Starting Civic Sense Platform Services  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$RootPath = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

# Determine Python Executable (prefer virtual environment)
$PythonExe = Join-Path $RootPath "ai-service\venv\Scripts\python.exe"
if (-not (Test-Path $PythonExe)) {
    $PythonExe = "python"
}

# 1. Start Backend API (Port 5000)
Write-Host "[1/4] Starting Backend API on http://localhost:5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\backend'; Write-Host '--- Backend API (Port 5000) ---' -ForegroundColor Green; node index.js"

# 2. Start AI Microservice (Port 8000)
Write-Host "[2/4] Starting AI Microservice on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\ai-service'; Write-Host '--- AI Microservice (Port 8000) ---' -ForegroundColor Green; & '$PythonExe' app.py"

# 3. Start Civic Spark Citizen Web App (Port 5174/8080)
Write-Host "[3/4] Starting Civic Spark Citizen Portal..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\civic-spark'; Write-Host '--- Civic Spark Citizen App ---' -ForegroundColor Green; npm run dev"

# 4. Start Admin Dashboard (Port 5173)
Write-Host "[4/4] Starting Admin Dashboard on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\admin-dashboard'; Write-Host '--- Admin Dashboard (Port 5173) ---' -ForegroundColor Green; npm run dev"

Write-Host "Admin Dashboard:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "Civic Spark App:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend API:      http://localhost:5000" -ForegroundColor Cyan
Write-Host "AI Service:       http://localhost:8000" -ForegroundColor Cyan

