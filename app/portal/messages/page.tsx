"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { getMessages, sendMessage, markMessageRead, Message } from "@/lib/supabase";
import { cn } from "@/lib/cn";

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"inbox" | "sent" | "compose">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composing, setComposing] = useState(false);
  
  // Compose form state
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    loadMessages();
  }, [isAuthenticated, router]);

  const loadMessages = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getMessages(user.id);
    setMessages(data);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!user?.id || !recipient || !subject || !messageBody) {
      alert("Please fill in all fields");
      return;
    }

    setSending(true);
    const sent = await sendMessage(
      user.id,
      recipient,
      subject,
      messageBody,
      selectedMessage?.id
    );

    if (sent) {
      setSubject("");
      setMessageBody("");
      setRecipient("");
      setComposing(false);
      setActiveView("inbox");
      await loadMessages();
    } else {
      alert("Failed to send message");
    }
    setSending(false);
  };

  const handleMarkRead = async (messageId: string) => {
    await markMessageRead(messageId);
    await loadMessages();
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setRecipient(message.sender_id);
    setSubject(`Re: ${message.subject}`);
    setComposing(true);
    setActiveView("compose");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const inboxMessages = messages.filter((m) => m.recipient_id === user.id);
  const sentMessages = messages.filter((m) => m.sender_id === user.id);
  const unreadCount = inboxMessages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="text-brand hover:text-brand2"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-extrabold text-text">Messages</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="mx-auto max-w-container px-7 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlowCard className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveView("inbox");
                    setComposing(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold",
                    activeView === "inbox"
                      ? "bg-brand/20 text-brand"
                      : "text-muted hover:bg-glass"
                  )}
                >
                  📥 Inbox {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-brand text-[#02131a]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveView("sent");
                    setComposing(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold",
                    activeView === "sent"
                      ? "bg-brand/20 text-brand"
                      : "text-muted hover:bg-glass"
                  )}
                >
                  📤 Sent
                </button>
                <button
                  onClick={() => {
                    setActiveView("compose");
                    setComposing(true);
                    setSelectedMessage(null);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-brand to-brand2 text-[#02131a] font-semibold hover:shadow-glow transition-all"
                >
                  ✍️ Compose
                </button>
              </nav>
            </GlowCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <GlowCard className="p-8 text-center">
                <div className="text-muted">Loading messages...</div>
              </GlowCard>
            ) : composing || activeView === "compose" ? (
              // Compose View
              <GlowCard className="p-6">
                <h2 className="text-2xl font-extrabold text-text mb-6">
                  {selectedMessage ? "Reply to Message" : "Compose New Message"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Recipient (Case Manager ID)
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      disabled={!!selectedMessage}
                      className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50"
                      placeholder="Enter recipient user ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                      placeholder="Enter subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Message
                    </label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      rows={8}
                      className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSendMessage}
                      disabled={sending}
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                    <button
                      onClick={() => {
                        setComposing(false);
                        setActiveView("inbox");
                        setSelectedMessage(null);
                      }}
                      className="px-6 py-3 rounded-lg font-semibold border border-border text-muted hover:text-text transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </GlowCard>
            ) : activeView === "inbox" ? (
              // Inbox View
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-text mb-4">
                  Inbox ({inboxMessages.length})
                </h2>
                {inboxMessages.length === 0 ? (
                  <GlowCard className="p-8 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-muted">No messages in your inbox</p>
                  </GlowCard>
                ) : (
                  inboxMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <GlowCard
                        className={cn(
                          "p-4 cursor-pointer hover:bg-glass transition-colors",
                          !msg.read && "border-l-4 border-brand"
                        )}
                        onClick={() => {
                          if (!msg.read) handleMarkRead(msg.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              {!msg.read && (
                                <span className="w-2 h-2 rounded-full bg-brand" />
                              )}
                              <h3 className="font-bold text-text">{msg.subject}</h3>
                            </div>
                            <p className="text-sm text-muted line-clamp-2 mb-2">
                              {msg.message}
                            </p>
                            <div className="text-xs text-muted">
                              {new Date(msg.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(msg);
                            }}
                            className="ml-4 px-3 py-1 text-sm rounded-lg border border-brand text-brand hover:bg-brand/10 transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              // Sent View
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-text mb-4">
                  Sent Messages ({sentMessages.length})
                </h2>
                {sentMessages.length === 0 ? (
                  <GlowCard className="p-8 text-center">
                    <div className="text-4xl mb-4">📤</div>
                    <p className="text-muted">No sent messages</p>
                  </GlowCard>
                ) : (
                  sentMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <GlowCard className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <h3 className="font-bold text-text mb-2">{msg.subject}</h3>
                            <p className="text-sm text-muted line-clamp-2 mb-2">
                              {msg.message}
                            </p>
                            <div className="text-xs text-muted">
                              Sent: {new Date(msg.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
