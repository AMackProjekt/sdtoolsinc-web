# Update-Dependencies.ps1
# Checks and optionally updates dependencies across key packages in the monorepo.

param(
  [ValidateSet("check","update")]
  [string]$Mode = "check",
  [switch]$Audit,
  [switch]$Fix
)

$ErrorActionPreference = "Stop"

$Packages = @(
  "c:\Users\donyalemack\sdtoolsinc-web\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\api\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\apps\casemgr-portal\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\apps\client-portal\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\portal-app\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\automation\package.json",
  "c:\Users\donyalemack\sdtoolsinc-web\servers\package.json"
)

function Get-Dir($pkg){ Split-Path -Path $pkg -Parent }

$Report = @()

foreach ($pkg in $Packages) {
  if (-not (Test-Path $pkg)) { continue }
  $dir = Get-Dir $pkg
  Write-Host "🔎 $dir" -ForegroundColor Cyan

  Push-Location $dir
  try {
    # Show outdated
    $outdated = & npx npm-check-updates --reject "@types/*" --jsonUpgraded 2>$null
    if ($LASTEXITCODE -eq 0) {
      if ($outdated) {
        $obj = $outdated | ConvertFrom-Json
        $Report += [pscustomobject]@{ Package=$dir; Upgrades=(($obj | Get-Member -MemberType NoteProperty).Count) }
        Write-Host "  ✓ Upgrades available: $((($obj | Get-Member -MemberType NoteProperty).Count))" -ForegroundColor Yellow
      } else {
        $Report += [pscustomobject]@{ Package=$dir; Upgrades=0 }
        Write-Host "  ✓ No upgrades" -ForegroundColor Green
      }
    }

    if ($Mode -eq "update" -and $outdated) {
      Write-Host "  ↻ Applying upgrades..." -ForegroundColor Yellow
      & npx npm-check-updates -u --reject "@types/*"
      & npm install --no-audit
    }

    if ($Audit) {
      Write-Host "  🔐 Running audit..." -ForegroundColor Yellow
      & npm audit --audit-level=moderate
      if ($Fix) { & npm audit fix --force }
    }

  } finally {
    Pop-Location
  }
}

# Save summary
$summaryDir = "c:\Users\donyalemack\sdtoolsinc-web\reports"
if (-not (Test-Path $summaryDir)) { New-Item -ItemType Directory -Path $summaryDir | Out-Null }
$summaryPath = Join-Path $summaryDir ("dependencies-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".md")

$md = "# Dependency Check Summary`n`n" + ($Report | ForEach-Object { "- **$($_.Package)**: $($_.Upgrades) upgrades" } | Out-String)
Set-Content -Path $summaryPath -Value $md
Write-Host "📄 Summary saved: $summaryPath" -ForegroundColor Cyan
