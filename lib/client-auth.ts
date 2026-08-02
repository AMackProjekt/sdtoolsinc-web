import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findClientUserByUsername } from "@/lib/client-users";

export async function requireClientSession(request: Request, options?: { allowPendingPasswordChange?: boolean }) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "client") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const sessionUser = session.user as typeof session.user & { username?: string };
  if (!sessionUser.username) {
    return NextResponse.json({ error: "INVALID_SESSION" }, { status: 401 });
  }

  const user = await findClientUserByUsername(sessionUser.username);
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
