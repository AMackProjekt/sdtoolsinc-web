"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const analyticsId = "G-CLEPBVEEFX";
const consentKey = "toolsinc_analytics_consent_v1";

/** Basic consent mode: do not fetch Google Analytics until the visitor opts in. */
export function GoogleAnalyticsConsent() {
  useEffect(() => {
    const activate = () => {
      if (document.querySelector('script[data-tools-ga]')) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.gtag("consent", "update", { analytics_storage: "granted" });
      window.gtag("js", new Date());
      window.gtag("config", analyticsId, { anonymize_ip: true });
      const script = document.createElement("script");
      script.async = true;
      script.dataset.toolsGa = "true";
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + analyticsId;
      document.head.appendChild(script);
    };
    const sync = () => {
      try { if (localStorage.getItem(consentKey) === "granted") activate(); }
      catch { /* blocked storage: remain opted out */ }
    };
    sync();
    window.addEventListener("toolsinc:analytics-consent", sync);
    return () => window.removeEventListener("toolsinc:analytics-consent", sync);
  }, []);
  return null;
}
