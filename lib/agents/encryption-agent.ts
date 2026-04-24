/**
 * lib/agents/encryption-agent.ts
 *
 * Client-side encryption utilities using the Web Crypto API (AES-256-GCM + PBKDF2-SHA-256).
 * All operations are async and run in the browser's native cryptographic subsystem.
 *
 * Safe to import in client components. Never exposes raw key material.
 */

const ALGO = "AES-GCM" as const;
const KEY_USAGES: KeyUsage[] = ["encrypt", "decrypt"];
const HASH = "SHA-256" as const;
const IV_BYTES = 12; // 96-bit IV — recommended for AES-GCM
const PBKDF2_ITERATIONS = 200_000;
const DEFAULT_SALT = "sdtools-client-v1";

// ── Key management ────────────────────────────────────────────────────────────

/** Derive a non-extractable AES-256-GCM key from a password. */
export async function deriveKey(password: string, salt = DEFAULT_SALT): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: HASH,
    },
    keyMaterial,
    { name: ALGO, length: 256 },
    false,
    KEY_USAGES
  );
}

/** Generate an ephemeral AES-256-GCM key (useful for one-time field encryption). */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: ALGO, length: 256 }, false, KEY_USAGES);
}

// ── Field encryption ──────────────────────────────────────────────────────────

/**
 * Encrypt a UTF-8 string with an AES-GCM CryptoKey.
 * Returns a compact payload: `"<ivHex>:<ciphertextHex>"`.
 * The GCM auth tag is appended to the ciphertext by SubtleCrypto automatically.
 */
export async function encryptField(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const enc = new TextEncoder();
  const cipherBuf = await crypto.subtle.encrypt({ name: ALGO, iv }, key, enc.encode(plaintext));
  return `${toHex(iv)}:${toHex(new Uint8Array(cipherBuf))}`;
}

/**
 * Decrypt a payload produced by `encryptField`.
 * Throws if the auth tag is invalid (tampered ciphertext).
 */
export async function decryptField(payload: string, key: CryptoKey): Promise<string> {
  const colonIdx = payload.indexOf(":");
  if (colonIdx === -1) throw new Error("Invalid encrypted payload — missing delimiter");
  const iv = fromHex(payload.slice(0, colonIdx));
  const cipherBuf = fromHex(payload.slice(colonIdx + 1));
  const ivBytes = toArrayBuffer(iv);
  const cipherBytes = toArrayBuffer(cipherBuf);
  const plainBuf = await crypto.subtle.decrypt({ name: ALGO, iv: ivBytes }, key, cipherBytes);
  return new TextDecoder().decode(plainBuf);
}

// ── Integrity ──────────────────────────────────────────────────────────────────

/** Compute SHA-256 of a string and return the hex digest. */
export async function hashData(data: string): Promise<string> {
  const buf = await crypto.subtle.digest(HASH, new TextEncoder().encode(data));
  return toHex(new Uint8Array(buf));
}

/**
 * Constant-time comparison of a string against its expected SHA-256 hex digest.
 * Prevents timing attacks on integrity checks.
 */
export async function verifyIntegrity(data: string, expectedHash: string): Promise<boolean> {
  const actual = await hashData(data);
  if (actual.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) {
    diff |= actual.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return diff === 0;
}

// ── Token generation ──────────────────────────────────────────────────────────

/** Generate a cryptographically secure random hex token. */
export function generateSecureToken(byteLength = 32): string {
  return toHex(crypto.getRandomValues(new Uint8Array(byteLength)));
}

/** Generate a URL-safe base64 token (no +, /, = padding). */
export function generateUrlSafeToken(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ── HMAC ─────────────────────────────────────────────────────────────────────

/** Generate an HMAC-SHA-256 signature for a message using a raw key string. */
export async function signHMAC(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: HASH },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(new Uint8Array(sig));
}

/** Verify an HMAC-SHA-256 signature. Constant-time. */
export async function verifyHMAC(
  message: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expected = await signHMAC(message, secret);
  return verifyIntegrity(expected, signature);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  if (bytes.buffer instanceof ArrayBuffer) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }
  return Uint8Array.from(bytes).buffer;
}
