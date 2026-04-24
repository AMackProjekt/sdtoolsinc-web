export function getSafeCallbackUrl(rawCallbackUrl: string | null | undefined, fallbackPath: string): string {
  if (!rawCallbackUrl) return fallbackPath;

  // Accept only same-origin relative paths to avoid open redirects.
  if (rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")) {
    return rawCallbackUrl;
  }

  return fallbackPath;
}
