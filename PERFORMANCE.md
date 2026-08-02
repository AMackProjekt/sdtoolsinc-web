# Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented for the T.O.O.L.S Inc website and best practices for maintaining optimal performance.

## Performance Targets

Our website meets or exceeds these Core Web Vitals targets:

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Lighthouse Performance Goals

- **Desktop**: 90+ score
- **Mobile**: 80+ score

## Implemented Optimizations

### 1. Package Updates and Security

✅ All npm packages updated to latest stable versions:
- Next.js 15.1.3 (from 14.2.0)
- React 18.3.1 (latest stable)
- TypeScript 5.7.3 (from 5.4.5)
- Framer Motion 11.18.2 (from 11.0.0)
- All other dependencies updated

✅ Security vulnerabilities resolved:
- Fixed high-severity glob vulnerabilities
- Updated eslint-config-next to secure version
- Zero vulnerabilities reported by `npm audit`

### 2. Next.js Configuration Optimizations

**Enabled Features:**
- ✅ React Strict Mode - catches potential problems early
- ✅ SWC Minification - faster build times and smaller bundles
- ✅ Compression (gzip/brotli) - reduced asset sizes
- ✅ CSS Optimization - removed unused CSS
- ✅ Package Import Optimization - optimizes recharts and framer-motion

**Configuration:**
```javascript
// next.config.js
{
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['recharts', 'framer-motion'],
  }
}
```

### 3. Font Optimization

✅ Using `next/font` for optimal font loading:
- Automatic font subsetting
- Zero layout shift
- Preloaded fonts
- Optimized font display strategy

```typescript
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});
```

### 4. Code Splitting and Lazy Loading

✅ Heavy components are dynamically imported:
- `DashboardSection` - lazy loaded with SSR
- `InteractiveTiles` - lazy loaded with SSR
- `ChatBot` - client-side only, lazy loaded
- `CookieConsent` - client-side only, lazy loaded

**Benefits:**
- Reduced initial bundle size
- Faster Time to Interactive (TTI)
- Lower First Contentful Paint (FCP)

```typescript
const DashboardSection = dynamic(() => import("@/components/ui/DashboardSection"), {
  loading: () => <div>Loading...</div>,
  ssr: true,
});
```

### 5. Image Optimization

✅ Next.js Image component configured:
- AVIF and WebP format support
- Responsive image sizes
- Lazy loading by default
- Automatic srcset generation

**Note**: Due to static export (`output: "export"`), images are marked as `unoptimized: true`. For full image optimization, consider:
- Using a CDN with image optimization
- Pre-optimizing images before deployment
- Using WebP/AVIF formats in the `/public` directory

### 6. Bundle Analysis

✅ Bundle analyzer configured:
```bash
npm run analyze
```

This generates an interactive bundle analysis showing:
- Largest modules in your bundle
- Duplicate dependencies
- Optimization opportunities

### 7. Core Web Vitals Tracking

✅ Real-time performance monitoring:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)
- INP (Interaction to Next Paint)

Metrics are logged in development and can be sent to analytics in production.

### 8. Error Handling

✅ Comprehensive error boundaries:
- Global error boundary (`app/error.tsx`)
- Graceful error recovery
- User-friendly error messages
- Development-mode error details

### 9. CSS Optimization

✅ Tailwind CSS optimizations:
- Purged unused styles in production
- Minified CSS output
- CSS variables for theming
- Optimized font loading

### 10. API Health Checks

✅ Health monitoring endpoints available:
- `/api/healthz` - Basic health check
- `/api/readyz` - Readiness check (can be extended for database checks)

## Best Practices

### Development

1. **Run bundle analysis regularly:**
   ```bash
   npm run analyze
   ```

2. **Monitor Web Vitals in development:**
   - Check browser console for Web Vitals metrics
   - Use Chrome DevTools Performance panel

3. **Test with slow connections:**
   - Use Chrome DevTools Network throttling
   - Test on real mobile devices

### Code Splitting Guidelines

**When to use dynamic imports:**
- Components > 50KB
- Third-party libraries
- Components below the fold
- Admin/dashboard features
- Charts and data visualizations

**Example:**
```typescript
// Heavy chart component
const MyChart = dynamic(() => import('./MyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // if client-side only
});
```

### Image Guidelines

1. **Use appropriate formats:**
   - WebP for photographs (smaller than JPEG)
   - SVG for logos and icons
   - PNG for images requiring transparency

2. **Optimize before deployment:**
   ```bash
   npm run optimize-logos
   ```

3. **Use responsive images:**
   - Provide multiple sizes
   - Use `sizes` attribute
   - Let Next.js generate srcset

### CSS Guidelines

1. **Avoid inline styles** when possible
2. **Use Tailwind utilities** for consistency
3. **Extract repeated patterns** into components
4. **Remove unused Tailwind classes** (automatic in production)

### Performance Budget

Monitor these metrics in CI/CD:

| Metric | Budget |
|--------|--------|
| First Load JS | < 200 KB |
| Page Bundle Size | < 100 KB |
| Total Bundle Size | < 500 KB |
| Lighthouse Performance | > 90 (desktop) |
| Lighthouse Performance | > 80 (mobile) |

## Monitoring in Production

### Recommended Tools

1. **Vercel Analytics** (if deployed on Vercel)
   - Real User Monitoring (RUM)
   - Core Web Vitals tracking
   - Zero configuration

2. **Google Analytics 4**
   - Custom Web Vitals events
   - User behavior tracking

3. **Sentry** or **LogRocket**
   - Error tracking
   - Performance monitoring
   - Session replay

### Implementation Example

Add to `components/WebVitals.tsx`:

```typescript
useReportWebVitals((metric) => {
  // Send to analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
```

## Continuous Optimization

### Regular Tasks

**Weekly:**
- [ ] Review bundle size reports
- [ ] Check for console warnings

**Monthly:**
- [ ] Update dependencies (`npm outdated`)
- [ ] Run security audit (`npm audit`)
- [ ] Run Lighthouse tests on staging
- [ ] Review Web Vitals in production

**Quarterly:**
- [ ] Major dependency updates
- [ ] Performance audit with real users
- [ ] Review and update performance budgets
- [ ] Optimize images in `/public` directory

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Analyze bundle
npm run analyze

# Run linter
npm run lint

# Static export
npm run export
```

## Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

## Troubleshooting

### Large Bundle Size

1. Run `npm run analyze` to identify large modules
2. Use dynamic imports for heavy components
3. Check for duplicate dependencies
4. Consider removing unused dependencies

### Poor LCP Score

1. Optimize above-the-fold images
2. Preload critical resources
3. Reduce render-blocking JavaScript
4. Use server-side rendering if possible

### High CLS Score

1. Add width/height to images
2. Reserve space for dynamic content
3. Use font-display: swap
4. Avoid inserting content above existing content

### Slow TTI

1. Reduce JavaScript bundle size
2. Implement code splitting
3. Defer non-critical JavaScript
4. Optimize third-party scripts

## Contact

For questions or suggestions about performance optimization:
- Email: info@sdtoolsinc.org
- GitHub Issues: [sdtoolsinc-web repository]
