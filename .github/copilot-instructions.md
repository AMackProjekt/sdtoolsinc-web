# toolsinc-dashdarkx - Copilot Instructions

## Project Overview

This is the **T.O.O.LS Inc DashDarkX** - a Next.js 14 dashboard application with dark theme styling. The project uses React 18, TypeScript, Tailwind CSS, with Framer Motion animations and Recharts for data visualization, deployed as an Azure Static Web App.

## Current Architecture

### Technology Stack
- **Framework**: Next.js 14.2.0 (App Router)
- **React**: 18.3.1
- **Styling**: Tailwind CSS 3.4.10 + PostCSS, clsx, tailwind-merge
- **Animation**: Framer Motion 11.0.0
- **Charts**: Recharts 2.12.7
- **TypeScript**: 5.5.4
- **Deployment**: Azure Static Web Apps

### Project State
This project has **core infrastructure** in place:
- Next.js 14 App Router with root layout configured
- Tailwind CSS with custom dark theme design system
- Typography system with responsive heading classes
- Glass morphism UI primitives
- `cn()` utility for class merging
- Reusable component patterns (Button, GlowCard with Framer Motion)
- Full dashboard components (Navbar, SectionHeading, DashboardSection)
- Recharts integration for data visualization
- Complete landing page (`app/page.tsx`) with hero, features, dashboard, and CTA
- Updated Azure deployment workflow with Next.js build
- The `.github/fluentui-master` directory contains a FluentUI monorepo (likely for reference or future integration)

### Next.js Configuration
- **Static Export**: `output: "export"` - generates standalone static HTML/CSS/JS
- **Images**: Unoptimized (required for static export)
- **Trailing Slash**: Enabled for Azure Static Web Apps compatibility
- **Target**: Azure Static Web Apps (no server-side rendering)

## Development Workflows

