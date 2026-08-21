# 바탕화면에 SBAR 아이콘 바로가기 생성
$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$ico = Join-Path $project "favicon.ico"
$desktop = [Environment]::GetFolderPath("Desktop")
$lnkPath = Join-Path $desktop "간호사 노티 훈련.lnk"

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome을 찾을 수 없습니다." }
if (-not (Test-Path $ico)) { throw "favicon.ico 가 없습니다: $ico" }

$appUrl = "http://127.0.0.1:8787/index.html"
$wsh = New-Object -ComObject WScript.Shell
$lnk = $wsh.CreateShortcut($lnkPath)
$lnk.TargetPath = $chrome
$lnk.Arguments = "--app=`"$appUrl`""
$lnk.WorkingDirectory = $project
$lnk.IconLocation = "$ico,0"
$lnk.Description = "간호사 노티 훈련 (SBAR)"
$lnk.Save()

Write-Host ""
Write-Host "바탕화면에 '간호사 노티 훈련' 바로가기를 만들었습니다."
Write-Host "아이콘: $ico"
Write-Host ""
Write-Host "사용 방법:"
Write-Host "1) 기존 '간' 글자 바로가기는 삭제하세요."
Write-Host "2) 먼저 '앱_실행.bat' 을 실행해 서버를 켠 뒤,"
Write-Host "3) 새 바로가기를 더블클릭하세요."
Write-Host ""
