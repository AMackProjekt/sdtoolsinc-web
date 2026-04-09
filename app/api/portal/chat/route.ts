import { NextRequest, NextResponse } from "next/server";

export interface ChatMessage {
  id: string;
  from: string;
  role: "staff" | "participant" | "admin";
  text: string;
  ts: string;
}

const MOCK_THREAD: ChatMessage[] = [
  { id: "1", from: "Staff Member", role: "staff", text: "Hi! Just checking in — how are things going this week?", ts: "2025-07-14T09:15:00Z" },
  { id: "2", from: "You", role: "participant", text: "Things are going well! I finished Module 2 of Life Skills.", ts: "2025-07-14T09:18:00Z" },
  { id: "3", from: "Staff Member", role: "staff", text: "That's great progress! Let's review your goals at our Thursday session.", ts: "2025-07-14T09:20:00Z" },
];

export async function GET() {
  return NextResponse.json({ messages: MOCK_THREAD });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, from, role } = body as { text: string; from: string; role: ChatMessage["role"] };

  if (!text?.trim() || !from || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newMessage: ChatMessage = {
    id: String(Date.now()),
    from,
    role,
    text: text.trim(),
    ts: new Date().toISOString(),
  };

  // In production: persist to Supabase
  return NextResponse.json({ message: newMessage }, { status: 201 });
}
