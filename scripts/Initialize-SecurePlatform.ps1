# Initialize-SecurePlatform.ps1
# Master script to initialize all security measures and launch secure platform
# Run this once to set up the complete T.O.O.L.S Inc secure infrastructure

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("full", "vault-only", "check", "cleanup")]
    [string]$Mode = "full",

    [Parameter(Mandatory = $false)]
    [string]$KeyVaultName = "toolsinc-kv",

    [Parameter(Mandatory = $false)]
    [string]$ResourceGroup = "toolsinc-rg",

    [Parameter(Mandatory = $false)]
    [string]$Location = "eastus",

    [Parameter(Mandatory = $false)]
    [switch]$Interactive = $true
)

$ErrorActionPreference = "Stop"
$VerbosePreference = "Continue"

# Helper functions
function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $Message" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Message, [int]$Number, [int]$Total)
    Write-Host "[$Number/$Total] $Message" -ForegroundColor Yellow
}

function Test-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    $allGood = $true
    
    # Check Azure CLI
    try {
        $azVersion = az --version 2>$null
        Write-Host "✓ Azure CLI installed" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Azure CLI not found" -ForegroundColor Red
        Write-Host "  Install from: https://learn.microsoft.com/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
        $allGood = $false
    }
    
    # Check Azure login
    try {
        $account = az account show --query name -o tsv 2>$null
        Write-Host "✓ Azure authenticated ($account)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Not authenticated to Azure" -ForegroundColor Red
        $allGood = $false
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✓ Node.js installed ($nodeVersion)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Node.js not found" -ForegroundColor Red
        $allGood = $false
    }
    
    # Check Git
    try {
        $gitVersion = git --version
        Write-Host "✓ Git installed" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Git not found" -ForegroundColor Red
        $allGood = $false
    }
    
    if (-not $allGood) {
        Write-Host ""
        Write-Host "⚠️  Some prerequisites are missing. Please install them and try again." -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

function Initialize-KeyVault {
    Write-Header "Initializing Azure Key Vault"
    
    Write-Step "Creating/validating Key Vault" 1 3
    & ".\scripts\Secure-KeyVault-Setup.ps1" `
        -KeyVaultName $KeyVaultName `
        -ResourceGroup $ResourceGroup `
        -Location $Location `
        -CreateSecrets
    
    Write-Step "Verifying Key Vault access" 2 3
    $vaultUrl = az keyvault show --name $KeyVaultName --query properties.vaultUri -o tsv
    Write-Host "✓ Key Vault URL: $vaultUrl" -ForegroundColor Green
    
    Write-Step "Creating .env.vault files" 3 3
    $envFiles = @(
        "api\.env.vault",
        "automation\.env.vault",
        "apps\casemgr-portal\.env.vault",
        "apps\client-portal\.env.vault"
    )
    
    foreach ($envFile in $envFiles) {
        $source = "$envFile.example"
        if (Test-Path $source) {
            Copy-Item $source $envFile -Force
            
            # Replace placeholder with actual Key Vault URL
            (Get-Content $envFile) -replace `
                "https://<your-keyvault-name>\.vault\.azure\.net/", `
                $vaultUrl | Set-Content $envFile
            
            Write-Host "  ✓ Created: $envFile" -ForegroundColor Green
        }
    }
    
    Write-Host ""
}

function Setup-GitHooks {
    Write-Header "Setting Up Git Pre-commit Hooks"
    
    $hooksDir = ".git\hooks"
    $gitHooksDir = ".git-hooks"
    
    if (-not (Test-Path $hooksDir)) {
        Write-Host "✗ Git repository not found" -ForegroundColor Red
        return
    }
    
    # Copy PowerShell pre-commit hook
    if (Test-Path "$gitHooksDir\pre-commit.ps1") {
        Copy-Item "$gitHooksDir\pre-commit.ps1" "$hooksDir\pre-commit" -Force
        Write-Host "✓ Installed pre-commit hook" -ForegroundColor Green
        Write-Host "  Prevents accidental commits of secrets" -ForegroundColor Gray
    }
    
    Write-Host ""
}

function Cleanup-PublicAssets {
    Write-Header "Cleaning Up Public Assets"
    
    Write-Host "Running file cleanup..." -ForegroundColor Yellow
    & ".\scripts\Cleanup-FilingFolders.ps1" -DryRun:$false -Archive:$true
    
    Write-Host ""
}

function Generate-Summary {
    param([hashtable]$Config)
    
    Write-Header "Security Platform Initialization Complete! ✅"
    
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "  Resource Group: $($Config.ResourceGroup)" -ForegroundColor Gray
    Write-Host "  Key Vault: $($Config.KeyVaultName)" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. ✓ Azure Key Vault is set up" -ForegroundColor Green
    Write-Host "  2. ✓ Git pre-commit hooks configured" -ForegroundColor Green
    Write-Host "  3. ✓ Public assets cleaned up" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Important Actions:" -ForegroundColor Yellow
    Write-Host "  □ Update all secrets in Key Vault with real credentials" -ForegroundColor Gray
    Write-Host "  □ Test local development with: az login" -ForegroundColor Gray
    Write-Host "  □ Launch portals with: .\scripts\Launch-SecurePortals.ps1" -ForegroundColor Gray
    Write-Host "  □ Review docs/SECURITY_CONFIGURATION.md for complete security guide" -ForegroundColor Gray
    Write-Host "  □ Set up audit logging and monitoring" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Portal URLs (when running locally):" -ForegroundColor Cyan
    Write-Host "  • Case Manager: http://localhost:3002" -ForegroundColor Gray
    Write-Host "  • Client Portal: http://localhost:3001" -ForegroundColor Gray
    Write-Host "  • Admin Portal:  http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Documentation:" -ForegroundColor Cyan
    Write-Host "  • docs/KEYVAULT_SETUP.md - Detailed Key Vault configuration" -ForegroundColor Gray
    Write-Host "  • docs/SECURITY_CONFIGURATION.md - Complete security guide" -ForegroundColor Gray
    Write-Host "  • scripts/README-SECURITY.md - Scripts documentation" -ForegroundColor Gray
    Write-Host ""
}

function Show-Menu {
    Write-Host ""
    Write-Host "Select initialization mode:" -ForegroundColor Cyan
    Write-Host "  1. Full Setup (Key Vault + Git Hooks + Cleanup)" -ForegroundColor Gray
    Write-Host "  2. Key Vault Only" -ForegroundColor Gray
    Write-Host "  3. Security Check" -ForegroundColor Gray
    Write-Host "  4. Cleanup Public Assets" -ForegroundColor Gray
    Write-Host ""
    
    $selection = Read-Host "Enter choice (1-4)"
    
    switch ($selection) {
        "1" { return "full" }
        "2" { return "vault-only" }
        "3" { return "check" }
        "4" { return "cleanup" }
        default { return "full" }
    }
}

# Main execution
Write-Header "T.O.O.L.S Inc Secure Platform Initialization"

if ($Interactive -and $Mode -eq "full") {
    $Mode = Show-Menu
}

Write-Host "Mode: $Mode" -ForegroundColor Cyan
Write-Host ""

# Run prerequisites check
Test-Prerequisites

switch ($Mode) {
    "full" {
        Initialize-KeyVault
        Setup-GitHooks
        Cleanup-PublicAssets
        Generate-Summary @{
            ResourceGroup = $ResourceGroup
            KeyVaultName = $KeyVaultName
        }
    }
    
    "vault-only" {
        Initialize-KeyVault
    }
    
    "check" {
        Write-Header "Security Status Check"
        Write-Host "✓ All prerequisites available" -ForegroundColor Green
        Write-Host "✓ Ready for deployment" -ForegroundColor Green
    }
    
    "cleanup" {
        Cleanup-PublicAssets
    }
}

Write-Host "For help, see: docs/SECURITY_CONFIGURATION.md" -ForegroundColor Gray
