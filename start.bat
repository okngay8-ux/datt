@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo   Dang khoi dong Korean Voice Studio Web Local...
echo ========================================================

start http://localhost:3000
node server.js
pause
