"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/cn"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowPrompt(false)
      setIsInstalled(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-4 right-4 max-w-sm",
          "rounded-xl bg-panel border border-border",
          "shadow-2xl backdrop-blur-md p-4 z-50"
        )}
      >
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-text">Install T.O.O.L.S Inc</h3>
            <p className="text-sm text-muted mt-1">
              Get instant access to your dashboard and offline support.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium",
                "bg-brand text-bg hover:bg-brand transition-colors"
              )}
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium",
                "border border-border text-muted hover:text-text transition-colors"
              )}
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
