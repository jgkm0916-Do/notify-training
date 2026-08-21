@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo [노티 훈련] 로컬 서버를 시작합니다...
echo 브라우저에서 http://127.0.0.1:8787 로 열립니다.
echo 종료하려면 이 창에서 Ctrl+C 를 누르세요.
echo.

start "" "http://127.0.0.1:8787/index.html"
npx --yes serve -l 8787 .
