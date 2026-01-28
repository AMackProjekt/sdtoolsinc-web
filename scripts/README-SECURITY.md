# Security & Deployment Scripts for T.O.O.L.S Inc

This directory contains critical scripts for secure deployment and management of the T.O.O.L.S Inc platform.

## 🔐 Security Scripts

### 1. Secure-KeyVault-Setup.ps1
**Purpose**: Automatically set up Azure Key Vault with all necessary secrets and permissions.

**Usage**:
```powershell
# Basic setup
.\Secure-KeyVault-Setup.ps1 -KeyVaultName "toolsinc-kv" -ResourceGroup "toolsinc-rg"

# With example secrets created
.\Secure-KeyVault-Setup.ps1 -KeyVaultName "toolsinc-kv" -ResourceGroup "toolsinc-rg" -CreateSecrets

# Configure for specific Function App
.\Secure-KeyVault-Setup.ps1 -KeyVaultName "toolsinc-kv" -ResourceGroup "toolsinc-rg" -FunctionAppName "toolsinc-api"
```

**What it does**:
- ✓ Creates Azure Key Vault if not exists
- ✓ Configures encryption and access protection
- ✓ Sets up RBAC roles for current user
- ✓ Assigns managed identity permissions for Functions
- ✓ Creates example secrets (if requested)
- ✓ Generates secure random values for sensitive secrets

**Prerequisites**:
- Azure CLI installed (`az --version`)
- Logged in to Azure (`az login`)
- Permissions to create resources in target resource group

---

### 2. Launch-SecurePortals.ps1
**Purpose**: Securely launch Case Manager, Client, and Admin portals with security checks.

**Usage**:
```powershell
# Launch all portals
.\Launch-SecurePortals.ps1

# Launch specific portal
.\Launch-SecurePortals.ps1 -Portal casemgr
.\Launch-SecurePortals.ps1 -Portal client
.\Launch-SecurePortals.ps1 -Portal admin

# Development mode (skip Key Vault check)
.\Launch-SecurePortals.ps1 -Portal all -Dev

# Skip security checks
.\Launch-SecurePortals.ps1 -SkipSecurityCheck
```

**Security Checks Performed**:
- ✓ Scans for exposed secrets in code
- ✓ Verifies .gitignore configuration
- ✓ Checks Azure authentication status
- ✓ Validates Key Vault configuration
- ✓ Confirms environment setup

**Portal Access URLs**:
- Case Manager: `http://localhost:3002`
- Client Portal: `http://localhost:3001`
- Admin Portal: `http://localhost:3000`

---

### 3. Cleanup-FilingFolders.ps1
**Purpose**: Clean up unnecessary files and organize public assets to bare minimum.

**Usage**:
```powershell
# Dry run (see what would be deleted)
.\Cleanup-FilingFolders.ps1 -DryRun:$true

# Perform actual cleanup
.\Cleanup-FilingFolders.ps1 -DryRun:$false

# Without archiving
.\Cleanup-FilingFolders.ps1 -Archive:$false
```

**What it removes**:
- Duplicate logo files (@2x variants)
- Optimized backup versions
- README files from public assets
- Cached/temporary files

**What it keeps**:
- Essential logo files (main, org-logo-1.webp, org-logo-2.webp)
- QR code images
- Partnership logos

---

## 📋 Documentation

### KEYVAULT_SETUP.md
Complete guide for setting up Azure Key Vault with step-by-step instructions:
- Prerequisites and installation
- Creating Key Vault and configuring access
- Adding secrets for database, APIs, and social media
- Local development setup
- Verification and testing
- Best practices and troubleshooting

### SECURITY_CONFIGURATION.md
Comprehensive security configuration guide covering:
- Secrets management strategy
- Environment variable handling
- Authentication and authorization
- Database security
- API security with validation and rate limiting
- Frontend security (CSP, headers, HTTPS)
- Portal-specific security features
- Automation security
- Audit logging
- Deployment security
- Compliance checklist
- Incident response procedures

---

## 🚀 Quick Start: Secure Deployment

### Step 1: Set Up Azure Key Vault
```powershell
.\scripts\Secure-KeyVault-Setup.ps1 `
    -KeyVaultName "toolsinc-kv" `
    -ResourceGroup "toolsinc-rg" `
    -CreateSecrets
```

### Step 2: Configure Environment
```bash
# Copy example files
cp api/.env.vault.example api/.env.vault
cp automation/.env.vault.example automation/.env.vault
cp apps/casemgr-portal/.env.vault.example apps/casemgr-portal/.env.vault
cp apps/client-portal/.env.vault.example apps/client-portal/.env.vault

