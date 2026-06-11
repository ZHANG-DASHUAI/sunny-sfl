@echo off
chcp 65001 >nul

cd /d "%~dp0..\assets\audio\normal"

for %%f in (*.flac) do (
  echo 正在转换：%%f
  ffmpeg -y -i "%%f" -b:a 192k -ar 44100 "%%~nf.mp3"
)

echo.
echo 全部转换完成！
pause
