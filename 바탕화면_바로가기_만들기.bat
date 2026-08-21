@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create-desktop-shortcut.ps1"
echo.
echo 이어서 바로가기 이름을 한글로 바꿉니다...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d=[Environment]::GetFolderPath('Desktop'); $src=Join-Path $d 'SBAR Notify.lnk'; $dst=Join-Path $d ([string]([char]0xAC04)+[char]0xD638+[char]0xC0AC+' '+[char]0xB178+[char]0xD2F0+' '+[char]0xD6C8+[char]0xB828+'.lnk'); if(Test-Path -LiteralPath $src){ if(Test-Path -LiteralPath $dst){Remove-Item -LiteralPath $dst -Force}; Rename-Item -LiteralPath $src -NewName (Split-Path $dst -Leaf); Write-Host ('OK: '+$dst) } else { Write-Host 'shortcut not found' }"
pause
