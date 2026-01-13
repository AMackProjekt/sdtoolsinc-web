import "./globals.css";

export const metadata = {
  title: "TOOLS Inc — DashDark X",
  description: "Modern systems. Real-world impact. Built for scale, clarity, and outcomes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-text antialiased">
        {children}
      </body>
    </html>
  );
}
