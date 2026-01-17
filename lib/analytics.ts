import ReactGA from "react-ga4";

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (measurementId && typeof window !== "undefined") {
    ReactGA.initialize(measurementId);
    return true;
  }
  
  if (process.env.NODE_ENV === "development") {
    console.warn("Google Analytics not initialized: NEXT_PUBLIC_GA_MEASUREMENT_ID not set");
  }
  
  return false;
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined") {
    ReactGA.send({ hitType: "pageview", page: url });
  }
};

// Track custom events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined") {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// Track QR code scans
export const trackQRCodeScan = (
  qrCodeName: string,
  source?: string,
  campaign?: string
) => {
  const label = source && campaign 
    ? `${qrCodeName} (${source}/${campaign})`
    : qrCodeName;
    
  trackEvent(
    "QR Code",
    "Scan",
    label,
    undefined
  );
};

// Track QR code downloads
export const trackQRCodeDownload = (qrCodeName: string) => {
  trackEvent("QR Code", "Download", qrCodeName);
};
