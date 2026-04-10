import { NextRequest, NextResponse } from "next/server";
import { encryptText, decryptText } from "@/lib/chat-crypto";

export interface ThreadMessage {
  id: string;
  from: string;
  role: "staff" | "participant" | "admin";
  text: string;
  ts: string;
  encrypted: boolean;
  fileAttachment?: {
    id: string;
    name: string;
    size: number;
    mimeType: string;
  };
}

interface StoredMessage {
  id: string;
  from: string;
  role: "staff" | "participant" | "admin";
  textEncrypted: string;
  ts: string;
  fileAttachment?: ThreadMessage["fileAttachment"];
}

// thread-id → encrypted messages
const messageStore: Record<string, StoredMessage[]> = {
  "thread-1": [
    {
      id: "1",
      from: "Sarah Miller",
      role: "staff",
      textEncrypted: encryptText("Hi Alex! Just checking in — how are things going this week?"),
      ts: new Date(Date.now() - 7_200_000).toISOString(),
    },
    {
      id: "2",
      from: "Alex Johnson",
      role: "participant",
      textEncrypted: encryptText("Things are going well! I finished Module 2 of Life Skills."),
      ts: new Date(Date.now() - 6_480_000).toISOString(),
    },
    {
      id: "3",
      from: "Sarah Miller",
      role: "staff",
      textEncrypted: encryptText(
        "That's great progress! Let's review your goals at our Thursday session."
      ),
      ts: new Date(Date.now() - 5_760_000).toISOString(),
    },
  ],
  "thread-2": [
    {
      id: "1",
      from: "Sarah Miller",
      role: "staff",
      textEncrypted: encryptText("Marcus, your intake documents have been received."),
      ts: new Date(Date.now() - 14_400_000).toISOString(),
    },
    {
      id: "2",
      from: "Marcus Williams",
      role: "participant",
      textEncrypted: encryptText(
        "Documentation submitted successfully. What's next for my program enrollment?"
      ),
      ts: new Date(Date.now() - 13_500_000).toISOString(),
    },
    {
      id: "3",
      from: "Sarah Miller",
      role: "staff",
      textEncrypted: encryptText(
        "The next step is your initial assessment meeting. I'll schedule it for later this week."
      ),
      ts: new Date(Date.now() - 12_600_000).toISOString(),
    },
  ],
  "thread-3": [
    {
      id: "1",
      from: "James Carter",
      role: "staff",
      textEncrypted: encryptText(
        "Hi Jasmine! Just a reminder about the group session tomorrow at 2pm."
      ),
      ts: new Date(Date.now() - 10_800_000).toISOString(),
    },
    {
      id: "2",
      from: "Jasmine Torres",
      role: "participant",
      textEncrypted: encryptText("Thanks for the heads up! See you at the group session tomorrow!"),
      ts: new Date(Date.now() - 7_200_000).toISOString(),
    },
  ],
};

const msgCounters: Record<string, number> = {
  "thread-1": 4,
  "thread-2": 4,
  "thread-3": 3,
};

/**
 * GET /api/portal/chat/threads/[threadId]
 * Returns all messages for a thread, decrypted.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { threadId } = params;
  const stored = messageStore[threadId] ?? [];

  const messages: ThreadMessage[] = stored.map((m) => ({
    id: m.id,
    from: m.from,
    role: m.role,
    text: decryptText(m.textEncrypted),
    ts: m.ts,
    encrypted: true,
    fileAttachment: m.fileAttachment,
  }));

  return NextResponse.json({ messages });
}

/**
 * POST /api/portal/chat/threads/[threadId]
 * Body: { text, from, role, fileAttachment? }
 * Encrypts the message text at rest. Returns the decrypted message.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { threadId } = params;
  const body = await req.json();
  const { text, from, role, fileAttachment } = body as {
    text?: string;
    from?: string;
    role?: "staff" | "participant" | "admin";
    fileAttachment?: ThreadMessage["fileAttachment"];
  };

  if (!text?.trim() || !from || !role) {
    return NextResponse.json({ error: "text, from, and role are required" }, { status: 400 });
  }

  if (!messageStore[threadId]) messageStore[threadId] = [];
  if (!msgCounters[threadId]) msgCounters[threadId] = 1;

  const stored: StoredMessage = {
    id: String(msgCounters[threadId]++),
    from,
    role,
    textEncrypted: encryptText(text.trim()),
    ts: new Date().toISOString(),
    fileAttachment,
  };

  messageStore[threadId].push(stored);

  // Cap per-thread history at 500 messages
  if (messageStore[threadId].length > 500) {
    messageStore[threadId].splice(0, messageStore[threadId].length - 500);
  }

  const outMessage: ThreadMessage = {
    id: stored.id,
    from: stored.from,
    role: stored.role,
    text: text.trim(),
    ts: stored.ts,
    encrypted: true,
    fileAttachment: stored.fileAttachment,
  };

  return NextResponse.json({ message: outMessage }, { status: 201 });
}
