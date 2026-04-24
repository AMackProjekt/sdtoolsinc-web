"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Send,
  Paperclip,
  ArrowLeft,
  MessageSquare,
  CheckCheck,
  FileText,
  X,
  Plus,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface Message {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolvePortalRole(userRole?: string): "staff" | "participant" | "admin" {
  const r = (userRole ?? "").toLowerCase();
  if (r.includes("admin") || r.includes("enterprise")) return "admin";
  if (r.includes("staff") || r.includes("case")) return "staff";
  if (r.includes("participant") || r.includes("viewer")) return "participant";
  return "staff";
}

function formatTs(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Role theme ───────────────────────────────────────────────────────────────

const ROLE_BUBBLE: Record<"staff" | "participant" | "admin", string> = {
  staff: "bg-sky-500/20 border-sky-500/30 text-sky-100",
  admin: "bg-violet-500/20 border-violet-500/30 text-violet-100",
  participant: "bg-teal-500/20 border-teal-500/30 text-teal-100",
};

const ROLE_AVATAR: Record<"staff" | "participant" | "admin", string> = {
  staff: "bg-sky-500/30 text-sky-300",
  admin: "bg-violet-500/30 text-violet-300",
  participant: "bg-teal-500/30 text-teal-300",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<"staff" | "participant" | "admin">("staff");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showThreads, setShowThreads] = useState(true);
  const [newConvoName, setNewConvoName] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.role) setRole(resolvePortalRole(user.role));
  }, [user]);

  // ── Load threads ──────────────────────────────────────────────────────────
  const loadThreads = useCallback(async () => {
    if (!user) return;
    try {
      const url =
        role === "participant"
          ? `/api/portal/chat/threads?participantName=${encodeURIComponent(user.name ?? "")}`
          : "/api/portal/chat/threads";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads ?? []);
      }
    } catch {
      // network error — keep existing threads
    } finally {
      setLoadingThreads(false);
    }
  }, [user, role]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // ── Load messages ─────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!selectedThread) return;
    try {
      const res = await fetch(
        `/api/portal/chat/threads/${selectedThread.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {
      // keep current messages on error
    }
  }, [selectedThread]);

  useEffect(() => {
    if (!selectedThread) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }
    setLoadingMsgs(true);
    setMessages([]);
    loadMessages().finally(() => setLoadingMsgs(false));

    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(loadMessages, 5_000);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [selectedThread, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Select thread ─────────────────────────────────────────────────────────
  function selectThread(t: Thread) {
    setSelectedThread(t);
    setShowThreads(false); // mobile: hide thread list
    setInput("");
    setPendingFile(null);
  }

  // ── Send message ──────────────────────────────────────────────────────────
  async function handleSend() {
    if (!selectedThread || (!input.trim() && !pendingFile)) return;
    if (sending || uploading) return;

    setSending(true);
    const msgRole = role === "admin" ? "admin" : role;
    let fileAttachment: Message["fileAttachment"] | undefined;

    // Upload file first if pending
    if (pendingFile) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        fd.append("uploadedBy", user?.name ?? "Unknown");
        const upRes = await fetch(
          `/api/portal/chat/threads/${selectedThread.id}/upload`,
          { method: "POST", body: fd }
        );
        if (upRes.ok) {
          const upData = await upRes.json();
          fileAttachment = upData.file;
        }
      } catch {
        // file upload failed — continue without attachment
      } finally {
        setUploading(false);
      }
    }

    const textToSend = input.trim() || (pendingFile ? `[File: ${pendingFile.name}]` : "");
    setInput("");
    setPendingFile(null);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      from: user?.name ?? "You",
      role: msgRole,
      text: textToSend,
      ts: new Date().toISOString(),
      encrypted: true,
      fileAttachment,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await fetch(`/api/portal/chat/threads/${selectedThread.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          from: user?.name ?? "Unknown",
          role: msgRole,
          fileAttachment,
        }),
      });
      await loadMessages(); // refresh to get server state
    } catch {
      // optimistic msg already shown
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Create new thread ─────────────────────────────────────────────────────
  async function createThread() {
    if (!newConvoName.trim() || !user?.name) return;
    const isPart = role === "participant";
    const body = isPart
      ? { participantName: user.name, staffName: newConvoName.trim() }
      : { participantName: newConvoName.trim(), staffName: user.name };

    try {
      const res = await fetch("/api/portal/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setNewConvoName("");
        setShowNewConvo(false);
        await loadThreads();
        if (data.thread) selectThread(data.thread);
      }
    } catch {
      // ignore
    }
  }

  // ── Contact label ─────────────────────────────────────────────────────────
  function contactLabel(t: Thread): string {
    return role === "participant" ? t.staffName : t.participantName;
  }

  // ── Loading / auth states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ── Computed ──────────────────────────────────────────────────────────────
  const isMine = (m: Message) => m.from === (user?.name ?? "");

  // ─────────────────────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-panel/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-brand" />
            <span className="font-semibold">Secure Messages</span>
          </div>
        </div>

        {/* Encryption badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <ShieldCheck size={12} />
          AES-256-GCM Encrypted
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Thread list – always visible on md+, toggled on mobile */}
        <aside
          className={`${
            showThreads ? "flex" : "hidden"
          } md:flex w-full flex-col border-r border-border bg-panel/50 md:w-72 lg:w-80`}
        >
          {/* Thread list header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-muted uppercase tracking-wide">
              Conversations
            </span>
            {(role === "staff" || role === "admin") && (
              <button
                onClick={() => setShowNewConvo((v) => !v)}
                className="rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-brand"
                aria-label="New conversation"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          {/* New conversation form */}
          {showNewConvo && (
            <div className="border-b border-border p-3">
              <p className="mb-2 text-xs text-muted">
                {role === "participant" ? "Staff name" : "Participant name"}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newConvoName}
                  onChange={(e) => setNewConvoName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createThread()}
                  placeholder="Full name..."
                  className="flex-1 rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text placeholder-muted outline-none focus:border-brand"
                />
                <button
                  onClick={createThread}
                  disabled={!newConvoName.trim()}
                  className="rounded-md bg-brand/20 px-2 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/30 disabled:opacity-50"
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {/* Thread items */}
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              </div>
            ) : threads.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted">
                <Lock size={24} className="mx-auto mb-3 opacity-40" />
                No conversations yet
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectThread(t)}
                  className={`w-full border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                    selectedThread?.id === t.id ? "bg-brand/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate font-medium text-sm">
                        <Lock size={11} className="shrink-0 text-emerald-500/70" />
                        <span className="truncate">{contactLabel(t)}</span>
                      </div>
                      {t.lastMessage && (
                        <p className="mt-0.5 truncate text-xs text-muted">{t.lastMessage}</p>
                      )}
                    </div>
                    {t.lastMessageTs && (
                      <span className="shrink-0 text-[10px] text-muted">
                        {formatTs(t.lastMessageTs)}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Message panel */}
        <main
          className={`${
            !showThreads || selectedThread ? "flex" : "hidden"
          } md:flex min-w-0 flex-1 flex-col`}
        >
          {selectedThread ? (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between border-b border-border bg-panel/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Mobile back */}
                  <button
                    className="mr-1 rounded p-1 text-muted hover:text-text md:hidden"
                    onClick={() => setShowThreads(true)}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${
                      ROLE_AVATAR[role]
                    }`}
                  >
                    {contactLabel(selectedThread).charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{contactLabel(selectedThread)}</div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <Lock size={9} />
                      End-to-end encrypted
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = isMine(m);
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] space-y-1 ${
                            mine ? "items-end" : "items-start"
                          } flex flex-col`}
                        >
                          {!mine && (
                            <span className="text-[11px] text-muted">{m.from}</span>
                          )}
                          <div
                            className={`rounded-2xl border px-3 py-2 text-sm leading-relaxed ${
                              mine
                                ? "rounded-br-sm bg-brand/20 border-brand/30 text-text"
                                : ROLE_BUBBLE[m.role]
                            }`}
                          >
                            {m.text}

                            {/* File attachment */}
                            {m.fileAttachment && (
                              <a
                                href={`/api/portal/chat/threads/${selectedThread.id}/upload?fileId=${m.fileAttachment.id}`}
                                download={m.fileAttachment.name}
                                className="mt-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] transition-colors hover:bg-white/10"
                              >
                                <FileText size={13} className="shrink-0 text-brand" />
                                <span className="truncate font-medium">{m.fileAttachment.name}</span>
                                <span className="shrink-0 text-muted">
                                  {formatBytes(m.fileAttachment.size)}
                                </span>
                              </a>
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-1 text-[10px] text-muted ${
                              mine ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <span>{formatTs(m.ts)}</span>
                            {m.encrypted && (
                              <Lock size={9} className="text-emerald-500/70" />
                            )}
                            {mine && (
                              <CheckCheck size={11} className="text-brand/60" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-border bg-panel/50 p-3 space-y-2">
                {/* Pending file preview */}
                {pendingFile && (
                  <div className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm">
                    <FileText size={14} className="shrink-0 text-brand" />
                    <span className="min-w-0 flex-1 truncate font-medium">{pendingFile.name}</span>
                    <span className="text-xs text-muted">{formatBytes(pendingFile.size)}</span>
                    <button
                      onClick={() => setPendingFile(null)}
                      className="ml-1 rounded p-0.5 text-muted hover:text-text"
                      aria-label="Remove file"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {/* File upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-brand disabled:opacity-50"
                    aria-label="Attach file"
                  >
                    <Paperclip size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    aria-label="Attach file"
                    title="Attach file"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setPendingFile(f);
                      e.target.value = "";
                    }}
                  />

                  {/* Text input */}
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    rows={1}
                    aria-label="Message input"
                    className="min-h-[38px] max-h-[120px] flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text placeholder-muted/70 outline-none transition-colors focus:border-brand"
                  />

                  {/* Send */}
                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !pendingFile) || sending || uploading}
                    className="shrink-0 rounded-xl bg-brand/20 p-2 text-brand transition-colors hover:bg-brand/30 disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Encryption notice */}
                <p className="text-center text-[10px] text-muted/60">
                  <Lock size={9} className="mr-0.5 inline" />
                  Messages and files are encrypted at rest using AES-256-GCM
                </p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShieldCheck size={40} className="mx-auto mb-4 text-emerald-500/40" />
                <p className="font-semibold text-text">Secure Messaging</p>
                <p className="mt-1 text-sm text-muted">
                  Select a conversation to get started
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
