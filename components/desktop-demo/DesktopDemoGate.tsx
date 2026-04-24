"use client";

/**
 * components/desktop-demo/DesktopDemoGate.tsx
 *
 * Client-side NDA gate for the /desktop-demo route tree.
 * - Checks Electron IPC first (packaged app), then falls back to localStorage (dev)
 * - Redirects to /desktop-demo/nda if NDA not yet accepted
 * - Renders nothing until the check is complete (prevents flicker)
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function DesktopDemoGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onNDAPage = pathname === "/desktop-demo/nda";

    async function check() {
      try {
        // Try Electron IPC bridge first
        if (typeof window !== "undefined" && window.electronBridge?.checkNda) {
          const record = await window.electronBridge.checkNda();
          if (record?.accepted) {
            setReady(true);
          } else if (!onNDAPage) {
            router.replace("/desktop-demo/nda");
          } else {
            setReady(true);
          }
          return;
        }

        // Browser / dev mode fallback
        const accepted = localStorage.getItem("desktop_nda_accepted") === "true";
        if (accepted) {
          setReady(true);
        } else if (!onNDAPage) {
          router.replace("/desktop-demo/nda");
        } else {
          setReady(true);
        }
      } catch {
        setReady(true);
      }
    }

    check();
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
