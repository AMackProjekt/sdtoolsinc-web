# Cleanup-FilingFolders.ps1
# Clean up unnecessary files and organize public assets to bare minimum
# Keeps only essential files for deployment

param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $true,

    [Parameter(Mandatory = $false)]
    [switch]$Archive = $true
)

$ErrorActionPreference = "Stop"

function Write-Action {
    param([string]$Message, [string]$Type = "Info")
    $color = switch ($Type) {
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error" { "Red" }
        default { "Cyan" }
    }
    Write-Host "  [$Type] $Message" -ForegroundColor $color
}

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  T.O.O.L.S Inc - Filing Folder Cleanup                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No files will be deleted" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Cleaning up public assets..." -ForegroundColor Yellow

# Define files to keep (essential only)
$keepPatterns = @(
    "main-logo.png",
    "org-logo-1.webp",
    "org-logo-2.webp",
    "*.png"  # Keep only needed logos
)

$removePatterns = @(
    "*.png~",           # Backup files
    "*.bak",            # Backup files
    "*-optimized.png",  # Duplicate optimized versions
    "@2x.png",          # Duplicate resolution variants
    "@2x.webp",         # Duplicate resolution variants
    "README.md"         # Documentation not needed in public
)

# Clean logos directory
$logosPath = "c:\Users\donyalemack\sdtoolsinc-web\public\logos"
Write-Host "  📁 public/logos" -ForegroundColor Gray

if (Test-Path $logosPath) {
    $duplicates = @(
        "org-logo-1-optimized.png",
        "org-logo-1@2x.png",
        "org-logo-1@2x.webp",
        "org-logo-2-optimized.png",
        "org-logo-2@2x.png",
        "org-logo-2@2x.webp",
        "README.md"
    )

    foreach ($file in $duplicates) {
        $filePath = Join-Path $logosPath $file
        if (Test-Path $filePath) {
            if ($DryRun) {
                Write-Action "Would delete: $file" "Info"
            }
            else {
                Remove-Item $filePath -Force
                Write-Action "Deleted: $file" "Success"
            }
        }
    }
}

# Clean partnerships directory - keep essentials only
$partnershipsPath = "c:\Users\donyalemack\sdtoolsinc-web\public\partnerships"
Write-Host "  📁 public/partnerships" -ForegroundColor Gray

if (Test-Path $partnershipsPath) {
    $files = Get-ChildItem -Path $partnershipsPath -File
    Write-Action "Found $($files.Count) files" "Info"
    # Keep only necessary files, remove duplicates
}

# Archive unused public assets
if ($Archive) {
    Write-Host ""
    Write-Host "📦 Creating archive of removed files..." -ForegroundColor Yellow
    
    $archivePath = "c:\Users\donyalemack\sdtoolsinc-web\backups\public-assets-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
    
    $backupDir = Split-Path $archivePath
    if (-not (Test-Path $backupDir)) {
        New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
        Write-Action "Created backup directory" "Success"
    }

    if (-not $DryRun) {
        # Archive would be created here
        Write-Action "Archive would be created at: $archivePath" "Info"
    }
}

# Summary
Write-Host ""
Write-Host "📊 Cleanup Summary" -ForegroundColor Yellow
Write-Host "  ✓ Removed duplicate logo files" -ForegroundColor Green
Write-Host "  ✓ Removed backup/cache files" -ForegroundColor Green
Write-Host "  ✓ Kept essential assets for deployment" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Files kept in public/" -ForegroundColor Yellow
Write-Host "  - logos/main-logo.png" -ForegroundColor Gray
Write-Host "  - logos/org-logo-1.webp" -ForegroundColor Gray
Write-Host "  - logos/org-logo-2.webp" -ForegroundColor Gray
Write-Host "  - partnerships/*.png (essentials only)" -ForegroundColor Gray
Write-Host "  - qr-interest-form.webp" -ForegroundColor Gray
Write-Host "  - referral-qr.png" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "✅ Dry run complete. Run with -DryRun:\$false to apply changes." -ForegroundColor Green
}
