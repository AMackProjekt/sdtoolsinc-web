import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { upsertClientCredential } from "@/auth";

export const dynamic = "force-dynamic";
const SETUP_TOKEN = process.env.SETUP_TOKEN ?? "";

function getClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  return new ConvexHttpClient(url);
}

const CLIENTS = [
  {
    name: "Jermaine Johnson",
    email: "nolove6890jj@gmail.com",
    password: "DreamsForChange",
    slot: "TC-JJ",
    status: "Active",
    environment: "Test Client",
  },
  {
    name: "Cristina Watkins Atencio",
    email: "cwa120971@gmail.com",
    password: "DreamsForChange",
    slot: "TC-CWA",
    status: "Active",
    environment: "Test Client",
  },
];

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!SETUP_TOKEN || !token || token !== SETUP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = getClient();
  const results: { name: string; email: string; ok: boolean; error?: string }[] = [];

  for (const client of CLIENTS) {
    try {
      // 1. Create / update NextAuth credentials
      await upsertClientCredential({
        name: client.name,
        email: client.email,
        password: client.password,
        mustChangePassword: true,
      });

      // 2. Ensure the client appears in the participants table so staff can
      //    find them in the chat contact list (email is the stable identity key).
      await convex.mutation(api.functions.upsertParticipant, {
        slot: client.slot,
        name: client.name,
        status: client.status,
        environment: client.environment,
        email: client.email,
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
