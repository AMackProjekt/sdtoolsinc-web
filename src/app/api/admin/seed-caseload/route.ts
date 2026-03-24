import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const SEED_TOKEN = process.env.SETUP_TOKEN ?? "";

// Original A-Block (A1–A18), D-Block (D6–D12), J-Block (J8–J10)
const ORIGINAL_CASELOAD = [
  // A-Block — O Lot
  { slot: "A1",  name: "UID-A1",  status: "Active",          environment: "O Lot" },
  { slot: "A2",  name: "UID-A2",  status: "Active",          environment: "O Lot" },
  { slot: "A3",  name: "UID-A3",  status: "Active (Shared)", environment: "O Lot" },
  { slot: "A4",  name: "UID-A4",  status: "Active",          environment: "O Lot" },
  { slot: "A5",  name: "UID-A5",  status: "Active (Shared)", environment: "O Lot" },
  { slot: "A6",  name: "UID-A6",  status: "Empty",           environment: "O Lot" },
  { slot: "A7",  name: "UID-A7",  status: "Active",          environment: "O Lot" },
  { slot: "A8",  name: "UID-A8",  status: "Active",          environment: "O Lot" },
  { slot: "A9",  name: "UID-A9",  status: "Active",          environment: "O Lot" },
  { slot: "A10", name: "UID-A10", status: "Active",          environment: "O Lot" },
  { slot: "A11", name: "UID-A11", status: "Active",          environment: "O Lot" },
  { slot: "A12", name: "UID-A12", status: "Active",          environment: "O Lot" },
  { slot: "A13", name: "UID-A13", status: "Active",          environment: "O Lot" },
  { slot: "A14", name: "UID-A14", status: "Active",          environment: "O Lot" },
  { slot: "A15", name: "UID-A15", status: "Active",          environment: "O Lot" },
  { slot: "A16", name: "UID-A16", status: "Active",          environment: "O Lot" },
  { slot: "A17", name: "UID-A17", status: "Active",          environment: "O Lot" },
  { slot: "A18", name: "UID-A18", status: "Active (Shared)", environment: "O Lot" },
  // D-Block — Tier 3
  { slot: "D6",  name: "UID-D6",  status: "Active",          environment: "Tier 3" },
  { slot: "D7",  name: "UID-D7",  status: "Active",          environment: "Tier 3" },
  { slot: "D8",  name: "UID-D8",  status: "Active",          environment: "Tier 3" },
  { slot: "D9",  name: "UID-D9",  status: "Active",          environment: "Tier 3" },
  { slot: "D10", name: "UID-D10", status: "Active",          environment: "Tier 3" },
  { slot: "D11", name: "UID-D11", status: "Active",          environment: "Tier 3" },
  { slot: "D12", name: "UID-D12", status: "Active",          environment: "Tier 3" },
  // J-Block — Tier 4
  { slot: "J8",  name: "UID-J8",  status: "Active",          environment: "Tier 4" },
  { slot: "J9",  name: "UID-J9",  status: "Active",          environment: "Tier 4" },
  { slot: "J10", name: "UID-J10", status: "Active",          environment: "Tier 4" },
];

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!SEED_TOKEN || !token || token !== SEED_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const results: { slot: string; ok: boolean }[] = [];
  for (const p of ORIGINAL_CASELOAD) {
    try {
      await convex.mutation(api.functions.upsertParticipant, p);
      results.push({ slot: p.slot, ok: true });
    } catch (err) {
      results.push({ slot: p.slot, ok: false });
      console.error(`seed-caseload: failed to upsert ${p.slot}`, err);
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    {
      seeded: results.filter((r) => r.ok).length,
      failed: failed.length,
      slots: results,
    },
    { status: failed.length === 0 ? 200 : 207 }
  );
}
