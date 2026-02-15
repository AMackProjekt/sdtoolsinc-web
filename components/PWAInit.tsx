"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa"

declare global {
  interface Window {
    Sentry?: any;
  }
}

export function PWAInit() {
  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker()

    // Initialize Sentry (error monitoring)
    // Note: Also initialized in next.config.js via @sentry/nextjs
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureMessage("App initialized", "info")
    }
  }, [])

  return null
}
