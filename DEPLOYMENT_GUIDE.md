# Deployment & Launch Guide

## Pre-Deployment Checklist (48 Hours Before)

### 1. Final Code Validation
```bash
# Navigate to workspace
cd /Users/.../sdtoolsinc-web

# Install latest dependencies
npm ci

# Run linter
npm run lint

# Run type check
npx tsc --noEmit

# Run tests
npm run test -- --run

# Run E2E tests
npm run e2e

# Build production version
npm run build

# Verify build size
du -sh .next/

# Expected: < 5MB for Next.js output
```

### 2. Environment Variables Setup

**Staging Environment** (.env.staging):
```bash
# Copy from production with staging credentials
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SENTRY_DSN=https://staging-key@sentry.io/project
# ... other vars
```

**Production Environment** (Azure Key Vault):
```bash
# Using Azure CLI
az keyvault secret set --vault-name toolsinc-kv --name "RESEND_API_KEY" --value "<api_key>"
az keyvault secret set --vault-name toolsinc-kv --name "SENTRY_DSN" --value "<dsn>"
az keyvault secret set --vault-name toolsinc-kv --name "SUPABASE_SERVICE_ROLE_KEY" --value "<key>"

# Verify secrets are set
az keyvault secret list --vault-name toolsinc-kv --query "[].name"
```

### 3. Supabase Preparation

#### Enable Automated Backups
```bash
# Via Supabase dashboard:
# 1. Go to Project Settings → Backup
# 2. Enable Automated Daily Backups
# 3. Set retention to 30 days
```

#### Verify RLS Policies
```sql
-- In Supabase SQL Editor
SELECT * FROM auth.policies;
-- Verify: Users can only see their own data
-- Verify: Admin can see all data
```

#### Test Authentication Flows
```bash
# Manual test:
# 1. Login page at https://sdtoolsinc.org/portal/auth
# 2. Try signup
# 3. Try login with test account
# 4. Verify redirect to portal
```

### 4. Sentry Setup

#### Create/Configure Sentry Project
1. Go to sentry.io and create project
2. Select "Next.js" template
3. Copy DSN: `https://<key>@sentry.io/<project>`
4. Set NEXT_PUBLIC_SENTRY_DSN in Key Vault
5. Install Sentry SDK: `npm install @sentry/nextjs`

#### Test Error Capture
```javascript
// In browser console after deployment:
Sentry.captureMessage("Test message");
// Should appear in Sentry dashboard within 5 minutes
```

### 5. Email Service (Resend) Setup

```bash
# Get API key from https://resend.com
# 1. Create account or log in
# 2. Generate API key
# 3. Add to Key Vault
az keyvault secret set --vault-name toolsinc-kv --name "RESEND_API_KEY" --value "re_..."
```

#### Test Email Sending
```bash
# In Node.js REPL or test script:
import { Resend } from "resend";
const resend = new Resend("re_...");

const result = await resend.emails.send({
  from: "noreply@sdtoolsinc.org",
  to: "test@example.com",
  subject: "Test",
  html: "<p>Test email</p>",
});
console.log(result);
// Should return { id: "..." }
```

---

## Staging Deployment (24 Hours Before)

### Deploy to Staging Environment
```bash
# Create staging branch
git checkout -b staging

# Deploy to staging
# This should trigger GitHub Actions
git push origin staging

# Monitor deployment
# 1. Go to GitHub Actions → CI workflow
# 2. Wait for all checks to pass (5-10 min)
# 3. Verify deployment at: https://staging.sdtoolsinc.org
```

### Staging Tests

#### Smoke Tests
```bash
# Test core paths
curl https://staging.sdtoolsinc.org/ -I
# Should return 200

curl https://staging.sdtoolsinc.org/portal/auth -I
# Should return 200

curl https://staging.sdtoolsinc.org/api/health -I
# Should return 200
```

#### Manual Testing (30 min)
- [ ] Homepage loads
- [ ] Interest form submits
- [ ] Login/signup works
- [ ] Dashboard loads
- [ ] Courses page loads
- [ ] Profile settings work
- [ ] Logout works
- [ ] Email verification triggers
- [ ] Navigation all working

#### Mobile Testing
```bash
# Use Chrome DevTools
# 1. Press F12, Ctrl+Shift+M
# 2. Select iPhone 12
# 3. Test each page
# 4. Verify touch targets work
```

#### Performance Check
```bash
# Use Lighthouse in Chrome DevTools
# Right-click → Inspect → Lighthouse
# - Run performance audit
# - Target score: > 85
# - Check LCP: < 2.5s
# - Check FID: < 100ms
```

---

