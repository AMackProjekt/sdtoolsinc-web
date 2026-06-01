"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, MessageCircle, ArrowRight, X } from "lucide-react";
import { GlowCard } from "./GlowCard";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";

interface RecentThread {
  id: string;
  participantName: string;
  staffName: string;
  lastMessage?: string;
  lastMessageTs?: string;
  unreadCount?: number;
}

interface MessagingWidgetProps {
  compact?: boolean;
  showRecent?: boolean;
  className?: string;
}

function isParticipantLikeRole(role?: string | null) {
  return !!role && /(participant|client|viewer)/i.test(role);
}

export function MessagingWidget({
  compact = false,
  showRecent = true,
  className,
}: MessagingWidgetProps) {
  const { user, isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<RecentThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !showRecent) return;

    const loadThreads = async () => {
      try {
        setLoading(true);
        const participantView = isParticipantLikeRole(user?.role);
        const url = participantView && user?.name
          ? `/api/portal/chat/threads?participantName=${encodeURIComponent(user.name)}`
          : "/api/portal/chat/threads";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setThreads((data.threads || []).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load messaging threads:", err);
      } finally {
        setLoading(false);
      }
    };

    loadThreads();
    const interval = setInterval(loadThreads, 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, showRecent, user?.name, user?.role]);

  if (!isAuthenticated) return null;

  if (compact) {
    return (
      <Link
        href="/portal/chat"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-sky-900/40 bg-sky-900/20 px-4 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-900/40 transition",
          className
        )}
      >
        <MessageSquare size={16} />
        Messages
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <GlowCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20">
              <MessageCircle size={20} className="text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text">Messages</h3>
              <p className="text-xs text-muted">Direct contact hub</p>
            </div>
          </div>
          <Link
            href="/portal/chat"
            className="rounded-lg p-2 hover:bg-slate-800/50 transition"
            title="Open messaging"
          >
            <MessageSquare size={18} className="text-sky-400" />
          </Link>
        </div>

        {/* Recent threads preview */}
        {showRecent && threads.length > 0 && (
          <div className="space-y-2 mb-4 border-t border-border pt-4">
            {threads.map((thread) => {
              const contactLabel = isParticipantLikeRole(user?.role)
                ? thread.staffName
                : thread.participantName || thread.staffName;
              return (
                <Link
                  key={thread.id}
                  href={`/portal/chat?threadId=${thread.id}`}
                  className="block rounded-lg border border-border/50 bg-slate-900/30 p-3 hover:bg-slate-900/60 hover:border-sky-500/30 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">
                        {contactLabel}
                      </p>
                      {thread.lastMessage && (
                        <p className="text-xs text-muted truncate mt-1">
                          {thread.lastMessage}
                        </p>
                      )}
                    </div>
                    {thread.unreadCount ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/30 text-[10px] font-semibold text-rose-300">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <Link
          href="/portal/chat"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition w-full justify-center"
        >
          <MessageSquare size={16} />
          Open Messages
          <ArrowRight size={14} className="ml-auto" />
        </Link>
      </GlowCard>
    </motion.div>
  );
}

/**
 * MessagingBadge - Compact notification badge for portal headers
 */
export function MessagingBadge() {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUnreadCount = async () => {
      try {
        const participantView = isParticipantLikeRole(user?.role);
        const url = participantView && user?.name
          ? `/api/portal/chat/threads?participantName=${encodeURIComponent(user.name)}`
          : "/api/portal/chat/threads";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const count = (data.threads || []).reduce(
            (sum: number, t: RecentThread) => sum + (t.unreadCount || 0),
            0
          );
          setUnreadCount(count);
        }
      } catch (err) {
        console.error("Failed to load unread count:", err);
      }
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.name, user?.role]);

  if (!isAuthenticated || unreadCount === 0) return null;

  return (
    <Link
      href="/portal/chat"
      className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-sky-900/40 transition"
      title={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
    >
      <MessageSquare size={18} className="text-sky-400" />
      <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </Link>
  );
}
