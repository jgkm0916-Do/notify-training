# Create desktop shortcut with SBAR icon (ASCII filename to avoid encoding issues)
$ErrorActionPreference = "Stop"
$project = "D:\DATA\Desktop\notify training"
$ico = Join-Path $project "favicon.ico"
$desktop = [Environment]::GetFolderPath("Desktop")
$lnkPath = Join-Path $desktop "SBAR Notify.lnk"

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome not found" }
if (-not (Test-Path $ico)) { throw "favicon.ico missing: $ico" }

$appUrl = "http://127.0.0.1:8787/index.html"
$wsh = New-Object -ComObject WScript.Shell
$lnk = $wsh.CreateShortcut($lnkPath)
$lnk.TargetPath = $chrome
$lnk.Arguments = "--app=$appUrl"
$lnk.WorkingDirectory = $project
$lnk.IconLocation = "$ico,0"
$lnk.Description = "Nurse SBAR Notify Training"
$lnk.Save()

Write-Host "Created: $lnkPath"
Write-Host "Icon: $ico"
