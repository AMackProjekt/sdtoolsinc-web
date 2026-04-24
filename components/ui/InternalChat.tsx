"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  ExternalLink,
  ChevronLeft,
  Lock,
  Paperclip,
  FileText,
} from "lucide-react";

interface Thread {
  id: string;
  participantId: string;
  participantName: string;
  staffId: string;
  staffName: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTs?: string;
}

interface ThreadMessage {
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ThreadMessagesResponse {
  messages?: ThreadMessage[];
}

interface PostMessageResponse {
  message?: ThreadMessage;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatThreadTime(ts?: string) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  return d.toLocaleDateString();
}

const ROLE_THEME = {
  staff: {
    fab: "bg-sky-600 hover:bg-sky-500",
    header: "bg-sky-900/30 border-sky-900/40",
    panel: "border-sky-900/40",
    dot: "text-sky-500",
    input: "focus:border-sky-700/50",
    send: "bg-sky-600 hover:bg-sky-500",
    icon: "text-sky-400",
    footer: "border-sky-900/30",
    selected: "bg-sky-500/15",
  },
  admin: {
    fab: "bg-violet-600 hover:bg-violet-500",
    header: "bg-violet-900/30 border-violet-900/40",
    panel: "border-violet-900/40",
    dot: "text-violet-500",
    input: "focus:border-violet-700/50",
    send: "bg-violet-600 hover:bg-violet-500",
    icon: "text-violet-400",
    footer: "border-violet-900/30",
    selected: "bg-violet-500/15",
  },
  participant: {
    fab: "bg-teal-600 hover:bg-teal-500",
    header: "bg-teal-900/30 border-teal-900/40",
    panel: "border-teal-900/40",
    dot: "text-teal-500",
    input: "focus:border-teal-700/50",
    send: "bg-teal-600 hover:bg-teal-500",
    icon: "text-teal-400",
    footer: "border-teal-900/30",
    selected: "bg-teal-500/15",
  },
} as const;

export function InternalChat({
  currentUser,
  role,
}: {
  currentUser: string;
  role: "staff" | "participant" | "admin";
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [connected, setConnected] = useState(false);
  const [pollMs, setPollMs] = useState(5000);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const pollBusyRef = useRef(false);
  const lastSeenByThreadRef = useRef<Record<string, number>>({});

  const t = ROLE_THEME[role];
  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [threads, selectedThreadId]
  );

  const stateKey = `internal-chat-ui:${role}:${currentUser}`;
  const threadKey = `internal-chat-thread:${role}:${currentUser}`;
  const draftKey = `internal-chat-draft:${role}:${currentUser}`;

  function resizeComposer() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }

  function contactLabel(thread: Thread) {
    return role === "participant" ? thread.staffName : thread.participantName;
  }

  function isThreadUnread(thread: Thread): boolean {
    if (!thread.lastMessageTs) return false;
    const lastTs = new Date(thread.lastMessageTs).getTime();
    const seenTs = lastSeenByThreadRef.current[thread.id] ?? 0;
    return lastTs > seenTs;
  }

  const markSelectedThreadSeen = useCallback(
    (incomingMessages: ThreadMessage[], threadId?: string | null) => {
      const id = threadId ?? selectedThreadId;
      if (!id) return;
      const latest = incomingMessages[incomingMessages.length - 1];
      if (latest) {
        lastSeenByThreadRef.current[id] = new Date(latest.ts).getTime();
      } else if (!lastSeenByThreadRef.current[id]) {
        lastSeenByThreadRef.current[id] = Date.now();
      }
    },
    [selectedThreadId]
  );

  const calculateUnreadFromThreads = useCallback(
    (nextThreads: Thread[]) => {
      const unseen = nextThreads.reduce((count, thread) => {
        if (!thread.lastMessageTs) return count;
        const lastTs = new Date(thread.lastMessageTs).getTime();
        const seenTs = lastSeenByThreadRef.current[thread.id] ?? 0;
        return lastTs > seenTs ? count + 1 : count;
      }, 0);
      setUnread(unseen);
    },
    []
  );

