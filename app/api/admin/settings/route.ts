import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("org_settings")
      .select("*")
      .single();

    if (error) {
      // No row yet — return safe defaults
      return NextResponse.json({
        org_name: "",
        session_timeout_minutes: 60,
        mfa_required: false,
        allowed_ip_ranges: [],
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin/settings GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only allow writing the fields we expose in the settings UI
  const allowed = [
    "org_name",
    "session_timeout_minutes",
    "mfa_required",
    "allowed_ip_ranges",
  ] as const;

  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }

  try {
    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("org_settings")
      .upsert({ id: "default", ...patch, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin/settings PUT]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
