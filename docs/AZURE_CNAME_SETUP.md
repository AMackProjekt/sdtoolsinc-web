# Azure CNAME Setup Guide

Complete guide for configuring custom domains with CNAME records for T.O.O.L.S Inc portals on Azure Static Web Apps.

## Overview

T.O.O.L.S Inc uses multiple subdomains for different portals:

| Portal | Domain | Purpose |
|--------|--------|---------|
| Main Website | `www.sdtoolsinc.org` | Public website and landing page |
| Client Portal | `client.sdtoolsinc.org` | Client self-service portal |
| Case Manager Portal | `staff.sdtoolsinc.org` | Staff management interface |
| Admin Portal | `admin.sdtoolsinc.org` | Administrative oversight |
| Portal Hub | `portal.sdtoolsinc.org` | Centralized portal selector |

## Prerequisites

- ✅ Azure subscription with Static Web Apps created
- ✅ Domain ownership (sdtoolsinc.org)
- ✅ DNS management access (Azure DNS, GoDaddy, Namecheap, etc.)
- ✅ Azure CLI installed (`az --version`)

## Step 1: Get Azure Static Web App Hostnames

First, retrieve the default Azure hostnames for each portal:

```bash
# Set resource group
RESOURCE_GROUP="toolsinc-rg"

# Get main website hostname
az staticwebapp show \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv

# Get client portal hostname
az staticwebapp show \
  --name toolsinc-client-portal \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv

# Get case manager portal hostname
az staticwebapp show \
  --name toolsinc-casemgr-portal \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv

# Get admin portal hostname
az staticwebapp show \
  --name toolsinc-admin-portal \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv

# Get portal hub hostname
az staticwebapp show \
  --name toolsinc-portal-hub \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv
```

**Example Output:**
```
gentle-ocean-123abc.azurestaticapps.net
brave-river-456def.azurestaticapps.net
proud-forest-789ghi.azurestaticapps.net
calm-mountain-012jkl.azurestaticapps.net
happy-valley-345mno.azurestaticapps.net
```

## Step 2: Add Custom Domains in Azure

Use Azure CLI to add custom domains to each Static Web App:

```bash
# Main website
az staticwebapp hostname set \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname www.sdtoolsinc.org

az staticwebapp hostname set \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname sdtoolsinc.org

# Client portal
az staticwebapp hostname set \
  --name toolsinc-client-portal \
  --resource-group $RESOURCE_GROUP \
  --hostname client.sdtoolsinc.org

# Case manager portal
az staticwebapp hostname set \
  --name toolsinc-casemgr-portal \
  --resource-group $RESOURCE_GROUP \
  --hostname staff.sdtoolsinc.org

# Admin portal
az staticwebapp hostname set \
  --name toolsinc-admin-portal \
  --resource-group $RESOURCE_GROUP \
  --hostname admin.sdtoolsinc.org

# Portal hub
az staticwebapp hostname set \
  --name toolsinc-portal-hub \
  --resource-group $RESOURCE_GROUP \
  --hostname portal.sdtoolsinc.org
```

**Or use the automated script:**

```bash
cd infrastructure/scripts
chmod +x setup-domains.sh
./setup-domains.sh
```

## Step 3: Configure CNAME Records in DNS

### Option A: Azure DNS

If using Azure DNS:

```bash
# Create DNS zone (if not exists)
az network dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name sdtoolsinc.org

# Add CNAME records
az network dns record-set cname set-record \
  --resource-group $RESOURCE_GROUP \
  --zone-name sdtoolsinc.org \
  --record-set-name www \
  --cname gentle-ocean-123abc.azurestaticapps.net

az network dns record-set cname set-record \
  --resource-group $RESOURCE_GROUP \
  --zone-name sdtoolsinc.org \
  --record-set-name client \
  --cname brave-river-456def.azurestaticapps.net

az network dns record-set cname set-record \
  --resource-group $RESOURCE_GROUP \
  --zone-name sdtoolsinc.org \
  --record-set-name staff \
  --cname proud-forest-789ghi.azurestaticapps.net

az network dns record-set cname set-record \
  --resource-group $RESOURCE_GROUP \
  --zone-name sdtoolsinc.org \
  --record-set-name admin \
  --cname calm-mountain-012jkl.azurestaticapps.net

az network dns record-set cname set-record \
  --resource-group $RESOURCE_GROUP \
  --zone-name sdtoolsinc.org \
  --record-set-name portal \
  --cname happy-valley-345mno.azurestaticapps.net
```

### Option B: External DNS Provider (GoDaddy, Namecheap, etc.)

