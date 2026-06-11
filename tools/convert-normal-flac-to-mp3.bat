@echo off
setlocal EnableExtensions

rem Resolve the normal-audio folder relative to this script.
set "PROJECT_ROOT=%~dp0.."
set "NORMAL_DIR=%PROJECT_ROOT%\assets\audio\normal"

where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo [ERROR] FFmpeg was not found.
  echo Install FFmpeg, add it to PATH, then run: ffmpeg -version
  pause
  exit /b 1
)

if not exist "%NORMAL_DIR%" (
  echo [ERROR] Normal audio folder does not exist:
  echo %NORMAL_DIR%
  pause
  exit /b 1
)

set "FOUND_FLAC="
set "FAILED="

for %%F in ("%NORMAL_DIR%\*.flac") do (
  if exist "%%~fF" (
    set "FOUND_FLAC=1"
    echo Converting: %%~nxF
    ffmpeg -hide_banner -loglevel warning -y -i "%%~fF" ^
      -vn -codec:a libmp3lame -b:a 192k -ar 44100 ^
      "%NORMAL_DIR%\%%~nF.mp3"
    if errorlevel 1 (
      set "FAILED=1"
      echo [ERROR] Failed: %%~nxF
    ) else (
      echo [OK] %%~nF.mp3
    )
  )
)

echo.
if not defined FOUND_FLAC (
  echo No FLAC files were found in:
  echo %NORMAL_DIR%
) else if defined FAILED (
  echo Conversion finished, but one or more files failed.
) else (
  echo Conversion completed successfully.
  echo MP3 files were saved beside the original FLAC files:
  echo %NORMAL_DIR%
)

echo Original FLAC files were not deleted.
pause
