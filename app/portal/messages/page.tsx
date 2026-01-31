"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
  senderName?: string;
}

export default function MessagesPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Compose form state
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    
    // Mock messages - in production, fetch from Supabase
    const mockMessages: Message[] = [
      {
        id: "1",
        sender_id: "case-manager-1",
        recipient_id: user?.id || "",
        subject: "Welcome to Your Support Program",
        message: "Hi! I'm your assigned case manager. I'm here to support you throughout your journey. Feel free to reach out anytime you have questions or need assistance.",
        read: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        senderName: "Sarah Johnson (Case Manager)"
      },
      {
        id: "2",
        sender_id: "case-manager-1",
        recipient_id: user?.id || "",
        subject: "Upcoming Course Deadline",
        message: "Just a reminder that your Job Readiness course has an assignment due this Friday. Let me know if you need any help completing it!",
        read: false,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        senderName: "Sarah Johnson (Case Manager)"
      },
      {
        id: "3",
        sender_id: "admin-1",
        recipient_id: user?.id || "",
        subject: "New Financial Management Course Available",
        message: "Great news! We've just launched a free Financial Management course. This course covers budgeting, saving, credit building, and more. Check it out in the Courses section!",
        read: true,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        senderName: "T.O.O.L.S Inc Team"
      }
    ];
    
    setMessages(mockMessages);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!subject.trim() || !messageBody.trim()) {
      alert("Please fill in both subject and message");
      return;
    }

    setSending(true);
    try {
      // In production: Send to Supabase
      // await supabase.from('messages').insert({...})
      
      // Mock implementation
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        recipient_id: user.caseManagerId || "case-manager-1",
        subject,
        message: messageBody,
        read: false,
        created_at: new Date().toISOString(),
        senderName: "You"
      };
      
      setMessages([newMessage, ...messages]);
      setSubject("");
      setMessageBody("");
      setShowCompose(false);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/portal/dashboard")} className="text-brand hover:text-brand2">
              ← Back to Dashboard
            </button>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              Messages
            </h1>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow"
              )}
            >
              {showCompose ? "Cancel" : "✉️ New Message"}
            </button>
          </div>
          <p className="text-muted">
            Communicate with your case manager
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full bg-brand/20 text-brand text-xs font-semibold">
                {unreadCount} unread
              </span>
            )}
          </p>
        </motion.div>

        {/* Compose Message Form */}
        {showCompose && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlowCard className="p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
                Compose Message
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    To: Your Case Manager
                  </label>
                  <div className="text-sm text-muted px-4 py-3 rounded-lg bg-bg/50 border border-border">
                    {user.caseManagerId ? "Sarah Johnson" : "Your assigned case manager"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject"
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold transition-all",
                      "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                      "hover:shadow-glow",
                      sending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-6 py-3 rounded-lg font-semibold bg-bg/50 text-text border border-border hover:border-brand/50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              Inbox ({messages.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <GlowCard className="p-6 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-muted">No messages yet</p>
              </GlowCard>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <GlowCard
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-brand/50",
                      !msg.read && "border-brand/30 bg-brand/5",
                      selectedMessage?.id === msg.id && "border-brand"
                    )}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.read) markAsRead(msg.id);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-text text-sm line-clamp-1">
                        {msg.senderName}
                      </div>
                      {!msg.read && (
                        <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-text/80 line-clamp-1 mb-1">
                      {msg.subject}
                    </div>
                    <div className="text-xs text-muted line-clamp-2 mb-2">
                      {msg.message}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                  </GlowCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlowCard className="p-6">
                  <div className="border-b border-border pb-4 mb-4">
                    <h2 className="text-xl font-extrabold tracking-tight text-text mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted">
                        <span className="font-semibold text-text">From:</span> {selectedMessage.senderName}
                      </div>
                      <div className="text-muted">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-text leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setShowCompose(true);
                        setSubject(`Re: ${selectedMessage.subject}`);
                        setSelectedMessage(null);
                      }}
                      className={cn(
                        "px-6 py-3 rounded-lg font-semibold transition-all",
                        "bg-brand/20 text-brand border border-brand/30",
                        "hover:bg-brand/30"
                      )}
                    >
                      ↩️ Reply
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            ) : (
              <GlowCard className="p-12 text-center">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-text mb-2">
                  Select a Message
                </h3>
                <p className="text-muted">
                  Choose a message from your inbox to read
                </p>
              </GlowCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
