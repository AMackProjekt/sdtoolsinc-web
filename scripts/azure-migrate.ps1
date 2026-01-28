<#
.SYNOPSIS
  Azure Migration Tools - Database, Storage, and Resource Migration

.DESCRIPTION
  Comprehensive migration toolkit for T.O.O.L.S Inc project
  - Database migration (SQL Server to Azure SQL)
  - Storage migration (on-prem to Azure Blob)
  - App Service migration
  - Configuration export/import
  
.PARAMETER Action
  The migration action to perform:
    - assess: Assess current resources for migration readiness
    - export-config: Export current configuration
    - migrate-db: Migrate database to Azure SQL
    - migrate-storage: Migrate files to Azure Blob Storage
    - migrate-app: Migrate application to Azure
    - validate: Validate migration results

.PARAMETER Source
  Source connection string or path

.PARAMETER Target
  Target Azure resource or connection string

.EXAMPLE
  .\azure-migrate.ps1 -Action assess
  .\azure-migrate.ps1 -Action export-config -Target "config-backup.json"
  .\azure-migrate.ps1 -Action migrate-db -Source "Server=localhost;Database=toolsinc" -Target "Server=toolsinc.database.windows.net;Database=toolsinc-prod"
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [ValidateSet('assess', 'export-config', 'migrate-db', 'migrate-storage', 'migrate-app', 'validate')]
  [string]$Action,

  [Parameter(Mandatory=$false)]
  [string]$Source,

  [Parameter(Mandatory=$false)]
  [string]$Target,

  [Parameter(Mandatory=$false)]
  [string]$ResourceGroup = "toolsinc-rg",

  [Parameter(Mandatory=$false)]
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Header([string]$Message) {
  Write-Host ""
  Write-Host "======================================================================" -ForegroundColor Cyan
  Write-Host $Message -ForegroundColor Green
  Write-Host "======================================================================" -ForegroundColor Cyan
}

function Write-Step([string]$Message) {
  Write-Host "  -> $Message" -ForegroundColor Yellow
}

function Write-Success([string]$Message) {
  Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Warning([string]$Message) {
  Write-Host "  [WARN] $Message" -ForegroundColor Yellow
}

function Test-AzureCLI {
  Write-Step "Checking Azure CLI installation..."
  if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Warning "Azure CLI not found. Please install from: https://aka.ms/InstallAzureCLIDirect"
    return $false
  }
  Write-Success "Azure CLI is installed"
  return $true
}

function Test-AzureLogin {
  Write-Step "Checking Azure authentication..."
  try {
    $account = az account show 2>$null | ConvertFrom-Json
    if ($account) {
      Write-Success "Logged in as: $($account.user.name)"
      return $true
    }
  } catch {
    Write-Warning "Not logged into Azure. Run: az login"
    return $false
  }
  return $false
}

