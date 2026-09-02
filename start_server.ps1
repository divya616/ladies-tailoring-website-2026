# Sri Meenakshi Ladies Tailoring & Boutique Launcher
$env:PYTHONHOME = "C:\Program Files\MySQL\MySQL Shell 8.0\lib\Python3.13"
$env:PYTHONIOENCODING = "utf-8"
$pythonPath = "C:\Program Files\MySQL\MySQL Shell 8.0\lib\Python3.13\Lib\venv\scripts\nt\python.exe"

Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "  SRI MEENAKSHI LADIES TAILORING & BOUTIQUE - AMBATTUR, CHENNAI" -ForegroundColor Yellow
Write-Host "  Starting Standalone Web Application on http://localhost:5000" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Magenta

Start-Process "http://localhost:5000"

if (Test-Path $pythonPath) {
    & $pythonPath app.py
} else {
    python app.py
}
