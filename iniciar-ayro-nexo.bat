@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "APP_URL=http://localhost:3000"
set "CHROME_EXE="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  set "CHROME_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  set "CHROME_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
)

echo Iniciando AYRO NEXO...
echo Proyecto: %PROJECT_DIR%
echo URL: %APP_URL%

pushd "%PROJECT_DIR%"
start "AYRO NEXO - Dev Server" cmd /k npm run dev

timeout /t 5 /nobreak >nul

if defined CHROME_EXE (
  start "AYRO NEXO" "%CHROME_EXE%" "%APP_URL%"
) else (
  start "AYRO NEXO" chrome "%APP_URL%"
)

popd
endlocal
