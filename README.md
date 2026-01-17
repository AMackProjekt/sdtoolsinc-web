# T.O.O.L.S Inc Website

Website for T.O.O.L.S Inc (Together Overcoming Obstacles and Limitations), providing reentry programs and support for justice-involved individuals.

## Features

- 🎯 Modern Next.js 14 application with TypeScript
- 📱 Fully responsive design with Tailwind CSS
- 🔐 User authentication and portal system
- 📊 Interactive dashboard with charts
- 🤖 AI-powered chatbot assistance
- 📸 Dynamic QR code generation with download capability
- 📈 Google Analytics 4 integration with UTM tracking

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AMackProjekt/sdtoolsinc-web.git
cd sdtoolsinc-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Google Analytics Measurement ID:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

## Google Analytics Setup

### Getting Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to **Admin** > **Data Streams**
4. Select your web stream (or create one)
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
6. Add it to your `.env` file:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### QR Code Tracking

QR codes automatically include UTM tracking parameters:

- **Interest Form QR Code**: 
  - `utm_source=qr_code`
  - `utm_medium=offline`
  - `utm_campaign=interest_form`

- **Referral Form QR Code**:
  - `utm_source=qr_code`
  - `utm_medium=offline`
  - `utm_campaign=referral_form`

When users scan a QR code and visit the site, the following events are tracked:
- Page views
- QR code scan events (with campaign information)
- QR code download events

### Viewing Analytics

1. Go to your Google Analytics dashboard
2. Navigate to **Reports** > **Engagement** > **Events**
3. Look for:
   - `QR Code` category with `Scan` and `Download` actions
   - Custom campaign parameters in the traffic sources

## QR Code Generator Component

The reusable QR code generator component supports:

- Dynamic QR code generation for any URL
- UTM parameter embedding for tracking
- Download as PNG functionality
- Customizable size, colors, and error correction level
- Responsive design

### Usage Example

```tsx
import { QRCodeGenerator } from "@/components/ui/QRCodeGenerator";

<QRCodeGenerator
  url="https://sdtoolsinc.org/interest"
  name="Interest Form"
  utmParams={{
    source: "qr_code",
    medium: "offline",
    campaign: "interest_form"
  }}
  size={256}
  showDownload={true}
/>
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | string | required | The URL to encode in the QR code |
| `name` | string | required | Display name for analytics tracking |
| `utmParams` | object | optional | UTM parameters for tracking |
| `size` | number | 256 | QR code size in pixels |
| `showDownload` | boolean | true | Show download button |
| `fgColor` | string | "#000000" | QR code foreground color |
| `bgColor` | string | "#FFFFFF" | QR code background color |
| `level` | "L"\|"M"\|"Q"\|"H" | "M" | Error correction level |

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── interest/          # Interest form page with QR code
│   ├── referral/          # Referral form page with QR code
│   ├── portal/            # User portal pages
│   └── layout.tsx         # Root layout with GA integration
├── components/
│   └── ui/                # Reusable UI components
│       ├── QRCodeGenerator.tsx  # QR code component
│       ├── GoogleAnalytics.tsx  # GA tracking wrapper
│       ├── Button.tsx
│       ├── Navbar.tsx
│       └── ...
├── lib/
│   ├── analytics.ts       # Google Analytics utilities
│   ├── auth.tsx          # Authentication context
│   └── cn.ts             # Class name utility
├── public/               # Static assets
└── .env                 # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Build and export static site

## Docker Support

Build and run with Docker:

```bash
npm run docker:build
npm run docker:run
```

Or use Docker Compose:

```bash
npm run compose:up
```

See [DOCKER.md](DOCKER.md) for more details.

## Deployment

The site is configured for deployment to Azure Static Web Apps. See `.github/workflows/` for CI/CD configuration.

## Contributing

This is a private repository for T.O.O.L.S Inc. For questions or support, contact the development team.

## License

Copyright © 2026 T.O.O.L.S Inc. All rights reserved.
