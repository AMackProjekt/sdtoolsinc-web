"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView, trackQRCodeScan } from "@/lib/analytics";

function GoogleAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize GA on component mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    // Check for QR code UTM parameters
    const utmSource = searchParams?.get("utm_source");
    const utmMedium = searchParams?.get("utm_medium");
    const utmCampaign = searchParams?.get("utm_campaign");

    if (utmSource === "qr_code" || utmMedium === "qr_code") {
      // User arrived via QR code - track the scan
      const qrCodeName = utmCampaign || "unknown";
      trackQRCodeScan(qrCodeName, utmSource || undefined, utmCampaign || undefined);
    }
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  );
}
