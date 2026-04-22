import crypto from "crypto";

/**
 * Full access pass token utilities for enterprise portal access.
 * Tokens are cryptographically generated and hashed for storage.
 */

export interface AccessToken {
  id: string;
  email: string;
  token: string; // Plain token (shown once on creation)
  tokenHash: string; // Hashed token for storage
  role: "admin" | "staff" | "participant";
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

/**
 * Generate a cryptographically secure random token.
 * Format: TOOLS_<random>
 */
export function generateToken(): string {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return `TOOLS_${randomBytes}`;
}

/**
 * Hash a token using SHA-256 for secure storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Verify a plain token against a stored hash.
 */
export function verifyToken(token: string, tokenHash: string): boolean {
  return hashToken(token) === tokenHash;
}

/**
 * Create a new access token record for an email.
 */
export function createAccessToken(
  email: string,
  role: "admin" | "staff" | "participant" = "staff",
  expiresInDays?: number
): AccessToken {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const now = new Date();
  const expiresAt = expiresInDays
    ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  return {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    token,
    tokenHash,
    role,
    createdAt: now.toISOString(),
    expiresAt,
    active: true,
  };
}

/**
 * Check if a token is expired.
 */
export function isTokenExpired(accessToken: AccessToken): boolean {
  if (!accessToken.expiresAt) return false;
  return new Date().getTime() > new Date(accessToken.expiresAt).getTime();
}

/**
 * Validate an access token (check hash and expiration).
 */
export function validateAccessToken(
  plainToken: string,
  storedToken: AccessToken
): { valid: boolean; reason?: string } {
  if (!storedToken.active) {
    return { valid: false, reason: "Token is inactive" };
  }

  if (isTokenExpired(storedToken)) {
    return { valid: false, reason: "Token is expired" };
  }

  if (!verifyToken(plainToken, storedToken.tokenHash)) {
    return { valid: false, reason: "Token hash mismatch" };
  }

  return { valid: true };
}
