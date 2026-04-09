"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Minimize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  from: string;
  role: "staff" | "participant" | "admin";
  text: string;
  ts: string;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function InternalChat({
  currentUser,
  role,
}: {
  currentUser: string;
  role: "staff" | "participant" | "admin";
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/portal/chat")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages ?? []);
        if (!open) setUnread(d.messages?.length ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open && minimized === false) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, minimized, messages]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setSending(true);
    setInput("");

    const optimistic: ChatMessage = {
      id: String(Date.now()),
      from: currentUser,
      role,
      text,
      ts: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: currentUser, role }),
      });
    } catch {
      // keep optimistic; production would handle error
    } finally {
      setSending(false);
    }
  }

  const roleBubble =
    role === "staff"
      ? "bg-sky-800/60 text-sky-100"
      : role === "admin"
      ? "bg-violet-800/60 text-violet-100"
      : "bg-teal-800/60 text-teal-100";

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      {/* Floating toggle */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setMinimized(false);
        }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 shadow-lg hover:bg-teal-500 transition"
        aria-label="Toggle internal chat"
      >
        <MessageSquare size={20} className="text-white" />
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex w-80 flex-col rounded-2xl border border-teal-900/40 bg-[#0c0f17]/95 shadow-2xl backdrop-blur-xl overflow-hidden"
            style={{ maxHeight: minimized ? "52px" : "420px", transition: "max-height 0.3s ease" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-teal-900/30 border-b border-teal-900/40">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-teal-400" />
                <span className="text-xs font-extrabold tracking-tight text-text">
                  Internal Chat
                </span>
                <span className="text-[10px] text-teal-500 ml-1">• Connected</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized((m) => !m)}
                  className="rounded p-1 text-muted hover:text-text transition"
                  aria-label="Minimize"
                >
                  <Minimize2 size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-muted hover:text-text transition"
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
                  {messages.map((m) => {
                    const isMine = m.from === currentUser;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                        <div
                          className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${
                            isMine ? roleBubble : "bg-white/[0.06] text-text"
                          }`}
                        >
                          {!isMine && (
                            <div className="mb-0.5 text-[10px] font-semibold text-teal-400/70">
                              {m.from}
                            </div>
                          )}
                          {m.text}
                        </div>
                        <span className="mt-0.5 text-[10px] text-muted/60">{formatTime(m.ts)}</span>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 border-t border-teal-900/30 px-3 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Type a message…"
                    className="flex-1 rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-text placeholder:text-muted/50 outline-none border border-white/[0.07] focus:border-teal-700/50 transition"
                    disabled={sending}
                    maxLength={500}
                  />
                  <button
                    onClick={send}
                    disabled={sending || !input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 transition"
                    aria-label="Send"
                  >
                    <Send size={13} className="text-white" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
