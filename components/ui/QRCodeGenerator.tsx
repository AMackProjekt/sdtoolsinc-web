"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { trackQRCodeDownload } from "@/lib/analytics";

export type QRCodeGeneratorProps = {
  /**
   * The URL to encode in the QR code
   */
  url: string;
  
  /**
   * UTM parameters for tracking
   */
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  
  /**
   * Display name for the QR code (used in analytics)
   */
  name: string;
  
  /**
   * Size of the QR code in pixels
   * @default 256
   */
  size?: number;
  
  /**
   * Whether to show the download button
   * @default true
   */
  showDownload?: boolean;
  
  /**
   * Custom className for the container
   */
  className?: string;
  
  /**
   * QR code foreground color
   * @default "#000000"
   */
  fgColor?: string;
  
  /**
   * QR code background color
   * @default "#FFFFFF"
   */
  bgColor?: string;
  
  /**
   * Error correction level
   * @default "M"
   */
  level?: "L" | "M" | "Q" | "H";
};

/**
 * QR Code Generator Component
 * 
 * Generates a QR code for a given URL with optional UTM tracking parameters.
 * Includes download functionality and Google Analytics tracking.
 * 
 * @example
 * ```tsx
 * <QRCodeGenerator
 *   url="https://sdtoolsinc.org/interest"
 *   name="Interest Form"
 *   utmParams={{
 *     source: "qr_code",
 *     medium: "offline",
 *     campaign: "interest_form"
 *   }}
 * />
 * ```
 */
export function QRCodeGenerator({
  url,
  utmParams,
  name,
  size = 256,
  showDownload = true,
  className,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  level = "M",
}: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Build URL with UTM parameters
  const buildTrackingUrl = () => {
    const urlObj = new URL(url);
    
    if (utmParams) {
      if (utmParams.source) urlObj.searchParams.set("utm_source", utmParams.source);
      if (utmParams.medium) urlObj.searchParams.set("utm_medium", utmParams.medium);
      if (utmParams.campaign) urlObj.searchParams.set("utm_campaign", utmParams.campaign);
      if (utmParams.content) urlObj.searchParams.set("utm_content", utmParams.content);
      if (utmParams.term) urlObj.searchParams.set("utm_term", utmParams.term);
    }
    
    return urlObj.toString();
  };

  const trackingUrl = buildTrackingUrl();

  // Download QR code as PNG
  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Draw SVG on canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);

      // Convert canvas to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const pngUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-code-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pngUrl);

        // Track download event
        trackQRCodeDownload(name);
      });
    };
    img.src = svgUrl;
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.div
        ref={qrRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl bg-white p-4 shadow-lg"
      >
        <QRCodeSVG
          value={trackingUrl}
          size={size}
          level={level}
          fgColor={fgColor}
          bgColor={bgColor}
          includeMargin={false}
        />
      </motion.div>

      {showDownload && (
        <Button
          variant="ghost"
          onClick={handleDownload}
          className="text-sm"
        >
          Download QR Code
        </Button>
      )}

      {/* Show tracking URL for debugging in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 max-w-full overflow-hidden">
          <p className="text-xs text-muted break-all">
            {trackingUrl}
          </p>
        </div>
      )}
    </div>
  );
}
