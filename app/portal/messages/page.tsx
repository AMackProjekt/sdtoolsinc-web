"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "case_manager";
  content: string;
  timestamp: Date;
  read: boolean;
}

// Mock case manager data - in production, fetch from API
const MOCK_CASE_MANAGER = {
  id: "cm-001",
  name: "Sarah Johnson",
  role: "Senior Case Manager",
  avatar: "SJ",
  email: "sarah.johnson@toolsinc.org",
  phone: "(555) 123-4567",
  availability: "Mon-Fri, 9am-5pm PST",
};

// Mock messages - in production, fetch from API/Supabase
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderId: "cm-001",
    senderName: "Sarah Johnson",
    senderRole: "case_manager",
    content: "Hi! Welcome to T.O.O.L.S Inc. I'm your assigned case manager. How can I help you today?",
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
  {
    id: "2",
    senderId: "user-001",
    senderName: "You",
    senderRole: "client",
    content: "Hello! I'm interested in the job readiness program and would like to learn more.",
    timestamp: new Date(Date.now() - 3000000),
    read: true,
  },
  {
    id: "3",
    senderId: "cm-001",
    senderName: "Sarah Johnson",
    senderRole: "case_manager",
    content: "Great! The Job Readiness Program includes resume building, interview skills, and job search strategies. Would you like to schedule a meeting to discuss your goals?",
    timestamp: new Date(Date.now() - 2400000),
    read: true,
  },
];

export default function MessagesPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    
    // Create new message
    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: "You",
      senderRole: "client",
      content: newMessage,
      timestamp: new Date(),
      read: false,
    };

    // Add message to list
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate API call delay
    setTimeout(() => {
      setSending(false);
    }, 500);
    
    // In production: Send message to API/Supabase
    // await sendMessage(user.id, user.caseManagerId, newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

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

      <div className="mx-auto max-w-6xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Messages
          </h1>
          <p className="text-muted mb-8">Communicate with your assigned case manager</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Manager Info Sidebar */}
          <div className="lg:col-span-1">
            <GlowCard className="p-6 sticky top-8">
              <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
                Your Case Manager
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-[#02131a] font-bold text-xl">
                  {MOCK_CASE_MANAGER.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-text">{MOCK_CASE_MANAGER.name}</h3>
                  <p className="text-sm text-muted">{MOCK_CASE_MANAGER.role}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-muted text-xs">Email</div>
                    <div className="text-text">{MOCK_CASE_MANAGER.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-muted text-xs">Phone</div>
                    <div className="text-text">{MOCK_CASE_MANAGER.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-muted text-xs">Availability</div>
                    <div className="text-text">{MOCK_CASE_MANAGER.availability}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-brand">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Messages Container */}
          <div className="lg:col-span-2">
            <GlowCard className="p-6 flex flex-col" style={{ minHeight: "600px" }}>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex gap-3",
                      message.senderRole === "client" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold",
                        message.senderRole === "case_manager"
                          ? "bg-gradient-to-br from-brand to-brand2 text-[#02131a]"
                          : "bg-panel border-2 border-brand text-brand"
                      )}
                    >
                      {message.senderRole === "case_manager" ? MOCK_CASE_MANAGER.avatar : user.name.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "flex-1 max-w-lg",
                        message.senderRole === "client" ? "items-end" : "items-start"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-text">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-muted">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "rounded-xl p-4",
                          message.senderRole === "case_manager"
                            ? "bg-panel border border-border"
                            : "bg-gradient-to-br from-brand/20 to-brand2/20 border border-brand/30"
                        )}
                      >
                        <p className="text-sm text-text leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border pt-4">
                <div className="flex gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    className="flex-1 rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                    rows={3}
                    disabled={sending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold transition-all self-end",
                      "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                      "hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
                <p className="text-xs text-muted mt-2">
                  💡 Your case manager typically responds within 24 hours during business days
                </p>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
