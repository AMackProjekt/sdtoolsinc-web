import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/admin-auth";
import { RedirectTiming } from "@/components/RedirectTiming";

export const metadata: Metadata = {
  title: "T.O.O.L.S Inc - Admin Portal",
  description: "Administrative dashboard for T.O.O.L.S Inc management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RedirectTiming portal="admin" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