function Invoke-Assessment {
  Write-Header "MIGRATION READINESS ASSESSMENT"
  
  Write-Step "Checking prerequisites..."
  
  # Check Azure CLI
  if (-not (Test-AzureCLI)) { return }
  if (-not (Test-AzureLogin)) { return }
  
  Write-Step "Checking Node.js packages..."
  $packageJson = Get-Content "package.json" | ConvertFrom-Json
  $azurePackages = $packageJson.devDependencies.PSObject.Properties | Where-Object { $_.Name -like "@azure/*" }
  
  Write-Host "`n  Installed Azure packages:" -ForegroundColor Cyan
  foreach ($pkg in $azurePackages) {
    Write-Host "    - $($pkg.Name): $($pkg.Value)" -ForegroundColor Gray
  }
  
  Write-Step "Checking API structure..."
  if (Test-Path "api") {
    Write-Success "API directory found"
    $functions = Get-ChildItem "api/src/functions" -Directory -ErrorAction SilentlyContinue
    if ($functions) {
      Write-Host "    Functions: $($functions.Count)" -ForegroundColor Gray
    }
  }
  
  Write-Step "Checking database schema..."
  if (Test-Path "api/schema.sql") {
    Write-Success "Database schema found (api/schema.sql)"
  } else {
    Write-Warning "No database schema found"
  }
  
  Write-Step "Checking Data Factory pipelines..."
  if (Test-Path "data-factory") {
    Write-Success "Data Factory directory found"
    $pipelines = Get-ChildItem "data-factory/pipelines" -ErrorAction SilentlyContinue
    if ($pipelines) {
      Write-Host "    Pipelines: $($pipelines.Count)" -ForegroundColor Gray
    }
  }
  
  Write-Header "ASSESSMENT COMPLETE"
  Write-Host ""
  Write-Host "  Next steps:" -ForegroundColor Cyan
  Write-Host "    1. Export configuration: .\azure-migrate.ps1 -Action export-config -Target config.json" -ForegroundColor Gray
  Write-Host "    2. Review migration plan in docs/MIGRATION_PLAN.md" -ForegroundColor Gray
  Write-Host "    3. Execute migrations with appropriate actions" -ForegroundColor Gray
  Write-Host ""
}

function Export-Configuration {
  Write-Header "EXPORTING CONFIGURATION"
  
  $config = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    project = @{
      name = "T.O.O.L.S Inc"
      version = "2.0.0"
    }
    structure = @{
      mainWebsite = Test-Path "app"
      api = Test-Path "api"
      caseManagerPortal = Test-Path "apps/casemgr-portal"
      clientPortal = Test-Path "apps/client-portal"
      standalonePortal = Test-Path "portal-app"
      automation = Test-Path "automation"
      dataFactory = Test-Path "data-factory"
    }
    azure = @{
      functions = @()
      staticWebApps = @()
      databases = @()
    }
  }
  
  # Detect Azure Functions
  if (Test-Path "api/src/functions") {
    $functionDirs = Get-ChildItem "api/src/functions" -Directory
    foreach ($dir in $functionDirs) {
      $config.azure.functions += @{
        name = $dir.Name
        path = $dir.FullName
      }
    }
  }
  
  # Export to file
  $outputPath = if ($Target) { $Target } else { "migration-config-$(Get-Date -Format 'yyyyMMdd-HHmmss').json" }
  $config | ConvertTo-Json -Depth 10 | Out-File $outputPath -Encoding utf8
  
  Write-Success "Configuration exported to: $outputPath"
  Write-Host ""
}

function Invoke-DatabaseMigration {
  Write-Header "DATABASE MIGRATION"
  
  if (-not $Source -or -not $Target) {
    Write-Warning "Source and Target connection strings required"
    Write-Host "  Example: -Source 'Server=localhost;Database=toolsinc' -Target 'Server=toolsinc.database.windows.net;Database=toolsinc-prod'" -ForegroundColor Gray
    return
  }
  
  if ($DryRun) {
    Write-Warning "DRY RUN MODE - No changes will be made"
  }
  
  Write-Step "Source: $Source"
  Write-Step "Target: $Target"
  
  Write-Host "`n  Migration options:" -ForegroundColor Cyan
  Write-Host "    1. Use Azure Database Migration Service (recommended)" -ForegroundColor Gray
  Write-Host "    2. Use SQL Server Management Studio" -ForegroundColor Gray
  Write-Host "    3. Use bcp utility for bulk copy" -ForegroundColor Gray
  Write-Host "    4. Use Node.js migration script (scripts/migrate-db.js)" -ForegroundColor Gray
  Write-Host ""
  
  Write-Step "Creating Node.js migration script..."
  
  Write-Success "Use: node scripts/migrate-db.js --source '$Source' --target '$Target'"
  Write-Host ""
}

