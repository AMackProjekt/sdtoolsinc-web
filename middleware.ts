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
};
const ENTERPRISE_PREFIX = "/portal/enterprise";
const ENTERPRISE_AUTH_PAGE = "/portal/enterprise/auth";

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

  // Enterprise routes also require an allowed organization domain.
  if (pathname.startsWith(ENTERPRISE_PREFIX) && !isEnterpriseEmail(token.email as string | undefined)) {
    const url = request.nextUrl.clone();
    url.pathname = ENTERPRISE_AUTH_PAGE;
    url.searchParams.set("error", "AccessDenied");
    url.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
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
  ],
  // /portal and /demo routes are intentionally excluded from middleware protection.
};
