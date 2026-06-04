@echo off
title Share Project via Cloudflare Tunnel

cd /d "%~dp0"

echo =====================================================================
echo    Exposing Local Server via Cloudflare Tunnel
echo =====================================================================
echo.

rem 1. Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on your system!
    echo Please install Python from https://www.python.org/ to run the local server.
    echo.
    pause
    exit /b
)

rem 2. Check Cloudflared
set CLOUDFLARED_CMD=cloudflared
where cloudflared >nul 2>nul
if %errorlevel% equ 0 goto start_server

rem Check common WinGet/msi installation paths directly to avoid PATH issues
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED_CMD=C:\Program Files (x86)\cloudflared\cloudflared.exe"
    goto start_server
)
if exist "C:\Program Files\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED_CMD=C:\Program Files\cloudflared\cloudflared.exe"
    goto start_server
)
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" (
    set "CLOUDFLARED_CMD=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
    goto start_server
)

echo [INFO] 'cloudflared' not found in PATH.
echo Attempting to install Cloudflare Tunnel using winget...
echo.
winget install --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install cloudflared automatically.
    echo Please install it manually by running: winget install --id Cloudflare.cloudflared
    echo.
    pause
    exit /b
)

rem Re-check common paths after installation
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED_CMD=C:\Program Files (x86)\cloudflared\cloudflared.exe"
    goto start_server
)
if exist "C:\Program Files\cloudflared\cloudflared.exe" (
    set "CLOUDFLARED_CMD=C:\Program Files\cloudflared\cloudflared.exe"
    goto start_server
)
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe" (
    set "CLOUDFLARED_CMD=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
    goto start_server
)

echo.
echo [WARNING] Installation completed, but you may need to restart the terminal.
echo Please close this window and run 'share.bat' again.
echo.
pause
exit /b

:start_server
echo [STEP 1] Starting Local Web Server (Python) on port 8000...
start "Python Web Server (Port 8000)" cmd /c "python -m http.server 8000"

echo Waiting for server to initialize...
timeout /t 3 >nul

echo.
echo [STEP 2] Launching Cloudflare Tunnel to expose port 8000...
echo Your public link (*.trycloudflare.com) will be shown below.
echo Copy and share it with others to test.
echo.
echo Press Ctrl + C to stop sharing and shut down the server.
echo.
echo =====================================================================
echo.

"%CLOUDFLARED_CMD%" tunnel --url http://localhost:8000

echo.
echo Stopping Local Web Server...
taskkill /FI "WINDOWTITLE eq Python Web Server (Port 8000)" /F >nul 2>nul
echo Share stopped successfully.
pause
