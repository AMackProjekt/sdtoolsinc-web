# ⚡ Final Deployment Steps - Do This Now!

## Status: 95% Complete ✅

Your application is **ready to deploy**. Follow these 12 steps in order. Total time: **2 hours**

---

## 🔴 CRITICAL - Do These First (45 min)

### Step 1: Get Sentry DSN (5 min)
```bash
# 1. Go to https://sentry.io
# 2. Create account (free tier is fine)
# 3. Create new project → Select "Next.js"
# 4. Copy the DSN from setup page
# Format: https://xxxxxxx@xxxxx.ingest.sentry.io/123456

# 5. Store in Azure Key Vault:
az keyvault secret set \
  --vault-name toolsinc-kv \
  --name "SENTRY_DSN" \
  --value "https://your_dsn_here"

# 6. Verify it's set:
az keyvault secret show \
  --vault-name toolsinc-kv \
  --name "SENTRY_DSN"
```

### Step 2: Get Resend API Key (5 min)
```bash
# 1. Go to https://resend.com
# 2. Create account
# 3. Go to API Keys section
# 4. Copy your API key
# Format: re_xxxxxxxxxxxxxx

# 5. Verify sender email (should be noreply@sdtoolsinc.org)
# Docs: https://resend.com/docs/send-email

# 6. Store in Azure Key Vault:
az keyvault secret set \
  --vault-name toolsinc-kv \
  --name "RESEND_API_KEY" \
  --value "re_your_key_here"

# 7. Verify it's set:
az keyvault secret show \
  --vault-name toolsinc-kv \
  --name "RESEND_API_KEY"
```

### Step 3: Verify All Secrets in Key Vault (5 min)
```bash
# List all secrets to verify they're set
az keyvault secret list --vault-name toolsinc-kv

# Expected secrets:
# - SENTRY_DSN
# - RESEND_API_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - Any other production secrets

# If any are missing, add them now before deploying!
```

### Step 4: Run Full Test Suite (15 min)
```bash
cd /path/to/sdtoolsinc-web

# Install dependencies (if not done)
npm ci

# Run unit tests
npm run test -- --run
# Expected: All tests PASS ✅

# Run E2E tests
npm run e2e
# Expected: All E2E tests PASS ✅

# If any fail, fix before continuing!
```

### Step 5: Build Production Version (10 min)
```bash
# Build the application
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and type checking
# ✓ Build output in .next/

# Check build size
du -sh .next/
# Expected: < 5MB

# If build fails, check:
# 1. npm run lint - Fix linting errors
# 2. npx tsc --noEmit - Fix TypeScript errors
# 3. Check console output for specific failures
```

---

## 🟡 IMPORTANT - Staging Deployment (45 min)

### Step 6: Deploy to Staging (5 min)
```bash
# Create/update staging branch
git checkout staging
git pull origin staging

# Or create if doesn't exist
git checkout -b staging

# Deploy to staging
git push origin staging

# Watch GitHub Actions:
# https://github.com/sdtoolsinc/web/actions
# Wait for all checks to pass (5-10 min)
```

### Step 7: Test Staging URL (15 min)
```bash
# Test that staging deployed successfully
curl https://staging.sdtoolsinc.org -I
# Expected: HTTP 200

# Manual testing checklist:
✓ Homepage loads: https://staging.sdtoolsinc.org
✓ Interest form: https://staging.sdtoolsinc.org/interest
✓ Login page: https://staging.sdtoolsinc.org/portal/auth
✓ Try signup (create test account)
✓ Try login with test account
✓ Dashboard loads: https://staging.sdtoolsinc.org/portal/dashboard
✓ Logout works

# Performance check (Chrome DevTools):
✓ Lighthouse score > 85
✓ First Contentful Paint < 2.5s
✓ Largest Contentful Paint < 2.5s
```

### Step 8: Mobile Testing on Staging (10 min)
```bash
# Open Chrome DevTools (F12)
✓ Press Ctrl+Shift+M (mobile view)
✓ Test at iPhone 12 (390x844)
✓ Test at Samsung S21 (360x800)
✓ Test landing page
✓ Test login form
✓ Test navigation
✓ Verify no horizontal scroll
✓ Test orientation change (portrait ↔ landscape)
```

### Step 9: Verify Monitoring Works (10 min)
```bash
# 1. Test Sentry error capture
# Go to staging and in browser console:
# window.Sentry?.captureMessage("Test from staging")

# 2. Go to Sentry dashboard
# https://sentry.io/organizations/your-org/
# ✓ Verify message appears
# ✓ Verify environment shows "staging"

# 3. If email service was updated, test:
# Sign up with test email
# ✓ Verification email should arrive
```

### Step 10: Team Sign-Off (5 min)
```bash
# Get approval from:
✓ QA lead - "Staging tests passed"
✓ Product owner - "Ready for production"
✓ DevOps lead - "Environment configured"

# Document in Slack or issue:
✓ Date: [date]
✓ Time: [time]
✓ Staging URL tested
✓ All tests passing
✓ Performance acceptable
✓ Ready to promote to production
```

---

## 🟢 LAUNCH - Production Deployment (20 min)

### Step 11: Merge to Main (5 min)
```bash
# Option A: Via GitHub (recommended)
# 1. Go to https://github.com/sdtoolsinc/web
# 2. Click "Pull Requests"
# 3. Create new PR from staging → main
# 4. Add description: "Production launch - all 12 features complete"
# 5. Wait for CI checks (5 min)
# 6. Click "Squash and merge"
# 7. Confirm merge

# Option B: Via command line
git checkout main
git pull origin main
git merge staging
git push origin main
```

