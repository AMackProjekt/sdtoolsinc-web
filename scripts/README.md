# Scripts Directory

This directory contains automation and migration scripts for the T.O.O.L.S Inc project.

## Build & Release Scripts

### `build-installers.ps1`
Automated build script for Electron desktop applications.
- Builds both Case Manager Portal and Client Portal
- Generates MSI and EXE installers
- Outputs to `release/` folder

```powershell
.\scripts\build-installers.ps1
```

### `check-versions.ps1`
Validates version consistency across the monorepo.

```powershell
.\scripts\check-versions.ps1
```

### `update-version.ps1`
Updates version numbers across all package.json files.

```powershell
.\scripts\update-version.ps1 -Version "2.1.0"
```

## Migration Scripts

### `azure-migrate.ps1`
**Azure Migration Orchestrator** - Main PowerShell script for coordinating all migration activities.

**Usage:**
```powershell
# Assess migration readiness
.\scripts\azure-migrate.ps1 -Action assess

# Export configuration backup
.\scripts\azure-migrate.ps1 -Action export-config -Target "backup.json"

# Validate migrated resources
.\scripts\azure-migrate.ps1 -Action validate -ResourceGroup "toolsinc-rg"
```

**Actions:**
- `assess` - Check prerequisites and readiness
- `export-config` - Backup current configuration
- `migrate-db` - Database migration guidance
- `migrate-storage` - Storage migration guidance
- `migrate-app` - Application deployment guidance
- `validate` - Validate Azure resources

### `migrate-db.js`
**Database Migration** - Node.js script for SQL database migration.

**Usage:**
```bash
# Full migration (schema + data)
node scripts/migrate-db.js \
  --source "Server=localhost;Database=toolsinc" \
  --target "Server=toolsinc.database.windows.net;Database=toolsinc-prod"

# Schema only
node scripts/migrate-db.js --source "..." --target "..." --action schema-only

# Data only
node scripts/migrate-db.js --source "..." --target "..." --action data-only

# Dry run (preview changes)
node scripts/migrate-db.js --source "..." --target "..." --dry-run
```

**Features:**
- ✅ Automatic schema detection
- ✅ Uses `api/schema.sql` if available
- ✅ Batch data transfer
- ✅ Error handling per table
- ✅ Dry run mode
- ✅ Progress reporting

### `migrate-storage.js`
**Storage Migration** - Node.js script for Azure Blob Storage migration.

**Usage:**
```bash
# Upload files to Azure Blob Storage
node scripts/migrate-storage.js \
  --source ./local-files \
  --target toolsincstorageaccount \
  --container client-documents

# List containers
node scripts/migrate-storage.js \
  --target toolsincstorageaccount \
  --list-containers

# Dry run
node scripts/migrate-storage.js \
  --source ./local-files \
  --target toolsincstorageaccount \
  --dry-run
```

**Features:**
- ✅ Recursive directory scanning
- ✅ Auto-creates containers
- ✅ MIME type detection
- ✅ Skip existing files
- ✅ Managed Identity or connection string auth
- ✅ Dry run mode

## Utility Scripts

### `optimize-logos.js`
Optimizes logo images for web use.

```bash
node scripts/optimize-logos.js
```

### `remove-bg.js`
Background removal utility for images.

```bash
node scripts/remove-bg.js
```

## Azure SDK Packages

The following Azure packages are installed for migration tools:

- `@azure/arm-migrate` - Azure Migrate service management
- `@azure/arm-datamigration` - Database migration service
- `@azure/identity` - Azure authentication
- `@azure/storage-blob` - Blob storage operations
- `@azure/data-tables` - Table storage operations

## Prerequisites

### For PowerShell Scripts
- PowerShell 5.1+ or PowerShell Core 7+
- Azure CLI (for migration scripts)

### For Node.js Scripts
- Node.js 20.x
- npm dependencies installed (`npm install`)

### For Migration Scripts
- Azure CLI: https://aka.ms/InstallAzureCLIDirect
- Azure subscription with appropriate permissions
- Logged in: `az login`

## Migration Workflow

1. **Assess Readiness**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action assess
   ```

2. **Backup Configuration**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action export-config -Target "pre-migration.json"
   ```

3. **Migrate Database** (test first with --dry-run)
   ```bash
   node scripts/migrate-db.js --source "..." --target "..." --dry-run
   node scripts/migrate-db.js --source "..." --target "..."
   ```

4. **Migrate Storage**
   ```bash
   node scripts/migrate-storage.js --source ./files --target storageaccount --dry-run
   node scripts/migrate-storage.js --source ./files --target storageaccount
   ```

5. **Validate**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action validate
   ```

## Documentation

For complete migration guide, see:
- `docs/AZURE_MIGRATION_TOOLS.md` - Complete migration documentation
- `apps/casemgr-portal/FILE_STORAGE_GUIDE.md` - Azure Blob Storage integration
- `docs/BACKEND_PLAN.md` - Backend architecture plan

## Troubleshooting

### Azure CLI Not Found
Install Azure CLI: https://aka.ms/InstallAzureCLIDirect

### Not Logged In
```bash
az login
```

### Permission Errors
Ensure you have appropriate Azure RBAC roles:
- Storage Blob Data Contributor (for storage migration)
- SQL DB Contributor (for database migration)
- Contributor (for resource creation)

### Connection Errors
For SQL databases, add your IP to firewall rules:
```bash
az sql server firewall-rule create \
  --resource-group toolsinc-rg \
  --server toolsinc-sql \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

## Support

For issues or questions:
1. Check documentation in `docs/` folder
2. Review script comments and help text
3. Run with `-Verbose` flag (PowerShell) or check output logs (Node.js)