  const loadThreads = useCallback(async () => {
    const url =
      role === "participant"
        ? `/api/portal/chat/threads?participantName=${encodeURIComponent(currentUser)}`
        : "/api/portal/chat/threads";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Unable to load threads");

    const data = (await res.json()) as { threads?: Thread[] };
    const nextThreads = data.threads ?? [];
    setThreads(nextThreads);

    setSelectedThreadId((prev) => {
      if (prev && nextThreads.some((thread) => thread.id === prev)) {
        return prev;
      }
      return nextThreads[0]?.id ?? null;
    });

    if (!openRef.current) {
      calculateUnreadFromThreads(nextThreads);
    }

    return nextThreads;
  }, [role, currentUser, calculateUnreadFromThreads]);

  const loadMessages = useCallback(
    async (threadId: string) => {
      const res = await fetch(`/api/portal/chat/threads/${threadId}`);
      if (!res.ok) throw new Error("Unable to load messages");

      const data = (await res.json()) as ThreadMessagesResponse;
      const nextMessages = data.messages ?? [];
      setMessages(nextMessages);

      if (openRef.current) {
        markSelectedThreadSeen(nextMessages, threadId);
        setUnread(0);
      }

      return nextMessages;
    },
    [markSelectedThreadSeen]
  );

  useEffect(() => {
    openRef.current = open && !minimized;
  }, [open, minimized]);

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(stateKey);
      if (rawState) {
        const parsed = JSON.parse(rawState) as { open?: boolean; minimized?: boolean };
        setOpen(Boolean(parsed.open));
        setMinimized(Boolean(parsed.minimized));
      }

      const storedThreadId = window.localStorage.getItem(threadKey);
      if (storedThreadId) setSelectedThreadId(storedThreadId);

