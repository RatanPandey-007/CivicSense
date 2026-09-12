# Startup Script for Civic Sense Platform

# Start Backend
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "backend/index.js"
Write-Host "Backend started..."

# Start AI Service (Python)
# Ensure you have python installed and requirements installed
# pip install -r ai-service/requirements.txt
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "ai-service/app.py"
Write-Host "AI Service started..."

# Start Admin Dashboard
Set-Location "admin-dashboard"
npm run dev
