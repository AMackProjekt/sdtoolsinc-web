import "./globals.css";
import type { Metadata } from "next";
import { RouteFooter } from "@/components/ui/RouteFooter";
import { PrivacyBanner } from "@/components/ui/PrivacyBanner";
import { GoogleAnalyticsConsent } from "@/components/ui/GoogleAnalyticsConsent";
import { WebVitals } from "@/components/WebVitals";
import { InteractionAnalytics } from "@/components/InteractionAnalytics";

const baseUrl = "https://sdtoolsinc.org";
const seoDescription = "T.O.O.L.S. Inc. provides essential services to assist justice-involved individuals, displaced veterans, and community members in San Diego through stabilization, resources, education, and employment readiness.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: "T.O.O.L.S. Inc.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logos/tools-inc-crown-official.svg",
    shortcut: "/logos/tools-inc-crown-official.svg",
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "T.O.O.L.S. Inc. | Reentry, Displaced Veteran & Community Services | San Diego",
    template: "%s | T.O.O.L.S. Inc.",
  },
  description: seoDescription,
  keywords: [
    "T.O.O.L.S. Inc.", "Together Overcoming Obstacles and Limitations",
    "TOO LS INC San Diego", "T.O.O.L.S. San Diego",
    "justice-involved support San Diego", "reentry services San Diego",
    "displaced veteran support San Diego", "veteran housing resources San Diego",
    "essential services San Diego", "community stabilization San Diego",
    "workforce readiness San Diego", "DocuReady PrePlan", "Intake Eligibility Form",
  ],
  authors: [{ name: "T.O.O.L.S. Inc." }],
  creator: "T.O.O.L.S. Inc.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "T.O.O.L.S. Inc.",
    title: "T.O.O.L.S. Inc. | Essential Services, Reentry & Community Support",
    description: seoDescription,
    images: [{
      url: "/seo/tools-social-preview.png",
      width: 1200,
      height: 630,
      alt: "T.O.O.L.S. Inc. gold crown and torch over blue emblem",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "T.O.O.L.S. Inc. | Essential Services in San Diego",
    description: seoDescription,
    images: ["/seo/tools-social-preview.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": baseUrl + "/#organization",
  name: "T.O.O.L.S. Inc.",
  alternateName: [
    "Together Overcoming Obstacles and Limitations",
    "T.O.O.L.S.",
    "TOOLS Inc San Diego",
  ],
  url: baseUrl + "/",
  logo: baseUrl + "/logos/tools-inc-crown-official.svg",
  image: baseUrl + "/logos/tools-inc-crown-official.svg",
  description: seoDescription,
  email: "info@sdtoolsinc.org",
  telephone: "+1-619-350-7638",
  address: { "@type": "PostalAddress", addressLocality: "San Diego", addressRegion: "CA", addressCountry: "US" },
  areaServed: { "@type": "Place", name: "San Diego County, California" },
  knowsAbout: [
    "Justice-involved reentry support",
    "Displaced veteran services",
    "Community stabilization",
    "Workforce readiness",
    "Essential service navigation",
    "DocuReady PrePlan", "Intake Eligibility Form Track A and Track B",
  ],
  sameAs: [
    "https://www.instagram.com/sd_t.o.o.ls_inc/",
    "https://www.facebook.com/people/TOOLs-Inc/61556483926772/",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": baseUrl + "/#website",
  url: baseUrl + "/",
  name: "T.O.O.L.S. Inc.",
  publisher: { "@id": baseUrl + "/#organization" },
  inLanguage: "en-US",
  description: seoDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, webSiteSchema]).replace(/</g, "\\u003c") }} />
      </head>
      <body className="font-sans text-text antialiased">
        <GoogleAnalyticsConsent />
        <WebVitals />
        <InteractionAnalytics />
        <PrivacyBanner />
        {children}
        <RouteFooter />
        <div aria-label="Social and profile links" className="border-t border-white/10 bg-[#071324] px-5 py-4 text-center text-sm"><a className="font-semibold text-sky-300 underline underline-offset-4 hover:text-amber-300" href="https://linktr.ee/dthreemack" target="_blank" rel="noopener noreferrer">Explore our Linktree</a></div>
      </body>
    </html>
  );
}
