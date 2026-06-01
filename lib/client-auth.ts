import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { findClientUserByUsername } from "@/lib/client-users";

export async function requireClientSession(request: Request, options?: { allowPendingPasswordChange?: boolean }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "client") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (!session.user.username) {
    return NextResponse.json({ error: "INVALID_SESSION" }, { status: 401 });
  }

  const user = await findClientUserByUsername(session.user.username);
  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
  }

  const hasPendingPasswordReset = user.firstLogin || user.mustChangePassword;
  if (hasPendingPasswordReset && !options?.allowPendingPasswordChange) {
    return NextResponse.json(
      {
        error: "INITIAL_PASSWORD_CHANGE_REQUIRED",
        message: "Access denied. You must update your temporary credentials to access the portal.",
      },
      { status: 403 }
    );
  }

  const tokenVersion = (session.user as any).sessionVersion as number | undefined;
  if (typeof tokenVersion === "number" && tokenVersion !== user.sessionVersion) {
    return NextResponse.json({ error: "SESSION_REVOKED", message: "Please sign in again." }, { status: 401 });
  }

  return { session, user };
}

export async function requireClientPasswordResetSession(request: Request) {
  const result = await requireClientSession(request, { allowPendingPasswordChange: true });
  if (result instanceof NextResponse) return result;
  return result;
}
