import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/admin-auth";
import { RedirectTiming } from "@/components/RedirectTiming";
import Script from "next/script";

export const metadata: Metadata = {
  title: "T.O.O.L.S Inc - Admin Portal",
  description: "Administrative dashboard for T.O.O.L.S Inc management",
  icons: {
    icon: "/logos/main-logo.png",
    shortcut: "/logos/main-logo.png",
    apple: "/logos/main-logo.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CLEPBVEEFX"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CLEPBVEEFX');
          `}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <RedirectTiming portal="admin" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
