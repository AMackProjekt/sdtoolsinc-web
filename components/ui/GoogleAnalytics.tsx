"use client";

import { useEffect } from "react";
import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      const preferences = JSON.parse(consent);
      
      // Only initialize GA if analytics cookies are accepted
      if (preferences.analytics && typeof window !== "undefined") {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          // @ts-ignore
          window.dataLayer.push(args);
        }
        // @ts-ignore
        window.gtag = gtag;
        
        gtag("js", new Date());
        gtag("config", measurementId, {
          page_path: window.location.pathname,
          anonymize_ip: true, // GDPR compliance
        });
      }
    }
  }, [measurementId]);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (consent) {
        const preferences = JSON.parse(consent);
        
        if (typeof window !== "undefined" && window.gtag) {
          if (preferences.analytics) {
            // @ts-ignore
            window.gtag("consent", "update", {
              analytics_storage: "granted",
            });
          } else {
            // @ts-ignore
            window.gtag("consent", "update", {
              analytics_storage: "denied",
            });
          }
        }
      }
    };

    window.addEventListener("storage", handleConsentChange);
    return () => window.removeEventListener("storage", handleConsentChange);
  }, []);

  // Check if analytics is enabled
  const consent = typeof window !== "undefined" 
    ? localStorage.getItem("cookie-consent") 
    : null;
  
  const analyticsEnabled = consent 
    ? JSON.parse(consent).analytics 
    : false;

  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}

// Hook for tracking page views (use in app router)
export function useGoogleAnalytics() {
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      const preferences = JSON.parse(consent);
      
      if (preferences.analytics && typeof window !== "undefined" && window.gtag) {
        const handleRouteChange = () => {
          // @ts-ignore
          window.gtag("event", "page_view", {
            page_path: window.location.pathname,
            page_title: document.title,
          });
        };

        // Track initial page view
        handleRouteChange();

        // Listen for route changes (Next.js 14)
        window.addEventListener("popstate", handleRouteChange);
        
        return () => {
          window.removeEventListener("popstate", handleRouteChange);
        };
      }
    }
  }, []);
}

// Helper function to track custom events
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  const consent = localStorage.getItem("cookie-consent");
  if (consent) {
    const preferences = JSON.parse(consent);
    
    if (preferences.analytics && typeof window !== "undefined" && window.gtag) {
      // @ts-ignore
      window.gtag("event", eventName, parameters);
    }
  }
}

// Helper function to track conversions
export function trackConversion(conversionId: string, value?: number) {
  trackEvent("conversion", {
    send_to: conversionId,
    value: value,
  });
}
