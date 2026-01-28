#!/usr/bin/env pwsh
# T.O.O.L.S Inc - Dependency Update Script
# Updates npm dependencies in all workspace directories

Write-Host "🔄 Starting dependency update across all projects..." -ForegroundColor Cyan

# Main root project
Write-Host "`n📦 Updating root project dependencies..." -ForegroundColor Yellow
Push-Location "."
npm update
Pop-Location

# API project
Write-Host "`n📦 Updating api/ dependencies..." -ForegroundColor Yellow
Push-Location "api"
npm update
Pop-Location

# Admin Portal
Write-Host "`n📦 Updating apps/admin-portal/ dependencies..." -ForegroundColor Yellow
Push-Location "apps/admin-portal"
npm update
Pop-Location

# Case Manager Portal
Write-Host "`n📦 Updating apps/casemgr-portal/ dependencies..." -ForegroundColor Yellow
Push-Location "apps/casemgr-portal"
npm update
Pop-Location

# Client Portal
Write-Host "`n📦 Updating apps/client-portal/ dependencies..." -ForegroundColor Yellow
Push-Location "apps/client-portal"
npm update
Pop-Location

# Portal Hub
Write-Host "`n📦 Updating apps/portal-hub/ dependencies..." -ForegroundColor Yellow
Push-Location "apps/portal-hub"
npm update
Pop-Location

# Portal App (if exists)
if (Test-Path "portal-app/package.json") {
    Write-Host "`n📦 Updating portal-app/ dependencies..." -ForegroundColor Yellow
    Push-Location "portal-app"
    npm update
    Pop-Location
}

# Automation scripts
if (Test-Path "automation/package.json") {
    Write-Host "`n📦 Updating automation/ dependencies..." -ForegroundColor Yellow
    Push-Location "automation"
    npm update
    Pop-Location
}

Write-Host "`n✅ All dependencies have been updated!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Review package-lock.json changes: git diff package-lock.json"
Write-Host "2. Test the application: npm run dev"
Write-Host "3. Commit the changes: git add -A && git commit -m 'chore: update dependencies'"
Write-Host "4. Push to repository: git push origin main"
Write-Host "5. Deploy: npm run build && npm run export"
