"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Users, Search, Filter, UserCheck, UserX, Clock, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

interface EnterpriseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  status: "active" | "inactive" | "pending";
  last_active?: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  inactive: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  pending: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<EnterpriseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/users")
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : d.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = users.filter((u) => u.status === "active").length;
  const totalPending = users.filter((u) => u.status === "pending").length;
  const totalInactive = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">User Management</h1>
          <p className="mt-1 text-sm text-slate-400">Manage all portal accounts and access roles.</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: totalActive, icon: UserCheck, color: "text-emerald-400" },
          { label: "Pending", value: totalPending, icon: Clock, color: "text-amber-400" },
          { label: "Inactive", value: totalInactive, icon: UserX, color: "text-slate-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlowCard key={label} className="p-4">
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", color)} />
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
                <div className={cn("text-2xl font-extrabold", color)}>{loading ? "—" : value}</div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Filters */}
      <GlowCard className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            {["all", "active", "pending", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                  statusFilter === s
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </GlowCard>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-400">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
            <Users className="h-8 w-8 opacity-40" />
            <span className="text-sm">No users found.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                {["Name", "Email", "Role", "Department", "Status", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-white/4 transition"
                >
                  <td className="px-5 py-3 font-semibold text-white">{u.name}</td>
                  <td className="px-5 py-3 text-slate-400">{u.email}</td>
                  <td className="px-5 py-3 capitalize text-slate-300">{u.role}</td>
                  <td className="px-5 py-3 text-slate-400">{u.department ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_COLORS[u.status])}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </GlowCard>
    </div>
  );
}