Log in to your DNS provider and add the following CNAME records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | gentle-ocean-123abc.azurestaticapps.net | 3600 |
| CNAME | client | brave-river-456def.azurestaticapps.net | 3600 |
| CNAME | staff | proud-forest-789ghi.azurestaticapps.net | 3600 |
| CNAME | admin | calm-mountain-012jkl.azurestaticapps.net | 3600 |
| CNAME | portal | happy-valley-345mno.azurestaticapps.net | 3600 |

**Replace the Azure hostnames with your actual values from Step 1!**

#### GoDaddy Instructions:
1. Go to DNS Management for sdtoolsinc.org
2. Click "Add" → Select "CNAME"
3. Enter Name: `www`
4. Enter Value: `gentle-ocean-123abc.azurestaticapps.net`
5. Set TTL: 1 hour (3600 seconds)
6. Save
7. Repeat for other subdomains

#### Namecheap Instructions:
1. Go to Domain List → Manage → Advanced DNS
2. Click "Add New Record" → Select "CNAME Record"
3. Host: `www`
4. Target: `gentle-ocean-123abc.azurestaticapps.net`
5. TTL: Automatic
6. Save
7. Repeat for other subdomains

#### Cloudflare Instructions:
1. Go to DNS → Records
2. Click "Add record"
3. Type: CNAME
4. Name: `www`
5. Target: `gentle-ocean-123abc.azurestaticapps.net`
6. Proxy status: DNS only (gray cloud, not proxied)
7. Save
8. Repeat for other subdomains

## Step 4: Verify DNS Propagation

Check if DNS records are propagating:

```bash
# Check CNAME records
nslookup www.sdtoolsinc.org
nslookup client.sdtoolsinc.org
nslookup staff.sdtoolsinc.org
nslookup admin.sdtoolsinc.org
nslookup portal.sdtoolsinc.org

# Or use dig
dig www.sdtoolsinc.org CNAME +short
dig client.sdtoolsinc.org CNAME +short
```

**Expected Output:**
```
www.sdtoolsinc.org     → gentle-ocean-123abc.azurestaticapps.net
client.sdtoolsinc.org  → brave-river-456def.azurestaticapps.net
```

**DNS Propagation Time:** 5 minutes to 48 hours (usually < 1 hour)

### Online Tools:
- https://dnschecker.org
- https://whatsmydns.net
- https://mxtoolbox.com/DNSLookup.aspx

## Step 5: Verify Custom Domain Status in Azure

Check domain validation status:

```bash
# Verify www.sdtoolsinc.org
az staticwebapp hostname show \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname www.sdtoolsinc.org

# Check all domains
az staticwebapp hostname list \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP
```

**Expected Output:**
```json
{
  "domainName": "www.sdtoolsinc.org",
  "sslState": "Ready",
  "validationToken": null
}
```

## Step 6: SSL Certificate Provisioning

Azure Static Web Apps automatically provisions free SSL certificates via managed certificates.

### Check SSL Status:

```bash
./infrastructure/scripts/setup-ssl.sh
```

Or manually:

```bash
az staticwebapp hostname show \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname www.sdtoolsinc.org \
  --query "sslState" -o tsv
```

**SSL States:**
- `Ready` - Certificate active ✅
- `InProgress` - Certificate provisioning (wait 5-10 minutes)
- `Failed` - Check domain validation

### Force SSL Certificate Renewal (if needed):

```bash
az staticwebapp hostname delete \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname www.sdtoolsinc.org

az staticwebapp hostname set \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --hostname www.sdtoolsinc.org
```

## Step 7: Update Application Configuration

Update environment variables and redirect URIs:

### Azure Entra ID Redirect URIs:
1. Go to Azure Portal → Entra ID → App Registrations
2. Select your app registration
3. Go to Authentication → Redirect URIs
4. Add:
   - `https://www.sdtoolsinc.org/.auth/login/aad/callback`
   - `https://client.sdtoolsinc.org/.auth/login/aad/callback`
   - `https://staff.sdtoolsinc.org/.auth/login/aad/callback`
   - `https://admin.sdtoolsinc.org/.auth/login/aad/callback`
   - `https://portal.sdtoolsinc.org/.auth/login/aad/callback`

### Update Environment Variables:

```bash
# Update API base URLs
az staticwebapp appsettings set \
  --name toolsinc-web \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    NEXT_PUBLIC_API_BASE=https://www.sdtoolsinc.org/api \
    NEXT_PUBLIC_CLIENT_PORTAL_URL=https://client.sdtoolsinc.org \
    NEXT_PUBLIC_CASEMGR_PORTAL_URL=https://staff.sdtoolsinc.org \
    NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.sdtoolsinc.org \
    NEXT_PUBLIC_HUB_URL=https://portal.sdtoolsinc.org
```

## Step 8: Test Custom Domains

Visit each portal and verify:

