# Install complete Azure PowerShell suite (Az module)
# Run this script to ensure all Azure tools are installed

Write-Host "Installing Complete Azure PowerShell Suite..." -ForegroundColor Cyan

# Install full Az module (includes all Azure services)
if (-not (Get-Module -ListAvailable -Name Az)) {
    Write-Host "Installing Az module (full suite - this may take a few minutes)..." -ForegroundColor Yellow
    Install-Module -Name Az -Force -AllowClobber -Scope CurrentUser -Repository PSGallery
    Write-Host "✓ Az module installed" -ForegroundColor Green
} else {
    Write-Host "✓ Az module already installed" -ForegroundColor Green
    Write-Host "Updating to latest version..." -ForegroundColor Yellow
    Update-Module -Name Az -Force -ErrorAction SilentlyContinue
}

# Import commonly used modules
Write-Host "`nImporting Azure modules..." -ForegroundColor Cyan
Import-Module Az.Accounts -ErrorAction SilentlyContinue
Import-Module Az.Resources -ErrorAction SilentlyContinue
Import-Module Az.Migrate -ErrorAction SilentlyContinue
Import-Module Az.Websites -ErrorAction SilentlyContinue
Import-Module Az.Storage -ErrorAction SilentlyContinue
Import-Module Az.KeyVault -ErrorAction SilentlyContinue
Import-Module Az.CosmosDB -ErrorAction SilentlyContinue

Write-Host "`n✓ Azure PowerShell Suite ready!" -ForegroundColor Green
Write-Host "`nInstalled Az modules:" -ForegroundColor Cyan
Get-Module -ListAvailable Az.* | Select-Object Name, Version | Format-Table

Write-Host "`nTo connect to Azure, run: Connect-AzAccount" -ForegroundColor Yellow
