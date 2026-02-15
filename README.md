# T.O.O.L.S Inc Website

**Together Overcoming Obstacles and Limitations**

Web application supporting justice-involved individuals through programs, referrals, community resources and a Client/CaseManager learning portal.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38bdf8)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# Install dependencies
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

Visit [https://sdtoolsinc.org](https://sdtoolsinc.org) to view the app.

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

## 🔐 Authentication & SSO

Users authenticate once on the main site and are automatically signed in across all portal applications:

- **Unified Login**: Single sign-on via Supabase Auth
- **Multi-Protocol**: Email/password, Magic Links, Azure OAuth
- **Automatic Redirection**: After login, users are redirected to their role-based portal
- **Session Sharing**: Access tokens shared securely between main site and portals
- **Zero Friction**: No re-authentication required when switching portals

See [SSO_IMPLEMENTATION.md](./SSO_IMPLEMENTATION.md) for architecture and testing guide.

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
| `ts-node scripts/validate-links.ts` | Validate external links and portal configuration |

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
- **Next.js 15.5.9** - React framework with static export
- **React 18.3.1** - UI library
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
- **Email**: dmack@sdtoolsinc.org
- **Partnership**: dmack@sdtoolsinc.org

## 📄 License

See [LICENSE](./LICENSE) for details.

---




<img width="2204" height="1120" alt="Screenshot 2026-01-17 143537" src="https://github.com/user-attachments/assets/83deba65-66c4-4c63-8d9f-97f4c09c5b1f" />

**T.O.O.L.S Inc** - Empowering individuals to step into their purpose.

