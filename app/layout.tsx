import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "T.O.O.L.S Inc - Empowering Individuals To Step Into Their Purpose",
  description: "Together Overcoming Obstacles and Limitations",
  icons: {
    icon: "/logos/main-logo.png",
    shortcut: "/logos/main-logo.png",
    apple: "/logos/main-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-text antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
