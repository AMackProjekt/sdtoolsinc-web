import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const DFC_DOMAIN = (process.env.WORKSPACE_DOMAIN ?? "dreamsforchange.org").toLowerCase();

function sanitizeForChat(value: string) {
  return value.replace(/[<>{}`]/g, "").trim();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  const sessionEmail = (session?.user?.email ?? "").toLowerCase();
  const isStaffOrAdmin = role === "staff" || role === "admin";
  const isWorkspaceEmail = sessionEmail.endsWith(`@${DFC_DOMAIN}`);

  if (!isStaffOrAdmin || !isWorkspaceEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const webhookUrl = process.env.Champions_Web_Hook;
  if (!webhookUrl) {
    return NextResponse.json({ error: "GOOGLE_CHAT_WEBHOOK_URL not configured" }, { status: 503 });
  }

  const { name, email, slot } = await req.json() as { name: string; email: string; slot: string };

  if (!name || !email || !slot) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const normalizedClientEmail = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedClientEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Never allow posting workspace staff/admin emails from this client-invite path.
  if (normalizedClientEmail.endsWith(`@${DFC_DOMAIN}`)) {
    return NextResponse.json({ error: "Workspace accounts are not valid client invite targets" }, { status: 400 });
  }

  const safeName = sanitizeForChat(name);
  const safeSlot = sanitizeForChat(slot);

  const message = {
    text: `New Gmail client added to caseload\n\nName: ${safeName}\nEmail: ${normalizedClientEmail}\nSlot: ${safeSlot}\n\nPlease invite this client to the Google Chat space so they can participate in the channel.`,
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to post to Google Chat" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
