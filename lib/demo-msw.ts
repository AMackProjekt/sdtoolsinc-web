import { isDemoModeClient } from "@/lib/demo-mode";

let started = false;

export async function initDemoMocks() {
  if (started || typeof window === "undefined") return;
  if (!isDemoModeClient()) return;

  const { worker } = await import("@/mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  });
  started = true;
}
