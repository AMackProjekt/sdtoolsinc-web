# Azure Data Factory Integration

This directory contains Azure Data Factory pipelines, linked services, and triggers for automated data workflows.

## Overview

**Data Factory Name:** Microsoft.DataFactory-konnektmack-DF

### Capabilities
1. **Data Sync** - Sync data between systems
2. **SQL Integration** - Automated data processing with Azure SQL
3. **Triggers** - Scheduled and event-based workflows

## Directory Structure

```
data-factory/
├── linked-services/     # Connection configurations
├── pipelines/          # Data processing workflows
├── triggers/           # Automation triggers
├── datasets/           # Data source/sink definitions
└── scripts/            # Setup and deployment scripts
```

## Setup Steps

### 1. Azure SQL Connection
Configure Data Factory to connect to your Azure SQL database:

```bash
# Set environment variables
$DF_NAME = "konnektmack-DF"
$RESOURCE_GROUP = "your-resource-group"
$SQL_SERVER = "your-sql-server.database.windows.net"
$SQL_DATABASE = "your-database-name"
```

### 2. Deploy Linked Services
```bash
# Deploy SQL linked service
az datafactory linked-service create `
  --factory-name $DF_NAME `
  --resource-group $RESOURCE_GROUP `
  --name "AzureSqlLinkedService" `
  --properties "@linked-services/azure-sql.json"
```

### 3. Deploy Pipelines
```bash
# Deploy data sync pipeline
az datafactory pipeline create `
  --factory-name $DF_NAME `
  --resource-group $RESOURCE_GROUP `
  --name "UserDataSyncPipeline" `
  --pipeline "@pipelines/user-data-sync.json"
```

### 4. Create Triggers
```bash
# Deploy schedule trigger
az datafactory trigger create `
  --factory-name $DF_NAME `
  --resource-group $RESOURCE_GROUP `
  --name "DailyDataSyncTrigger" `
  --properties "@triggers/daily-sync.json"
```

## Common Workflows

### User Data Sync
- **Source:** API submissions, form data
- **Destination:** Azure SQL Database
- **Frequency:** Real-time or scheduled
- **Trigger:** Event-based or daily at 2 AM

### Reporting Data Aggregation
- **Source:** Azure SQL transactional tables
- **Destination:** Analytics tables
- **Frequency:** Hourly
- **Trigger:** Schedule-based

### Backup and Archive
- **Source:** Azure SQL Database
- **Destination:** Azure Blob Storage
- **Frequency:** Daily
- **Trigger:** Schedule-based at midnight

## Monitoring

Access Data Factory monitoring:
```
https://adf.azure.com/en/monitoring/pipelineruns?factory=/subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.DataFactory/factories/konnektmack-DF
```

## Integration with API

The backend API can trigger Data Factory pipelines:

```typescript
// Trigger pipeline from API
const response = await fetch(
  `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.DataFactory/factories/konnektmack-DF/pipelines/{pipelineName}/createRun?api-version=2018-06-01`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);
```

## Security

- Use Azure Key Vault for connection strings
- Enable Managed Identity for Data Factory
- Configure network rules for SQL access
- Implement role-based access control (RBAC)
