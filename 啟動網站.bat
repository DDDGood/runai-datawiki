@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   DataWiki - Game2022 資料維基
echo ========================================
echo.
echo 正在啟動網站伺服器...
echo.
echo 請在瀏覽器開啟: http://localhost:3000
echo.
echo 按 Ctrl+C 可停止伺服器
echo ========================================
echo.

cd /d "%~dp0"
npx serve dist -p 3000
