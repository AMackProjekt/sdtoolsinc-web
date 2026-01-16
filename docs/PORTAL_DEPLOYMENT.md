# Portal Deployment Guide

## Overview
This guide walks through deploying the separate T.O.O.L.S Inc portal as an Azure Static Web App with Azure Entra ID authentication and Azure SQL database integration.

## Prerequisites
- Azure Subscription (AzureSubscription1)
- Azure CLI installed
- Existing Azure SQL Database
- GitHub repository access

## Step 1: Create Azure Static Web App for Portal

```bash
# Login to Azure
az login

# Create resource group (if not exists)
az group create --name toolsinc-rg --location eastus

# Create Static Web App for Portal
az staticwebapp create \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --location eastus \
  --sku Standard \
  --branch main \
  --app-location "portal-app/out" \
  --output-location "" \
  --token <YOUR_GITHUB_PAT>
```

## Step 2: Configure Azure Entra ID App Registration

1. **Create App Registration:**
   ```bash
   # Or use Azure Portal: portal.azure.com > Entra ID > App Registrations > New
   az ad app create \
     --display-name "T.O.O.L.S Inc Portal" \
     --sign-in-audience AzureADMyOrg
   ```

2. **Configure Redirect URIs:**
   - Go to Azure Portal > Entra ID > App Registrations > Your App
   - Add Redirect URI: `https://<your-portal-url>/.auth/login/aad/callback`
   - Example: `https://toolsinc-portal.azurestaticapps.net/.auth/login/aad/callback`

3. **Create Client Secret:**
   - Certificates & secrets > New client secret
   - Save the secret value (only shown once!)

4. **Get IDs:**
   ```bash
   # Tenant ID
   az account show --query tenantId -o tsv
   
   # Application (Client) ID  
   az ad app list --display-name "T.O.O.L.S Inc Portal" --query [0].appId -o tsv
   ```

## Step 3: Configure Static Web App Settings

```bash
# Add Entra ID settings to portal SWA
az staticwebapp appsettings set \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --setting-names \
    AAD_CLIENT_ID=<your-client-id> \
    AAD_CLIENT_SECRET=<your-client-secret>

# Add Azure SQL settings to main SWA (backend API)
az staticwebapp appsettings set \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --setting-names \
    AZURE_SQL_SERVER=<your-server>.database.windows.net \
    AZURE_SQL_DATABASE=<your-database> \
    AZURE_SQL_USER=<your-username> \
    AZURE_SQL_PASSWORD=<your-password>
```

## Step 4: Configure Azure SQL Database

1. **Create Database (if needed):**
   ```bash
   az sql db create \
     --resource-group toolsinc-rg \
     --server <your-server> \
     --name toolsinc-db \
     --edition GeneralPurpose \
     --family Gen5 \
     --capacity 2
   ```

2. **Configure Firewall:**
   ```bash
   # Allow Azure services
   az sql server firewall-rule create \
     --resource-group toolsinc-rg \
     --server <your-server> \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

3. **Run Schema Script:**
   - Connect to your Azure SQL Database using Azure Data Studio or SQL Server Management Studio
   - Execute `api/schema.sql` to create tables

## Step 5: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets):

```
AZURE_PORTAL_SWA_TOKEN=<deployment-token-from-portal-swa>
```

Get deployment token:
```bash
az staticwebapp secrets list \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --query properties.apiKey -o tsv
```

## Step 6: Update staticwebapp.config.json

Update `portal-app/staticwebapp.config.json` with your tenant ID:

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<YOUR-TENANT-ID>/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  }
}
```

## Step 7: Deploy

1. **Commit changes:**
   ```bash
   git add portal-app/
   git commit -m "Add portal application"
   git push origin main
   ```

2. **Monitor deployment:**
   - Check GitHub Actions workflow
   - Verify deployment at Azure Portal > Static Web Apps > toolsinc-portal

## Step 8: Configure Custom Domain (Optional)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --hostname portal.sdtoolsinc.org

# Configure DNS with your provider:
# CNAME: portal.sdtoolsinc.org -> toolsinc-portal.azurestaticapps.net
```

## Testing

### 1. Test Authentication:
- Visit portal URL
- Click "Sign In with Microsoft"
- Verify redirect to Entra ID login
- Verify successful authentication and redirect back

### 2. Test API Integration:
- Check browser console for API calls
- Verify user creation in Azure SQL
- Test profile update functionality

### 3. Test Database Connection:
```bash
# From Azure Cloud Shell or local with Azure CLI
az sql db show-connection-string \
  --client ado.net \
  --server <your-server> \
  --name toolsinc-db
```

## Troubleshooting

### Authentication Issues:
- Verify Redirect URIs match exactly
- Check client secret hasn't expired
- Verify tenant ID is correct in config

### Database Connection Issues:
- Verify firewall rules allow Azure services
- Check connection string credentials
- Verify SQL user has proper permissions

### Deployment Issues:
- Check GitHub Actions logs
- Verify AZURE_PORTAL_SWA_TOKEN secret is set
- Ensure build completes successfully

## Next Steps

1. **User Management:**
   - Add admin role functionality
   - Implement user deactivation
   - Build user directory

2. **Progress Tracking:**
   - Create progress endpoints
   - Build progress dashboard
   - Add milestone tracking

3. **Resource Management:**
   - Upload resources via admin portal
   - Implement resource access control
   - Track resource engagement

4. **Appointments:**
   - Add appointment scheduling
   - Integrate calendar sync
   - Send email reminders

## Support

For issues or questions:
- Review logs in Azure Portal
- Check Application Insights
- Contact Azure support if needed
