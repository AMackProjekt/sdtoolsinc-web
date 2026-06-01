const rateLimitCache = new Map<string, { count: number; expiresAt: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = rateLimitCache.get(key);

  if (!existing || existing.expiresAt <= now) {
    rateLimitCache.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (existing.count >= limit) {
    return true;
  }

  existing.count += 1;
  rateLimitCache.set(key, existing);
  return false;
}

export function buildRateLimitKey(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join("|").toLowerCase();
}
