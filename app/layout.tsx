import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/ui/Footer";
import { GoogleAnalytics } from "@/components/ui/GoogleAnalytics";

export const metadata = {
  metadataBase: new URL('https://sdtoolsinc.org'),
  title: {
    default: 'T.O.O.L.S Inc - Reentry Programs & Support for Justice-Involved Individuals',
    template: '%s | T.O.O.L.S Inc'
  },
  description: 'Empowering justice-involved individuals through job training, case management, and wraparound reentry services. 48-hour response. California statewide.',
  keywords: ['reentry programs', 'reentry services', 'justice involved', 'job readiness', 'case management', 'wraparound services', 'california', 'formerly incarcerated', 'reentry support'],
  authors: [{ name: 'T.O.O.L.S Inc' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sdtoolsinc.org',
    siteName: 'T.O.O.L.S Inc',
    title: 'T.O.O.L.S Inc - Reentry Programs & Support',
    description: 'Comprehensive support for justice-involved individuals through job training, case management, and wraparound services.',
    images: [{
      url: '/logos/main-logo.png',
      width: 1200,
      height: 630,
      alt: 'T.O.O.L.S Inc Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T.O.O.L.S Inc - Reentry Programs',
    description: 'Comprehensive support for justice-involved individuals',
    images: ['/logos/main-logo.png']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "T.O.O.L.S Inc",
    "alternateName": "Together Overcoming Obstacles and Limitations",
    "url": "https://sdtoolsinc.org",
    "logo": "https://sdtoolsinc.org/logos/main-logo.png",
    "description": "T.O.O.L.S Inc supports justice-involved individuals through comprehensive reentry programs, case management, and wraparound services.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "State",
      "name": "California"
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans text-text antialiased">
        <GoogleAnalytics />
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
