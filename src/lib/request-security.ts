import { NextRequest, NextResponse } from "next/server";

function getAllowedOrigins(req: NextRequest) {
  const requestOrigin = req.nextUrl.origin;
  const configured = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  ].filter(Boolean) as string[];

  return new Set([requestOrigin, ...configured]);
}

export function ensureTrustedOrigin(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return null;
  }

  const origin = req.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "Missing origin header" }, { status: 403 });
  }

  const allowedOrigins = getAllowedOrigins(req);
  if (!allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  }

  return null;
}