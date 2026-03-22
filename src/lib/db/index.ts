import type { StoreAdapter } from "./adapter";
import { MemoryAdapter } from "./memory-adapter";

let _adapter: StoreAdapter | null = null;

/**
 * Returns the active store adapter.
 *
 * Selection order:
 *   1. VercelKVAdapter  — when KV_REST_API_URL is present (Vercel linked KV or Upstash)
 *   2. MemoryAdapter    — local dev without credentials (warns on first write)
 *
 * The adapter is instantiated once per process and cached.
 */
export async function getAdapter(): Promise<StoreAdapter> {
  if (_adapter) return _adapter;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { VercelKVAdapter } = await import("./vercel-kv-adapter");
    _adapter = new VercelKVAdapter();
  } else {
    _adapter = new MemoryAdapter();
  }

  return _adapter;
}
