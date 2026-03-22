import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req: { url: string; nextUrl: { pathname: string }; auth?: { user?: { email?: string | null; role?: string | null } } }) => {
  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user?.role ?? "client";
  const isAuthenticated = Boolean(req.auth?.user?.email);

  const isPortal = pathname.startsWith("/portal/");
  const isProtectedApi = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth") && pathname !== "/api/health";

  if (!isPortal && !isProtectedApi) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login/staff", req.url));
  }

  const needsStaffRole =
    pathname.startsWith("/portal/staff") ||
    pathname === "/api/terminal" ||
    pathname.startsWith("/api/admin");

  if (needsStaffRole && role !== "staff") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/portal/client", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/api/:path*"],
};
