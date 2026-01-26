import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#06070b',
        panel: '#0c0f17',
        glass: 'rgba(255,255,255,.06)',
        border: 'rgba(255,255,255,.12)',
        text: 'rgba(248,250,252,.96)',
        muted: 'rgba(148,163,184,.92)',
        brand: '#38bdf8',
        brand2: '#2dd4bf',
        accent: '#a78bfa',
      },
      maxWidth: {
        container: '1200px',
      },
      backgroundImage: {
        'dash-glow': 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.08), transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
