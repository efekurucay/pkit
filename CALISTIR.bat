@echo off
title PromptKit Launcher
color 0A
echo.
echo  ================================================
echo   PromptKit - Prompt Manager ^& Clipboard Tool
echo  ================================================
echo.
echo  [1] Development Mode (Yavas ama calisir)
echo  [2] Production Mode (Hizli ama sorunlu)
echo  [3] Cikis
echo.
set /p choice="Seciminiz (1-3): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" exit
goto end

:dev
echo.
echo [DEV] React server baslatiliyor...
start "React Server" cmd /k "npm run start:react"
echo [DEV] 15 saniye bekleniyor...
timeout /t 15 /nobreak >nul
echo [DEV] Electron baslatiliyor...
set ELECTRON_START_URL=http://localhost:3000
npx electron .
goto end

:prod
echo.
echo [PROD] Electron baslatiliyor...
npx electron .
goto end

:end
