@echo off
title Sri Meenakshi Ladies Tailoring - Ambattur
echo ======================================================================
echo   SRI MEENAKSHI LADIES TAILORING & BOUTIQUE - AMBATTUR, CHENNAI
echo   Starting Standalone Web Application...
echo ======================================================================
echo.

set "PYTHONHOME=C:\Program Files\MySQL\MySQL Shell 8.0\lib\Python3.13"
set "PYTHONIOENCODING=utf-8"
set "PYTHON_EXE=C:\Program Files\MySQL\MySQL Shell 8.0\lib\Python3.13\Lib\venv\scripts\nt\python.exe"

if exist "%PYTHON_EXE%" (
    echo [OK] Using Python at %PYTHON_EXE%
    start "" http://localhost:5000
    "%PYTHON_EXE%" app.py
) else (
    echo [INFO] Looking for default python...
    start "" http://localhost:5000
    python app.py
)

pause
