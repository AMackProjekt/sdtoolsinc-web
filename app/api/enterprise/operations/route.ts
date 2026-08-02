import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = createSupabaseAdmin();
    const [services, jobs, errors] = await Promise.all([
      db.from("service_health").select("*").order("name"),
      db.from("background_jobs").select("*").order("name"),
      db.from("error_metrics").select("*").order("recorded_at", { ascending: false }).limit(7),
    ]);
    return NextResponse.json({
      services: services.data ?? [],
      jobs: jobs.data ?? [],
      errorRate: (errors.data ?? []).map((e: { value: number }) => e.value).reverse(),
    });
  } catch (err) {
    console.error("[api/enterprise/operations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
