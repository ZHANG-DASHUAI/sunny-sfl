[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$inputDir = Join-Path $projectRoot "assets\audio_original"
$outputDir = Join-Path $projectRoot "assets\audio"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Error "FFmpeg was not found. Install it, add it to PATH, then run: ffmpeg -version"
    exit 1
}

if (-not (Test-Path -LiteralPath $inputDir -PathType Container)) {
    Write-Error "Input folder does not exist: $inputDir"
    exit 1
}

New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
$files = @(Get-ChildItem -LiteralPath $inputDir -File -Filter "*.flac")

if ($files.Count -eq 0) {
    Write-Host "No FLAC files were found in: $inputDir"
    exit 0
}

foreach ($file in $files) {
    $outputPath = Join-Path $outputDir ($file.BaseName + ".mp3")
    Write-Host "Converting: $($file.Name)"

    & ffmpeg -hide_banner -loglevel warning -y `
        -i $file.FullName `
        -vn -codec:a libmp3lame -b:a 128k -ar 44100 `
        $outputPath

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Conversion failed: $($file.Name)"
        exit $LASTEXITCODE
    }

    Write-Host "[OK] $([System.IO.Path]::GetFileName($outputPath))"
}

Write-Host ""
Write-Host "Conversion finished. Output folder: $outputDir"
