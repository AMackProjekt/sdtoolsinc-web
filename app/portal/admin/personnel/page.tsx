"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Search, ChevronDown, Eye, Users } from "lucide-react";
import { cn } from "@/lib/cn";

type Status = "Active" | "On Leave" | "Departed";
type Department = "All" | "Case Management" | "IT" | "Administration" | "Programs" | "Outreach";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: Exclude<Department, "All">;
  startDate: string;
  status: Status;
  email: string;
}

const EMPLOYEES: Employee[] = [
  { id: "1",  name: "Aaliyah Torres",   role: "Case Manager II",        department: "Case Management", startDate: "2023-03-12", status: "Active",   email: "atorres@sdtoolsinc.org" },
  { id: "2",  name: "Marcus Chen",      role: "Systems Administrator",  department: "IT",              startDate: "2022-08-01", status: "Active",   email: "mchen@sdtoolsinc.org" },
  { id: "3",  name: "Destiny Brown",    role: "Program Coordinator",    department: "Programs",        startDate: "2023-11-07", status: "Active",   email: "dbrown@sdtoolsinc.org" },
  { id: "4",  name: "Jordan Williams",  role: "Outreach Specialist",    department: "Outreach",        startDate: "2024-01-15", status: "Active",   email: "jwilliams@sdtoolsinc.org" },
  { id: "5",  name: "Elijah Roberts",   role: "Executive Assistant",    department: "Administration",  startDate: "2024-02-20", status: "Active",   email: "eroberts@sdtoolsinc.org" },
  { id: "6",  name: "Simone Hayward",   role: "Case Manager I",         department: "Case Management", startDate: "2023-06-18", status: "On Leave", email: "shayward@sdtoolsinc.org" },
  { id: "7",  name: "Derek Okafor",     role: "IT Support Specialist",  department: "IT",              startDate: "2021-05-03", status: "Active",   email: "dokafor@sdtoolsinc.org" },
  { id: "8",  name: "Naomi Luckett",    role: "Outreach Lead",          department: "Outreach",        startDate: "2022-01-10", status: "Active",   email: "nluckett@sdtoolsinc.org" },
  { id: "9",  name: "Tyrese Fountain",  role: "Program Director",       department: "Programs",        startDate: "2020-09-14", status: "Active",   email: "tfountain@sdtoolsinc.org" },
  { id: "10", name: "Brianna Keith",    role: "Office Manager",         department: "Administration",  startDate: "2019-11-01", status: "Departed", email: "bkeith@sdtoolsinc.org" },
];

const STATUS_COLOR: Record<Status, string> = {
  "Active":   "bg-green-500/20 text-green-300",
  "On Leave": "bg-yellow-500/20 text-yellow-300",
  "Departed": "bg-slate-600/40 text-slate-400",
};

const DEPARTMENTS: Department[] = ["All", "Case Management", "IT", "Administration", "Programs", "Outreach"];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full bg-violet-700/40 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-200 shrink-0">
      {initials}
    </div>
  );
}

export default function PersonnelPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<Department>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");

  const filtered = EMPLOYEES.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All" || e.department === dept;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-gradient-to-r from-violet-900/50 to-slate-900/40 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-600/20 p-3 border border-violet-500/30">
            <UserCog className="h-6 w-6 text-violet-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Personnel Directory</h1>
            <p className="text-sm text-muted mt-0.5">{EMPLOYEES.filter(e => e.status !== "Departed").length} active staff members</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 border border-violet-500/20">
            <Users className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300">{EMPLOYEES.length} Total</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, role, email…"
            className="w-full rounded-lg border border-border bg-panel pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          />
        </div>

        {/* Department filter */}
        <div className="relative">
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value as Department)}
            className="appearance-none rounded-lg border border-border bg-panel pl-3 pr-8 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-violet-500/40 cursor-pointer"
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | Status)}
            className="appearance-none rounded-lg border border-border bg-panel pl-3 pr-8 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-violet-500/40 cursor-pointer"
          >
            {["All", "Active", "On Leave", "Departed"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="rounded-2xl border border-border bg-panel overflow-hidden"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-white/[0.02]">
              <th className="px-5 py-3.5 font-semibold text-muted">Employee</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden md:table-cell">Department</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden lg:table-cell">Start Date</th>
              <th className="px-5 py-3.5 font-semibold text-muted">Status</th>
              <th className="px-5 py-3.5 font-semibold text-muted text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted text-sm">No employees match your filters.</td>
              </tr>
            ) : (
              filtered.map((emp, i) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} />
                      <div>
                        <p className="font-semibold text-text">{emp.name}</p>
                        <p className="text-xs text-muted">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted hidden md:table-cell">{emp.department}</td>
                  <td className="px-5 py-4 text-muted hidden lg:table-cell">{emp.startDate}</td>
                  <td className="px-5 py-4">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLOR[emp.status])}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted hover:text-text hover:border-violet-500/40 transition">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-border/50 text-xs text-muted">
          Showing {filtered.length} of {EMPLOYEES.length} employees
        </div>
      </motion.div>
    </div>
  );
}
