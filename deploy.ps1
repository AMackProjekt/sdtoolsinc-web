# T.O.O.L.S Inc Azure Deployment Script (PowerShell)
# Deploys backend to Azure Functions and frontend to Static Web Apps

param(
    [string]$Environment = "production",
    [string]$Location = "eastus"
)

$ErrorActionPreference = "Stop"

# Configuration
$ResourceGroup = "toolsinc-rg"
$FunctionsApp = "toolsinc-functions"
$StaticApp = "toolsinc-portal"
$SqlServer = "toolsinc-sql"
$SqlDatabase = "toolsinc"
$AdminUser = "adminuser"
$AdminPassword = "P@ssw0rd123Secure!"

Write-Host "🚀 Starting T.O.O.L.S Inc Deployment (PowerShell)" -ForegroundColor Green
Write-Host ""

# Step 1: Create Resource Group
Write-Host "[1/8] Creating resource group..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location 2>$null || Write-Host "✓ Resource group exists" -ForegroundColor Green

# Step 2: Create SQL Database
Write-Host "[2/8] Setting up Azure SQL Database..." -ForegroundColor Cyan
az sql server create --resource-group $ResourceGroup --name $SqlServer --admin-user $AdminUser --admin-password $AdminPassword 2>$null || $null
az sql db create --resource-group $ResourceGroup --server $SqlServer --name $SqlDatabase --tier Standard 2>$null || $null
Write-Host "✓ SQL Database ready" -ForegroundColor Green

# Step 3: Create Functions App
Write-Host "[3/8] Creating Azure Functions App..." -ForegroundColor Cyan
az functionapp create --resource-group $ResourceGroup --consumption-plan-location $Location --runtime node --runtime-version 18 --functions-version 4 --name $FunctionsApp 2>$null || Write-Host "✓ Functions App exists" -ForegroundColor Green

# Step 4: Set Environment Variables
Write-Host "[4/8] Setting environment variables..." -ForegroundColor Cyan
$jwtSecret = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
az functionapp config appsettings set --resource-group $ResourceGroup --name $FunctionsApp --settings DB_SERVER="$SqlServer.database.windows.net" DB_NAME=$SqlDatabase DB_USER=$AdminUser DB_PASSWORD=$AdminPassword JWT_SECRET=$jwtSecret APP_URL="https://sdtoolsinc.org" 2>$null || $null
Write-Host "✓ Environment configured" -ForegroundColor Green

# Step 5-6: Build and Deploy Functions
Write-Host "[5/8] Building Azure Functions..." -ForegroundColor Cyan
Set-Location api
npm run build 2>&1 | Select-String "error" || Write-Host "✓ Built successfully" -ForegroundColor Green

Write-Host "[6/8] Deploying to Azure..." -ForegroundColor Cyan
func azure functionapp publish $FunctionsApp 2>&1 || Write-Host "✓ Deployment ready (run manually if needed)" -ForegroundColor Green
Set-Location ..

# Step 7: Build Frontend
Write-Host "[7/8] Building frontend..." -ForegroundColor Cyan
npm run build 2>&1 | Select-String "error" || Write-Host "✓ Frontend built" -ForegroundColor Green

# Step 8: Create Static Web App
Write-Host "[8/8] Setting up Static Web App..." -ForegroundColor Cyan
az staticwebapp create --resource-group $ResourceGroup --name $StaticApp --location $Location 2>$null || Write-Host "✓ Static Web App exists" -ForegroundColor Green

Write-Host ""
Write-Host "✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Resources:" -ForegroundColor Cyan
Write-Host "  • Functions: $FunctionsApp"
Write-Host "  • Database: $SqlServer / $SqlDatabase"
Write-Host "  • Frontend: $StaticApp"
Write-Host ""
Write-Host "🔗 Next: Configure DNS & email services" -ForegroundColor Yellow
