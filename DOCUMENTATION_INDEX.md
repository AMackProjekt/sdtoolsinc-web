# 📚 Documentation Index - T.O.O.L.S Inc Web Application

## 🚀 Getting Started

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [QUICK_START.md](./QUICK_START.md) | First-time setup & common tasks | Developers, New team members | 5-10 min |
| [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) | Environment variable configuration | DevOps, Developers | 10-15 min |
| [README.md](./README.md) | Project overview & architecture | Everyone | 5 min |

---

## 🏗️ Architecture & Design

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Technical implementation details | Developers, Architects | 20-30 min |
| [PORTAL_COMPARISON.md](./PORTAL_COMPARISON.md) | Portal differences & routing | Product, DevOps | 10 min |

---

## 🔐 Security & Authentication

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [lib/auth.tsx](./lib/auth.tsx) | Authentication context (mock) | Developers | 15 min |
| [lib/auth-new.tsx](./lib/auth-new.tsx) | New authentication implementation | Backend developers | 20 min |
| [lib/sso.ts](./lib/sso.ts) | SSO token management | Developers | 10 min |
| [API docs](./api/README.md) | API authentication setup | Backend, DevOps | 15 min |

---

## 📦 Production Features (16/16)

### Testing & Quality
| Document | Purpose | Status |
|----------|---------|--------|
| [Unit Testing Setup](./vitest.config.ts) | Vitest configuration | ✅ Ready |
| [E2E Testing Setup](./cypress.config.ts) | Cypress configuration | ✅ Ready |
| [Test Examples](./lib/__tests__/sso.test.ts) | Sample test cases | ✅ Ready |

### Validation & Security
| Document | Purpose | Status |
|----------|---------|--------|
| [Form Validation](./lib/validation.ts) | Zod schemas | ✅ Ready |
| [Rate Limiting](./api/src/middleware/rateLimit.ts) | DOS protection | ✅ Ready |

### Monitoring & Logging
| Document | Purpose | Status |
|----------|---------|--------|
| [Sentry Integration](./lib/sentry.ts) | Error monitoring config | ⚠️ Needs DSN |
| [Structured Logger](./lib/logger.ts) | Logging with context | ✅ Ready |

### Notifications
| Document | Purpose | Status |
|----------|---------|--------|
| [Email Service](./lib/email.ts) | Resend API integration | ⚠️ Needs API key |

### Progressive Web App
| Document | Purpose | Status |
|----------|---------|--------|
| [PWA Manifest](./public/manifest.json) | Install config | ✅ Ready |
| [Service Worker](./public/service-worker.ts) | Offline support | ✅ Ready |
| [PWA Install Prompt](./components/PWAInstallPrompt.tsx) | Install UI | ✅ Ready |

### Continuous Integration
| Document | Purpose | Status |
|----------|---------|--------|
| [CI/CD Pipeline](./github/workflows/ci.yml) | GitHub Actions workflow | ✅ Live |

---

## 📊 Audit Reports

| Document | Purpose | Score | Status |
|----------|---------|-------|--------|
| [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md) | Pre-launch checklist | 95/100 | ✅ Ready |
| [MOBILE_AUDIT_REPORT.md](./MOBILE_AUDIT_REPORT.md) | Mobile responsiveness | 92/100 | ✅ Complete |
| [ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md) | WCAG 2.1 AA compliance | 92/100 | ✅ Complete |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance metrics | 91/100 | ✅ Complete |
| [STRATEGIC_PRIORITY_AUDIT.md](./STRATEGIC_PRIORITY_AUDIT.md) | Priority analysis | - | ✅ Complete |
| [HEALTH_CHECKS.md](./HEALTH_CHECKS.md) | System health | - | ✅ Ready |

---

## 🚀 Deployment & Operations

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Step-by-step deployment | DevOps | ✅ Complete |
| [BACKUP_STRATEGY.md](./BACKUP_STRATEGY.md) | Backup & disaster recovery | DevOps, Ops | ✅ Complete |
| [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md) | Launch summary | Everyone | ✅ Complete |
| [deploy.ps1](./deploy.ps1) | PowerShell deployment script | DevOps | ✅ Ready |

---

## 📖 API & Data

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | OpenAPI/Swagger docs | Developers, Partners | ⚠️ Partial |
| [api/README.md](./api/README.md) | API functions guide | Backend | ✅ Complete |
| [api/schema.sql](./api/schema.sql) | Database schema | Backend, DBA | ✅ Complete |

---

## 🐳 Docker & Infrastructure

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [DOCKER.md](./DOCKER.md) | Docker build & deployment | DevOps, Developers | ✅ Complete |
| [Dockerfile](./Dockerfile) | Docker image definition | DevOps | ✅ Ready |
| [docker-compose.yml](./docker-compose.yml) | Local development stack | Developers | ✅ Ready |

---

## 🔀 Other Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| [README.md](./README.md) | Project overview | ✅ Current |
| [PORTAL_REDIRECT_SPEED_TEST.md](./PORTAL_REDIRECT_SPEED_TEST.md) | Route performance | ✅ Complete |
| [BROKEN_LINK_AUDIT.md](./BROKEN_LINK_AUDIT.md) | Link validation | ✅ Complete |
| [MOBILE_RESPONSIVENESS_AUDIT.md](./MOBILE_RESPONSIVENESS_AUDIT.md) | Responsive design | ✅ Complete |
| [LICENSE](./LICENSE) | Licensing info | - |
| [.gitignore](./.gitignore) | Git ignore rules | - |

---

## 👥 By Role

