import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  // Enforce HTTPS for 1 year; include subdomains
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Prevent clickjacking — portal should never be framed
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Reduce referrer leakage across origins
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable features not needed in a case-management portal
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Opt out of DNS prefetch to reduce information leakage
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // Content Security Policy
  // unsafe-inline / unsafe-eval required by Next.js App Router + Tailwind
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + Vercel Speed Insights
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      // Tailwind + NextAuth inline styles
      "style-src 'self' 'unsafe-inline'",
      // Images: self, data URIs, blobs (profile photos), HTTPS (Google avatars)
      "img-src 'self' data: blob: https:",
      // WebSocket + HTTP connections to Convex and Google OAuth
      [
        "connect-src 'self'",
        "https://rightful-firefly-201.convex.cloud",
        "wss://rightful-firefly-201.convex.cloud",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
      ].join(" "),
      // Only Google frames allowed (OAuth popup, Chat embed)
      "frame-src https://accounts.google.com https://chat.google.com",
      // Disallow being embedded in any frame
      "frame-ancestors 'none'",
      // No plugins
      "object-src 'none'",
      // Lock down base tag
      "base-uri 'self'",
      // Forms may only submit to self
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