## Production Deployment

### Day Of Deployment

#### Final Sanity Checks (10 min before)
```bash
# 1. Check all tests passing
git status
git log --oneline -5
npm run lint

# 2. Verify all secrets in Key Vault
az keyvault secret list --vault-name toolsinc-kv

# 3. Verify CI/CD pipeline status
# Check GitHub Actions for any failures

# 4. Create backup
# (Supabase does this automatically)
```

#### Deploy to Production
```bash
# Merge to main branch
git checkout main
git pull origin main

# If using fast-forward:
git merge --ff-only staging

# Or merge from PR:
# Go to GitHub → Create PR from staging → Squash and merge

# Push to main
git push origin main
# This triggers GitHub Actions CI/CD pipeline
```

#### Monitor Deployment
```bash
# 1. Watch GitHub Actions
#    - Lint: ~1 min
#    - Build: ~5 min
#    - E2E Tests: ~10 min
#    - Deploy: ~5 min
#    Total: ~20-30 min

# 2. Verify Azure Static Web App deployment
az staticwebapp show --name toolsinc-web --resource-group toolsinc

# 3. Check deployment URL
curl https://sdtoolsinc.org/ -I
# Should return 200

# 4. Monitor Sentry
# https://sentry.io/path/to/project
# Should show no errors
```

#### Post-Deployment Validation (15 min)
```bash
# Test critical paths
# 1. Homepage loads: https://sdtoolsinc.org
# 2. Login page: https://sdtoolsinc.org/portal/auth
# 3. Courses page: https://sdtoolsinc.org/portal/courses
# 4. Profile page: https://sdtoolsinc.org/portal/profile

# Test authentication flow
# 1. Sign up new account
# 2. Check email for verification
# 3. Verify email address
# 4. Login
# 5. Verify portal access
# 6. Logout

# Check monitoring tools
# 1. Sentry: No new errors
# 2. Google Analytics: Session active
# 3. Azure Monitor: Normal traffic
```

---

## Post-Deployment (Day 1-7)

### Day 1: Launch Day Monitoring
- [ ] Monitor Sentry errors (should be < 5)
- [ ] Monitor Google Analytics (verify traffic)
- [ ] Check user feedback channel
- [ ] Validate email service (test signup)
- [ ] Check database performance
- [ ] Monitor Azure Static Web Apps metrics

### Day 7: First Week Review
- [ ] Review error logs for patterns
- [ ] Check Core Web Vitals (100+ samples)
- [ ] Performance optimization (if needed)
- [ ] User feedback review
- [ ] Database backup test

---

## Rollback Procedure

### If Critical Issue Detected
```bash
# Option 1: Revert to previous commit
git revert HEAD
git push origin main
# This triggers new build (2-3 min)

# Option 2: Use Azure Portal rollback
# 1. Go to Azure Static Web Apps → toolsinc-web
# 2. Go to Deployments
# 3. Find previous successful deployment
# 4. Click "..." → Promote to Production
# This is instant (< 1 min)

# Option 3: Restore database from backup
# 1. Go to Supabase dashboard
# 2. Project Settings → Backup
# 3. Select daily backup from yesterday
# 4. Restore (takes 10-30 min)
```

---

## Crisis Communication

### If Major Outage
1. **Notify Team** (Slack): "Production issue detected at [time]. Investigating..."
2. **Status Page** (statuspage.io): Update status to "Investigating"
3. **Implement Fix**: Roll back or deploy hotfix
4. **Verify**: Test critical paths
5. **Communicate Resolution**: "Fixed at [time]. Normal service resumed."

---

## Deployment Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Deploy Time | < 30 min | |
| Build Time | < 10 min | |
| Test Suite | < 5 min | |
| E2E Tests | < 10 min | |
| Post-Deploy Validation | < 15 min | |
| Error Rate (24h) | < 0.1% | |
| Page Load Time (p50) | < 2s | |
| Page Load Time (p95) | < 4s | |

---

## Post-Deployment Checklists

**Deployment Completed By**: ________________________
**Date/Time**: ________________________
**Duration**: ________________________
**Issues Encountered**: ________________________

**Sign-off**:
- [ ] Code deployed successfully
- [ ] All tests passing
- [ ] No Sentry errors
- [ ] Email service working
- [ ] Database verified
- [ ] Performance acceptable

**Approved By**: ________________________
**Date**: ________________________

---

## Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| DevOps Lead | | | |
| Backend Lead | | | |
| QA Lead | | | |
| Product Manager | | | |
| Emergency Escalation | | | |

---

**Last Updated**: February 14, 2026  
**Next Review**: February 21, 2026