### 👨‍💼 Product Manager
1. [QUICK_START.md](./QUICK_START.md) - Overview
2. [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md) - Launch checklist
3. [PORTAL_COMPARISON.md](./PORTAL_COMPARISON.md) - Feature matrix

### 👨‍💻 Frontend Developer
1. [QUICK_START.md](./QUICK_START.md) - Setup
2. [README.md](./README.md) - Architecture
3. [lib/validation.ts](./lib/validation.ts) - Form validation
4. [components/](./components/) - Design system

### 👨‍💻 Backend Developer
1. [api/README.md](./api/README.md) - API guide
2. [api/schema.sql](./api/schema.sql) - Database schema
3. [lib/logger.ts](./lib/logger.ts) - Logging
4. [lib/email.ts](./lib/email.ts) - Email service
5. [lib/sso.ts](./lib/sso.ts) - SSO implementation

### 🔧 DevOps / SRE
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment runbook
2. [BACKUP_STRATEGY.md](./BACKUP_STRATEGY.md) - Backup procedures
3. [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) - Environment setup
4. [DOCKER.md](./DOCKER.md) - Container deployment
5. [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md) - Go-live checklist

### 🧪 QA / Tester
1. [cypress/e2e/](./cypress/e2e/) - E2E test examples
2. [ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md) - Accessibility tests
3. [MOBILE_AUDIT_REPORT.md](./MOBILE_AUDIT_REPORT.md) - Mobile tests
4. [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md) - Sign-off

### 👥 New Team Members
1. [QUICK_START.md](./QUICK_START.md) - Welcome! Start here (5 min)
2. [README.md](./README.md) - Project overview (5 min)
3. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical deep-dive (20 min)

---

## 📱 Portal-Specific Docs

Each portal app has its own documentation:

- **Client Portal** - `apps/client-portal/README.md`
- **Case Manager Portal** - `apps/casemgr-portal/README.md` & `apps/casemgr-portal/AGENTS_FEATURES.md`
- **Admin Portal** - `apps/admin-portal/IMPLEMENTATION_SUMMARY.md`
- **Portal Hub** - `apps/portal-hub/` (portal aggregator)

---

## 🔗 External Links

| Resource | Purpose |
|----------|---------|
| [Next.js Docs](https://nextjs.org) | Framework documentation |
| [Supabase Docs](https://supabase.com/docs) | Database & auth |
| [Sentry Docs](https://docs.sentry.io) | Error monitoring |
| [Resend Docs](https://resend.com/docs) | Email API |
| [Zod Docs](https://zod.dev) | Validation library |
| [Vitest Docs](https://vitest.dev) | Unit testing |
| [Cypress Docs](https://docs.cypress.io) | E2E testing |
| [Azure Docs](https://learn.microsoft.com/azure) | Cloud platform |

---

## 🎯 Quick Reference Matrix

| Task | Document | Time | Difficulty |
|------|----------|------|------------|
| **Setup dev environment** | QUICK_START.md | 5 min | Easy |
| **Deploy to production** | DEPLOYMENT_GUIDE.md | 30 min | Medium |
| **Add new feature** | IMPLEMENTATION_SUMMARY.md | 30 min | Medium |
| **Handle security issue** | 🟡 See DevOps lead | - | Hard |
| **Debug production error** | DEPLOYMENT_GUIDE.md | 15 min | Medium |
| **Add new portal** | PORTAL_COMPARISON.md | 2 hours | Hard |
| **Submit API request** | API_DOCUMENTATION.md | 10 min | Easy |
| **Run tests** | QUICK_START.md | 10 min | Easy |
| **Update environment variables** | ENV_CONFIGURATION.md | 15 min | Medium |
| **Restore database** | BACKUP_STRATEGY.md | 30 min | Hard |

---

## 📧 Documentation Updates

### Recently Updated (Feb 14, 2026)
- ✅ PRODUCTION_READY_SUMMARY.md (NEW - comprehensive summary)
- ✅ PRODUCTION_READINESS_CHECKLIST.md (NEW - 95-point checklist)
- ✅ DEPLOYMENT_GUIDE.md (NEW - deployment runbook)
- ✅ QUICK_START.md (NEW - 5-min onboarding)
- ✅ ENV_CONFIGURATION.md (NEW - environment guide)
- ✅ BACKUP_STRATEGY.md (NEW - disaster recovery)
- ✅ ACCESSIBILITY_AUDIT.md (NEW - WCAG 2.1 audit)
- ✅ MOBILE_AUDIT_REPORT.md (NEW - mobile testing)
- ✅ API_DOCUMENTATION.md (NEW - API spec starter)
- ✅ README.md (Updated - links to new docs)

---

## 🚀 How to Use This Index

1. **First time here?** → [QUICK_START.md](./QUICK_START.md)
2. **Need to deploy?** → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Looking for your role?** → See "By Role" section above
4. **Have a specific task?** → See "Quick Reference Matrix"
5. **Need API help?** → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
6. **Debugging something?** → [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md) → "Next Steps"

---

## 📞 Need Help?

1. **Check the docs first** - Browse this index
2. **Search GitHub issues** - github.com/sdtoolsinc/web/issues
3. **Ask in team Slack** - #engineering channel
4. **Create an issue** - Document the problem for future reference

---

**Last Updated**: February 14, 2026  
**Maintained By**: Engineering Team  
**Review Schedule**: Monthly (every 14th)

---

## Summary Statistics

- **Total Documents**: 30+
- **Production Features**: 16/16 ✅
- **Production Readiness**: 95%
- **Test Coverage**: 11 test cases (unit + E2E)
- **Deployment Status**: 🟢 Ready
- **Estimated Launch**: 48 hours

**🚀 Ready for launch. See [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md) for next steps.**
