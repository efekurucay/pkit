@echo off
echo ===================================
echo PromptKit - Development Mode
echo ===================================
echo.
echo [1/2] React dev server baslatiliyor...
start "React Dev Server" cmd /k "npm run start:react"
echo.
echo [2/2] 15 saniye bekleniyor...
timeout /t 15 /nobreak
echo.
echo [3/3] Electron baslatiliyor...
set ELECTRON_START_URL=http://localhost:3000
npx electron .
