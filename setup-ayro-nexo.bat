@echo off
setlocal

set "PROJECT_DIR=%~dp0"

echo ==========================================
echo AYRO NEXO - Setup local
echo ==========================================
echo.
echo Proyecto: %PROJECT_DIR%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado o no esta en PATH.
  echo Instalar Node.js LTS desde:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm no esta instalado o no esta en PATH.
  echo Instalar Node.js LTS desde:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

pushd "%PROJECT_DIR%"

echo Version de Node:
node --version
echo.

echo Version de npm:
npm --version
echo.

echo Instalando dependencias...
npm install
if errorlevel 1 (
  echo.
  echo ERROR: Fallo npm install.
  popd
  pause
  exit /b 1
)

echo.
echo Verificando build...
npm run build
if errorlevel 1 (
  echo.
  echo ERROR: Fallo npm run build.
  popd
  pause
  exit /b 1
)

echo.
echo Setup completo.
echo Para iniciar AYRO NEXO ejecutar:
echo iniciar-ayro-nexo.bat
echo.

popd
pause
endlocal
