import { NextRequest, NextResponse } from "next/server";
import { upsertClientCredential } from "@/auth";

const SETUP_TOKEN = process.env.SETUP_TOKEN ?? "";

const CLIENTS = [
  {
    name: "Jermaine Johnson",
    email: "nolove6890jj@gmail.com",
    password: "DreamsForChange",
  },
  {
    name: "Cristina Watkins Atencio",
    email: "cwa120971@gmail.com",
    password: "DreamsForChange",
  },
];

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!SETUP_TOKEN || !token || token !== SETUP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { name: string; email: string; ok: boolean; error?: string }[] = [];

  for (const client of CLIENTS) {
    try {
      await upsertClientCredential({
        name: client.name,
        email: client.email,
        password: client.password,
        mustChangePassword: true,
      });
      results.push({ name: client.name, email: client.email, ok: true });
    } catch (err) {
      results.push({
        name: client.name,
        email: client.email,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    { provisioned: results.filter((r) => r.ok).length, failed: failed.length, results },
    { status: failed.length === 0 ? 200 : 207 }
  );
}
