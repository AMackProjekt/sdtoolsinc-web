import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaseFlow Command',
  description: 'Modern case management platform',
};

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthSessionProvider } from '@/components/AuthSessionProvider';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <ConvexClientProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