### Running the Development Server
```bash
npm run dev
```
Starts Next.js development server (default: http://localhost:3000)

### Building for Production
```bash
npm run build        # Standard build
npm run export       # Build + static export for hosting
npm run start        # Preview production build
```

### Linting
```bash
npm run lint
```

## Deployment

### Azure Static Web Apps
- **Deployment Trigger**: Push to `main` branch or pull request
- **Workflow**: `.github/workflows/azure-static-web-apps-red-river-01c6ba710.yml`
- **Configuration**: 
  - Node.js 20 with npm cache
  - Runs `npm ci` then `npm run export`
  - App location: `/` (root)
  - Output location: `out` (Next.js static export)
  - Includes PR preview deployments

## Important Conventions

### When Creating Next.js Structure
When implementing the Next.js application, follow these guidelines:

1. **Use App Router** (Next.js 14 default):
   - Create `app/` directory for routes
   - Use Server Components by default
   - Add `'use client'` directive only when needed (client-side interactivity, hooks, event handlers)

2. **TypeScript Files**:
   - Use `.tsx` for components
   - Use `.ts` for utilities and non-component files
   - Maintain strict TypeScript configurations

3. **Tailwind CSS + Utility Libraries**:
   - Config: `tailwind.config.ts`, `postcss.config.js`
   - Content paths: `./app/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`
   - `app/globals.css` - Tailwind directives + custom utilities
   - Use `clsx` for conditional class names
   - Use `tailwind-merge` via `cn()` utility to merge Tailwind classes safely
   
   **Dark Theme Design System**:
   - Background: `bg-bg` (#06070b), `bg-panel` (#0c0f17)
   - Glass effects: `bg-glass` (rgba overlay) or `.glass` utility class
   - Borders: `border-border` (rgba white 12%)
   - Text: `text-text` (slate-50 96%), `text-muted` (slate-400 92%)
   - Brand colors: `text-brand` (#38bdf8 sky), `text-brand2` (#2dd4bf teal), `text-accent` (#a78bfa purple)
   - Glow effects: `shadow-glow`, `bg-dash-glow` (radial gradients)
   - Custom radii: `rounded-xl` (26px), `rounded-lg` (18px), `rounded-md` (12px)
   - Font: Inter (`font-sans`)
   - Container: `max-w-container` (1200px)
   
   **Typography System** (Webflow/DashDark-style):
   - `.h1` - 42px/56px/72px, tracking-tight2, font-extrabold (responsive)
   - `.h2` - 28px/34px/40px, tracking-tight2, font-extrabold (responsive)
   - `.p-lead` - 16px/18px, text-muted, leading-[1.7]

4. **Animation & Data Visualization**:
   - **Framer Motion**: For smooth animations and transitions
   - **Recharts**: For dashboard charts and data visualization
   - Both require `'use client'` directive when used

5. **Component Organization**:
   - Place reusable UI components in `components/ui/`
   - Use `@/` path alias for imports (e.g., `@/lib/cn`, `@/components/ui/Button`)
   - Client components go in files marked with `'use client'` directive
   - Export component types alongside component for type safety

### FluentUI Integration
The `.github/fluentui-master/` directory contains Microsoft FluentUI codebase. If integrating FluentUI:
- Reference the `AGENTS.md` for Nx workspace patterns
- FluentUI uses Nx monorepo architecture with `nx` commands
- Consider if FluentUI React v9 components are needed

## Key Files & Directories

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration (static export, images, trailing slash)
- `tailwind.config.ts` - Dark theme design system (colors, spacing, typography)
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `app/layout.tsx` - Root layout with metadata and font configuration
- `app/page.tsx` - Landing page with hero, features, dashboard, CTA
- `app/globals.css` - Tailwind directives + custom typography + glass utilities
- `lib/cn.ts` - Utility for merging Tailwind classes with clsx + tailwind-merge
- `components/ui/Button.tsx` - Animated button component with variants
- `components/ui/GlowCard.tsx` - Glass card with scroll animations and hover glow
- `components/ui/SectionHeading.tsx` - Section header with eyebrow/title/subtitle
- `components/ui/Navbar.tsx` - Sticky navigation header with backdrop blur
- `components/ui/DashboardSection.tsx` - Full dashboard layout with charts, KPIs, tables
- `.github/workflows/` - Azure deployment pipeline
- `.github/fluentui-master/` - FluentUI reference codebase (Nx monorepo)
- `.next/` - Next.js build output (gitignored)
- `out/` - Static export output (gitignored)
- `.env` - Environment variables (gitignored)

## Next Steps for Development

When building out the application:

1. **Core Structure Complete** ✅:
   ```
   app/
     layout.tsx       # Root layout with Inter font (exists)
     page.tsx         # Landing page with full sections (exists)
     globals.css      # Tailwind + custom utilities (exists)
   components/
     ui/
       Button.tsx          # Animated button component (exists)
       GlowCard.tsx        # Glass card with animations (exists)
       SectionHeading.tsx  # Section header pattern (exists)
       Navbar.tsx          # Sticky navigation (exists)
       DashboardSection.tsx # Full dashboard (exists)
   lib/
     cn.ts            # Class name utility (exists)
   ```

2. **Design System Ready** ✅:
   - `tailwind.config.ts` - Dark theme configured
   - `postcss.config.js` - Build pipeline configured
   - `app/globals.css` - Custom utilities (.h1, .h2, .glass) ready
   - Typography system, glass effects, and color tokens available

3. **Component Library Started** ✅:
   - `lib/cn.ts` - Class name utility implemented
   - `components/ui/Button.tsx` - Animated button with variants
   - `components/ui/GlowCard.tsx` - Glass card with scroll/hover animations
   - `components/ui/SectionHeading.tsx` - Section header with eyebrow pattern
   - `components/ui/Navbar.tsx` - Sticky nav with backdrop blur
   - `components/ui/DashboardSection.tsx` - Full dashboard with KPIs, charts, tables
   - Pattern established for future components

4. **Next: Build Pages**:
   - ✅ `app/page.tsx` implemented with hero, features, dashboard, CTA
   - ✅ Azure deployment workflow updated to build Next.js
   - ✅ Static export configured for Azure Static Web Apps
   - Ready to extend with additional pages or features as needed

4. **Replace Static HTML**:
   - Remove `index.html` once Next.js routes are ready
   - Update Azure Static Web App workflow to enable Next.js build
   - Remove `index.html` once Next.js routes are ready
   - Update Azure Static Web App workflow to enable Next.js build

4. **Environment Configuration**:
   - Use `.env.local` for local secrets
   - Configure Azure Static Web Apps environment variables in portal

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run export           # Build + static export
npm run start            # Serve production build
npm run lint             # Run ESLint

# Next.js specific
npx next info           # Display Next.js environment info
```

## Common Patterns

### cn() Utility for Class Names
Implemented in `lib/cn.ts` for merging Tailwind classes:
```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
```

### Client Components with Framer Motion
Pattern used in `components/ui/Button.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "ghost", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold";
  const ghost = "glass text-text hover:shadow-glow";
  const primary = "bg-gradient-to-br from-brand to-brand2 text-[#02131a]";

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      className={cn(base, variant === "primary" ? primary : ghost, className)}
      {...props}
    />
  );
}
```

**Key patterns:**
- Extend native HTML props for type safety
- Use variant prop for style alternatives
- Compose classes with `cn()` allowing consumer overrides
- Subtle motion effects: hover lift, tap feedback

### Scroll-Based Animations with GlowCard
Pattern used in `components/ui/GlowCard.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function GlowCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-xl glass p-6",
        "transition-shadow hover:shadow-glow",
        className
      )}
    >
      {/* subtle animated glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-24 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          background:
            "radial-gradient(600px 220px at 30% 20%, rgba(56,189,248,.18), transparent 60%), radial-gradient(500px 200px at 80% 30%, rgba(167,139,250,.16), transparent 55%)"
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
```

**Key patterns:**
- `whileInView` for scroll-triggered animations
- `viewport={{ once: true }}` prevents re-animation on scroll
- `margin: "-60px"` triggers animation slightly before element enters viewport
- Custom easing: `[0.22, 1, 0.36, 1]` for smooth, natural motion
- Layered hover effects: lift + shadow + animated gradient glow
- `pointer-events-none` on decorative elements
- `aria-hidden` for accessibility on visual-only elements

### Dashboard Layout Pattern
Full implementation in `components/ui/DashboardSection.tsx`:

**Sidebar + Main Layout**:
```tsx
<div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[280px_1fr]">
  {/* Sidebar with fixed width on desktop */}
  <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
    {/* Navigation items */}
  </div>
  
  {/* Main content area */}
  <div className="p-5">
    {/* Dashboard content */}
  </div>
