# Secure-KeyVault-Setup.ps1
# Automated Azure Key Vault setup for T.O.O.L.S Inc
# This script creates and configures Key Vault with all necessary secrets

param(
    [Parameter(Mandatory = $true)]
    [string]$KeyVaultName,

    [Parameter(Mandatory = $true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory = $false)]
    [string]$Location = "eastus",

    [Parameter(Mandatory = $false)]
    [string]$FunctionAppName,

    [Parameter(Mandatory = $false)]
    [switch]$CreateSecrets
)

# Enable strict error handling
$ErrorActionPreference = "Stop"
$VerbosePreference = "Continue"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  T.O.O.L.S Inc - Azure Key Vault Security Setup       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
try {
    $azVersion = az --version 2>$null
    Write-Host "✓ Azure CLI is installed" -ForegroundColor Green
}
catch {
    Write-Host "✗ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check Azure login
try {
    $account = az account show --query id -o tsv
    Write-Host "✓ Authenticated to Azure" -ForegroundColor Green
    Write-Host "  Subscription: $(az account show --query name -o tsv)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Not authenticated to Azure. Run 'az login' first." -ForegroundColor Red
    exit 1
}

# Create resource group if needed
Write-Host ""
Write-Host "Checking resource group: $ResourceGroup" -ForegroundColor Yellow
try {
    az group show --name $ResourceGroup >$null 2>&1
    Write-Host "✓ Resource group exists" -ForegroundColor Green
}
catch {
    Write-Host "  Creating resource group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location
    Write-Host "✓ Resource group created" -ForegroundColor Green
}

# Create Key Vault
Write-Host ""
Write-Host "Configuring Key Vault: $KeyVaultName" -ForegroundColor Yellow
try {
    az keyvault show --name $KeyVaultName --resource-group $ResourceGroup >$null 2>&1
    Write-Host "✓ Key Vault already exists" -ForegroundColor Green
}
catch {
    Write-Host "  Creating Key Vault..." -ForegroundColor Yellow
    az keyvault create `
        --resource-group $ResourceGroup `
        --name $KeyVaultName `
        --location $Location `
        --enable-soft-delete true `
        --enable-purge-protection true `
        --enable-rbac-authorization true
    Write-Host "✓ Key Vault created" -ForegroundColor Green
}

# Get Key Vault URL
$KeyVaultUrl = az keyvault show --name $KeyVaultName --query properties.vaultUri -o tsv
Write-Host "  URL: $KeyVaultUrl" -ForegroundColor Gray

# Configure access for current user
Write-Host ""
Write-Host "Configuring access permissions" -ForegroundColor Yellow
$UserId = az ad signed-in-user show --query id -o tsv
$Scope = "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$ResourceGroup/providers/Microsoft.KeyVault/vaults/$KeyVaultName"

# Check if role assignment already exists
$roleCheck = az role assignment list --assignee $UserId --scope $Scope --query "[?roleDefinitionName=='Key Vault Secrets Officer']" 2>$null

if ($null -eq $roleCheck -or $roleCheck.Count -eq 0) {
    Write-Host "  Assigning 'Key Vault Secrets Officer' role..." -ForegroundColor Gray
    az role assignment create `
        --role "Key Vault Secrets Officer" `
        --assignee $UserId `
        --scope $Scope
    Write-Host "✓ User permissions configured" -ForegroundColor Green
}
else {
    Write-Host "✓ User already has permissions" -ForegroundColor Green
}

# Configure access for Function App if specified
if ($FunctionAppName) {
    Write-Host ""
    Write-Host "Configuring Function App managed identity" -ForegroundColor Yellow
    try {
        $FunctionIdentity = az functionapp identity show `
            --name $FunctionAppName `
            --resource-group $ResourceGroup `
            --query principalId -o tsv

        if ($FunctionIdentity) {
            # Check if role already assigned
            $funcRoleCheck = az role assignment list --assignee $FunctionIdentity --scope $Scope --query "[?roleDefinitionName=='Key Vault Secrets User']" 2>$null
            
            if ($null -eq $funcRoleCheck -or $funcRoleCheck.Count -eq 0) {
                Write-Host "  Assigning 'Key Vault Secrets User' role..." -ForegroundColor Gray
                az role assignment create `
                    --role "Key Vault Secrets User" `
                    --assignee $FunctionIdentity `
                    --scope $Scope
                Write-Host "✓ Function App permissions configured" -ForegroundColor Green
            }
            else {
                Write-Host "✓ Function App already has permissions" -ForegroundColor Green
            }

            # Set Key Vault URL in Function App settings
            Write-Host "  Updating Function App settings..." -ForegroundColor Gray
            az functionapp config appsettings set `
                --name $FunctionAppName `
                --resource-group $ResourceGroup `
                --settings AZURE_KEYVAULT_URL=$KeyVaultUrl
            Write-Host "✓ Function App settings updated" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "✗ Could not configure Function App: $_" -ForegroundColor Red
    }
}

# Create example secrets if requested
if ($CreateSecrets) {
    Write-Host ""
    Write-Host "Creating example secrets (REPLACE WITH REAL VALUES)" -ForegroundColor Yellow
    
    $secrets = @{
        "azure-sql-server"      = "your-server.database.windows.net"
        "azure-sql-database"    = "toolsinc-prod"
        "azure-sql-user"        = "sqladmin"
        "azure-sql-password"    = "CHANGE-ME-$(Get-Random)"
        "openai-api-key"        = "sk-PLACEHOLDER"
        "sendgrid-api-key"      = "SG.PLACEHOLDER"
        "jwt-secret"            = (New-Guid).ToString()
        "twitter-api-key"       = "PLACEHOLDER"
        "facebook-page-token"   = "PLACEHOLDER"
        "instagram-access-token" = "PLACEHOLDER"
    }

    foreach ($secretName in $secrets.Keys) {
        $secretValue = $secrets[$secretName]
        az keyvault secret set `
            --vault-name $KeyVaultName `
            --name $secretName `
            --value $secretValue
        Write-Host "  ✓ Created secret: $secretName" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Update the placeholder values in Key Vault with real credentials!" -ForegroundColor Yellow
}

# Generate configuration summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Setup Complete!                                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Yellow
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor Gray
Write-Host "  Key Vault Name: $KeyVaultName" -ForegroundColor Gray
Write-Host "  Key Vault URL: $KeyVaultUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Copy the Key Vault URL to your .env.vault files" -ForegroundColor Gray
Write-Host "  2. Update secrets with real API keys and passwords" -ForegroundColor Gray
Write-Host "  3. Run: az login (for local development)" -ForegroundColor Gray
Write-Host "  4. Test access: az keyvault secret list --vault-name $KeyVaultName" -ForegroundColor Gray
Write-Host ""
Write-Host "Reference Documentation:" -ForegroundColor Cyan
Write-Host "  See docs/KEYVAULT_SETUP.md for detailed instructions" -ForegroundColor Gray
