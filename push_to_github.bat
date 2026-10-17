@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%
echo ========================================================
echo   Đang tải mã nguồn lên GitHub: okngay8-ux/datt
echo ========================================================
echo.
git branch -M main
git push -u origin main
echo.
if %errorlevel% neq 0 (
    echo --------------------------------------------------------
    echo [HUONG DAN XAC THUC GITHUB]
    echo Neu cua so yeu cau dang nhap:
    echo 1. Dang nhap bang tai khoan GitHub okngay8-ux cua ban.
    echo 2. Neu hoi mat khau (Password), hay dung GitHub Token.
    echo --------------------------------------------------------
) else (
    echo ========================================================
    echo   DA DAY LEN GITHUB THANH CONG!
    echo   Kiem tra tai: https://github.com/okngay8-ux/datt
    echo ========================================================
)
echo.
pause
