export function isDemoModeClient(): boolean {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  }

  const envEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const demoPath = window.location.pathname.startsWith("/demo");
  const queryEnabled = new URLSearchParams(window.location.search).get("demo") === "1";

  return envEnabled || demoPath || queryEnabled;
}
