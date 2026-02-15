# Environment Configuration Guide

## Overview
This file documents all environment variables required for production deployment.

## Public Environment Variables
These are safe to commit and visible in client-side code.

```env
# Branding
NEXT_PUBLIC_APP_NAME=TOOLS Inc
NEXT_PUBLIC_APP_URL=https://sdtoolsinc.org

# Supabase (Auth)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# Analytics & Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://<key>@sentry.io/<project>
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Secret Environment Variables
These must NEVER be committed. Store in Azure Key Vault.

```env
# Supabase Admin (Backend only)
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Email Service (Resend)
RESEND_API_KEY=<api_key>
RESEND_FROM_EMAIL=noreply@sdtoolsinc.org

# Error Monitoring (Sentry)
SENTRY_DSN=https://<key>@sentry.io/<project>
SENTRY_AUTH_TOKEN=<auth_token>

# Admin Dashboard (Case Manager Portal)
CASEMGR_ADMIN_KEY=<strong_random_key>

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_STORE=redis  # or "memory" for development

# Database (if applicable)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Secrets
JWT_SECRET=<strong_random_32char_key>
ENCRYPTION_KEY=<strong_random_32char_key>
```

## Azure Key Vault Setup

### 1. Create Secrets in Azure Portal
```bash
az keyvault secret set --vault-name toolsinc-kv \
  --name "RESEND-API-KEY" --value "<api_key>"

az keyvault secret set --vault-name toolsinc-kv \
  --name "SENTRY-DSN" --value "<sentry_dsn>"

az keyvault secret set --vault-name toolsinc-kv \
  --name "SUPABASE-SERVICE-ROLE" --value "<service_role_key>"
```

### 2. Reference in Azure Static Web Apps
In `.github/workflows/ci.yml`:
```yaml
env:
  RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
  SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### 3. Reference in Azure Static Web Apps config
In `staticwebapp.config.json`:
```json
{
  "env": {
    "RESEND_API_KEY": "=RESEND_API_KEY",
    "SENTRY_DSN": "=SENTRY_DSN"
  }
}
```

## Development Environment

Create `.env.local` (gitignored):
```env
# Public
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_ENABLE_BETA_FEATURES=true

# Secret
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_test_...
SENTRY_DSN=
JWT_SECRET=dev_secret_key_12345678
ENCRYPTION_KEY=dev_encrypt_key_12345678
```

## Testing Environment

Create `.env.test`:
```env
# Use mock/test credentials
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test
SUPABASE_SERVICE_ROLE_KEY=test
RESEND_API_KEY=re_test_
SENTRY_DSN=
JWT_SECRET=test_secret
```

## Production Environment

### Azure Static Web Apps Configuration

1. **Via Azure Portal:**
   - Navigate to Static Web App → Configuration → Application Settings
   - Add each secret

2. **Via GitHub Secrets:**
   - Add to repo Settings → Secrets and variables → Actions
   - Reference in `.github/workflows/ci.yml`

3. **Via Azure CLI:**
```bash
az staticwebapp appsettings set \
  --name toolsinc-web \
  --resource-group toolsinc \
  --setting-names RESEND_API_KEY=<value> SENTRY_DSN=<value>
```

## Validation Checklist

Before deploying to production:

- [ ] All `NEXT_PUBLIC_*` vars set in public config
- [ ] All secrets stored in Azure Key Vault
- [ ] No secrets in `.env` or committed files
- [ ] `NEXT_PUBLIC_SENTRY_DSN` configured
- [ ] `RESEND_API_KEY` valid and whitelisted
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set for API
- [ ] Database connection pooling configured
- [ ] Rate limiting enabled
- [ ] `NODE_ENV=production` in deployment
- [ ] `npm run build` completes without warnings
- [ ] Health checks passing

## Troubleshooting

### Variables not loading
1. Verify Key Vault permissions: `az keyvault secret list`
2. Check GitHub Secrets: Settings → Secrets → Actions
3. Verify build logs for env var references
4. Clear Next.js cache: `rm -rf .next`

### Sentry not capturing errors
1. Verify DSN format: `https://<key>@sentry.io/<project>`
2. Check Sentry project settings
3. Verify `NEXT_PUBLIC_SENTRY_DSN` is public
4. Test in browser console: `Sentry.captureMessage("Test")`

### Email not sending
1. Verify Resend API key is valid
2. Check sender email is verified in Resend
3. Review rate limits (5 emails/min per domain)
4. Check logs: `logger.error('Email failed', { error })`

---

**Last Updated**: February 14, 2026
