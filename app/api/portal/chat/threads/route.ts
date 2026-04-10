import { NextRequest, NextResponse } from "next/server";

export interface Thread {
  id: string;
  participantId: string;
  participantName: string;
  staffId: string;
  staffName: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTs?: string;
}

// In-memory thread store — persists for the lifetime of the server process.
const threads: Thread[] = [
  {
    id: "thread-1",
    participantId: "participant-alex",
    participantName: "Alex Johnson",
    staffId: "staff-sarah",
    staffName: "Sarah Miller",
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    lastMessage: "Let's review your goals at our Thursday session.",
    lastMessageTs: new Date(Date.now() - 5_760_000).toISOString(),
  },
  {
    id: "thread-2",
    participantId: "participant-marcus",
    participantName: "Marcus Williams",
    staffId: "staff-sarah",
    staffName: "Sarah Miller",
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
    lastMessage: "Documentation submitted successfully.",
    lastMessageTs: new Date(Date.now() - 14_400_000).toISOString(),
  },
  {
    id: "thread-3",
    participantId: "participant-jasmine",
    participantName: "Jasmine Torres",
    staffId: "staff-james",
    staffName: "James Carter",
    createdAt: new Date(Date.now() - 259_200_000).toISOString(),
    lastMessage: "See you at the group session tomorrow!",
    lastMessageTs: new Date(Date.now() - 7_200_000).toISOString(),
  },
];
let threadCounter = 4;

/**
 * GET /api/portal/chat/threads
 *   ?participantName=<name>  → returns only the participant's thread(s)
 *   (no params)              → returns all threads (staff/admin view)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const participantName = searchParams.get("participantName");

  if (participantName) {
    const userThreads = threads.filter(
      (t) => t.participantName.toLowerCase() === participantName.toLowerCase()
    );
    return NextResponse.json({ threads: userThreads });
  }

  return NextResponse.json({ threads });
}

/**
 * POST /api/portal/chat/threads
 * Body: { participantName: string; staffName: string }
 * Returns existing thread if one already exists between these two parties.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { participantName, staffName } = body as {
    participantName?: string;
    staffName?: string;
  };

  if (!participantName?.trim() || !staffName?.trim()) {
    return NextResponse.json(
      { error: "participantName and staffName are required" },
      { status: 400 }
    );
  }

  // Return existing thread if found
  const existing = threads.find(
    (t) =>
      t.participantName.toLowerCase() === participantName.toLowerCase() &&
      t.staffName.toLowerCase() === staffName.toLowerCase()
  );
  if (existing) {
    return NextResponse.json({ thread: existing });
  }

  const thread: Thread = {
    id: `thread-${threadCounter++}`,
    participantId: `participant-${Date.now()}`,
    participantName: participantName.trim(),
    staffId: `staff-${Date.now()}`,
    staffName: staffName.trim(),
    createdAt: new Date().toISOString(),
  };
  threads.push(thread);

  return NextResponse.json({ thread }, { status: 201 });
}
