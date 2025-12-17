@echo off

REM Check if WebStorm is running
tasklist | find /i "webstorm64.exe" >nul
if errorlevel 1 (
    REM WebStorm not running → do nothing
    exit /b 0
)

REM WebStorm is running → proceed
cd /d N:\Programming\Website\E-Commerce-2\adventure || exit /b 1

git add .
git commit -m "Auto-commit: %date% %time%" || exit /b 0
git push origin main
