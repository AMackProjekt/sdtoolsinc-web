import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upsertClientCredential } from "@/auth";

const MIN_LENGTH = 8;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { newPassword?: string; confirmPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { newPassword, confirmPassword } = body;

  if (!newPassword || newPassword.length < MIN_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  await upsertClientCredential({
    email: session.user.email,
    password: newPassword,
    name: session.user.name ?? undefined,
    mustChangePassword: false,
  });

  return NextResponse.json({ success: true });
}
