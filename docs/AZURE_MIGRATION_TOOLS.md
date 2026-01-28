# Azure Migration Tools - User Guide

## Overview

Comprehensive migration toolkit for T.O.O.L.S Inc project, enabling seamless migration of databases, storage, and applications to Azure.

## Installed Packages

The following Azure SDK packages have been added to the project:

```json
{
  "@azure/arm-migrate": "Latest",
  "@azure/arm-datamigration": "Latest",
  "@azure/identity": "Latest",
  "@azure/storage-blob": "Latest",
  "@azure/data-tables": "Latest"
}
```

These packages are installed as dev dependencies and are part of the repository.

## Migration Scripts

### 1. PowerShell Migration Orchestrator

**Location**: `scripts/azure-migrate.ps1`

Main orchestration script for assessing, planning, and executing migrations.

#### Usage:

```powershell
# Assess migration readiness
.\scripts\azure-migrate.ps1 -Action assess

# Export current configuration
.\scripts\azure-migrate.ps1 -Action export-config -Target "backup-config.json"

# Validate migrated resources
.\scripts\azure-migrate.ps1 -Action validate -ResourceGroup "toolsinc-rg"

# Get database migration guidance
.\scripts\azure-migrate.ps1 -Action migrate-db -Source "Server=localhost;Database=toolsinc" -Target "Server=toolsinc.database.windows.net;Database=toolsinc-prod"

# Get storage migration guidance
.\scripts\azure-migrate.ps1 -Action migrate-storage -Target "toolsincstorageaccount"

# Get app migration guidance
.\scripts\azure-migrate.ps1 -Action migrate-app
```

#### Actions:

- **assess** - Check migration readiness and prerequisites
- **export-config** - Backup current configuration
- **migrate-db** - Database migration workflow
- **migrate-storage** - Storage migration workflow
- **migrate-app** - Application deployment guidance
- **validate** - Validate migrated Azure resources

### 2. Database Migration Script

**Location**: `scripts/migrate-db.js`

Node.js script for SQL database migration using mssql package.

#### Usage:

```bash
# Full migration (schema + data)
node scripts/migrate-db.js \
  --source "Server=localhost;Database=toolsinc;User=sa;Password=***" \
  --target "Server=toolsinc.database.windows.net;Database=toolsinc-prod;User=admin;Password=***"

# Schema only
node scripts/migrate-db.js \
  --source "..." \
  --target "..." \
  --action schema-only

# Data only
node scripts/migrate-db.js \
  --source "..." \
  --target "..." \
  --action data-only

# Dry run (preview without changes)
node scripts/migrate-db.js \
  --source "..." \
  --target "..." \
  --dry-run
```

#### Features:

- ✅ Automatic schema detection
- ✅ Uses `api/schema.sql` if available
- ✅ Batch data transfer
- ✅ Error handling per table
- ✅ Dry run mode
- ✅ Progress reporting

#### Environment Variables:

```bash
SOURCE_DB="Server=localhost;Database=toolsinc"
TARGET_DB="Server=toolsinc.database.windows.net;Database=toolsinc-prod"
node scripts/migrate-db.js
```

### 3. Storage Migration Script

**Location**: `scripts/migrate-storage.js`

Node.js script for Azure Blob Storage migration using @azure/storage-blob.

#### Usage:

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
  --container client-documents \
  --dry-run
```

#### Features:

- ✅ Recursive directory scanning
- ✅ Auto-creates containers
- ✅ MIME type detection
- ✅ Skip existing files
- ✅ Progress reporting
- ✅ Managed Identity or connection string auth
- ✅ Dry run mode

#### Authentication:

**Option 1: Managed Identity (Recommended)**
```bash
az login
node scripts/migrate-storage.js --target toolsincstorageaccount
```

**Option 2: Connection String**
```bash
export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=..."
node scripts/migrate-storage.js --target toolsincstorageaccount
```

## Prerequisites

### Azure CLI

Install Azure CLI: https://aka.ms/InstallAzureCLIDirect

```bash
# Verify installation
az --version

# Login
az login

# Set subscription
az account set --subscription "your-subscription-id"
```

### Node.js Packages

Already installed in the repository:

```bash
npm install
```

This will install all required Azure SDK packages.

### Azure Functions Core Tools

Required for API development:

```bash
# Windows (via Chocolatey)
choco install azure-functions-core-tools-4

# Or download from:
# https://learn.microsoft.com/azure/azure-functions/functions-run-local
```

## Migration Workflows

### Database Migration Workflow

1. **Assess Readiness**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action assess
   ```

