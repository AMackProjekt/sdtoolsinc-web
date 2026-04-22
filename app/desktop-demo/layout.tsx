"use client";

/**
 * app/desktop-demo/layout.tsx
 *
 * Root layout for the Electron desktop demo. Wraps all desktop-demo pages in
 * DemoAuthProvider (same mock auth as /demo) and enforces the NDA gate.
 * If the NDA hasn't been accepted yet, only the /desktop-demo/nda page renders.
 */

import { DemoAuthProvider } from "@/lib/demo-auth";
import { DesktopDemoGate } from "@/components/desktop-demo/DesktopDemoGate";

export default function DesktopDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoAuthProvider>
      <DesktopDemoGate>{children}</DesktopDemoGate>
    </DemoAuthProvider>
  );
}
