# Setup-MCP-Auth.ps1
# Securely materialize MCP credentials from Azure Key Vault into environment variables for runtime.
# No secrets are committed; values are fetched just-in-time.

param(
    [Parameter(Mandatory = $true)]
    [string]$KeyVaultName,

    [Parameter(Mandatory = $false)]
    [string]$ResourceGroup,

    [Parameter(Mandatory = $false)]
    [string]$OutputJson = "servers\\mcp-server-credentials.json",

    [Parameter(Mandatory = $false)]
    [switch]$ExportEnv = $true
)

$ErrorActionPreference = "Stop"

function Get-Secret {
    param([string]$Name)
    $val = az keyvault secret show --vault-name $KeyVaultName --name $Name --query value -o tsv
    if (-not $val) { throw "Secret not found: $Name" }
    return $val
}

Write-Host "🔐 Fetching MCP credentials from Azure Key Vault '$KeyVaultName'..." -ForegroundColor Cyan

# Map of Key Vault secret names → env vars expected by MCP servers
$secretMap = @{
  # GitHub
  "mcp-github-token"                = "GITHUB_PERSONAL_ACCESS_TOKEN"
  # GitLab
  "mcp-gitlab-token"                = "GITLAB_PERSONAL_ACCESS_TOKEN"
  # Auth0
  "mcp-auth0-client-id"             = "AUTH0_CLIENT_ID"
  "mcp-auth0-client-secret"         = "AUTH0_CLIENT_SECRET"
  "mcp-auth0-domain"                = "AUTH0_DOMAIN"
  # Google
  "mcp-google-oauth-client-id"      = "GOOGLE_OAUTH_CLIENT_ID"
  "mcp-google-oauth-client-secret"  = "GOOGLE_OAUTH_CLIENT_SECRET"
  "mcp-google-service-account-json" = "GOOGLE_APPLICATION_CREDENTIALS"
  # OpenAI
  "mcp-openai-api-key"              = "OPENAI_API_KEY"
  # Notion
  "mcp-notion-token"                = "NOTION_TOKEN"
  # Snowflake
  "mcp-snowflake-account"           = "SNOWFLAKE_ACCOUNT"
  "mcp-snowflake-user"              = "SNOWFLAKE_USER"
  "mcp-snowflake-password"          = "SNOWFLAKE_PASSWORD"
  "mcp-snowflake-role"              = "SNOWFLAKE_ROLE"
  "mcp-snowflake-warehouse"         = "SNOWFLAKE_WAREHOUSE"
  "mcp-snowflake-database"          = "SNOWFLAKE_DATABASE"
  "mcp-snowflake-schema"            = "SNOWFLAKE_SCHEMA"
  # ntfy
  "mcp-ntfy-server-url"             = "NTFY_SERVER_URL"
  "mcp-ntfy-access-token"           = "NTFY_ACCESS_TOKEN"
}

$envMap = @{}

foreach ($kvName in $secretMap.Keys) {
  try {
    $val = Get-Secret -Name $kvName
    $envVar = $secretMap[$kvName]
    $envMap[$envVar] = $val
    if ($ExportEnv) { [Environment]::SetEnvironmentVariable($envVar, $val, "Process") }
    Write-Host "  ✓ $envVar set" -ForegroundColor Green
  }
  catch {
    Write-Host "  ⚠️  Missing optional secret: $kvName" -ForegroundColor Yellow
  }
}

# Write JSON bundle (for clients that read a credentials file)
$OutputPath = Join-Path (Get-Location) $OutputJson
$OutputDir = Split-Path $OutputPath
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir | Out-Null }

$bundle = $envMap | ConvertTo-Json -Depth 3
Set-Content -Path $OutputPath -Value $bundle
Write-Host "📄 Credentials JSON written to: $OutputPath" -ForegroundColor Cyan

Write-Host "✅ MCP authentication environment prepared." -ForegroundColor Green
Write-Host "Next: launch your MCP client with these env vars in scope." -ForegroundColor Yellow
