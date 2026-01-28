<#
.SYNOPSIS
  Standalone packaging system (non-invasive) for sdtoolsinc-web.

.DESCRIPTION
  Builds two separate distributables WITHOUT modifying existing app code:
    1) Desktop (Electron) -> EXE/MSI
    2) Mobile (Capacitor) -> Android/iOS shells

  Reads from existing web build output:
    - Uses the repo root "out\" if present (already exists in your repo)
    - OR can build/export from a specified Next.js app folder (optional)

.PARAMETER Action
  Setup | BuildDesktop | BuildMobile | BuildAll | DevDesktop | Clean | Help

.PARAMETER RepoRoot
  Default: current directory parent of packaging folder

.PARAMETER UiOutDir
  Directory containing exported static site (default: <RepoRoot>\out)

.NOTES
  iOS build requires macOS/Xcode; this script can scaffold iOS on Windows but cannot compile it.
#>

[CmdletBinding()]
param(
  [ValidateSet("Setup","BuildDesktop","BuildMobile","BuildAll","DevDesktop","Clean","Help")]
  [string]$Action = "Help",

  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,

  [string]$UiOutDir = $null,

  [int]$Port = 3002,

  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Say([string]$Msg, [ValidateSet("Info","Ok","Warn","Err")] [string]$Level="Info") {
  $c = switch ($Level) {
    "Ok"   { "Green" }
    "Warn" { "Yellow" }
    "Err"  { "Red" }
    default { "Cyan" }
  }
  Write-Host ("[Packaging] " + $Msg) -ForegroundColor $c
}

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null }
}

function Invoke-Cmd([string]$WorkingDir, [string]$Exe, [string[]]$Args) {
  Push-Location $WorkingDir
  try {
    Say "$Exe $($Args -join ' ') (in $WorkingDir)" "Info"
    & $Exe @Args
    if ($LASTEXITCODE -ne 0) { throw "$Exe failed (exit $LASTEXITCODE) in $WorkingDir" }
  } finally {
    Pop-Location
  }
}

function Write-File([string]$Path, [string]$Content) {
  Ensure-Dir (Split-Path $Path -Parent)
  $Content | Set-Content -Path $Path -Encoding UTF8
}

function Resolve-UiOutDir {
  if ($UiOutDir -and (Test-Path $UiOutDir)) { return (Resolve-Path $UiOutDir).Path }

  $rootOut = Join-Path $RepoRoot "out"
  if (Test-Path $rootOut) { return (Resolve-Path $rootOut).Path }

  throw "UI export folder not found. Provide -UiOutDir or ensure <RepoRoot>\out exists."
}

# ---- Paths (standalone) ----
$PackagingRoot = $PSScriptRoot
$DesktopDir    = Join-Path $PackagingRoot "desktop"
$MobileDir     = Join-Path $PackagingRoot "mobile"
$ReleaseRoot   = Join-Path $RepoRoot "release"
$ReleaseDesk   = Join-Path $ReleaseRoot "desktop"

Ensure-Dir $ReleaseDesk
Ensure-Dir $ReleaseRoot

# ---- Desktop wrapper files (standalone) ----
function Ensure-DesktopFiles([string]$OutDir) {
  $pkg = Join-Path $DesktopDir "package.json"
  $builder = Join-Path $DesktopDir "electron-builder.json"
  $main = Join-Path $DesktopDir "electron\main.js"

  if (-not (Test-Path $pkg) -or $Force) {
    Write-File $pkg @"
{
  "name": "casemgr-desktop-packaging",
  "version": "1.0.0",
  "private": true,
  "main": "electron/main.js",
  "scripts": {
    "dev": "electron .",
    "dist:exe": "electron-builder --win nsis",
    "dist:msi": "electron-builder --win msi",
    "dist:all": "electron-builder --win nsis msi"
  },
  "devDependencies": {
    "electron": "^30.0.0",
    "electron-builder": "^24.13.3"
  }
}
"@
    Say "Wrote: packaging\desktop\package.json" "Ok"
  }

  if (-not (Test-Path $builder) -or $Force) {
    Write-File $builder @"
{
  "appId": "org.sdtoolsinc.casemgr",
  "productName": "Case Manager Portal",
  "directories": { "output": "$($ReleaseDesk.Replace('\','\\'))" },
  "files": [ "electron/**/*" ],
  "win": { "target": [ "nsis", "msi" ] }
}
"@
    Say "Wrote: packaging\desktop\electron-builder.json" "Ok"
  }

  if (-not (Test-Path $main) -or $Force) {
    # Production: load local exported UI from OutDir
    # Dev: also loads local file by default; if you want localhost dev, we can add a flag later.
    Write-File $main @"
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: { contextIsolation: true }
  });

  const indexPath = path.join("$($OutDir.Replace('\','\\'))", "index.html");
  win.loadFile(indexPath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
"@
    Say "Wrote: packaging\desktop\electron\main.js" "Ok"
  }
}

