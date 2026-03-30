"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const FALLBACK_CONVEX_URL = "https://example.convex.cloud";
const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? FALLBACK_CONVEX_URL;
const convex = new ConvexReactClient(url);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
