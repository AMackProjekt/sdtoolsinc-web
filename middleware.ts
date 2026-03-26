import { auth } from "@/auth";
import { NextResponse } from "next/server";


const DFC_DOMAIN = "dreamsforchange.org";
const PRIVILEGED_PORTAL_EMAILS = new Set([
  "donyale@dreamsforchange.org",
  "dmack@sdtoolsinc.org",
]);

async function verifyTwoFACookie(cookieValue: string, email: string): Promise<boolean> {
  try {
    const parts = cookieValue.split("|");
    if (parts.length !== 3) return false;
    const [emailB64, expiryStr, sig] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    const secret = process.env.TWO_FA_SECRET ?? "fallback-dev-secret";
    const payload = `${emailB64}|${expiryStr}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBytes)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    if (sig !== expectedSig) return false;

    // Decode email from base64url
    const decodedEmail = atob(emailB64.replace(/-/g, "+").replace(/_/g, "/"));
    return decodedEmail === email;
  } catch {
    return false;
  }
}

// auth() from next-auth v5 wraps the handler; the callback can be async
export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user?.role ?? "client";
  const isAuthenticated = Boolean(req.auth?.user?.email);
  const userEmail = (req.auth?.user?.email ?? "").toLowerCase();
  const isPrivilegedPortalUser = PRIVILEGED_PORTAL_EMAILS.has(userEmail);

  const isPortal = pathname.startsWith("/portal/");
  const isProtectedApi = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth") && pathname !== "/api/health";

  if (!isPortal && !isProtectedApi && !pathname.startsWith("/auth/2fa")) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (pathname.startsWith("/portal/admin") || pathname.startsWith("/portal/staff")) {
      return NextResponse.redirect(new URL("/login/staff", req.url));
    }
    return NextResponse.redirect(new URL(
      pathname.startsWith("/portal/client") ? "/login/client" : "/login/staff",
      req.url
    ));
  }

  // Staff/admin portals and admin APIs require a privileged email.
  // The client portal is open to anyone with a valid provisioned client credential.
  const isStaffOrAdminPath =
    pathname.startsWith("/portal/staff") ||
    pathname.startsWith("/portal/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname === "/api/terminal";

  if (isStaffOrAdminPath && !isPrivilegedPortalUser) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/login/staff", req.url));
  }

  // ── Force password change for clients with mustChangePassword flag ───────
  const mustChangePassword = (req.auth as { user?: { mustChangePassword?: boolean } })?.user?.mustChangePassword === true;
  const isChangePasswordPage = pathname === "/portal/client/change-password";
  if (mustChangePassword && role === "client" && !isChangePasswordPage && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/portal/client/change-password", req.url));
  }

  // ── Enforce admin role for admin portal ──────────────────────────────────
  const needsAdminRole = pathname.startsWith("/portal/admin");
  if (needsAdminRole && role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Redirect based on their actual role
    const fallback = role === "staff" ? "/portal/staff" : "/login/staff";
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  // ── Enforce client role for client portal ────────────────────────────────
  const needsClientRole = pathname.startsWith("/portal/client");
  if (needsClientRole && role !== "client") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const fallback = role === "admin" ? "/portal/admin" : "/portal/staff";
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  // ── Enforce staff role for staff portal pages ────────────────────────────
  // (Privileged-email gate already fired above; this ensures the JWT role is also "staff".)
  if (pathname.startsWith("/portal/staff") && role !== "staff") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/login/staff", req.url));
  }

  // ── 2FA gate: skip for the 2FA page itself, API routes, and client-credentials users ────────────
  // Clients who use password auth don't need 2FA (they already have password protection)
  // Staff/Admin use Google OAuth and require 2FA
  if (!pathname.startsWith("/auth/2fa") && !pathname.startsWith("/api/") && role !== "client") {
    const twofaCookie = req.cookies.get("twofa_verified")?.value ?? "";
    const twoFAValid = twofaCookie ? await verifyTwoFACookie(twofaCookie, userEmail) : false;
    if (!twoFAValid) {
      return NextResponse.redirect(new URL("/auth/2fa", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/api/((?!auth/).*)", "/auth/2fa"],
};
