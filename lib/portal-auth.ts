export function getSafeCallbackUrl(rawCallbackUrl: string | null | undefined, fallbackPath: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (!rawCallbackUrl) {
    return origin ? `${origin}${fallbackPath}` : fallbackPath;
  }

  // Accept only same-origin relative paths to avoid open redirects.
  if (rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")) {
    return origin ? `${origin}${rawCallbackUrl}` : rawCallbackUrl;
  }

  return origin ? `${origin}${fallbackPath}` : fallbackPath;
}
