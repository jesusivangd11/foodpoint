@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo   Publicar actualizacion de Mesana
echo ============================================
echo.
echo Antes de seguir:
echo   1. Sube "version" en package.json (ej. 3.2.1 -^> 3.2.2)
echo   2. Escribe las novedades en build\release-notes.md
echo Todas las PCs con Mesana instalada la descargaran solas.
echo.

rem El token de GitHub se lee de la variable GH_TOKEN o de este archivo
rem (fuera del repo, nunca se sube): %USERPROFILE%\.mesana-licencias\github-token.txt
if "%GH_TOKEN%"=="" for /f "delims=" %%t in ('node tools\leer-token.js') do set GH_TOKEN=%%t
if "%GH_TOKEN%"=="" (
  echo *** Falta el token de GitHub ^(o el archivo esta vacio o sin guardar^). Guardalo en:
  echo     %USERPROFILE%\.mesana-licencias\github-token.txt
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node -p "require('./package.json').version"') do set VERSION=%%v
echo Version a publicar: %VERSION%
choice /m "Publicar Mesana %VERSION% para todos los equipos"
if errorlevel 2 exit /b 0

call npm run release
if errorlevel 1 goto :error

rem Copia las notas a la descripcion de la release (la que muestra la pagina web).
call node tools\notas-release.js
if errorlevel 1 echo *** La version se publico, pero no se pudieron copiar las notas a GitHub.

echo.
echo ============================================
echo   Listo. Mesana %VERSION% quedo publicada en GitHub Releases.
echo   Revisala en:
echo   https://github.com/jesusivangd11/mesana-releases/releases
echo ============================================
pause
exit /b 0

:error
echo.
echo *** Hubo un error al publicar. Revisa el mensaje de arriba. ***
pause
exit /b 1
