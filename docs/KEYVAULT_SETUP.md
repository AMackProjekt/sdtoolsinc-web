# Azure Key Vault Setup Guide

## Overview
This guide walks you through setting up Azure Key Vault to securely manage all API keys, database credentials, and sensitive configuration for T.O.O.L.S Inc applications.

## Prerequisites
- Azure subscription with appropriate permissions
- Azure CLI installed (`az --version`)
- PowerShell or bash terminal
- Access to create Azure resources

## Step 1: Create Azure Key Vault

```bash
# Set variables
RESOURCE_GROUP="toolsinc-rg"
KEYVAULT_NAME="toolsinc-kv"
LOCATION="eastus"

# Create resource group (if not exists)
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Create Key Vault
az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name $KEYVAULT_NAME \
  --location $LOCATION \
  --enable-soft-delete true \
  --enable-purge-protection true \
  --enable-rbac-authorization true

# Get Key Vault URL
KEYVAULT_URL=$(az keyvault show --name $KEYVAULT_NAME --query properties.vaultUri -o tsv)
echo "Key Vault URL: $KEYVAULT_URL"
```

## Step 2: Configure Access Permissions

### For Local Development (User Access)
```bash
# Get your current user object ID
USER_ID=$(az ad signed-in-user show --query id -o tsv)

# Assign secret permissions
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee $USER_ID \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
```

### For Azure Functions (Managed Identity)
```bash
# Get your Function App's managed identity object ID
FUNCTION_APP_NAME="toolsinc-api"
FUNCTION_IDENTITY=$(az functionapp identity show \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

# Assign secret permissions
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee $FUNCTION_IDENTITY \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
```

## Step 3: Add Secrets to Key Vault

### Database Credentials
```bash
# Add SQL Database secrets
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "azure-sql-server" \
  --value "your-server.database.windows.net"

az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "azure-sql-database" \
  --value "toolsinc-prod"

az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "azure-sql-user" \
  --value "sqladmin"

az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "azure-sql-password" \
  --value "Your-Secure-Password-Here"
```

### API Keys
```bash
# OpenAI
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "openai-api-key" \
  --value "sk-..."

# SendGrid
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "sendgrid-api-key" \
  --value "SG...."

# JWT Secret
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "jwt-secret" \
  --value "$(openssl rand -base64 32)"
```

### Social Media Automation
```bash
# Twitter/X
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "automation-twitter-api-key" \
  --value "your-key"

# Facebook
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "automation-facebook-api-key" \
  --value "your-key"

# Instagram
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "automation-instagram-api-key" \
  --value "your-key"

# LinkedIn
az keyvault secret set \
  --vault-name $KEYVAULT_NAME \
  --name "automation-linkedin-api-key" \
  --value "your-key"
```

## Step 4: Configure Applications

### Azure Functions (API)
```bash
# Add Key Vault URL to Function App settings
az functionapp config appsettings set \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings AZURE_KEYVAULT_URL=$KEYVAULT_URL
```

### Static Web Apps (Portals)
```bash
# Create configuration file at apps/casemgr-portal/.env.vault
# Use the template and add KEYVAULT_URL

# Build and deploy
cd apps/casemgr-portal
npm run build
```

## Step 5: Local Development Setup

```bash
# Copy example files
cp api/.env.vault.example api/.env.vault
cp automation/.env.vault.example automation/.env.vault
cp apps/casemgr-portal/.env.vault.example apps/casemgr-portal/.env.vault

# Edit the files with your Key Vault URL
# Then run using Azure CLI auth
az login
```

## Step 6: Verify Configuration

### Test Key Vault Access
```bash
# Retrieve a secret
az keyvault secret show \
  --vault-name $KEYVAULT_NAME \
  --name "azure-sql-server"

# List all secrets
az keyvault secret list --vault-name $KEYVAULT_NAME
```

### Test Application Access
```bash
# For Azure Functions
az functionapp logs stream --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP

# For local development
cd api
npm start
```

## Best Practices

### Security
1. **Rotation**: Rotate secrets regularly (quarterly minimum)
2. **Access Control**: Use RBAC, not shared keys
3. **Audit Logging**: Enable Key Vault audit logs
4. **Network**: Use Private Endpoints when possible
5. **Compliance**: Enable soft-delete and purge protection

### Development
1. **Never commit secrets**: Use `.env.vault` template files only
2. **Use Managed Identities**: For Azure services, not connection strings
3. **Cache secrets**: Use TTL-based caching in applications
4. **Monitor access**: Review audit logs regularly

### Operations
1. **Alert on access**: Set up monitoring for suspicious access patterns
2. **Backup**: Export critical secrets securely
3. **Documentation**: Maintain updated list of all secrets
4. **Versioning**: Key Vault maintains version history

## Troubleshooting

### Permission Denied
```bash
# Verify role assignment
az role assignment list \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
```

### Secret Not Found
```bash
# List all secrets
az keyvault secret list --vault-name $KEYVAULT_NAME --query "[].name"
```

### Authentication Issues
```bash
# Verify Azure CLI login
az account show

# Re-authenticate if needed
az login
```

## References
- [Azure Key Vault Documentation](https://learn.microsoft.com/azure/key-vault/)
- [Azure Identity SDK](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme)
- [Key Vault Secrets Client](https://learn.microsoft.com/javascript/api/@azure/keyvault-secrets/)
