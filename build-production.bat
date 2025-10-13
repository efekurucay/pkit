@echo off
echo ===================================
echo PromptKit Production Build
echo ===================================
echo.
echo [1/2] React uygulamasi build ediliyor...
call npm run build
echo.
echo [2/2] Electron paketi olusturuluyor...
call npm run build:electron
echo.
echo ===================================
echo Build tamamlandi!
echo Kurulum dosyasi: dist/ klasorunde
echo ===================================
pause