# Edit with your Key Vault URL
# AZURE_KEYVAULT_URL=https://toolsinc-kv.vault.azure.net/
```

### Step 3: Authenticate with Azure
```bash
az login
```

### Step 4: Launch Portals
```powershell
.\scripts\Launch-SecurePortals.ps1
```

### Step 5: Update Key Vault Secrets
```bash
# Update with real API keys and credentials
az keyvault secret set --vault-name toolsinc-kv --name "openai-api-key" --value "sk-..."
az keyvault secret set --vault-name toolsinc-kv --name "sendgrid-api-key" --value "SG...."
# ... etc for all secrets
```

---

## 🔒 Security Best Practices

### Never Commit Secrets
- `.env` files are in `.gitignore`
- `local.settings.json` is in `.gitignore`
- Pre-commit hooks scan for exposed secrets

### Use Azure Key Vault
- All production secrets stored in Key Vault
- Local development uses Key Vault via Azure CLI
- No secrets in environment files (except Key Vault URL)

### Rotate Secrets Regularly
```bash
# Generate new password
$newPassword = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Update in Key Vault
az keyvault secret set --vault-name toolsinc-kv --name "azure-sql-password" --value $newPassword
```

### Enable Audit Logging
All Azure resources have audit logging enabled via Key Vault diagnostics settings.

### Review Permissions
```bash
# Check role assignments
az role assignment list --scope /subscriptions/{subscriptionId}
```

---

## 🛠️ Installation & Setup

### Install Git Hooks (Optional but Recommended)
```powershell
# Copy pre-commit hook
Copy-Item .git-hooks\pre-commit.ps1 .git\hooks\pre-commit

# Or for bash
Copy-Item .git-hooks\pre-commit .git\hooks\pre-commit
chmod +x .git\hooks\pre-commit
```

The pre-commit hook will:
- Scan staged files for secrets patterns
- Prevent commits of `.env` files
- Catch hardcoded API keys
- Alert on protected files

---

## 📊 Secrets Managed in Key Vault

| Secret Name | Type | Notes |
|------------|------|-------|
| azure-sql-server | Database | SQL Server hostname |
| azure-sql-database | Database | Database name |
| azure-sql-user | Database | DB username |
| azure-sql-password | Database | DB password |
| openai-api-key | API | OpenAI API key |
| sendgrid-api-key | API | SendGrid email service |
| jwt-secret | Security | JWT signing secret |
| automation-twitter-api-key | Social Media | Twitter/X API |
| automation-facebook-api-key | Social Media | Facebook API |
| automation-instagram-api-key | Social Media | Instagram API |
| automation-linkedin-api-key | Social Media | LinkedIn API |

---

## 🔧 Troubleshooting

### Azure CLI Not Installed
```powershell
# Install Azure CLI
choco install azure-cli
# Or download from: https://learn.microsoft.com/cli/azure/install-azure-cli-windows
```

### Not Authenticated to Azure
```bash
az login
# or with specific tenant
az login --tenant <tenant-id>
```

### Key Vault Access Denied
```bash
# Verify you have the right role
az role assignment list --assignee $(az ad signed-in-user show --query id -o tsv)

# Or assign role if missing
az role assignment create \
    --role "Key Vault Secrets Officer" \
    --assignee $(az ad signed-in-user show --query id -o tsv) \
    --scope /subscriptions/{subscriptionId}/resourceGroups/toolsinc-rg/providers/Microsoft.KeyVault/vaults/toolsinc-kv
```

### Pre-commit Hook Not Running
Make sure the hook has execute permissions:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 📚 Additional Resources

- [Azure Key Vault Documentation](https://learn.microsoft.com/azure/key-vault/)
- [Azure Static Web Apps Authentication](https://learn.microsoft.com/azure/static-web-apps/authentication-authorization)
- [Azure Functions Security Best Practices](https://learn.microsoft.com/azure/azure-functions/security-concepts)
- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)

---

## ⚠️ Important Security Notes

1. **Never commit credentials** - The `.gitignore` and pre-commit hooks help prevent this
2. **Rotate secrets regularly** - Quarterly minimum recommended
3. **Review audit logs** - Set up monitoring for suspicious access patterns
4. **Use HTTPS only** - All production deployments enforce HTTPS
5. **Enable MFA** - Especially for admin accounts and Key Vault access
6. **Follow least privilege** - Users/services only get permissions they need

---

## 🆘 Support

For security-related issues or questions:
1. Check the relevant documentation in `/docs`
2. Review the troubleshooting section above
3. Contact the security team or maintainers

**Do not attempt to work around security measures or bypass the pre-commit hooks.**

---

Last Updated: 2026-01-26