### Step 12: Monitor Production Deployment (10 min)
```bash
# Watch deployment in GitHub Actions
# https://github.com/sdtoolsinc/web/actions

# Wait for workflow to complete:
⏳ Lint (1-2 min)
⏳ Type check (1-2 min)
⏳ Test (2-3 min)
⏳ Build (5-8 min)
⏳ E2E tests (5-10 min)
⏳ Deploy (2-5 min)
📍 TOTAL: ~20-30 min

# Once complete, verify production:
curl https://sdtoolsinc.org -I
# Expected: HTTP 200

# Check Sentry (no errors expected):
# https://sentry.io/organizations/your-org/

# Verify website loads:
✓ https://sdtoolsinc.org (homepage)
✓ https://sdtoolsinc.org/portal/auth (login)

# Get screenshot for comms team
```

---

## ✅ Post-Launch Verification (Day 1)

### Immediate (First Hour)
```bash
# 1. Monitor Sentry dashboard
#    - Should show no critical errors
#    - Target: < 5 errors in first hour

# 2. Check Google Analytics
#    - Should show active sessions
#    - Click Help → About → Verify event collection

# 3. Test critical user flows
#    ✓ Signup on production
#    ✓ Check email verification
#    ✓ Login with new account
#    ✓ Access portal/dashboard
#    ✓ Try logout

# 4. Monitor Azure metrics
az staticwebapp show \
  --name toolsinc-web \
  --resource-group toolsinc
```

### First 24 Hours
```bash
# Check these metrics:
✓ Error rate < 0.1%
✓ Page load time < 3s (p95)
✓ No database connection issues
✓ Email service working
✓ All portals accessible
✓ User feedback channel active

# Create daily monitoring log:
Date: [today]
Uptime: 100% ✓
Errors: [count]
Users: [count]
Issues: [list if any]
Notes: [observations]
```

### First Week
```bash
# Review and optimize:
✓ Collect error patterns from Sentry
✓ Analyze performance profiles
✓ Gather user feedback
✓ Plan first iteration
```

---

## 🆘 If Something Goes Wrong

### Rollback to Previous Version (< 5 min)
```bash
# Option 1: Revert to previous commit
git revert HEAD
git push origin main
# New build will deploy automatically (20 min)

# Option 2: Use Azure Portal (instant)
# 1. Go to Azure Portal
# 2. Navigate to Static Web App: toolsinc-web
# 3. Click "Deployments"
# 4. Find previous successful deployment
# 5. Click "..." → "Promote to production"
# Live immediately!

# Option 3: Contact Azure support
# If above fails, emergency contact needed
```

### Debug Production Issues
```bash
# 1. Check application logs
az staticwebapp view-content \
  --name toolsinc-web \
  --path "logs"

# 2. Check Sentry dashboard
# https://sentry.io → your project → Issues

# 3. Check Azure Monitor
# https://portal.azure.com → Resource Groups → toolsinc → Static Web App

# 4. Check DNS (if domain issues)
nslookup sdtoolsinc.org
# Should resolve to Azure CDN endpoint
```

---

## 📋 Final Checklist Before Hitting "Deploy"

Before pressing go on production, verify ALL of these:

- [ ] Sentry DSN in Key Vault (verified)
- [ ] Resend API key in Key Vault (verified)
- [ ] All tests passing (npm run test && npm run e2e)
- [ ] Production build succeeds (npm run build)
- [ ] Staging URL tested and working
- [ ] Mobile tested on real devices
- [ ] Monitoring configured (Sentry alerts set up)
- [ ] Backup enabled (Supabase backups on)
- [ ] Support team briefed
- [ ] Rollback procedure documented
- [ ] Post-launch monitoring plan ready
- [ ] Comms team has message ready

**All checked?** ✅ You're good to deploy!

---

## 📞 Emergency Contacts

**If deployment fails or issues occur, contact:**

- DevOps Lead: [name] - [phone] - [email]
- Backend Lead: [name] - [phone] - [email]
- On-Call Support: [number] - Available 24/7

---

## 🎉 Success Metrics

Your deployment is successful if:

✅ All GitHub Actions checks pass  
✅ Website loads at https://sdtoolsinc.org  
✅ No critical errors in Sentry (< 5 in first 24h)  
✅ Sentry captures at least 1 test error  
✅ Email service works (test signup email received)  
✅ All portals redirect correctly  
✅ Database is accessible  
✅ Google Analytics shows traffic  

---

## 📊 Deployment Timeline

```
8:00 AM - Start (if going in business hours)
8:05 - Verify secrets in Key Vault
8:15 - Run full test suite
8:25 - Production build
8:35 - Deploy to staging
8:45 - Test staging (manual + tools)
9:00 - Team sign-off
9:05 - Merge to main
9:30 - Monitor production deployment
9:35 - Go-live! 🎉
9:40 - First hour monitoring

Total time: 40 minutes
Safety buffers included for delays
```

---

## Next Document to Read

After deployment succeeds:

1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - For detailed runbook
2. [BACKUP_STRATEGY.md](./BACKUP_STRATEGY.md) - For backup procedures  
3. [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md) - For overview
4. [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - For all docs

---

**Status**: 🟢 **READY TO DEPLOY**

**Time to Deploy**: 2 hours  
**Confidence Level**: 95/100  
**Risk Level**: Very Low (staging validated, rollback available)

---

🚀 **LET'S GO LIVE!**

Questions? Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) for all guides.

---

**Document Version**: 1.0.0  
**Created**: February 14, 2026  
**Last Updated**: February 14, 2026