      const draft = window.localStorage.getItem(draftKey);
      if (draft) setInput(draft);
    } catch {
      // ignore persisted state parse errors
    }
  }, [stateKey, threadKey, draftKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        stateKey,
        JSON.stringify({
          open,
          minimized,
        })
      );
    } catch {
      // ignore storage failures
    }
  }, [open, minimized, stateKey]);

  useEffect(() => {
    try {
      if (selectedThreadId) {
        window.localStorage.setItem(threadKey, selectedThreadId);
      }
    } catch {
      // ignore storage failures
    }
  }, [selectedThreadId, threadKey]);

  useEffect(() => {
    try {
      if (input.trim()) {
        window.localStorage.setItem(draftKey, input);
      } else {
        window.localStorage.removeItem(draftKey);
      }
    } catch {
      // ignore storage failures
    }
  }, [input, draftKey]);

  useEffect(() => {
    resizeComposer();
  }, [input]);

  useEffect(() => {
    setPollMs(open && !minimized ? 3000 : 7000);
  }, [open, minimized]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (cancelled || pollBusyRef.current) return;
      pollBusyRef.current = true;

      try {
        if (loadingThreads) setLoadingThreads(true);
        const nextThreads = await loadThreads();

        const activeThreadId = selectedThreadId ?? nextThreads[0]?.id;
        if (activeThreadId) {
          if (loadingMessages) setLoadingMessages(true);
          await loadMessages(activeThreadId);
        } else {
          setMessages([]);
        }

        if (!cancelled) {
          setConnected(true);
          setError(null);
          setLoadingThreads(false);
          setLoadingMessages(false);
        }
      } catch {
        if (!cancelled) {
          setConnected(false);
          setLoadingThreads(false);
          setLoadingMessages(false);
        }
      } finally {
        pollBusyRef.current = false;
      }
    }

    void poll();
    const id = setInterval(() => {
      void poll();
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs, loadThreads, loadMessages, selectedThreadId, loadingMessages, loadingThreads]);

  useEffect(() => {
    if (open && !minimized) {
      setUnread(0);
      markSelectedThreadSeen(messages);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      textareaRef.current?.focus();
    }
  }, [open, minimized, messages, markSelectedThreadSeen]);

  async function send() {
    const text = input.trim();
    if (!selectedThreadId || (!text && !pendingFile) || sending || uploading) return;

    setSending(true);
    setError(null);
    setInput("");

    let fileAttachment: ThreadMessage["fileAttachment"] | undefined;

    // Upload file first if pending
    if (pendingFile) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        fd.append("uploadedBy", currentUser);
        const upRes = await fetch(
          `/api/portal/chat/threads/${selectedThreadId}/upload`,
          { method: "POST", body: fd }
        );
        if (upRes.ok) {
          const upData = (await upRes.json()) as { file?: ThreadMessage["fileAttachment"] };
          fileAttachment = upData.file;
        }
      } catch {
        // file upload failed — continue without attachment
      } finally {
        setUploading(false);
      }
    }

    const textToSend = text || (pendingFile ? `[File: ${pendingFile.name}]` : "");
    setPendingFile(null);

    const optimistic: ThreadMessage = {
      id: `local-${Date.now()}`,
      from: currentUser,
      role,
      text: textToSend,
      ts: new Date().toISOString(),
      encrypted: true,
      fileAttachment,
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/portal/chat/threads/${selectedThreadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend, from: currentUser, role, fileAttachment }),
      });

      if (!res.ok) throw new Error("Message send failed");

      const data = (await res.json()) as PostMessageResponse;
      if (data.message) {
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? data.message! : m)));
      }
      markSelectedThreadSeen(data.message ? [data.message] : [optimistic], selectedThreadId);
    } catch {
      setError("Unable to send. Please try again.");
      setInput(text);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setMinimized(false);
        }}
        className={`relative flex h-12 w-12 items-center justify-center rounded-full ${t.fab} shadow-lg transition`}
        aria-label="Toggle internal chat"
      >
        <MessageSquare size={20} className="text-white" />
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
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
            className={`flex w-[24rem] flex-col overflow-hidden rounded-2xl border ${t.panel} bg-[#0c0f17]/95 shadow-2xl backdrop-blur-xl`}
            style={{ maxHeight: minimized ? "52px" : "520px", transition: "max-height 0.3s ease" }}
          >
            <div className={`flex items-center justify-between border-b px-4 py-3 ${t.header}`}>
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className={t.icon} />
                <span className="text-xs font-extrabold tracking-tight text-text">Internal Chat</span>
                <span className={`ml-1 text-[10px] ${t.dot}`}>
                  {connected ? "• Connected" : "• Reconnecting..."}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href="/portal/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1 text-muted transition hover:text-text"
                  aria-label="Open chat in new tab"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => setMinimized((prev) => !prev)}
                  className="rounded p-1 text-muted transition hover:text-text"
                  aria-label={minimized ? "Expand" : "Minimize"}
                >
                  <Minimize2 size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-muted transition hover:text-text"
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {!selectedThread ? (
                  <div className="flex h-56 items-center justify-center px-4 text-center text-xs text-muted/70">
                    {loadingThreads ? "Loading conversations..." : "No conversations available."}
                  </div>
                ) : (
                  <>
                    <div className="border-b border-white/10 px-2 py-2">
                      <div className="mb-2 px-2 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                        Conversations
                      </div>
                      <div className="max-h-28 space-y-1 overflow-y-auto">
                        {threads.map((thread) => (
                          <button
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`w-full rounded-lg px-2 py-1.5 text-left transition ${
                              selectedThreadId === thread.id ? t.selected : "hover:bg-white/[0.06]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="truncate text-xs font-semibold text-text">
                                    {contactLabel(thread)}
                                  </div>
                                  {isThreadUnread(thread) && (
                                    <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                  )}
                                </div>
                                {thread.lastMessage && (
                                  <div className="truncate text-[10px] text-muted/70">{thread.lastMessage}</div>
                                )}
                              </div>
                              <div className="text-[10px] text-muted/60">{formatThreadTime(thread.lastMessageTs)}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <ChevronLeft size={13} className="text-muted" />
                        <span className="text-xs font-semibold text-text">{contactLabel(selectedThread)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Lock size={9} />
                        Encrypted
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3" style={{ minHeight: 0 }}>
                      {loadingMessages ? (
                        <div className="flex h-full min-h-[110px] items-center justify-center text-xs text-muted/70">
                          Loading messages...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex h-full min-h-[110px] items-center justify-center text-xs text-muted/60">
                          No messages yet. Start the conversation.
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isMine = message.from === currentUser;
                          return (
                            <div
                              key={message.id}
                              className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`max-w-[88%] space-y-1 rounded-xl px-3 py-2 text-sm ${
                                  isMine ? "bg-white/[0.14] text-text" : "bg-white/[0.06] text-text"
                                }`}
                              >
                                {!isMine && (
                                  <div className="text-[10px] font-semibold text-muted/70">{message.from}</div>
                                )}
                                {message.text}
                                
                                {/* File attachment */}
                                {message.fileAttachment && (
                                  <a
                                    href={`/api/portal/chat/threads/${selectedThreadId}/upload?fileId=${message.fileAttachment.id}`}
                                    download={message.fileAttachment.name}
                                    className="mt-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] transition-colors hover:bg-white/10"
                                  >
                                    <FileText size={11} className="shrink-0 text-brand" />
                                    <span className="truncate font-medium">{message.fileAttachment.name}</span>
                                    <span className="shrink-0 text-muted/70">
                                      {formatBytes(message.fileAttachment.size)}
                                    </span>
                                  </a>
                                )}
                              </div>
                              <span className="mt-0.5 text-[10px] text-muted/60">{formatTime(message.ts)}</span>
                            </div>
                          );
                        })
                      )}
                      <div ref={bottomRef} />
                    </div>

                    <div className={`border-t ${t.footer} px-3 py-2 space-y-2`}>
                      {/* Pending file preview */}
                      {pendingFile && (
                        <div className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1.5 text-[11px]">
                          <FileText size={13} className="shrink-0 text-brand" />
                          <span className="min-w-0 flex-1 truncate font-medium">{pendingFile.name}</span>
                          <span className="text-muted/70">{formatBytes(pendingFile.size)}</span>
                          <button
                            onClick={() => setPendingFile(null)}
                            className="ml-1 rounded p-0.5 text-muted hover:text-text"
                            aria-label="Remove file"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-end gap-2">
                        {/* File upload */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading || sending}
                          className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-white/5 hover:text-brand disabled:opacity-50"
                          aria-label="Attach file"
                          title="Attach file"
                        >
                          <Paperclip size={14} />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          aria-label="Attach file"
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setPendingFile(f);
                            e.target.value = "";
                          }}
                        />

                        {/* Text input */}
                        <textarea
                          ref={textareaRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              void send();
                            }
                          }}
                          placeholder="Type a message... (Shift+Enter for new line)"
                          className={`min-h-[34px] max-h-28 flex-1 resize-none rounded-lg border border-white/[0.07] bg-white/[0.05] px-3 py-2 text-xs text-text placeholder:text-muted/50 outline-none transition ${t.input}`}
                          disabled={sending || uploading}
                          maxLength={500}
                        />

                        {/* Send */}
                        <button
                          onClick={() => {
                            void send();
                          }}
                          disabled={sending || uploading || (!input.trim() && !pendingFile)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.send} transition disabled:opacity-40`}
                          aria-label="Send"
                        >
                          <Send size={13} className="text-white" />
                        </button>
                      </div>
                      {error && <p className="text-[11px] text-rose-300">{error}</p>}
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
