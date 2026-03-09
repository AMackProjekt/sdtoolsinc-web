import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/ui/Footer";
import { PrivacyBanner } from "@/components/ui/PrivacyBanner";
import { WebVitals } from "@/components/WebVitals";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAInit } from "@/components/PWAInit";

export const metadata = {
  metadataBase: new URL('https://sdtoolsinc.org'),
  icons: {
    icon: '/logos/main-logo.png',
    shortcut: '/logos/main-logo.png',
    apple: '/logos/main-logo.png',
  },
  manifest: '/manifest.json',
  title: {
    default: 'T.O.O.L.S. Inc. | Reentry Support & Workforce Development in San Diego, CA',
    template: '%s | T.O.O.L.S. Inc.'
  },
  description: 'T.O.O.L.S. Inc. provides reentry support, workforce development, and wraparound services for justice-involved individuals in San Diego, California.',
  keywords: ['reentry programs San Diego', 'reentry services San Diego', 'justice involved support', 'workforce development', 'second chance employment resources', 'case management', 'wraparound services', 'formerly incarcerated support services', 'social services organization'],
  authors: [{ name: 'T.O.O.L.S Inc' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sdtoolsinc.org',
    siteName: 'T.O.O.L.S. Inc.',
    title: 'T.O.O.L.S. Inc. | Reentry Support & Workforce Development in San Diego, CA',
    description: 'Reentry support, workforce development, and wraparound services for justice-involved individuals in San Diego, California.',
    images: [{
      url: '/logos/main-logo.png',
      width: 1200,
      height: 630,
      alt: 'T.O.O.L.S Inc Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.O.O.L.S. Inc. | Reentry Support & Workforce Development',
    description: 'Reentry support and workforce development for justice-involved individuals in San Diego, California.',
    images: ['/logos/main-logo.png']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "T.O.O.L.S. Inc.",
    "alternateName": "Together Overcoming Obstacles and Limitations",
    "url": "https://sdtoolsinc.org",
    "logo": "https://sdtoolsinc.org/logos/main-logo.png",
    "description": "T.O.O.L.S. Inc. provides reentry support, workforce development, case management, and wraparound services for justice-involved individuals in San Diego, California.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "telephone": "+1-619-350-7638",
        "email": "info@sdtoolsinc.org"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "San Diego"
      },
      {
        "@type": "State",
        "name": "California"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/sd_t.o.o.ls_inc",
      "https://www.facebook.com/TOOLsInc",
      "https://www.tiktok.com/@toolsinc"
    ],
    "knowsAbout": [
      "Reentry Services",
      "Case Management",
      "Job Readiness Training",
      "Educational Support",
      "Wraparound Services"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CLEPBVEEFX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CLEPBVEEFX');
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans text-text antialiased">
        <WebVitals />
        <PrivacyBanner />
        <PWAInit />
        <AuthProvider>
          {children}
          <PWAInstallPrompt />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
