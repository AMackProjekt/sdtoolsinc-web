# Security Configuration Guide for T.O.O.L.S Inc

## Overview
This guide outlines all security measures implemented across the T.O.O.L.S Inc platform to protect sensitive data, manage credentials securely, and maintain compliance standards.

## 1. Secrets Management - Azure Key Vault

### 1.1 Implementation
All API keys, database credentials, and sensitive configuration are stored in **Azure Key Vault**, not in code or environment files.

**Files involved:**
- `api/src/shared/keyvault.ts` - Key Vault client and retrieval functions
- `api/.env.vault.example` - Configuration template
- `automation/.env.vault.example` - Automation secrets template
- `apps/casemgr-portal/.env.vault.example` - Case Manager secrets template
- `apps/client-portal/.env.vault.example` - Client Portal secrets template

### 1.2 Supported Secrets
The system manages the following secret types:

#### Database Credentials
```
azure-sql-server        → SQL Server hostname
azure-sql-database      → Database name
azure-sql-user          → Database username
azure-sql-password      → Database password
```

#### API Keys
```
openai-api-key          → OpenAI API key
sendgrid-api-key        → SendGrid email service
jwt-secret              → JWT signing secret
```

#### Social Media Automation
```
automation-twitter-api-key
automation-facebook-api-key
automation-instagram-api-key
automation-linkedin-api-key
automation-tiktok-api-key
```

### 1.3 Setup Instructions
1. Run setup script:
   ```powershell
   .\scripts\Secure-KeyVault-Setup.ps1 -KeyVaultName "toolsinc-kv" -ResourceGroup "toolsinc-rg" -CreateSecrets
   ```

2. Copy the Key Vault URL to all `.env.vault` files:
   ```
   AZURE_KEYVAULT_URL=https://toolsinc-kv.vault.azure.net/
   ```

3. Authenticate with Azure:
   ```bash
   az login
   ```

4. Verify access:
   ```bash
   az keyvault secret list --vault-name toolsinc-kv
   ```

## 2. Environment Variable Management

### 2.1 Local Development
Use `.env.vault` files (NOT committed to git):
```bash
# Copy example
cp api/.env.vault.example api/.env.vault

# Edit with your Key Vault URL only
AZURE_KEYVAULT_URL=https://your-keyvault.vault.azure.net/
```

### 2.2 Production
**Never** use environment files in production. Use:
- Azure Key Vault (primary)
- Azure Static Web Apps configuration (for public settings)
- Managed Identities for authentication

### 2.3 .gitignore Configuration
Ensure these are ignored from version control:
```
.env
.env.local
.env.production
.env.*.local
local.settings.json
secrets.json
*.key
*.pem
credentials.json
```

## 3. Azure Authentication Methods

### 3.1 Development
Use `DefaultAzureCredential` which supports:
1. Environment variables (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`)
2. Azure CLI login (`az login`)
3. Visual Studio sign-in
4. Azure PowerShell sign-in

### 3.2 Azure Functions (Production)
Use **Managed Identity**:
```typescript
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);
```

Functions automatically authenticate using their system-assigned managed identity (no keys required).

### 3.3 Static Web Apps
Use **Static Web Apps Built-in Auth** with **Azure Entra ID**:
- All requests include `x-ms-client-principal` header
- Portal apps can read user identity from request
- Backend validates against Entra ID

## 4. Database Security

### 4.1 SQL Database Configuration
```sql
-- Enable Transparent Data Encryption (TDE)
-- Enable Always Encrypted for sensitive columns
-- Configure firewall rules to Azure services only
-- Use Azure AD authentication for access control
```

### 4.2 Connection String Management
**Never** hardcode connection strings. Use Key Vault:
```typescript
const { server, database, user, password } = await getDatabaseSecrets();
const config = {
  server,
  database,
  authentication: {
    type: "default",
    options: { userName: user, password }
  },
  options: { encrypt: true, connectTimeout: 30000 }
};
```

### 4.3 Least Privilege
- Database users have minimal required permissions
- Separate users for different application tiers
- Audit all database access

## 5. API Security

### 5.1 Authentication
- **Development**: Mock auth (React Context)
- **Production**: Azure Entra ID via Static Web Apps

### 5.2 Authorization
```typescript
// All protected endpoints check user context
const principalId = req.headers['x-ms-client-principal-id'];
if (!principalId) {
  return error('UNAUTHORIZED', 'User identity required');
}
```

### 5.3 Rate Limiting
Implement rate limiting on all APIs to prevent abuse:
```typescript
// Per user/IP: 100 requests per hour
const rateLimiter = new RateLimiter({
  interval: 3600000, // 1 hour
  maxRequests: 100
});
```

### 5.4 Input Validation
All API inputs must be validated:
```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100)
});

