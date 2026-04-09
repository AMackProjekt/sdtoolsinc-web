import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Profile data is managed by the OAuth provider (NextAuth).
  // This endpoint returns supplemental fields stored server-side.
  const data = {
    phone: "",
    bio: "",
    notificationPrefs: {
      courseUpdates: true,
      messageAlerts: true,
      goalReminders: true,
      weeklyDigest: false,
      staffMessages: true,
    },
  };
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  // In a production app this would persist to a database.
  // For now, accept the payload and echo it back.
  const body = await request.json();
  return NextResponse.json({ ok: true, updated: body });
}