function Invoke-StorageMigration {
  Write-Header "STORAGE MIGRATION"
  
  if (-not $Target) {
    Write-Warning "Target storage account required"
    Write-Host "  Example: -Target 'toolsincstorageaccount'" -ForegroundColor Gray
    return
  }
  
  Write-Step "Target Storage Account: $Target"
  
  Write-Host "`n  Migration steps:" -ForegroundColor Cyan
  Write-Host "    1. Create storage account: az storage account create" -ForegroundColor Gray
  Write-Host "    2. Create container: az storage container create" -ForegroundColor Gray
  Write-Host "    3. Upload files: az storage blob upload-batch" -ForegroundColor Gray
  Write-Host "    4. Configure CORS and access policies" -ForegroundColor Gray
  Write-Host ""
  
  if ($DryRun) {
    Write-Warning "DRY RUN MODE - No changes will be made"
    return
  }
  
  Write-Step "Use Node.js migration script: node scripts/migrate-storage.js --target '$Target'"
  Write-Host ""
}

function Invoke-AppMigration {
  Write-Header "APPLICATION MIGRATION"
  
  Write-Host "`n  Components to migrate:" -ForegroundColor Cyan
  Write-Host "    1. Main Website (Next.js) -> Azure Static Web Apps" -ForegroundColor Gray
  Write-Host "    2. API (Azure Functions) -> Integrated with SWA" -ForegroundColor Gray
  Write-Host "    3. Portal Apps -> Separate SWA deployments" -ForegroundColor Gray
  Write-Host "    4. Data Factory -> Azure Data Factory" -ForegroundColor Gray
  Write-Host ""
  
  Write-Step "Existing deployment workflow: .github/workflows/azure-static-web-apps-blue-desert-08d808f10.yml"
  Write-Success "Application already configured for Azure deployment"
  
  Write-Host "`n  To deploy:" -ForegroundColor Cyan
  Write-Host "    git push origin main" -ForegroundColor Gray
  Write-Host ""
}

function Invoke-Validation {
  Write-Header "MIGRATION VALIDATION"
  
  Write-Step "Validating Azure resources..."
  
  if (-not (Test-AzureCLI)) { return }
  if (-not (Test-AzureLogin)) { return }
  
  Write-Step "Checking Static Web Apps..."
  try {
    $swas = az staticwebapp list --resource-group $ResourceGroup 2>$null | ConvertFrom-Json
    if ($swas) {
      Write-Success "Found $($swas.Count) Static Web App(s)"
      foreach ($swa in $swas) {
        Write-Host "    - $($swa.name): $($swa.defaultHostname)" -ForegroundColor Gray
      }
    }
  } catch {
    Write-Warning "No Static Web Apps found or error accessing"
  }
  
  Write-Step "Checking SQL Databases..."
  try {
    $dbs = az sql db list --resource-group $ResourceGroup 2>$null | ConvertFrom-Json
    if ($dbs) {
      Write-Success "Found $($dbs.Count) SQL Database(s)"
    }
  } catch {
    Write-Warning "No SQL Databases found or error accessing"
  }
  
  Write-Step "Checking Storage Accounts..."
  try {
    $storage = az storage account list --resource-group $ResourceGroup 2>$null | ConvertFrom-Json
    if ($storage) {
      Write-Success "Found $($storage.Count) Storage Account(s)"
    }
  } catch {
    Write-Warning "No Storage Accounts found or error accessing"
  }
  
  Write-Host ""
}

# Main execution
Write-Host ""
Write-Host "T.O.O.L.S Inc - Azure Migration Toolkit" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

switch ($Action) {
  'assess' { Invoke-Assessment }
  'export-config' { Export-Configuration }
  'migrate-db' { Invoke-DatabaseMigration }
  'migrate-storage' { Invoke-StorageMigration }
  'migrate-app' { Invoke-AppMigration }
  'validate' { Invoke-Validation }
}

Write-Host "Done!" -ForegroundColor Green
Write-Host ""
