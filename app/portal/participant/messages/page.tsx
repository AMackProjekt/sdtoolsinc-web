"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Send, User as UserIcon } from "lucide-react";

type Message = {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  own: boolean;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    from: "Support Staff",
    text: "Hi! How are you settling in with the program so far?",
    timestamp: "9:32 AM",
    own: false,
  },
  {
    id: "2",
    from: "You",
    text: "Going well, thank you! I finished the Life Skills module yesterday.",
    timestamp: "9:45 AM",
    own: true,
  },
  {
    id: "3",
    from: "Support Staff",
    text: "That's great to hear! You're making excellent progress. Let me know if you need any help with the next module.",
    timestamp: "9:47 AM",
    own: false,
  },
];

export default function ParticipantMessagesPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading || !isAuthenticated) return null;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), from: user?.name ?? "You", text, timestamp, own: true },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-teal-100">Messages</h1>
        <p className="mt-1 text-sm text-teal-300/70">
          Communicate with your support staff and case managers.
        </p>
      </div>

      {/* Chat window */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-teal-900/40 bg-teal-950/60">
        {/* Contact bar */}
        <div className="flex items-center gap-3 border-b border-teal-900/40 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
            <UserIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-100">Support Staff</p>
            <span className="flex items-center gap-1 text-xs text-teal-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg) =>
            msg.own ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xs rounded-2xl rounded-br-sm bg-teal-600 px-4 py-2.5">
                  <p className="text-sm text-white">{msg.text}</p>
                  <p className="mt-1 text-right text-[10px] text-teal-200/70">{msg.timestamp}</p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-xs rounded-2xl rounded-bl-sm bg-teal-900/60 px-4 py-2.5 border border-teal-800/40">
                  <p className="mb-1 text-[10px] font-semibold text-teal-400">{msg.from}</p>
                  <p className="text-sm text-teal-100">{msg.text}</p>
                  <p className="mt-1 text-[10px] text-teal-400/60">{msg.timestamp}</p>
                </div>
              </div>
            )
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-teal-900/40 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-teal-800/40 bg-teal-900/40 px-4 py-2.5 text-sm text-teal-100 placeholder-teal-600 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              title="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white transition-colors hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
