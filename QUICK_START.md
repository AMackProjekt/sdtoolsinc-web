# Quick Start Guide - T.O.O.L.S Inc Web Application

## 🚀 First Time Setup (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/sdtoolsinc/web.git
cd sdtoolsinc-web
```

### 2. Install Dependencies
```bash
npm ci  # Use 'ci' (clean install) instead of 'install' for deterministic builds
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your development values
```

### 4. Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📝 Common Development Tasks

### Running Tests
```bash
# Unit tests (Vitest)
npm run test

# Unit tests with UI
npm run test:ui

# Unit tests with coverage report
npm run test:coverage

# E2E tests (Cypress)
npm run e2e

# E2E tests with visual interface
npm run e2e:open
```

### Building for Production
```bash
# Build Next.js application
npm run build

# Export static files to /out directory
npm run export

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

### Code Quality
```bash
# Run linter (ESLint)
npm run lint

# Check for type errors (TypeScript)
npx tsc --noEmit

# Security audit (npm)
npm audit

# Check for outdated dependencies
npm check-updates
```

---

## 🔐 Authentication Setup

### Supabase Configuration
1. Go to https://supabase.com
2. Create new project
3. Copy API URL → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy service role key → `SUPABASE_SERVICE_ROLE_KEY`

### Email Service (Resend)
1. Go to https://resend.com
2. Create account and get API key
3. Add to `.env.local`: `RESEND_API_KEY=re_...`
4. Verify sender email in Resend dashboard

### Error Monitoring (Sentry)
1. Go to https://sentry.io
2. Create new project → Select "Next.js"
3. Copy DSN → `NEXT_PUBLIC_SENTRY_DSN`
4. Test: `npm run dev` → Should see Sentry initialized in console

---

## 📂 Project Structure

```
sdtoolsinc-web/
├── app/                      # Next.js 15 App Router
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout (Sentry, PWA init)
│   ├── portal/              # Authenticated portal
│   │   ├── dashboard/       # User dashboard
│   │   ├── courses/         # Course browser
│   │   └── profile/         # User settings
│   └── auth/                # Authentication pages
│       ├── login/           # Login page
│       └── signup/          # Registration page
│
├── components/              # Reusable React components
│   ├── ui/                  # Design system
│   │   ├── Button.tsx       # Animated button
│   │   ├── GlowCard.tsx     # Glass card component
│   │   └── Navbar.tsx       # Navigation bar
│   ├── PWAInstallPrompt.tsx # PWA install UI
│   ├── PWAInit.tsx          # PWA initialization
│   └── WebVitals.tsx        # Performance monitoring
│
├── lib/                     # Utilities and helpers
│   ├── auth.tsx             # Authentication context
│   ├── auth-new.tsx         # New auth implementation
│   ├── sentry.ts            # Sentry configuration
│   ├── pwa.ts               # PWA utilities
│   ├── validation.ts        # Zod schemas for form validation
│   ├── logger.ts            # Structured logging with Sentry
│   ├── email.ts             # Email service (Resend)
│   ├── sso.ts               # SSO token management
│   ├── cn.ts                # Class name utility
│   └── hooks/               # Custom React hooks
│
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.ts    # Service worker (offline support)
│   ├── favicon.ico          # Browser icon
│   └── logos/               # Brand logos
│
├── types/                   # TypeScript type definitions
│   └── database.ts          # Supabase types
│
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD pipeline
│
├── package.json             # Dependencies & scripts
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS config
├── vitest.config.ts         # Vitest configuration
└── cypress.config.ts        # Cypress configuration
```

---

## 🎨 Design System

