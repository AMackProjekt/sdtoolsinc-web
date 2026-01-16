# T.O.O.L.S Inc Portal Application

Separate Azure Static Web App for authenticated client portal.

## Architecture
- **Frontend**: Next.js 14 (Static Export)
- **Authentication**: Azure Entra ID (via SWA)
- **Backend API**: Shared with main site (Azure Functions)
- **Database**: Azure SQL Database
- **Deployment**: Azure Static Web Apps (portal subdomain)

## Local Development

1. Install dependencies:
```bash
cd portal-app
npm install
```

2. Run dev server:
```bash
npm run dev
```

3. Visit: http://localhost:3001

## Azure Setup Required

### 1. Create Azure Static Web App for Portal
```bash
az staticwebapp create \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --location eastus \
  --sku Standard
```

### 2. Configure Custom Domain (Optional)
Set up portal.sdtoolsinc.org to point to the SWA.

### 3. Configure Azure Entra ID App Registration
1. Go to Azure Portal > Entra ID > App Registrations
2. Create new registration for portal
3. Add redirect URI: https://portal.sdtoolsinc.org/.auth/login/aad/callback
4. Copy Client ID and create Client Secret
5. Add to SWA Configuration:
   - AAD_CLIENT_ID: Your application ID
   - AAD_CLIENT_SECRET: Your client secret

### 4. Configure Azure SQL Connection
Update backend API environment variables:
```bash
az staticwebapp appsettings set \
  --name toolsinc-swa \
  --setting-names \
    AZURE_SQL_SERVER=your-server.database.windows.net \
    AZURE_SQL_DATABASE=toolsinc-db \
    AZURE_SQL_USER=your-username \
    AZURE_SQL_PASSWORD=your-password
```

### 5. Add GitHub Secret for Deployment
Add AZURE_PORTAL_SWA_TOKEN to repository secrets with the deployment token from:
```bash
az staticwebapp secrets list --name toolsinc-portal --resource-group toolsinc-rg
```

## Features
- ✅ Azure Entra ID authentication
- ✅ User profile management
- ✅ Progress tracking
- ✅ Resource access
- ✅ Integration with Azure SQL backend
- ✅ Secure API communication

## API Integration
Portal connects to backend API at:
- Production: https://blue-desert-08d808f10.azurestaticapps.net/api
- Endpoints: /v1/users, /v1/progress, etc.
