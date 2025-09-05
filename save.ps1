param()

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add -A
git commit -m "snapshot $stamp" --allow-empty

# ZIP « code-only »
$stampZip = Get-Date -Format "yyyyMMdd-HHmmss"
New-Item -ItemType Directory -Force "C:\backups\rafik-next-app" | Out-Null
$staging = Join-Path $env:TEMP "rafik-stage-$stampZip"
robocopy $PWD $staging /MIR /XD node_modules .next .git 1>$null 2>$null | Out-Null
$zip = "C:\backups\rafik-next-app\rafik-next-app-$stampZip.zip"
Compress-Archive -Path "$staging\*" -DestinationPath $zip -Force
Remove-Item -Recurse -Force $staging

if (Test-Path ".\.env.local") {
  Copy-Item ".\.env.local" "C:\backups\rafik-next-app\.env.local.$stampZip" -Force
}

Write-Host "✅ Snapshot Git + ZIP: $zip"
