# Generates a Play Console upload keystore (local only, never commit secrets)
# Usage (PowerShell, from repo root):
#   .\scripts\generate_upload_keystore.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$keystoreDir = Join-Path $root "android\keystore"
$jks = Join-Path $keystoreDir "oltaapp-upload-keystore.jks"
$props = Join-Path $root "android\keystore.properties"
$cred = Join-Path $keystoreDir "UPLOAD_KEYSTORE_CREDENTIALS.txt"

New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null

if (Test-Path $jks) {
  Write-Host "Keystore already exists: $jks"
  exit 0
}

$pass = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })

@"
IMPORTANT: Backup this file and the .jks securely. Losing it means you cannot update the Play Store app with the same signing key.

storeFile=../keystore/oltaapp-upload-keystore.jks
storePassword=$pass
keyAlias=oltaapp_upload
keyPassword=$pass
"@ | Set-Content $cred

keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 `
  -alias oltaapp_upload `
  -keystore $jks `
  -storepass $pass `
  -keypass $pass `
  -dname "CN=OltaApp, OU=Mobile, O=OltaApp, L=Duzce, ST=Duzce, C=TR"

@"
storeFile=../keystore/oltaapp-upload-keystore.jks
storePassword=$pass
keyAlias=oltaapp_upload
keyPassword=$pass
"@ | Set-Content $props

Write-Host "Created:"
Write-Host " - $jks"
Write-Host " - $props"
Write-Host " - $cred"
Write-Host "Backup the credentials file now."