1. ✅ **Main Site**: https://www.sdtoolsinc.org
2. ✅ **Client Portal**: https://client.sdtoolsinc.org
3. ✅ **Case Manager Portal**: https://staff.sdtoolsinc.org
4. ✅ **Admin Portal**: https://admin.sdtoolsinc.org
5. ✅ **Portal Hub**: https://portal.sdtoolsinc.org

### Checklist:
- [ ] Page loads without errors
- [ ] HTTPS (green padlock) is active
- [ ] No mixed content warnings
- [ ] Authentication redirects work
- [ ] API calls use correct domain

## Troubleshooting

### Domain Not Validating

**Issue:** Custom domain stuck in "Validating" state

**Solutions:**
1. Verify CNAME record is correct: `nslookup www.sdtoolsinc.org`
2. Wait 24-48 hours for DNS propagation
3. Ensure CNAME points to exact Azure hostname (no typos)
4. Check for conflicting A records (delete if exists)
5. Try using different DNS service (e.g., Cloudflare)

### SSL Certificate Not Provisioning

**Issue:** `sslState: InProgress` or `Failed`

**Solutions:**
1. Ensure domain is validated first (CNAME must be correct)
2. Wait 5-10 minutes for automatic provisioning
3. Check Azure Service Health for outages
4. Delete and re-add custom domain
5. Contact Azure support if persists > 24 hours

### CNAME Already Exists Error

**Issue:** "CNAME record already exists" when adding domain

**Solutions:**
1. Check if domain is added to different Static Web App
2. Remove domain from old app first
3. Verify DNS records don't point to multiple targets
4. Use `az staticwebapp hostname delete` to clean up

### 404 Not Found After Adding Domain

**Issue:** Custom domain shows 404 error

**Solutions:**
1. Verify app is deployed: `az staticwebapp show`
2. Check `staticwebapp.config.json` has correct `navigationFallback`
3. Clear browser cache and cookies
4. Test in incognito mode
5. Check Azure Portal for deployment errors

### Mixed Content Warnings

**Issue:** Browser shows "Not Secure" despite HTTPS

**Solutions:**
1. Update all API URLs to use `https://`
2. Check `<script>` and `<link>` tags use HTTPS
3. Update environment variables to use custom domains
4. Ensure no hardcoded `http://` references in code

### Authentication Redirect Fails

**Issue:** Login redirect fails or shows error

**Solutions:**
1. Update Entra ID redirect URIs (Step 7)
2. Verify `AAD_CLIENT_ID` and `AAD_CLIENT_SECRET` are set
3. Check `staticwebapp.config.json` auth configuration
4. Test with original Azure hostname first
5. Review Azure Static Web Apps authentication logs

## Quick Reference Commands

```bash
# Get all SWA hostnames
for app in toolsinc-web toolsinc-client-portal toolsinc-casemgr-portal toolsinc-admin-portal toolsinc-portal-hub; do
  echo "$app:"
  az staticwebapp show --name $app --resource-group toolsinc-rg --query defaultHostname -o tsv
done

# Check all custom domains
az staticwebapp hostname list --name toolsinc-web --resource-group toolsinc-rg --output table

# Force refresh domain validation
az staticwebapp hostname delete --name toolsinc-web --resource-group toolsinc-rg --hostname www.sdtoolsinc.org
az staticwebapp hostname set --name toolsinc-web --resource-group toolsinc-rg --hostname www.sdtoolsinc.org

# Test DNS propagation
for domain in www.sdtoolsinc.org client.sdtoolsinc.org staff.sdtoolsinc.org admin.sdtoolsinc.org portal.sdtoolsinc.org; do
  echo "Testing $domain:"
  nslookup $domain
done
```

## Security Best Practices

1. ✅ **Always use HTTPS** - Azure provisions free SSL certificates
2. ✅ **Enable HSTS** - Add `Strict-Transport-Security` header in `staticwebapp.config.json`
3. ✅ **Use DNS CAA records** - Prevent unauthorized certificate issuance
4. ✅ **Enable DDoS protection** - Configure in Azure Portal
5. ✅ **Monitor certificate expiration** - Azure auto-renews, but monitor logs
6. ✅ **Use Cloudflare** (optional) - Additional DDoS protection and CDN

## Additional Resources

- [Azure Static Web Apps Custom Domains](https://docs.microsoft.com/azure/static-web-apps/custom-domain)
- [Azure DNS Documentation](https://docs.microsoft.com/azure/dns/)
- [SSL Certificate Management](https://docs.microsoft.com/azure/static-web-apps/custom-domain#ssl-certificates)
- [DNS Propagation Checker](https://dnschecker.org)

## Support

For issues with domain configuration:
1. Check Azure Portal → Static Web Apps → Custom domains
2. Review Azure Service Health dashboard
3. Open support ticket via Azure Portal
4. Email: support@sdtoolsinc.org
