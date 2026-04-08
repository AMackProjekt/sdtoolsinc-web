import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PREFIX = "/portal/enterprise";
const AUTH_PAGE = "/portal/enterprise/auth";

const ENTERPRISE_DOMAINS = (process.env.ENTERPRISE_ALLOWED_DOMAINS ?? "sdtoolsinc.org,sdtoolsinc.com")
  .split(",")
  .map((d) => d.trim().toLowerCase());

function isEnterpriseEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return ENTERPRISE_DOMAINS.includes(domain ?? "");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard enterprise routes — skip the auth page itself
  if (!pathname.startsWith(PROTECTED_PREFIX) || pathname.startsWith(AUTH_PAGE)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_PAGE;
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Verified session exists — also require an enterprise-domain email
  if (!isEnterpriseEmail(token.email as string | undefined)) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_PAGE;
    url.searchParams.set("error", "AccessDenied");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/enterprise/:path*"],
};