</div>
```

**KPI Cards with MiniKpi Component**:
```tsx
function MiniKpi({ label, value, hint }) {
  return (
    <GlowCard className="p-5">
      <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-muted">{hint}</div>
    </GlowCard>
  );
}
```

**Recharts Integration**:
```tsx
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={chartData}>
    <XAxis 
      dataKey="name" 
      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }} 
      axisLine={false} 
      tickLine={false} 
    />
    <Tooltip
      contentStyle={{
        background: "rgba(12,15,23,.92)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 12
      }}
    />
    <Area
      type="monotone"
      dataKey="value"
      stroke="rgba(56,189,248,.85)"
      fill="rgba(56,189,248,.14)"
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
```

**Data Table Pattern**:
```tsx
<table className="w-full text-left text-sm">
  <thead className="text-muted">
    <tr className="border-b border-border">
      <th className="py-2 pr-4 font-semibold">Header</th>
    </tr>
  </thead>
  <tbody className="text-text">
    <tr className="border-b border-border/60">
      <td className="py-3 pr-4 font-semibold">Cell</td>
    </tr>
  </tbody>
</table>
```

**Sticky Navigation with Backdrop Blur**:
```tsx
<header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
  <div className="mx-auto flex max-w-container items-center justify-between px-7 py-4">
    {/* Logo, nav, actions */}
  </div>
</header>
```

### Page Structure Pattern
Full landing page implementation in `app/page.tsx`:
```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Fixed background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      {/* Hero section with gradient text */}
      <section className="mx-auto max-w-container px-7 pt-24 pb-16 text-center">
        <h1 className="h1">
          Title Line 1
          <br />
          <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            Gradient Text
          </span>
        </h1>
        {/* Content */}
      </section>

      {/* Feature grid */}
      <section id="platform" className="mx-auto max-w-container px-7 pt-8 pb-20">
        <SectionHeading />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* GlowCard components */}
        </div>
      </section>

      <DashboardSection />

      {/* CTA section */}
    </main>
  );
}
```

**Key patterns:**
- Fixed background glow with `pointer-events-none` and `-z-10`
- Gradient text using `bg-gradient-to-r`, `bg-clip-text`, `text-transparent`
- Consistent section structure with `max-w-container` and horizontal padding
- Responsive grids that adapt from 1 to 2 to 4 columns

### Design System Usage
Typical dashboard card pattern:
```tsx
<div className="rounded-xl bg-panel border border-border p-6 shadow-glow">
  <h2 className="text-text font-semibold tracking-tight2">Title</h2>
  <p className="text-muted text-sm">Description</p>
</div>
```

Glass effect (two approaches):
```tsx
{/* Option 1: Utility class */}
<div className="glass rounded-lg p-6">
  {/* Content */}
</div>

{/* Option 2: Tailwind classes */}
<div className="bg-glass backdrop-blur-sm rounded-lg border border-border">
  {/* Content */}
</div>
```

Typography patterns:
```tsx
<h1 className="h1 text-text">Hero Heading</h1>
<h2 className="h2 text-text">Section Title</h2>
<p className="p-lead">Lead paragraph with muted text</p>
```

---

**Note**: This is a minimal starter project. Most architectural decisions and conventions should be established as development progresses based on T.O.O.LS Inc's requirements.