### Colors (Dark Theme)
```typescript
// Tailwind config defines these:
bg: "#06070b"           // Main background
panel: "#0c0f17"        // Card/panel
glass: "rgba(255,255,255,.06)"  // Glass overlay
border: "rgba(255,255,255,.12)" // Border
text: "rgba(248,250,252,.96)"   // Primary text
muted: "rgba(148,163,184,.92)"  // Secondary text
brand: "#38bdf8"        // Sky blue (primary)
brand2: "#2dd4bf"       // Teal (secondary)
accent: "#a78bfa"       // Purple (accent)
```

### Typography
```typescript
.h1 { /* 42px-72px responsive */ }
.h2 { /* 28px-40px responsive */ }
.p-lead { /* 16px-18px + muted gray */ }
```

### Components
```tsx
// Glass card
<GlowCard className="p-6">Content</GlowCard>

// Animated button
<Button onClick={() => {}}>Click me</Button>

// Sleep gradient text
<span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
  Gradient Text
</span>
```

---

## 🌐 Deployment Checklist

Before going to production:

- [ ] All tests passing: `npm run test && npm run e2e`
- [ ] No linting errors: `npm run lint`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Lighthouse score > 85: DevTools → Lighthouse
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set in Key Vault
- [ ] Sentry DSN configured
- [ ] Email service (Resend) working
- [ ] Database backups enabled (Supabase)
- [ ] GitHub branch protection enabled
- [ ] PR requires 1+ approval + status checks
- [ ] CI/CD workflow active

Then deploy:
```bash
git push origin main
# GitHub Actions will automatically build, test, and deploy
# Watch progress at: https://github.com/sdtoolsinc/web/actions
```

---

## 🐛 Troubleshooting

### "Supabase not found" error
```bash
npm install @supabase/supabase-js @supabase/ssr
npm run dev
```

### "Resend is not defined"
```bash
npm install resend
# Check RESEND_API_KEY is set in .env.local
npm run dev
```

### "Sentry not starting"
```bash
npm install @sentry/nextjs
# Check NEXT_PUBLIC_SENTRY_DSN is set
npm run dev
# Check browser console for Sentry initialization message
```

### Tests failing
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm ci
npm run test

# If still failing, check:
# 1. VITEST_GLOBALS=true (in vitest.config.ts)
# 2. jsdom environment enabled
# 3. @testing-library/react installed
```

### Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for:
# 1. TypeScript errors: npx tsc --noEmit
# 2. ESLint errors: npm run lint
# 3. Missing env vars: console output during build
```

---

## 📚 Documentation

- [Authentication Setup](./AUTH_SETUP.md)
- [Environment Configuration](./ENV_CONFIGURATION.md)
- [Backup Strategy](./BACKUP_STRATEGY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Production Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
- [Mobile Audit Report](./MOBILE_AUDIT_REPORT.md)
- [Accessibility Audit](./ACCESSIBILITY_AUDIT.md)
- [API Documentation](./API_DOCUMENTATION.md)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am "Add my feature"`
3. Run tests: `npm run test && npm run e2e`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request on GitHub
6. Wait for CI checks to pass + approval
7. Squash & merge

---

## 📞 Support

For issues:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review documentation files
3. Check existing GitHub issues
4. Create new issue if needed: https://github.com/sdtoolsinc/web/issues

---

## 📊 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run export           # Export static HTML

# Testing
npm run test             # Run unit tests
npm run test:ui          # Test UI
npm run e2e              # Run E2E tests
npm run e2e:open         # Open Cypress UI

# Quality
npm run lint             # ESLint
npm audit                # Security audit
npm run analyze          # Bundle analysis

# Docker (optional)
npm run docker:build     # Build image
npm run docker:run       # Run container
npm run compose:up       # Start with docker-compose
```

---

## 🚢 Release Process

1. **Development**: Feature branches → PR → Review → QA
2. **Staging**: Merge to `staging` → Test on staging URL
3. **Production**: Merge `staging` to `main` → Automatic CI/CD → Live!

---

**Last Updated**: February 14, 2026
**Next Review**: February 28, 2026

**Questions?** Check the docs or create an issue on GitHub.
