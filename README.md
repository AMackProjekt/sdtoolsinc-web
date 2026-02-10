# T.O.O.L.S Inc Website

**Together Overcoming Obstacles and Limitations**

A Next.js 15 web application supporting justice-involved individuals through programs, referrals, and a learning portal.

---

## 📋 Open Pull Requests Documentation

**⭐ NEW**: Comprehensive analysis of all open PRs is now available!

👉 **Start here**: [PR_SUMMARY_FOR_MAINTAINERS.md](PR_SUMMARY_FOR_MAINTAINERS.md) - 5-minute executive summary

**What's included**:
- Analysis of all 8 open PRs with critical issues identified
- Step-by-step resolution plans for each PR
- Recommended merge order and timeline
- Testing checklists and code fix examples

**Key findings**:
- ⛔ PR #17 has merge conflicts + 15 critical bugs requiring fixes
- ✅ PR #14 ready to merge after testing
- 🤔 PR #16 is duplicate of #17 and should be closed

See [PR_DOCS_README.md](PR_DOCS_README.md) for full documentation index.

---

[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38bdf8)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# Install dependencies (includes Next.js 16.1.5 security patch)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

> **⚠️ Security Note:** After pulling latest changes, run `npm install` to update Next.js to 16.1.5, which patches a critical DoS vulnerability (CVE).

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## ⚡ Performance

This website is optimized for performance with:

- **Lighthouse Score**: 90+ (Desktop), 80+ (Mobile) target
- **First Load JS**: ~250KB on homepage
- **Core Web Vitals**: All metrics within target ranges
- **Zero Security Vulnerabilities**: All packages audited and secure

### Performance Features

✅ **Code Splitting** - Dynamic imports for heavy components  
✅ **Lazy Loading** - Components load only when needed  
✅ **CSS Optimization** - Unused CSS automatically removed  
✅ **Bundle Analysis** - Built-in analyzer for optimization  
✅ **Web Vitals Tracking** - Real-time performance monitoring  
✅ **Error Boundaries** - Graceful error handling  
✅ **Optimized Fonts** - Preconnected Google Fonts with swap display  
✅ **Compression** - Gzip/Brotli enabled for all assets

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization guide.

## 🏥 Health Monitoring

Health check endpoints are available for monitoring:

- **`/api/healthz`** - Basic liveness check
- **`/api/readyz`** - Readiness check with dependency verification

See [HEALTH_CHECKS.md](./HEALTH_CHECKS.md) for monitoring documentation.

## 🏗️ Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark theme
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Authentication**: React Context (mock implementation)
- **Deployment**: Azure Static Web Apps + Azure Functions

### Directory Structure

```
├── app/                    # Next.js App Router pages
│   ├── portal/            # User portal (dashboard, courses, profile)
│   ├── interest/          # Interest form page
│   ├── referral/          # Referral submission page
│   └── partnerships/      # Partnership information
├── components/
│   ├── ui/                # Reusable UI components
│   ├── WebVitals.tsx      # Performance monitoring
│   └── ErrorBoundary.tsx  # Error handling
├── api/                   # Azure Functions backend
│   ├── src/functions/     # API endpoints
│   │   ├── healthz/       # Health check
│   │   └── readyz/        # Readiness check
│   └── src/shared/        # Shared utilities
├── public/                # Static assets
├── lib/                   # Utilities and helpers
└── docs/                  # Documentation
```

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run export` | Build and export static site |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run analyze` | Analyze bundle size with visual report |
| `npm run optimize-logos` | Optimize logo images |

### Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run container on port 3000 |
| `npm run docker:stop` | Stop and remove container |
| `npm run compose:up` | Start with Docker Compose |
| `npm run compose:down` | Stop Docker Compose stack |

See [DOCKER.md](./DOCKER.md) for detailed Docker deployment guide.

## 🛠️ Technology Stack

### Frontend
- **Next.js 16.1.5** - React framework with static export (patched for CVE DoS vulnerability)
- **React 19.2.3** - UI library
- **TypeScript 5.7.3** - Type safety
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Framer Motion 11.18.2** - Animation library
- **Recharts 2.15.4** - Charts and data visualization

### Backend
- **Azure Functions v4** - Serverless API
- **TypeScript 5.6.3** - API type safety
- **MSSQL 12.2.0** - Database client

### DevTools
- **@next/bundle-analyzer** - Bundle size analysis
- **ESLint 9** - Code linting
- **Sharp 0.34.5** - Image optimization
- **Critters** - Critical CSS inlining

## 🎨 Design System

The website uses a custom dark theme with:

- **Colors**: Sky blue (#38bdf8), Teal (#2dd4bf), Purple (#a78bfa)
- **Typography**: Inter font with custom scaling
- **Components**: Glass morphism cards, animated buttons, gradient text
- **Responsive**: Mobile-first approach with Tailwind breakpoints

Key design tokens available in `tailwind.config.ts`.

## 🔐 Security

- ✅ Zero npm vulnerabilities
- ✅ React Strict Mode enabled
- ✅ Content Security Policy ready
- ✅ Secure headers configured
- ⚠️ Mock authentication (requires backend for production)

**Note**: Current authentication is for demonstration only. Implement proper backend authentication before production use.

## 🚀 Deployment

### Azure Static Web Apps (Recommended)

The site is configured for automatic deployment to Azure Static Web Apps via GitHub Actions.

**Workflow**: `.github/workflows/azure-static-web-apps-*.yml`

**Process**:
1. Push to `main` or create PR
2. GitHub Actions builds Next.js app
3. Deploys to Azure Static Web Apps
4. Azure Functions API deployed separately

### Docker Deployment

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# View logs
npm run docker:logs
```

See [DOCKER.md](./DOCKER.md) for Azure Container Registry and ACI deployment.

## 📊 Monitoring

### Core Web Vitals

The app tracks these metrics in real-time:

- **FCP** (First Contentful Paint): < 1.8s target
- **LCP** (Largest Contentful Paint): < 2.5s target
- **FID** (First Input Delay): < 100ms target
- **CLS** (Cumulative Layout Shift): < 0.1 target
- **TTFB** (Time to First Byte): < 600ms target

Metrics are logged to console in development and can be sent to analytics in production.

### Health Endpoints

Monitor system health at:
- `/api/healthz` - Basic health check
- `/api/readyz` - Readiness with dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Documentation

- [Performance Guide](./PERFORMANCE.md) - Optimization best practices
- [Health Checks](./HEALTH_CHECKS.md) - Monitoring and alerting
- [Docker Deployment](./DOCKER.md) - Container deployment guide
- [Portal Configuration](./docs/PORTAL_CONFIGURATION.md) - Portal setup, user approval, and role management

## 🐛 Troubleshooting

### Build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Lighthouse score is low
- Run `npm run analyze` to identify large bundles
- Check [PERFORMANCE.md](./PERFORMANCE.md) for optimization tips
- Ensure images are optimized

### Health checks fail
- Verify API is running: `cd api && npm start`
- Check Azure Functions logs
- Review [HEALTH_CHECKS.md](./HEALTH_CHECKS.md)

## 📧 Contact

- **Website**: [https://sdtoolsinc.org](https://sdtoolsinc.org)
- **Email**: info@sdtoolsinc.org
- **Partnership**: partner@sdtoolsinc.org

## 📄 License

See [LICENSE](./LICENSE) for details.

---

**T.O.O.L.S Inc** - Empowering individuals to step into their purpose.
