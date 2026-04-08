"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { Search, UserCog, Shield, ChevronDown, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type Role = "Enterprise Admin" | "Admin" | "Staff" | "Participant" | "Read-Only";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Pending" | "Suspended";
  lastLogin: string;
  department: string;
}

const ROLE_OPTIONS: Role[] = ["Enterprise Admin", "Admin", "Staff", "Participant", "Read-Only"];

const ROLE_STYLES: Record<Role, string> = {
  "Enterprise Admin": "bg-cyan-900/50 text-cyan-300 border-cyan-700/50",
  "Admin":            "bg-violet-900/50 text-violet-300 border-violet-700/50",
  "Staff":            "bg-sky-900/50 text-sky-300 border-sky-700/50",
  "Participant":      "bg-teal-900/50 text-teal-300 border-teal-700/50",
  "Read-Only":        "bg-slate-800 text-slate-400 border-slate-700",
};

const STATUS_STYLES = {
  Active:    { icon: CheckCircle, cls: "text-emerald-400" },
  Pending:   { icon: Clock,       cls: "text-amber-400" },
  Suspended: { icon: XCircle,     cls: "text-red-400" },
};

const PERMISSIONS = [
  { name: "View Dashboard",      enterprise: true,  admin: true,  staff: true,  participant: true  },
  { name: "Manage Users",        enterprise: true,  admin: true,  staff: false, participant: false },
  { name: "Edit Org Settings",   enterprise: true,  admin: false, staff: false, participant: false },
  { name: "View Reports",        enterprise: true,  admin: true,  staff: true,  participant: false },
  { name: "Manage Integrations", enterprise: true,  admin: false, staff: false, participant: false },
  { name: "Audit Log Access",    enterprise: true,  admin: true,  staff: false, participant: false },
  { name: "Create Content",      enterprise: true,  admin: true,  staff: true,  participant: false },
  { name: "Submit Applications", enterprise: false, admin: false, staff: false, participant: true  },
];

export default function IdentityPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "All">("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"users" | "permissions">("users");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/users")
      .then((r) => r.json())
      .then((data) => { if (data.users) setUsers(data.users as ManagedUser[]); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleRoleChange = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    setEditingId(null);
    fetch("/api/enterprise/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    }).catch(() => {});
  };

  const handleStatusToggle = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const status = u.status === "Active" ? "Suspended" : "Active";
        fetch("/api/enterprise/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        }).catch(() => {});
        return { ...u, status };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <UserCog size={22} className="text-cyan-400" /> Identity & Access Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">Manage user roles, access policies, and permissions</p>
        </div>
        <div className="rounded-full bg-cyan-900/30 border border-cyan-800/40 px-3 py-1 text-xs font-semibold text-cyan-300">
          {users.length} total users
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-900 p-1 w-fit">
        {(["users", "permissions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold capitalize transition",
              tab === t ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            {t === "users" ? "User Management" : "Permissions Matrix"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as Role | "All")}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="All">All Roles</option>
              {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* User Table */}
          <GlowCard className="bg-slate-900 border-slate-800 overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["User", "Role", "Department", "Status", "Last Login", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  [1, 2, 3, 4].map((n) => (
                    <tr key={n}><td colSpan={6} className="px-5 py-3">
                      <div className="h-8 animate-pulse rounded-lg bg-slate-800/50" />
                    </td></tr>
                  ))
                ) : filtered.map((u) => {
                  const { icon: StatusIcon, cls } = STATUS_STYLES[u.status];
                  return (
                    <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {editingId === u.id ? (
                          <select
                            autoFocus
                            defaultValue={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            onBlur={() => setEditingId(null)}
                            className="rounded-lg border border-cyan-600 bg-slate-800 px-2 py-1 text-xs text-white outline-none"
                          >
                            {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingId(u.id)}
                            className={cn("flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition hover:opacity-80", ROLE_STYLES[u.role])}
                          >
                            <Shield size={10} />{u.role}<ChevronDown size={10} />
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{u.department}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn("flex items-center gap-1 text-xs font-semibold", cls)}>
                          <StatusIcon size={12} />{u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{u.lastLogin}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleStatusToggle(u.id)}
                          className={cn(
                            "rounded-lg px-3 py-1 text-xs font-semibold transition",
                            u.status === "Active"
                              ? "bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-800/40"
                              : "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/40"
                          )}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!loadingData && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-600">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlowCard>
        </>
      )}

      {tab === "permissions" && (
        <GlowCard className="bg-slate-900 border-slate-800 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Permission</th>
                {["Enterprise Admin", "Admin", "Staff", "Participant"].map((r) => (
                  <th key={r} className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm) => (
                <tr key={perm.name} className="border-b border-slate-800/50">
                  <td className="px-5 py-3 font-medium text-slate-300">{perm.name}</td>
                  {([perm.enterprise, perm.admin, perm.staff, perm.participant]).map((allowed, i) => (
                    <td key={i} className="px-5 py-3 text-center">
                      {allowed
                        ? <CheckCircle size={16} className="mx-auto text-cyan-400" />
                        : <XCircle    size={16} className="mx-auto text-slate-700" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      )}
    </motion.div>
  );
}
