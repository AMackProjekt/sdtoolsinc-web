"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { UserCheck, UserX, Clock, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/cn";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  title: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
  hire_date: string;
  manager_id?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  on_leave: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  terminated: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  on_leave: "On Leave",
  terminated: "Terminated",
};

export default function AdminStaffPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : d.staff ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const filtered = staff.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = staff.filter((s) => s.status === "active").length;
  const onLeaveCount = staff.filter((s) => s.status === "on_leave").length;
  const terminatedCount = staff.filter((s) => s.status === "terminated").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Staff Roster</h1>
        <p className="mt-1 text-sm text-slate-400">View and manage all staff members across departments.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: activeCount, icon: UserCheck, color: "text-emerald-400" },
          { label: "On Leave", value: onLeaveCount, icon: Clock, color: "text-amber-400" },
          { label: "Terminated", value: terminatedCount, icon: UserX, color: "text-red-400" },
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

      {/* Search */}
      <GlowCard className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, or department…"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
          />
        </div>
      </GlowCard>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-400">Loading staff…</div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
            <Briefcase className="h-8 w-8 opacity-40" />
            <span className="text-sm">No staff members found.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                {["Name", "Title", "Department", "Status", "Hire Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/4 transition"
                >
                  <td className="px-5 py-3 font-semibold text-white">{s.name}</td>
                  <td className="px-5 py-3 text-slate-300">{s.title}</td>
                  <td className="px-5 py-3 text-slate-400">{s.department}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[s.status])}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(s.hire_date).toLocaleDateString()}
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