2. **Backup Configuration**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action export-config -Target "pre-migration-config.json"
   ```

3. **Create Target Database**
   ```bash
   az sql server create --name toolsinc-sql --resource-group toolsinc-rg --location eastus --admin-user sqladmin --admin-password "SecurePassword123!"
   az sql db create --resource-group toolsinc-rg --server toolsinc-sql --name toolsinc-prod --service-objective S0
   ```

4. **Test Migration (Dry Run)**
   ```bash
   node scripts/migrate-db.js \
     --source "Server=localhost;Database=toolsinc" \
     --target "Server=toolsinc-sql.database.windows.net;Database=toolsinc-prod;User=sqladmin;Password=SecurePassword123!" \
     --dry-run
   ```

5. **Execute Schema Migration**
   ```bash
   node scripts/migrate-db.js \
     --source "..." \
     --target "..." \
     --action schema-only
   ```

6. **Execute Data Migration**
   ```bash
   node scripts/migrate-db.js \
     --source "..." \
     --target "..." \
     --action data-only
   ```

7. **Validate**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action validate
   ```

### Storage Migration Workflow

1. **Create Storage Account**
   ```bash
   az storage account create \
     --name toolsincstorageaccount \
     --resource-group toolsinc-rg \
     --location eastus \
     --sku Standard_LRS \
     --kind StorageV2
   ```

2. **Configure CORS (if needed)**
   ```bash
   az storage cors add \
     --services b \
     --methods GET POST PUT DELETE \
     --origins "*" \
     --allowed-headers "*" \
     --exposed-headers "*" \
     --max-age 3600 \
     --account-name toolsincstorageaccount
   ```

3. **Test Upload (Dry Run)**
   ```bash
   node scripts/migrate-storage.js \
     --source ./local-files \
     --target toolsincstorageaccount \
     --container client-documents \
     --dry-run
   ```

4. **Execute Upload**
   ```bash
   node scripts/migrate-storage.js \
     --source ./local-files \
     --target toolsincstorageaccount \
     --container client-documents
   ```

5. **Verify**
   ```bash
   node scripts/migrate-storage.js \
     --target toolsincstorageaccount \
     --list-containers
   ```

### Application Deployment Workflow

The application is already configured for Azure Static Web Apps deployment via GitHub Actions.

1. **Review Existing Deployment**
   ```powershell
   .\scripts\azure-migrate.ps1 -Action migrate-app
   ```

2. **Verify GitHub Workflow**
   - File: `.github/workflows/azure-static-web-apps-blue-desert-08d808f10.yml`
   - Triggers on push to `main` branch

3. **Deploy**
   ```bash
   git push origin main
   ```

4. **Monitor Deployment**
   - GitHub Actions tab in repository
   - Azure Portal > Static Web Apps

## Integration with Case Manager Portal

For the Case Manager Portal, update file storage to use Azure Blob:

See: `apps/casemgr-portal/FILE_STORAGE_GUIDE.md`

Example implementation:

```typescript
import { BlobServiceClient } from '@azure/storage-blob'
import { DefaultAzureCredential } from '@azure/identity'

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  new DefaultAzureCredential()
)

export async function uploadClientDocument(file: File, clientId: string) {
  const containerClient = blobServiceClient.getContainerClient('client-documents')
  const blobName = `${clientId}/${Date.now()}-${file.name}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  })
  
  return blockBlobClient.url
}
```

## Best Practices

### Security

1. **Never commit secrets** - Use environment variables
2. **Use Managed Identity** when possible instead of connection strings
3. **Enable encryption** for all Azure resources
4. **Configure firewall rules** for SQL databases
5. **Use Azure Key Vault** for production secrets

### Performance

1. **Batch operations** - Use bulk inserts for database migrations
2. **Parallel uploads** - Upload multiple files concurrently to blob storage
3. **Use appropriate tiers** - Select right service tiers for workload
4. **Monitor costs** - Set up Azure Cost Management alerts

### Testing

1. **Always use --dry-run** first
2. **Test with sample data** before full migration
3. **Keep backups** of source data
4. **Validate after migration** using validation script

## Troubleshooting

### Common Issues

**Issue**: "Azure CLI not found"
```bash
# Install Azure CLI
# https://aka.ms/InstallAzureCLIDirect
```

**Issue**: "Not logged into Azure"
```bash
az login
```

**Issue**: "Permission denied on storage account"
```bash
# Assign Storage Blob Data Contributor role
az role assignment create \
  --role "Storage Blob Data Contributor" \
  --assignee user@domain.com \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}
```

**Issue**: "SQL connection timeout"
```bash
# Add your IP to SQL firewall
az sql server firewall-rule create \
  --resource-group toolsinc-rg \
  --server toolsinc-sql \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

## Support and Documentation

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Azure SDK for JavaScript**: https://github.com/Azure/azure-sdk-for-js
- **Project Documentation**: See `docs/` folder
- **Migration Plan**: See `docs/MIGRATION_PLAN.md` (to be created)

## Next Steps

1. Run assessment: `.\scripts\azure-migrate.ps1 -Action assess`
2. Export config backup: `.\scripts\azure-migrate.ps1 -Action export-config`
3. Review and create migration plan in `docs/MIGRATION_PLAN.md`
4. Execute migrations using provided scripts
5. Validate: `.\scripts\azure-migrate.ps1 -Action validate`
