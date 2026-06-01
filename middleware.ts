import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PORTAL_AUTH_ROUTES: Record<string, string> = {
  "/portal/admin": "/portal/admin/auth",
  "/portal/staff": "/portal/staff/auth",
  "/portal/participant": "/portal/participant/auth",
  "/portal/finance": "/portal/finance/auth",
  "/portal/hr": "/portal/hr/auth",
  "/portal/news": "/portal/news/auth",
  "/portal/enterprise": "/portal/enterprise/auth",
  "/portal/client": "/portal/client/auth",
};
const ENTERPRISE_PREFIX = "/portal/enterprise";
const ENTERPRISE_AUTH_PAGE = "/portal/enterprise/auth";
const CLIENT_PREFIX = "/portal/client";
const CLIENT_AUTH_PAGE = "/portal/client/auth";
const CLIENT_CHANGE_PASSWORD_PAGE = "/portal/client/change-password";

const ENTERPRISE_DOMAINS = (process.env.ENTERPRISE_ALLOWED_DOMAINS ?? "sdtoolsinc.org,sdtoolsinc.com")
  .split(",")
  .map((d) => d.trim().toLowerCase());

function isEnterpriseEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return ENTERPRISE_DOMAINS.includes(domain ?? "");
}

function getAuthRoute(pathname: string): string | null {
  for (const [prefix, authRoute] of Object.entries(PORTAL_AUTH_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return authRoute;
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authRoute = getAuthRoute(pathname);

  if (!authRoute || pathname === authRoute || pathname.startsWith(`${authRoute}/`)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = authRoute;
    url.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(CLIENT_PREFIX)) {
    const isClient = token.role === "client";
    const needsPasswordChange = token.firstLogin === true || token.mustChangePassword === true;
    if (!isClient) {
      const url = request.nextUrl.clone();
      url.pathname = CLIENT_AUTH_PAGE;
      url.searchParams.set("error", "Unauthorized");
      return NextResponse.redirect(url);
    }

    if (needsPasswordChange && pathname !== CLIENT_CHANGE_PASSWORD_PAGE && pathname !== CLIENT_AUTH_PAGE) {
      const url = request.nextUrl.clone();
      url.pathname = CLIENT_CHANGE_PASSWORD_PAGE;
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/api/client")) {
    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    const isClient = token.role === "client";
    const needsPasswordChange = token.firstLogin === true || token.mustChangePassword === true;
    if (!isClient) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (needsPasswordChange && pathname !== "/api/client/change-password") {
      return NextResponse.json(
        {
          error: "INITIAL_PASSWORD_CHANGE_REQUIRED",
          message: "Access denied. You must update your temporary credentials to access the portal.",
        },
        { status: 403 }
      );
    }
  }

  // Enterprise routes also require an allowed organization domain (skip in development/localhost).
  if (pathname.startsWith(ENTERPRISE_PREFIX)) {
    const isDevelopment = request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1";
    if (!isDevelopment && !isEnterpriseEmail(token.email as string | undefined)) {
      const url = request.nextUrl.clone();
      url.pathname = ENTERPRISE_AUTH_PAGE;
      url.searchParams.set("error", "AccessDenied");
      url.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal/admin/:path*",
    "/portal/staff/:path*",
    "/portal/participant/:path*",
    "/portal/finance/:path*",
    "/portal/hr/:path*",
    "/portal/news/:path*",
    "/portal/enterprise/:path*",
    "/portal/client/:path*",
    "/api/client/:path*",
  ],
  // /portal and /demo routes are intentionally excluded from middleware protection.
};
