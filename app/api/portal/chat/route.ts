import { NextRequest, NextResponse } from "next/server";

export interface ChatMessage {
  id: string;
  from: string;
  role: "staff" | "participant" | "admin" | "client";
  text: string;
  ts: string;
}

// In-memory store — shared across all portal roles, persists for the server session
const store: ChatMessage[] = [
  { id: "1", from: "Staff Member", role: "staff", text: "Hi! Just checking in — how are things going this week?", ts: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "2", from: "Participant", role: "participant", text: "Things are going well! I finished Module 2 of Life Skills.", ts: new Date(Date.now() - 3600000 * 1.8).toISOString() },
  { id: "3", from: "Staff Member", role: "staff", text: "That's great progress! Let's review your goals at our Thursday session.", ts: new Date(Date.now() - 3600000 * 1.6).toISOString() },
];
let counter = 4;

export async function GET() {
  return NextResponse.json({ messages: store });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, from, role } = body as { text: string; from: string; role: ChatMessage["role"] };

  if (!text?.trim() || !from || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newMessage: ChatMessage = {
    id: String(counter++),
    from,
    role,
    text: text.trim(),
    ts: new Date().toISOString(),
  };

  store.push(newMessage);
  // Keep last 200 messages to prevent unbounded growth
  if (store.length > 200) store.splice(0, store.length - 200);

  return NextResponse.json({ message: newMessage }, { status: 201 });
}
