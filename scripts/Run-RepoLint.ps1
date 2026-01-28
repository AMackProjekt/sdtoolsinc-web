# Run-RepoLint.ps1
# Executes lint and type checks across key projects and applies fixes.

$ErrorActionPreference = "Stop"

$Projects = @(
  "c:\Users\donyalemack\sdtoolsinc-web",
  "c:\Users\donyalemack\sdtoolsinc-web\api",
  "c:\Users\donyalemack\sdtoolsinc-web\apps\casemgr-portal",
  "c:\Users\donyalemack\sdtoolsinc-web\apps\client-portal",
  "c:\Users\donyalemack\sdtoolsinc-web\portal-app",
  "c:\Users\donyalemack\sdtoolsinc-web\automation",
  "c:\Users\donyalemack\sdtoolsinc-web\servers"
)

foreach ($dir in $Projects) {
  if (-not (Test-Path (Join-Path $dir "package.json"))) { continue }
  Write-Host "🔧 Linting: $dir" -ForegroundColor Cyan
  Push-Location $dir
  try {
    if (Test-Path (Join-Path $dir "package-lock.json")) {
      npm install --no-audit
    }
    # Try standard lint fix scripts if present
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    $hasLintFix = $pkg.scripts.PSObject.Properties.Name -contains "lint:fix"
    if ($hasLintFix) { npm run lint:fix } else { npm run lint }

    # Typecheck if TypeScript
    if (Test-Path (Join-Path $dir "tsconfig.json")) {
      if ($pkg.scripts.PSObject.Properties.Name -contains "typecheck") { npm run typecheck } else { npx tsc -p . --noEmit }
    }
  } catch {
    Write-Host "⚠️  Lint/typecheck issue in $dir: $_" -ForegroundColor Yellow
  } finally { Pop-Location }
}

Write-Host "✅ Repo lint completed." -ForegroundColor Green
