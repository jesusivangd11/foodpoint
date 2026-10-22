@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo   Creando instalador de FoodPoint...
echo ============================================
echo.

if not exist "node_modules\electron" (
  echo Instalando dependencias por primera vez (puede tardar)...
  call npm install
  if errorlevel 1 goto :error
)

call npm run dist
if errorlevel 1 goto :error

echo.
echo ============================================
echo   Listo. El instalador esta en la carpeta dist-installer.
echo ============================================
start "" "%~dp0dist-installer"
exit /b 0

:error
echo.
echo *** Hubo un error al crear el instalador. Revisa el mensaje de arriba. ***
pause
exit /b 1
