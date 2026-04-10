/**
 * lib/chat-crypto.ts
 *
 * Server-side AES-256-GCM encryption helpers for the secure messaging system.
 * Used exclusively in API route handlers (Node.js runtime — never imported by
 * client components).
 *
 * Key derivation: PBKDF2-SHA-256 from CHAT_ENCRYPTION_KEY env var.
 * Ciphertext format: "<ivHex>:<authTagHex>:<ciphertextHex>"
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  pbkdf2Sync,
} from "node:crypto";

const ALGO = "aes-256-gcm" as const;
const IV_LEN = 12; // 96-bit IV recommended for GCM
const TAG_LEN = 16; // 128-bit auth tag
const KEY_LEN = 32; // 256-bit key
const SALT = "sdtools-chat-salt-v1";
const ITERATIONS = 100_000;

// Cache the derived key for the lifetime of the server process.
let _cachedKey: Buffer | null = null;

function getDerivedKey(): Buffer {
  if (_cachedKey) return _cachedKey;
  const secret =
    process.env.CHAT_ENCRYPTION_KEY ??
    "dev-fallback-key-change-before-production";
  _cachedKey = pbkdf2Sync(secret, SALT, ITERATIONS, KEY_LEN, "sha256");
  return _cachedKey;
}

/**
 * Encrypt a UTF-8 string.
 * Returns  "<ivHex>:<authTagHex>:<ciphertextHex>"
 */
export function encryptText(plaintext: string): string {
  const key = getDerivedKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv, {
    authTagLength: TAG_LEN,
  } as Parameters<typeof createCipheriv>[3]);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

/**
 * Decrypt a payload produced by encryptText.
 */
export function decryptText(payload: string): string {
  const parts = payload.split(":");
  if (parts.length !== 3) throw new Error("Invalid ciphertext — expected iv:tag:cipher");
  const [ivHex, tagHex, cipherHex] = parts;
  const key = getDerivedKey();
  const decipher = createDecipheriv(
    ALGO,
    key,
    Buffer.from(ivHex, "hex"),
    { authTagLength: TAG_LEN } as Parameters<typeof createDecipheriv>[3]
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const plain =
    decipher.update(Buffer.from(cipherHex, "hex")).toString("utf8") +
    decipher.final("utf8");
  return plain;
}

/**
 * Encrypt binary data (Buffer).
 * Internally base64-encodes the raw bytes then encrypts the resulting string.
 */
export function encryptBuffer(buf: Buffer): string {
  return encryptText(buf.toString("base64"));
}

/**
 * Decrypt binary data encrypted with encryptBuffer.
 */
export function decryptBuffer(payload: string): Buffer {
  return Buffer.from(decryptText(payload), "base64");
}