# ---- Mobile wrapper files (standalone) ----
function Ensure-MobileFiles([string]$OutDir) {
  $pkg = Join-Path $MobileDir "package.json"
  $cap = Join-Path $MobileDir "capacitor.config.ts"

  if (-not (Test-Path $pkg) -or $Force) {
    Write-File $pkg @"
{
  "name": "casemgr-mobile-packaging",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "cap:init": "npx cap init \"Case Manager Portal\" org.sdtoolsinc.casemgr",
    "cap:add:android": "npx cap add android",
    "cap:add:ios": "npx cap add ios",
    "cap:sync": "npx cap sync",
    "cap:open:android": "npx cap open android",
    "cap:open:ios": "npx cap open ios"
  },
  "dependencies": {
    "@capacitor/core": "^6.0.0",
    "@capacitor/cli": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    "@capacitor/ios": "^6.0.0"
  }
}
"@
    Say "Wrote: packaging\mobile\package.json" "Ok"
  }

  if (-not (Test-Path $cap) -or $Force) {
    # Capacitor webDir points to your already-exported static UI.
    Write-File $cap @"
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.sdtoolsinc.casemgr',
  appName: 'Case Manager Portal',
  webDir: '$($OutDir.Replace('\','/'))',
  server: { androidScheme: 'https' }
};

export default config;
"@
    Say "Wrote: packaging\mobile\capacitor.config.ts" "Ok"
  }
}

function Show-Help {
@"
USAGE:
  cd $RepoRoot
  .\packaging\Build-Packages.ps1 -Action Setup
  .\packaging\Build-Packages.ps1 -Action BuildDesktop
  .\packaging\Build-Packages.ps1 -Action BuildMobile
  .\packaging\Build-Packages.ps1 -Action BuildAll

ACTIONS:
  Setup         Install packaging dependencies (Electron Builder + Capacitor)
  BuildDesktop  Build Windows EXE + MSI using exported UI (out\)
  BuildMobile   Scaffold/sync Android+iOS wrappers using exported UI (out\)
  BuildAll      Build both
  DevDesktop    Run desktop app (loads local out\index.html)
  Clean         Remove packaging node_modules + release\desktop
"@
}

function Setup-All([string]$OutDir) {
  Ensure-DesktopFiles $OutDir
  Ensure-MobileFiles  $OutDir

  Invoke-Cmd $DesktopDir "npm" @("install")
  Invoke-Cmd $MobileDir  "npm" @("install")

  Say "Setup complete." "Ok"
}

function Build-Desktop([string]$OutDir) {
  Ensure-DesktopFiles $OutDir
  Invoke-Cmd $DesktopDir "npm" @("install")
  Invoke-Cmd $DesktopDir "npm" @("run","dist:all")
  Say "Desktop installers output: $ReleaseDesk" "Ok"
}

function Dev-Desktop([string]$OutDir) {
  Ensure-DesktopFiles $OutDir
  Invoke-Cmd $DesktopDir "npm" @("install")
  Invoke-Cmd $DesktopDir "npm" @("run","dev")
}

function Build-Mobile([string]$OutDir) {
  Ensure-MobileFiles $OutDir
  Invoke-Cmd $MobileDir "npm" @("install")

  # Initialize once (safe to rerun; it will warn if already initialized)
  Invoke-Cmd $MobileDir "npm" @("run","cap:init")

  # Add platforms (safe to rerun; it will warn if already exists)
  Invoke-Cmd $MobileDir "npm" @("run","cap:add:android")
  Invoke-Cmd $MobileDir "npm" @("run","cap:add:ios")

  # Sync assets into native projects
  Invoke-Cmd $MobileDir "npm" @("run","cap:sync")

  Say "Mobile projects created under: packaging\mobile\android and packaging\mobile\ios" "Ok"
  Say "On Windows you can build Android in Android Studio. iOS requires macOS + Xcode." "Warn"
}

function Clean-All {
  Say "Cleaning packaging artifacts..." "Info"
  $paths = @(
    (Join-Path $DesktopDir "node_modules"),
    (Join-Path $MobileDir "node_modules"),
    $ReleaseDesk
  )
  foreach ($p in $paths) {
    if (Test-Path $p) { Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue }
  }
  Say "Clean complete." "Ok"
}

try {
  $OutDir = Resolve-UiOutDir
  Say "Using exported UI directory: $OutDir" "Ok"

  switch ($Action) {
    "Setup"       { Setup-All  $OutDir }
    "BuildDesktop"{ Build-Desktop $OutDir }
    "DevDesktop"  { Dev-Desktop $OutDir }
    "BuildMobile" { Build-Mobile $OutDir }
    "BuildAll"    { Build-Desktop $OutDir; Build-Mobile $OutDir }
    "Clean"       { Clean-All }
    default       { Show-Help }
  }
}
catch {
  Say $_.Exception.Message "Err"
  throw
}
