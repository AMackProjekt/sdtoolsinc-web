<#
.SYNOPSIS
  Deploy Azure Data Factory resources for T.O.O.L.S Inc

.DESCRIPTION
  Deploys linked services, pipelines, and triggers to Azure Data Factory

.PARAMETER ResourceGroup
  Azure resource group name

.PARAMETER DataFactoryName
  Data Factory name (default: konnektmack-DF)

.PARAMETER SubscriptionId
  Azure subscription ID
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [string]$ResourceGroup,
  
  [Parameter(Mandatory=$false)]
  [string]$DataFactoryName = "konnektmack-DF",
  
  [Parameter(Mandatory=$true)]
  [string]$SubscriptionId
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Deploying to Data Factory: $DataFactoryName" -ForegroundColor Cyan

# Set subscription
az account set --subscription $SubscriptionId

# Deploy Linked Services
Write-Host "`nDeploying Linked Services..." -ForegroundColor Yellow
$linkedServices = Get-ChildItem -Path ".\linked-services\*.json"
foreach ($ls in $linkedServices) {
  Write-Host "  - Deploying $($ls.BaseName)..."
  az datafactory linked-service create `
    --factory-name $DataFactoryName `
    --resource-group $ResourceGroup `
    --name $ls.BaseName `
    --properties "@$($ls.FullName)"
}

# Deploy Pipelines
Write-Host "`nDeploying Pipelines..." -ForegroundColor Yellow
$pipelines = Get-ChildItem -Path ".\pipelines\*.json"
foreach ($pipeline in $pipelines) {
  Write-Host "  - Deploying $($pipeline.BaseName)..."
  az datafactory pipeline create `
    --factory-name $DataFactoryName `
    --resource-group $ResourceGroup `
    --name $pipeline.BaseName `
    --pipeline "@$($pipeline.FullName)"
}

# Deploy Triggers
Write-Host "`nDeploying Triggers..." -ForegroundColor Yellow
$triggers = Get-ChildItem -Path ".\triggers\*.json"
foreach ($trigger in $triggers) {
  Write-Host "  - Deploying $($trigger.BaseName)..."
  az datafactory trigger create `
    --factory-name $DataFactoryName `
    --resource-group $ResourceGroup `
    --name $trigger.BaseName `
    --properties "@$($trigger.FullName)"
}

# Start Triggers
Write-Host "`nStarting Triggers..." -ForegroundColor Yellow
foreach ($trigger in $triggers) {
  Write-Host "  - Starting $($trigger.BaseName)..."
  az datafactory trigger start `
    --factory-name $DataFactoryName `
    --resource-group $ResourceGroup `
    --name $trigger.BaseName
}

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "Monitor pipelines at: https://adf.azure.com" -ForegroundColor Cyan
