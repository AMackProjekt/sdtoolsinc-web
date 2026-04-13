"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function DemoLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // Check NDA acceptance
    const accepted = localStorage.getItem("nda_accepted") === "true";
    setNdaAccepted(accepted);
    setIsLoading(false);

    // If NDA not accepted and not on NDA page, redirect
    if (!accepted && !pathname.includes("/nda")) {
      router.push("/demo/nda");
    }
  }, [pathname, router]);

  if (!isClient || isLoading) {
    return null;
  }

  // If on NDA page, allow access
  if (pathname.includes("/nda")) {
    return children;
  }

  // If NDA accepted, show children
  if (ndaAccepted) {
    return children;
  }

  // Otherwise, don't render anything (redirect will happen)
  return null;
}
