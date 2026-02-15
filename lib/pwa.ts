/**
 * Service Worker Registration
 * Safely register service worker for offline support and caching
 */

export function registerServiceWorker() {
  // Only register in production and if service workers are supported
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
    return
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers are not supported in this browser")
    return
  }

  // Register service worker
  navigator.serviceWorker
    .register("/service-worker.js", { scope: "/" })
    .then((registration) => {
      console.log("Service Worker registered:", registration)

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 60000) // Check every minute

      // Listen for new service worker available
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is ready, notify user to refresh
            console.log("New version available! Refresh to update.")
            
            // Dispatch custom event for UI to show update notification
            window.dispatchEvent(
              new CustomEvent("serviceWorkerUpdate", { detail: { registration } })
            )
          }
        })
      })
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error)
    })

  // Handle service worker messages
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "SKIP_WAITING") {
      navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" })
    }
  })
}

/**
 * Check if app is currently offline
 */
export function checkOnlineStatus(): boolean {
  return navigator.onLine
}

/**
 * Listen for online/offline events
 */
export function onOnlineStatusChange(callback: (online: boolean) => void) {
  window.addEventListener("online", () => callback(true))
  window.addEventListener("offline", () => callback(false))

  return () => {
    window.removeEventListener("online", () => callback(true))
    window.removeEventListener("offline", () => callback(false))
  }
}
