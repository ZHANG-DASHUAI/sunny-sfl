@echo off
setlocal EnableExtensions

rem Resolve folders relative to this script, so it can be run from anywhere.
set "PROJECT_ROOT=%~dp0.."
set "INPUT_DIR=%PROJECT_ROOT%\assets\audio_original"
set "OUTPUT_DIR=%PROJECT_ROOT%\assets\audio"

where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo [ERROR] FFmpeg was not found.
  echo Install FFmpeg, add it to PATH, then run: ffmpeg -version
  pause
  exit /b 1
)

if not exist "%INPUT_DIR%" (
  echo [ERROR] Input folder does not exist:
  echo %INPUT_DIR%
  pause
  exit /b 1
)

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "FOUND_FLAC="
for %%F in ("%INPUT_DIR%\*.flac") do (
  if exist "%%~fF" (
    set "FOUND_FLAC=1"
    echo Converting: %%~nxF
    ffmpeg -hide_banner -loglevel warning -y -i "%%~fF" ^
      -vn -codec:a libmp3lame -b:a 128k -ar 44100 ^
      "%OUTPUT_DIR%\%%~nF.mp3"
    if errorlevel 1 (
      echo [ERROR] Failed: %%~nxF
    ) else (
      echo [OK] %%~nF.mp3
    )
  )
)

if not defined FOUND_FLAC (
  echo No FLAC files were found in:
  echo %INPUT_DIR%
)

echo.
echo Conversion finished. Output folder:
echo %OUTPUT_DIR%
pause
