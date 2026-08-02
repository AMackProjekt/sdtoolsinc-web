import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Admin-specific color scheme (red/orange theme for differentiation)
        bg: "#0a0a0a",
        panel: "#111111",
        glass: "rgba(255,255,255,.04)",
        border: "rgba(255,255,255,.1)",
        text: "rgba(248,250,252,.96)",
        muted: "rgba(148,163,184,.85)",
        // Admin brand colors (red/orange for admin context)
        brand: "#ef4444",        // Red
        brand2: "#f97316",       // Orange
        accent: "#8b5cf6",       // Purple accent
        success: "#10b981",      // Green
        warning: "#f59e0b",      // Amber
        danger: "#ef4444",       // Red
      },
      maxWidth: {
        container: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
