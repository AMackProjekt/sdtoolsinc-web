# Azure DNS Configuration Status

**Last Updated:** January 26, 2026

## Azure Resources

- **Static Web App:** sdtoolsinc
- **Resource Group:** sdtoolsinc_group-a7cd
- **Default Hostname:** blue-desert-08d808f10.1.azurestaticapps.net
- **DNS Zone:** sdtoolsinc.org

## Azure DNS Nameservers ✅

Update your domain registrar to use these nameservers:

```
ns1-09.azure-dns.com
ns2-09.azure-dns.net
ns3-09.azure-dns.org
ns4-09.azure-dns.info
```

## CNAME Records Created ✅

All CNAME records have been successfully created in Azure DNS:

| Subdomain | CNAME Target | Status |
|-----------|--------------|--------|
| www | blue-desert-08d808f10.1.azurestaticapps.net | ✅ Succeeded |
| client | blue-desert-08d808f10.1.azurestaticapps.net | ✅ Succeeded |
| staff | blue-desert-08d808f10.1.azurestaticapps.net | ✅ Succeeded |
| admin | blue-desert-08d808f10.1.azurestaticapps.net | ✅ Succeeded |
| portal | blue-desert-08d808f10.1.azurestaticapps.net | ✅ Succeeded |

## Custom Domains in Static Web App

| Domain | Status |
|--------|--------|
| sdtoolsinc.org | ✅ Ready |
| www.sdtoolsinc.org | ✅ Ready |
| client.sdtoolsinc.org | ⏳ Pending DNS Propagation |
| staff.sdtoolsinc.org | ⏳ Pending DNS Propagation |
| admin.sdtoolsinc.org | ⏳ Pending DNS Propagation |
| portal.sdtoolsinc.org | ⏳ Pending DNS Propagation |

## Next Steps

### 1. Update Domain Registrar Nameservers ⏳

Log into your domain registrar and update sdtoolsinc.org nameservers to Azure DNS.

### 2. Wait for DNS Propagation (5 mins - 48 hours)

Check propagation status:
```bash
nslookup client.sdtoolsinc.org
nslookup staff.sdtoolsinc.org
nslookup admin.sdtoolsinc.org
nslookup portal.sdtoolsinc.org
```

Or use: https://dnschecker.org

### 3. Add Custom Domains to Static Web App

After DNS propagation completes, run:

```powershell
# Add client portal domain
az staticwebapp hostname set `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --hostname client.sdtoolsinc.org

# Add staff portal domain
az staticwebapp hostname set `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --hostname staff.sdtoolsinc.org

# Add admin portal domain
az staticwebapp hostname set `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --hostname admin.sdtoolsinc.org

# Add portal hub domain
az staticwebapp hostname set `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --hostname portal.sdtoolsinc.org
```

### 4. Verify SSL Certificates

Azure automatically provisions SSL certificates. Verify status:

```powershell
az staticwebapp hostname list `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --output table
```

Expected SSL State: **Ready** (may take 5-10 minutes after domain validation)

## Verification Commands

### Check DNS Zone Records
```powershell
az network dns record-set cname list `
  --resource-group sdtoolsinc_group-a7cd `
  --zone-name sdtoolsinc.org `
  --output table
```

### Check Static Web App Domains
```powershell
az staticwebapp hostname list `
  --name sdtoolsinc `
  --resource-group sdtoolsinc_group-a7cd `
  --output table
```

### Test DNS Resolution
```powershell
nslookup www.sdtoolsinc.org
nslookup client.sdtoolsinc.org
nslookup staff.sdtoolsinc.org
nslookup admin.sdtoolsinc.org
nslookup portal.sdtoolsinc.org
```

## Troubleshooting

### CNAME Record Invalid Error

**Cause:** DNS records not yet propagated globally

**Solution:**
1. Verify nameservers are updated at domain registrar
2. Wait 15-30 minutes for propagation
3. Check DNS with: `nslookup subdomain.sdtoolsinc.org`
4. Retry domain addition command

### SSL Certificate Not Provisioning

**Cause:** Domain validation incomplete

**Solution:**
1. Ensure CNAME points to correct Azure hostname
2. Wait 5-10 minutes after domain validation
3. Check status: `az staticwebapp hostname show`
4. Delete and re-add domain if stuck

### Domain Not Resolving

**Cause:** Nameservers not updated or propagation incomplete

**Solution:**
1. Verify nameservers at registrar match Azure DNS
2. Check propagation: https://dnschecker.org
3. Clear DNS cache: `ipconfig /flushdns`
4. Wait up to 48 hours (usually < 1 hour)

## Support Resources

- [Azure DNS Documentation](https://learn.microsoft.com/azure/dns/)
- [Azure Static Web Apps Custom Domains](https://learn.microsoft.com/azure/static-web-apps/custom-domain)
- [DNS Checker Tool](https://dnschecker.org)
- [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
