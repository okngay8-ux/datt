@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%
echo ========================================================
echo   Đẩy mã nguồn lên GitHub (Push to GitHub)
echo ========================================================
echo.
set /p REPO_URL="Dán đường link Repository GitHub của bạn vào đây: "
if "%REPO_URL%"=="" (
    echo Bạn chưa nhập đường link!
    pause
    exit /b
)
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Đang tải lên GitHub...
git push -u origin main
echo.
echo ========================================================
echo   Đã hoàn tất!
echo ========================================================
pause
