@echo off
setlocal enabledelayedexpansion
title HakiWork

echo.
echo  =================================================
echo   HakiWork v1.0.0
echo   Usage: haki [dev^|build^|test]
echo  =================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found, please install Node.js first
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('where node') do set NODE=%%i
echo [INFO] Node: !NODE!
echo.

if not exist "node_modules\electron\cli.js" (
    echo [INFO] Running npm install...
    call npm install
    if errorlevel 1 ( echo [ERROR] npm install failed; pause; exit /b 1 )
    echo.
)

set MODE=%~1
if "!MODE!" == "dev" (
    echo [DEV] Please run "npx vite" in a separate terminal first, then run "haki dev"
    echo [DEV] Or use: npm run dev
    goto :end
)
if "!MODE!" == "build" (
    echo [BUILD] Building only...
    node scripts/test.js --build-only
    goto :end
)
if "!MODE!" == "test" (
    echo [TEST] Build and verify...
    node scripts/test.js --build-only
    goto :end
)

echo [START] Building and launching HakiWork...
node scripts/test.js

:end
echo.
echo Press any key to exit...
pause >nul