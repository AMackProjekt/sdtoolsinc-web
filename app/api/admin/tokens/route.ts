import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { addToken, listTokens, getTokensByEmail, revokeToken } from "@/lib/token-store";

export const runtime = "nodejs";

/**
 * Admin endpoint to manage full-access pass tokens.
 * GET: List all tokens or tokens for a specific email
 * POST: Create a new token
 * DELETE: Revoke a token
 */

interface CreateTokenBody {
  email?: string;
  role?: "admin" | "staff" | "participant";
  expiresInDays?: number;
}

interface RevokeTokenBody {
  tokenId?: string;
}

async function isAdmin(session: Session | null): Promise<boolean> {
  // Check if user is enterprise admin
  return session?.user?.email === process.env.ENTERPRISE_ADMIN_EMAIL;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAdmin(session))) {
    return NextResponse.json(
      { error: "Only enterprise admins can manage tokens" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const tokens = await getTokensByEmail(email);
      return NextResponse.json({
        success: true,
        email,
        tokens,
        count: tokens.length,
      });
    }

    const allTokens = await listTokens();
    return NextResponse.json({
      success: true,
      tokens: allTokens,
      count: allTokens.length,
    });
  } catch (err) {
    console.error("[admin/tokens GET]", err);
    return NextResponse.json(
      { error: "Failed to list tokens", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAdmin(session))) {
    return NextResponse.json(
      { error: "Only enterprise admins can create tokens" },
      { status: 403 }
    );
  }

  let body: CreateTokenBody;
  try {
    body = (await req.json()) as CreateTokenBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, role = "staff", expiresInDays } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!["admin", "staff", "participant"].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be admin, staff, or participant" },
      { status: 400 }
    );
  }

  try {
    const { token: storedToken, plainToken } = await addToken(email, role, expiresInDays);

    // Return the plain token ONCE — it won't be retrievable again
    return NextResponse.json(
      {
        success: true,
        message: "Full-access pass token created successfully",
        token: {
          id: storedToken.id,
          email: storedToken.email,
          role: storedToken.role,
          createdAt: storedToken.createdAt,
          expiresAt: storedToken.expiresAt,
          plainToken, // Only shown once on creation!
        },
        warning:
          "Save this token securely. You will not be able to view it again. Use it in the Authorization header as Bearer TOOLS_xxxx",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[admin/tokens POST]", err);
    return NextResponse.json(
      { error: "Failed to create token", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAdmin(session))) {
    return NextResponse.json(
      { error: "Only enterprise admins can revoke tokens" },
      { status: 403 }
    );
  }

  let body: RevokeTokenBody;
  try {
    body = (await req.json()) as RevokeTokenBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { tokenId } = body;

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
  }

  try {
    const revoked = await revokeToken(tokenId);

    if (!revoked) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Token revoked successfully",
    });
  } catch (err) {
    console.error("[admin/tokens DELETE]", err);
    return NextResponse.json(
      { error: "Failed to revoke token", details: String(err) },
      { status: 500 }
    );
  }
}
