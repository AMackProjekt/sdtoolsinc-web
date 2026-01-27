# Azure Static Web Apps Configuration

This directory contains configuration files for deploying T.O.O.L.S Inc portals to Azure Static Web Apps with custom domains and routing rules.

## Overview

T.O.O.L.S Inc uses multiple Azure Static Web Apps for different portals:

- **Main Website** (`www.sdtoolsinc.org`) - Public website and landing pages
- **Client Portal** (`client.sdtoolsinc.org`) - Client-facing portal
- **Case Manager Portal** (`staff.sdtoolsinc.org`) - Staff portal
- **Admin Portal** (`admin.sdtoolsinc.org`) - Administrative portal
- **Portal Hub** (`portal.sdtoolsinc.org`) - Centralized portal dashboard

## Configuration Files

### `main-site.json`
Configuration for the main website with redirects to specialized portals.

**Features:**
- Redirects `/admin`, `/client`, `/staff` to respective portals
- Public access to most routes
- Security headers (X-Frame-Options, CSP, etc.)

### `client-portal.json`
Configuration for the client portal with authentication requirements.

**Features:**
- Requires authentication for all routes except `/auth/*`
- Redirects unauthorized users to login
- CORS and security headers configured

### `casemgr-portal.json`
Configuration for the case manager (staff) portal.

**Features:**
- Requires `case_manager` or `admin` role
- Protected API routes
- Forbidden (403) error handling

### `admin-portal.json`
Configuration for the admin portal with strictest security.

**Features:**
- Requires `admin` role for all routes
- Enhanced security headers
- CSP restrictions
- No inline scripts allowed (except style)

### `portal-hub.json`
Configuration for the centralized portal hub.

**Features:**
- Requires authentication
- Routes users to appropriate portals
- Session-based access control

## Setup Instructions

### Prerequisites

1. Azure CLI installed and configured
2. Azure subscription with Static Web Apps enabled
3. Domain name configured in Azure DNS or external DNS provider

### Step 1: Deploy Static Web Apps

Each portal should be deployed as a separate Azure Static Web App:

```bash
# Create resource group
az group create --name toolsinc-rg --location eastus

# Deploy main website
az staticwebapp create \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --location eastus

# Deploy client portal
az staticwebapp create \
  --name toolsinc-client-portal \
  --resource-group toolsinc-rg \
  --location eastus

# Repeat for other portals...
```

### Step 2: Configure Custom Domains

Run the domain setup script:

```bash
cd infrastructure/scripts
chmod +x setup-domains.sh
./setup-domains.sh
```

Or manually add domains:

```bash
az staticwebapp hostname set \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --hostname www.sdtoolsinc.org
```

### Step 3: Configure DNS Records

Add CNAME records in your DNS provider:

```
www.sdtoolsinc.org      CNAME   [swa-hostname].azurestaticapps.net
client.sdtoolsinc.org   CNAME   [swa-hostname].azurestaticapps.net
staff.sdtoolsinc.org    CNAME   [swa-hostname].azurestaticapps.net
admin.sdtoolsinc.org    CNAME   [swa-hostname].azurestaticapps.net
portal.sdtoolsinc.org   CNAME   [swa-hostname].azurestaticapps.net
```

Get the SWA hostname:

```bash
az staticwebapp show \
  --name toolsinc-web \
  --resource-group toolsinc-rg \
  --query defaultHostname -o tsv
```

### Step 4: Apply Configuration Files

Copy the appropriate `staticwebapp.config.json` file to each portal's root directory:

```bash
# For main website
cp infrastructure/azure-swa-config/main-site.json ./staticwebapp.config.json

# For client portal
cp infrastructure/azure-swa-config/client-portal.json apps/client-portal/staticwebapp.config.json

# Repeat for other portals...
```

### Step 5: Configure SSL

SSL certificates are automatically provisioned by Azure Static Web Apps. Check status:

```bash
./infrastructure/scripts/setup-ssl.sh
```

## Security Considerations

### Authentication

All portals except the main website require authentication:

- Implement Azure AD B2C or custom authentication
- Configure `/.auth/login` endpoints
- Set up role-based access control (RBAC)

### Headers

Security headers are configured in each JSON file:

- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **Content-Security-Policy**: Restricts resource loading
- **Referrer-Policy**: Controls referrer information

### CORS

For cross-portal communication, configure CORS in your API backend to allow:

```
Access-Control-Allow-Origin: https://*.sdtoolsinc.org
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### Domain Not Validating

1. Check DNS propagation: `nslookup www.sdtoolsinc.org`
2. Wait 24-48 hours for DNS changes
3. Verify CNAME record points to correct SWA hostname

### SSL Certificate Issues

1. Ensure domain is validated first
2. Certificate provisioning takes 5-10 minutes
3. Check status with `setup-ssl.sh` script

### 401/403 Errors

1. Verify authentication is configured
2. Check role assignments in Azure AD
3. Review route rules in `staticwebapp.config.json`

### Routing Issues

1. Clear browser cache and cookies
2. Test in incognito mode
3. Verify `navigationFallback` is configured
4. Check for conflicting route rules

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Custom Domains Guide](https://docs.microsoft.com/azure/static-web-apps/custom-domain)
- [Authentication & Authorization](https://docs.microsoft.com/azure/static-web-apps/authentication-authorization)
- [Configuration Reference](https://docs.microsoft.com/azure/static-web-apps/configuration)
