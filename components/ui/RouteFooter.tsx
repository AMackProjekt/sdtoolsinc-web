"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/ui/Footer";

/** Public landing page renders its custom electrified footer; all other routes retain the shared footer. */
export function RouteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}