const validated = schema.parse(req.body);
```

## 6. Frontend Security

### 6.1 Content Security Policy (CSP)
Configure in `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
];
```

### 6.2 Secure Headers
```javascript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
},
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
},
{
  key: 'X-XSS-Protection',
  value: '1; mode=block'
}
```

### 6.3 HTTPS Enforcement
All production endpoints must use HTTPS. Automatic in Azure Static Web Apps.

## 7. Portal Security

### 7.1 Case Manager Portal
- Requires Entra ID authentication
- Manages sensitive case data
- Implements role-based access control (RBAC)
- Encrypts local storage if enabled

### 7.2 Client Portal
- Restricted access to client's own data
- No administrative functions
- Limited file upload capabilities
- Session timeout after inactivity

### 7.3 Admin Portal
- Highest privilege level
- Audit logging of all administrative actions
- Multi-factor authentication (MFA) recommended
- IP-based access restrictions (optional)

## 8. Automation Security

### 8.1 Social Media Credentials
All social media API keys stored in Key Vault:
```typescript
const credentials = {
  twitter: await getSecret("automation-twitter-api-key"),
  facebook: await getSecret("automation-facebook-api-key"),
  instagram: await getSecret("automation-instagram-api-key")
};
```

### 8.2 Scheduled Tasks
- Use managed service identities for authentication
- Implement audit logging for all posts/actions
- Validate content before publishing
- Implement approval workflow for sensitive content

## 9. Audit Logging

### 9.1 Key Vault Audit
Enable audit logging for all Key Vault operations:
```bash
az monitor log-analytics workspace create \
  --resource-group toolsinc-rg \
  --workspace-name toolsinc-logs

az monitor diagnostic-settings create \
  --name kv-diagnostics \
  --resource-group toolsinc-rg \
  --resource-type Microsoft.KeyVault/vaults \
  --resource-name toolsinc-kv \
  --logs '[{"category":"AuditEvent","enabled":true}]' \
  --workspace toolsinc-logs
```

### 9.2 Application Logging
Log security-relevant events:
```typescript
context.log({
  event: 'SECRET_RETRIEVED',
  secretName,
  user: principalId,
  timestamp: new Date().toISOString()
});
```

## 10. Deployment Security

### 10.1 GitHub Actions
Secrets in GitHub are encrypted:
```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Deploy to Azure
        env:
          AZURE_CREDENTIALS: ${{ secrets.AZURE_CREDENTIALS }}
```

### 10.2 Container Security
If using Docker:
```dockerfile
# Never bake secrets into images
# Use build-time secrets:
RUN --mount=type=secret,id=npm_token \
    npm ci --production

# Scan for vulnerabilities
# Use minimal base image
FROM node:20-alpine
```

## 11. Compliance Checklist

- [ ] All secrets in Azure Key Vault
- [ ] No hardcoded credentials in code
- [ ] `.gitignore` properly configured
- [ ] HTTPS enforced on all endpoints
- [ ] Authentication required for sensitive operations
- [ ] Authorization checks on all resources
- [ ] Audit logging enabled
- [ ] Data encrypted in transit (HTTPS/TLS)
- [ ] Data encrypted at rest (for sensitive data)
- [ ] Rate limiting implemented
- [ ] Input validation on all APIs
- [ ] Security headers configured
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented

## 12. Regular Maintenance

### 12.1 Secret Rotation
Rotate secrets quarterly minimum:
```powershell
# Generate new password
$newPassword = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Update in Key Vault
az keyvault secret set \
  --vault-name toolsinc-kv \
  --name "azure-sql-password" \
  --value $newPassword
```

### 12.2 Access Review
```bash
# Audit role assignments
az role assignment list --scope /subscriptions/{subscriptionId}

# Review Key Vault access logs
az monitor log-analytics query \
  --workspace toolsinc-logs \
  --analytics-query "AuditLogs | where Category == 'KeyVaultManagement'"
```

### 12.3 Dependency Updates
Keep packages updated for security patches:
```bash
npm audit
npm update
```

## 13. Incident Response

### 13.1 If a Secret is Compromised
1. Immediately rotate the secret in Key Vault
2. Review audit logs to check if it was accessed
3. Update all references in connected services
4. Monitor for suspicious activity
5. Document the incident

### 13.2 If Code with Secrets is Committed
1. Remove the commit from history (force push)
2. Rotate all exposed secrets immediately
3. Scan git history for other exposed secrets
4. Enable branch protection rules
5. Implement pre-commit hooks

## References
- [Azure Key Vault Documentation](https://learn.microsoft.com/azure/key-vault/)
- [Azure Identity SDK](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme)
- [OWASP Security Best Practices](https://owasp.org/)
- [Azure Security Benchmark](https://learn.microsoft.com/security/benchmark/azure/)
