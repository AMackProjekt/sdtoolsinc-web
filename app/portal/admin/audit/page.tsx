"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Filter, User, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type ActionType = "created" | "updated" | "deleted" | "viewed";
type TabFilter = "All" | ActionType;

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: ActionType;
  resource: string;
  detail: string;
  ip: string;
}

const ENTRIES: AuditEntry[] = [
  { id: "e01", timestamp: "2026-04-14 09:12:04", user: "Aaliyah Torres",   userRole: "Case Manager II",       action: "viewed",   resource: "Participant Record",  detail: "Jordan M. — participant profile",          ip: "10.0.1.44" },
  { id: "e02", timestamp: "2026-04-14 09:08:55", user: "Marcus Chen",      userRole: "Systems Administrator", action: "updated",  resource: "System Configuration", detail: "Updated SMTP relay settings",              ip: "10.0.1.12" },
  { id: "e03", timestamp: "2026-04-14 08:51:32", user: "Destiny Brown",    userRole: "Program Coordinator",   action: "created",  resource: "Program Enrollment",  detail: "New enrollment: Tyra Williams in Work Ready", ip: "10.0.1.67" },
  { id: "e04", timestamp: "2026-04-13 17:44:10", user: "Admin System",     userRole: "Automated",             action: "deleted",  resource: "Session Token",        detail: "Expired session cleared (batch)",          ip: "127.0.0.1" },
  { id: "e05", timestamp: "2026-04-13 16:30:01", user: "Elijah Roberts",   userRole: "Executive Assistant",   action: "viewed",   resource: "Staff Report",         detail: "HR Q1 Personnel Summary",                  ip: "10.0.1.89" },
  { id: "e06", timestamp: "2026-04-13 15:22:48", user: "Naomi Luckett",    userRole: "Outreach Lead",         action: "created",  resource: "Referral",             detail: "Referral submitted for D. Carter",         ip: "10.0.1.55" },
  { id: "e07", timestamp: "2026-04-13 14:07:33", user: "Derek Okafor",     userRole: "IT Support Specialist", action: "updated",  resource: "User Account",         detail: "Reset password for T. Fountain",            ip: "10.0.1.12" },
  { id: "e08", timestamp: "2026-04-13 13:55:19", user: "Tyrese Fountain",  userRole: "Program Director",      action: "viewed",   resource: "Compliance Report",    detail: "Viewed compliance tracker (full)",         ip: "10.0.1.78" },
  { id: "e09", timestamp: "2026-04-13 11:41:07", user: "Jordan Williams",  userRole: "Outreach Specialist",   action: "updated",  resource: "Participant Record",   detail: "Updated goals: Marcus B.",                 ip: "10.0.1.22" },
  { id: "e10", timestamp: "2026-04-12 16:09:52", user: "Marcus Chen",      userRole: "Systems Administrator", action: "deleted",  resource: "Test Account",         detail: "Removed staging test user (cleanup)",      ip: "10.0.1.12" },
  { id: "e11", timestamp: "2026-04-12 10:30:44", user: "Simone Hayward",   userRole: "Case Manager I",        action: "created",  resource: "Case Note",            detail: "Case note added — intake session",         ip: "10.0.1.34" },
  { id: "e12", timestamp: "2026-04-11 14:55:28", user: "Brianna Keith",    userRole: "Former Staff",          action: "viewed",   resource: "Document",             detail: "Downloaded exit checklist (final access)",  ip: "10.0.3.01" },
];

const ACTION_STYLE: Record<ActionType, { badge: string; icon: typeof Eye; label: string }> = {
  created: { badge: "bg-green-500/20 text-green-300 border-green-500/25",   icon: Plus,    label: "Created" },
  updated: { badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/25", icon: Pencil,  label: "Updated" },
  deleted: { badge: "bg-red-500/20 text-red-300 border-red-500/25",         icon: Trash2,  label: "Deleted" },
  viewed:  { badge: "bg-sky-500/20 text-sky-300 border-sky-500/25",         icon: Eye,     label: "Viewed"  },
};

const TABS: TabFilter[] = ["All", "created", "updated", "deleted", "viewed"];

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = ENTRIES.filter((e) => {
    const matchTab = activeTab === "All" || e.action === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.user.toLowerCase().includes(q) ||
      e.resource.toLowerCase().includes(q) ||
      e.detail.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-600/30 p-3 border border-slate-500/30">
            <ScrollText className="h-6 w-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Audit Log</h1>
            <p className="text-sm text-muted mt-0.5">All administrative and user actions recorded below</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-600/20 px-3 py-1 border border-slate-500/30">
            <ScrollText className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Immutable Record</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Tab filters */}
        <div className="flex gap-1.5">
          {TABS.map((tab) => {
            const isAction = tab !== "All";
            const style = isAction ? ACTION_STYLE[tab as ActionType] : null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition capitalize",
                  activeTab === tab
                    ? style
                      ? cn("border", style.badge)
                      : "bg-white/10 border-white/20 text-text"
                    : "border-border bg-panel text-muted hover:text-text"
                )}
              >
                {tab === "All" ? "All" : ACTION_STYLE[tab as ActionType].label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user, resource, detail…"
            className="w-full rounded-lg border border-border bg-panel pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-slate-500/40"
          />
        </div>
      </motion.div>

      {/* Log Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-panel overflow-hidden"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-white/[0.02]">
              <th className="px-5 py-3.5 font-semibold text-muted whitespace-nowrap">Timestamp</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden md:table-cell">User</th>
              <th className="px-5 py-3.5 font-semibold text-muted">Action</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden lg:table-cell">Resource</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden xl:table-cell">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted text-sm">
                  No entries match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((entry, i) => {
                const { badge, icon: Icon, label } = ACTION_STYLE[entry.action];
                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className="border-b border-border/40 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-muted whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-600/40 border border-slate-500/30 flex items-center justify-center">
                          <User className="h-3 w-3 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-text text-xs">{entry.user}</p>
                          <p className="text-[11px] text-muted">{entry.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", badge)}>
                        <Icon className="h-3 w-3" />
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted hidden lg:table-cell">{entry.resource}</td>
                    <td className="px-5 py-4 text-muted text-xs hidden xl:table-cell max-w-[280px] truncate">{entry.detail}</td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/50">
          <span className="text-xs text-muted">Showing {filtered.length} of {ENTRIES.length} entries</span>
          <span className="text-xs text-muted/60 italic">Read-only — entries cannot be modified</span>
        </div>
      </motion.div>
    </div>
  );
}
