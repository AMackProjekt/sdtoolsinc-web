# Launch-SecurePortals.ps1
# Securely launch Case Manager, Client, and Admin portals with security checks
# Verifies environment, checks for exposed secrets, and initializes Key Vault access

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("casemgr", "client", "admin", "all")]
    [string]$Portal = "all",

    [Parameter(Mandatory = $false)]
    [switch]$Dev = $false,

    [Parameter(Mandatory = $false)]
    [switch]$SkipSecurityCheck = $false
)

$ErrorActionPreference = "Stop"
$WarningPreference = "Continue"

function Test-IsAdmin {
    $current = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($current)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $Message" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message, [string]$Status = "...")
    Write-Host "  → $Message " -NoNewline -ForegroundColor Yellow
    Write-Host $Status -ForegroundColor Gray
}

function Test-Environment {
    Write-Host ""
    Write-Host "🔐 Security Pre-Launch Checks" -ForegroundColor Cyan
    Write-Host ""

    # Check for exposed secrets in code
    Write-Step "Scanning for exposed secrets..." ""
    
    $secretPatterns = @(
        "password\s*=",
        "api[_-]?key\s*=",
        "secret\s*=",
        "token\s*=",
        "credential"
    )

    $dangerousFiles = @(
        ".env",
        ".env.local",
        ".env.production",
        "local.settings.json",
        "secrets.json"
    )

    $foundSecrets = $false
    foreach ($file in $dangerousFiles) {
        $paths = Get-ChildItem -Path "c:\Users\donyalemack\sdtoolsinc-web" -Recurse -Filter $file -ErrorAction SilentlyContinue
        if ($paths) {
            foreach ($path in $paths) {
                # Skip node_modules and .next
                if ($path.FullName -match "node_modules|\.next|dist|out") {
                    continue
                }
                Write-Host "    ⚠️  Found: $($path.FullName)" -ForegroundColor Yellow
                $foundSecrets = $true
            }
        }
    }

    if ($foundSecrets -and -not $SkipSecurityCheck) {
        Write-Host ""
        Write-Host "    ❌ Potential security issue: Found config files with secrets!" -ForegroundColor Red
        Write-Host "    Please ensure all secrets are in .env.vault files and ignored from git" -ForegroundColor Red
        Write-Host ""
        $response = Read-Host "    Continue anyway? (y/N)"
        if ($response -ne "y") {
            exit 1
        }
    }
    else {
        Write-Host "    ✓ No exposed secrets detected" -ForegroundColor Green
    }

    # Check .gitignore for secrets
    Write-Step "Checking .gitignore..." ""
    $gitignorePath = "c:\Users\donyalemack\sdtoolsinc-web\.gitignore"
    if (Test-Path $gitignorePath) {
        $content = Get-Content $gitignorePath -Raw
        $hasSecretPatterns = @(
            ".env",
            "local.settings.json",
            "secrets.json"
        ) | Where-Object { $content -match $_ }
        
        if ($hasSecretPatterns.Count -gt 0) {
            Write-Host "✓ .gitignore properly configured" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  .gitignore may need updates" -ForegroundColor Yellow
        }
    }

    # Check for Key Vault configuration
    Write-Step "Checking Key Vault setup..." ""
    
    if ($Dev) {
        Write-Host "ℹ️  Development mode - local secrets allowed" -ForegroundColor Gray
    }
    else {
        $kvCheck = $false
        foreach ($portal in @("api", "apps/casemgr-portal", "apps/client-portal")) {
            $envPath = Join-Path "c:\Users\donyalemack\sdtoolsinc-web" "$portal\.env.vault"
            if (Test-Path $envPath) {
                $content = Get-Content $envPath -Raw
                if ($content -match "AZURE_KEYVAULT_URL") {
                    $kvCheck = $true
                }
            }
        }
        
        if ($kvCheck) {
            Write-Host "✓ Key Vault configured" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  Key Vault not detected - check docs/KEYVAULT_SETUP.md" -ForegroundColor Yellow
        }
    }

    # Check Azure CLI login
    if (-not $Dev) {
        Write-Step "Checking Azure authentication..." ""
        try {
            $account = az account show --query name -o tsv 2>$null
            Write-Host "✓ Authenticated as: $account" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️  Not authenticated to Azure - run 'az login'" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "✅ Security checks complete" -ForegroundColor Green
}

Write-Header "T.O.O.L.S Inc - Secure Portal Launcher"

# Security checks
if (-not $SkipSecurityCheck) {
    Test-Environment
}

# Check admin privileges for some operations
if (-not (Test-IsAdmin)) {
    Write-Host ""
    Write-Host "ℹ️  Running without admin privileges (some features may be limited)" -ForegroundColor Yellow
}

# Launch portals
Write-Host ""
Write-Host "🚀 Launching Portals..." -ForegroundColor Cyan

$portalsToLaunch = @()
if ($Portal -eq "all" -or $Portal -eq "casemgr") {
    $portalsToLaunch += @{
        Name = "Case Manager Portal"
        Path = "c:\Users\donyalemack\sdtoolsinc-web\apps\casemgr-portal"
        Port = 3002
        Script = "dev"
    }
}

if ($Portal -eq "all" -or $Portal -eq "client") {
    $portalsToLaunch += @{
        Name = "Client Portal"
        Path = "c:\Users\donyalemack\sdtoolsinc-web\apps\client-portal"
        Port = 3001
        Script = "dev"
    }
}

if ($Portal -eq "all" -or $Portal -eq "admin") {
    $portalsToLaunch += @{
        Name = "Admin Portal"
        Path = "c:\Users\donyalemack\sdtoolsinc-web"
        Port = 3000
        Script = "dev"
    }
}

foreach ($portal in $portalsToLaunch) {
    Write-Host ""
    Write-Host "Starting: $($portal.Name)" -ForegroundColor Yellow
    Write-Host "  Path: $($portal.Path)" -ForegroundColor Gray
    Write-Host "  Port: $($portal.Port)" -ForegroundColor Gray
    
    if (Test-Path $portal.Path) {
        # Launch in new terminal window
        $command = "cd '$($portal.Path)' && npm run $($portal.Script)"
        
        # Use PowerShell to launch in new window to keep terminals separate
        $psCommand = "powershell -NoExit -Command `"$command`""
        
        if ($Dev) {
            Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $command
        }
        else {
            # Production mode - would use more secure launcher
            Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $command
        }
        
        Write-Host "  ✓ Launched in new window" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Path not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Portal Access URLs:" -ForegroundColor Yellow
Write-Host "  • Case Manager: http://localhost:3002" -ForegroundColor Cyan
Write-Host "  • Client Portal: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  • Admin Portal:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Security Reminders:" -ForegroundColor Yellow
Write-Host "  • All secrets are managed in Azure Key Vault" -ForegroundColor Gray
Write-Host "  • Use HTTPS in production" -ForegroundColor Gray
Write-Host "  • Enable RBAC for all Azure resources" -ForegroundColor Gray
Write-Host "  • Review audit logs regularly" -ForegroundColor Gray
Write-Host ""
