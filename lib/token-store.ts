import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { AccessToken, createAccessToken, validateAccessToken } from "@/lib/token-utils";

/**
 * File-based token storage (can be migrated to database).
 * In production, use a proper database with encryption.
 */

const TOKEN_STORE_PATH = path.join(process.cwd(), ".data", "access-tokens.json");

/**
 * Ensure the data directory exists.
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(TOKEN_STORE_PATH), { recursive: true });
  } catch {
    // directory may already exist
  }
}

/**
 * Load all tokens from storage.
 */
export async function loadTokenStore(): Promise<AccessToken[]> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(TOKEN_STORE_PATH, "utf-8");
    return JSON.parse(content) as AccessToken[];
  } catch {
    // File doesn't exist or is invalid — return empty array
    return [];
  }
}

/**
 * Save tokens to storage.
 */
async function saveTokenStore(tokens: AccessToken[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TOKEN_STORE_PATH, JSON.stringify(tokens, null, 2), "utf-8");
}

/**
 * Add a new token to the store.
 */
export async function addToken(
  email: string,
  role: "admin" | "staff" | "participant" = "staff",
  expiresInDays?: number
): Promise<{ token: AccessToken; plainToken: string }> {
  const tokens = await loadTokenStore();
  const newToken = createAccessToken(email, role, expiresInDays);

  // Keep plainToken separate — we'll return it to the caller once
  const plainToken = newToken.token;

  // Store without the plainToken in the JSON
  const storedToken = { ...newToken };
  tokens.push(storedToken);
  await saveTokenStore(tokens);

  return { token: storedToken, plainToken };
}

/**
 * Find and verify a token.
 */
export async function findAndVerifyToken(plainToken: string): Promise<{
  valid: boolean;
  email?: string;
  role?: string;
  reason?: string;
}> {
  const tokens = await loadTokenStore();
  const tokenHash = createHash("sha256").update(plainToken).digest("hex");
  const storedToken = tokens.find((t) => t.tokenHash === tokenHash);

  if (!storedToken) {
    return { valid: false, reason: "Token not found" };
  }

  const validation = validateAccessToken(plainToken, storedToken);
  if (!validation.valid) {
    return { valid: false, reason: validation.reason };
  }

  return { valid: true, email: storedToken.email, role: storedToken.role };
}

/**
 * List all active tokens.
 */
export async function listTokens(): Promise<Array<Omit<AccessToken, "tokenHash">>> {
  const tokens = await loadTokenStore();
  return tokens.map((t) => ({
    id: t.id,
    email: t.email,
    token: t.token,
    role: t.role,
    createdAt: t.createdAt,
    expiresAt: t.expiresAt,
    active: t.active,
  }));
}

/**
 * Revoke a token by ID.
 */
export async function revokeToken(tokenId: string): Promise<boolean> {
  const tokens = await loadTokenStore();
  const index = tokens.findIndex((t) => t.id === tokenId);

  if (index === -1) return false;

  tokens[index].active = false;
  await saveTokenStore(tokens);
  return true;
}

/**
 * Get token by email.
 */
export async function getTokensByEmail(email: string): Promise<Array<Omit<AccessToken, "tokenHash">>> {
  const tokens = await loadTokenStore();
  return tokens
    .filter((t) => t.email === email.toLowerCase())
    .map((t) => ({
      id: t.id,
      email: t.email,
      token: t.token,
      role: t.role,
      createdAt: t.createdAt,
      expiresAt: t.expiresAt,
      active: t.active,
    }));
}
