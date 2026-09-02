@echo off
title Ambattur Classic Tailors - Full-Stack Server
echo ================================================================
echo    AMBATTUR CLASSIC TAILORS - FULL-STACK WEB APPLICATION
echo    Location: MTH Road, Ambattur OT, Chennai - 600053
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo Dependencies found.
)

echo.
echo [2/3] Starting Express API Server on port 5000...
echo.
echo Storefront:  http://localhost:5000
echo Admin Panel: http://localhost:5000/admin.html
echo.

start "" "http://localhost:5000"

node backend/server.js

pause
