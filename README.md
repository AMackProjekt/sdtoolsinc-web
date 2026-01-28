# sdtoolsinc-web

T.O.O.L.S Inc Website - Reentry Programs & Support for Justice-Involved Individuals


<img width="2204" height="1120" alt="Screenshot 2026-01-17 143537" src="https://github.com/user-attachments/assets/46636232-eb64-4bb3-a73b-23fd74263cf3" />

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file and add your Google Analytics ID:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your GA4 Measurement ID:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Get your GA4 Measurement ID from [Google Analytics](https://analytics.google.com/).

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ **Next.js 14** with App Router and static export
- ✅ **Google Analytics 4** with privacy-first implementation
- ✅ **GDPR Compliant** cookie consent with granular controls
- ✅ **Dark Theme** with Tailwind CSS
- ✅ **Framer Motion** animations
- ✅ **User Authentication** (mock implementation)
- ✅ **Azure Static Web Apps** deployment ready

## Documentation

- [Google Analytics Setup](docs/GOOGLE_ANALYTICS.md) - Complete GA4 configuration guide
- [Azure CNAME Setup](docs/AZURE_CNAME_SETUP.md) - Custom domain configuration
- [Copilot Instructions](.github/copilot-instructions.md) - Development guidelines
- [Docker Guide](DOCKER.md) - Container deployment
