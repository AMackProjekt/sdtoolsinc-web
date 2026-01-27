# Portal Integration Guide

This guide covers the integration of all T.O.O.L.S Inc portals, including the centralized portal hub, custom domain routing, and shared API configuration.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Portal Hub Usage](#portal-hub-usage)
3. [Custom Domain Setup](#custom-domain-setup)
4. [Shared API Configuration](#shared-api-configuration)
5. [Environment Variables](#environment-variables)
6. [Cross-Portal Authentication](#cross-portal-authentication)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

T.O.O.L.S Inc uses a multi-portal architecture with the following components:

### Portal Structure

```
┌─────────────────────────────────────────────────────┐
│           Portal Hub (portal.sdtoolsinc.org)         │
│         Centralized Dashboard & Navigation           │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼─────┐
│Client Portal │  │Staff Portal │  │Admin Portal│
│client.*      │  │staff.*      │  │admin.*     │
└──────────────┘  └─────────────┘  └────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                ┌────────▼────────┐
                │  Shared API     │
                │ api.sdtools*    │
                └─────────────────┘
```

### Key Components

1. **Portal Hub** (`apps/portal-hub/`)
   - Centralized landing page
   - Role-based portal display
   - User dashboard with quick stats

2. **Shared Configuration** (`packages/shared-config/`)
   - API endpoints
   - Portal URLs
   - Environment configuration

3. **Infrastructure** (`infrastructure/`)
   - Azure SWA configurations
   - Domain setup scripts
   - SSL configuration

## Portal Hub Usage

### For End Users

1. **Login**: Navigate to `portal.sdtoolsinc.org`
2. **Authenticate**: Use your credentials to log in
3. **Select Portal**: Click on any portal card you have access to
4. **Navigate**: The hub automatically shows only portals you're authorized to use

### Role-Based Access

The portal hub displays different portals based on user roles:

| Role | Available Portals |
|------|------------------|
| `client` | Client Portal, Learning Hub |
| `case_manager` | Staff Portal, Learning Hub, Reports |
| `admin` | All Portals |
| `auditor` | Reports & Analytics (read-only) |

### Quick Statistics

The hub dashboard shows:
- **Active Clients**: Number of clients currently assigned
- **Completed Tasks**: Tasks completed this period
- **Hours Logged**: Time logged this month

## Custom Domain Setup

### Prerequisites

- Azure subscription with Static Web Apps enabled
- Domain ownership and DNS management access
- Azure CLI installed

### Step-by-Step Setup

#### 1. Create Azure Static Web Apps

```bash
# Set variables
RESOURCE_GROUP="toolsinc-rg"
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create static web apps for each portal
az staticwebapp create \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

az staticwebapp create \
  --name toolsinc-client-portal \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Repeat for: toolsinc-casemgr-portal, toolsinc-admin-portal, toolsinc-portal-hub
```

#### 2. Run Domain Setup Script

```bash
cd infrastructure/scripts
./setup-domains.sh
```

Or manually add domains:

```bash
# Add custom domain
az staticwebapp hostname set \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --hostname www.sdtoolsinc.org

# Verify domain
az staticwebapp hostname show \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --hostname www.sdtoolsinc.org
```

#### 3. Configure DNS Records

Add CNAME records in your DNS provider:

```dns
www.sdtoolsinc.org      CNAME   gentle-ocean-xyz.azurestaticapps.net
client.sdtoolsinc.org   CNAME   brave-river-abc.azurestaticapps.net
staff.sdtoolsinc.org    CNAME   proud-forest-def.azurestaticapps.net
admin.sdtoolsinc.org    CNAME   calm-mountain-ghi.azurestaticapps.net
portal.sdtoolsinc.org   CNAME   happy-valley-jkl.azurestaticapps.net
```

Get SWA hostnames:

```bash
az staticwebapp show --name toolsinc-web --resource-group toolsinc-rg --query defaultHostname -o tsv
```

#### 4. Verify SSL Certificates

SSL certificates are automatically provisioned. Check status:

```bash
./setup-ssl.sh
```

## Shared API Configuration

### Using the Shared Package

The `@toolsinc/shared-config` package provides centralized configuration:

```typescript
import { API_ENDPOINTS, PORTAL_URLS, ENV } from '@toolsinc/shared-config'

// Use API endpoints
const response = await fetch(API_ENDPOINTS.USERS.ME)

// Navigate to another portal
import { redirectToPortal } from '@toolsinc/shared-config'
redirectToPortal('client', '/dashboard')

// Access environment variables
if (ENV.ENABLE_RBAC) {
  // RBAC is enabled
}
```

### API Endpoints

All API endpoints are defined in `packages/shared-config/src/api-config.ts`:

```typescript
// Authentication
API_ENDPOINTS.AUTH.LOGIN
API_ENDPOINTS.AUTH.LOGOUT
API_ENDPOINTS.AUTH.SIGNUP

// Users
API_ENDPOINTS.USERS.ME
API_ENDPOINTS.USERS.GET(userId)
API_ENDPOINTS.USERS.UPDATE(userId)

// Clients
API_ENDPOINTS.CLIENTS.LIST
API_ENDPOINTS.CLIENTS.GET(clientId)
API_ENDPOINTS.CLIENTS.NOTES(clientId)

// And more...
```

### Portal URLs

Access portal URLs programmatically:

```typescript
import { PORTAL_URLS } from '@toolsinc/shared-config'

console.log(PORTAL_URLS.main)      // https://www.sdtoolsinc.org
console.log(PORTAL_URLS.client)    // https://client.sdtoolsinc.org
console.log(PORTAL_URLS.hub)       // https://portal.sdtoolsinc.org
```

## Environment Variables

### Required Variables

Create a `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

### Critical Variables

```env
# Portal URLs
NEXT_PUBLIC_MAIN_URL=https://www.sdtoolsinc.org
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://client.sdtoolsinc.org
NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://staff.sdtoolsinc.org
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.sdtoolsinc.org
NEXT_PUBLIC_HUB_URL=https://portal.sdtoolsinc.org

# API Configuration
NEXT_PUBLIC_API_URL=https://api.sdtoolsinc.org

# NextAuth
NEXTAUTH_URL=https://portal.sdtoolsinc.org
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Database
DB_CONNECTION_STRING=<your-azure-sql-connection-string>
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Example output:
# x9Y2mK8pQ3rT5vN1wL7cH4bA6sD9fG2j
```

## Cross-Portal Authentication

### Session Sharing

All portals share the same authentication cookie domain:

```typescript
// Set cookie for .sdtoolsinc.org
document.cookie = `toolsinc_session=${token}; domain=.sdtoolsinc.org; secure; samesite=strict`
```

### Authentication Flow

1. **User logs in** at any portal or the hub
2. **Session cookie is set** for `.sdtoolsinc.org`
3. **All subdomains** can read the session cookie
4. **Token is validated** on each portal separately
5. **User data is fetched** from the API

### Implementing Authentication

```typescript
// In your portal app
import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '@toolsinc/shared-config'

function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(API_ENDPOINTS.USERS.ME, {
      credentials: 'include', // Important for cookies
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => {
        // Redirect to login
        window.location.href = '/auth/login'
      })
  }, [])

  return { user }
}
```

### CORS Configuration

Configure your API backend to allow cross-origin requests:

```javascript
// Express.js example
app.use(cors({
  origin: [
    'https://www.sdtoolsinc.org',
    'https://client.sdtoolsinc.org',
    'https://staff.sdtoolsinc.org',
    'https://admin.sdtoolsinc.org',
    'https://portal.sdtoolsinc.org',
  ],
  credentials: true,
}))
```

## Deployment Guide

### Deploying Portal Hub

```bash
cd apps/portal-hub

# Install dependencies
npm install

# Build
npm run build

# Deploy to Azure SWA
az staticwebapp upload \
  --name toolsinc-portal-hub \
  --resource-group toolsinc-rg \
  --app-location out
```

### CI/CD with GitHub Actions

The repository includes GitHub Actions workflows for automatic deployment:

```yaml
# .github/workflows/deploy-portal-hub.yml
name: Deploy Portal Hub

on:
  push:
    branches: [main]
    paths:
      - 'apps/portal-hub/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "apps/portal-hub"
          output_location: "out"
```

## Troubleshooting

### Common Issues

#### Portal Hub Not Loading

**Symptoms**: Blank page or loading spinner indefinitely

**Solutions**:
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Ensure user is authenticated
4. Check CORS configuration

#### Custom Domain Not Working

**Symptoms**: Domain shows "Not Found" or fails to load

**Solutions**:
1. Verify DNS records: `nslookup www.sdtoolsinc.org`
2. Wait 24-48 hours for DNS propagation
3. Check domain validation status in Azure Portal
4. Ensure CNAME points to correct SWA hostname

#### SSL Certificate Not Provisioning

**Symptoms**: Browser shows "Not Secure" warning

**Solutions**:
1. Verify domain is validated first
2. Wait 5-10 minutes for certificate provisioning
3. Run `./infrastructure/scripts/setup-ssl.sh` to check status
4. Contact Azure support if issue persists

#### Cross-Portal Authentication Failing

**Symptoms**: Users are logged out when navigating between portals

**Solutions**:
1. Ensure cookie domain is set to `.sdtoolsinc.org`
2. Verify CORS is configured correctly
3. Check that all portals use HTTPS
4. Ensure `credentials: 'include'` in fetch requests

#### Role-Based Access Not Working

**Symptoms**: Users see wrong portals or access denied errors

**Solutions**:
1. Verify user roles are correctly set in database
2. Check role mappings in `lib/portal-config.ts`
3. Clear browser cache and cookies
4. Test with different user accounts

### Debug Mode

Enable debug logging in the portal hub:

```typescript
// In app/page.tsx
useEffect(() => {
  console.log('User data:', user)
  console.log('Available portals:', availablePortals)
}, [user, availablePortals])
```

### Health Checks

Create health check endpoints:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
}
```

Test with:

```bash
curl https://portal.sdtoolsinc.org/api/health
```

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## Support

For issues or questions:

- **Email**: support@sdtoolsinc.org
- **Documentation**: https://docs.sdtoolsinc.org
- **GitHub Issues**: Create an issue in the repository
