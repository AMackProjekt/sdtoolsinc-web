import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'T.O.O.L.S Inc - Empowering Individuals To Step Into Their Purpose',
  description: 'Together Overcoming Obstacles and Limitations',
  manifest: '/manifest.json',
  icons: {
    icon: '/logos/main-logo.png',
    shortcut: '/logos/main-logo.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#14b8a6',
  width: 'device-width',
  initialScale: 1,
};

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/lib/auth';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import BackgroundAgentsBootstrap from '@/components/BackgroundAgentsBootstrap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConvexClientProvider>
            <ThemeProvider>
              {children}
              <BackgroundAgentsBootstrap />
            </ThemeProvider>
          </ConvexClientProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
