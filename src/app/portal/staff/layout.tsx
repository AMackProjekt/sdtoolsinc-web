"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings,
  Bell,
  Search,
  LogOut,
  MessageSquare,
  AlertCircle,
  Video,
  UserCheck,
  FileSpreadsheet,
  FileBox,
  Table,
  Terminal
} from "lucide-react";
import { ShieldCheck, ShieldAlert, ShieldOff } from "lucide-react";
import { StaffProvider, useStaff } from "@/context/StaffContext";
import { signOut, useSession } from "next-auth/react";
import type { ComplianceStatus } from "@/app/api/admin/compliance/route";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffProvider>
      <StaffLayoutContent>{children}</StaffLayoutContent>
    </StaffProvider>
  );
}

function StaffLayoutContent({ children }: { children: React.ReactNode }) {
  const { notifications, markNotificationRead } = useStaff();
  const { data: session } = useSession();
  const unreadCount = notifications.filter(n => !n.read).length;

  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);

  useEffect(() => {
    fetch("/api/admin/compliance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ComplianceStatus | null) => setCompliance(data))
      .catch(() => setCompliance(null));
  }, []);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alerts: { title: string; client: string; time: string; priority: string; type: string }[] = [];
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-charcoal-800">
          <span className="font-bold text-white text-lg tracking-wide">CaseFlow Command</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/portal/staff" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-charcoal-800 text-white">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/portal/staff/caseload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <Users className="w-5 h-5" />
            Caseload / Roster
          </Link>
          <Link href="/portal/staff/documents" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <FileText className="w-5 h-5" />
            Documents
          </Link>
          <Link href="/portal/staff/messages" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <MessageSquare className="w-5 h-5" />
            Messages
          </Link>
          <Link href="/portal/staff/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <Calendar className="w-5 h-5" />
            Calendar
          </Link>
          <Link href="/portal/staff/terminal" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition border border-teal-500/20 bg-teal-500/5">
            <Terminal className="w-5 h-5 text-teal-400" />
            Command Terminal
          </Link>
          <Link href="/portal/staff/compliance" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <ShieldCheck className="w-5 h-5" />
            Compliance
          </Link>
        </nav>

        <div className="p-4 border-t border-charcoal-800">
          {/* Compliance status pill */}
          {compliance && (
            <div
              title={`PHI: ${compliance.checks.phi_workflow_approved ? "✓" : "✗"}  BAA: ${compliance.checks.baa_confirmed ? "✓" : "✗"}  Encryption: ${compliance.checks.encryption_key_configured ? "✓" : "✗"}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2 text-xs font-semibold ${
                compliance.overall === "approved"
                  ? "bg-teal-500/15 text-teal-400"
                  : compliance.overall === "pending"
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-rose-500/15 text-rose-400"
              }`}
            >
              {compliance.overall === "approved" ? (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              ) : compliance.overall === "pending" ? (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              ) : (
                <ShieldOff className="w-4 h-4 shrink-0" />
              )}
              <span>
                {compliance.overall === "approved"
                  ? "Compliance: OK"
                  : compliance.overall === "pending"
                  ? "Compliance: Pending"
                  : "Compliance: Not Set"}
              </span>
            </div>
          )}
          <Link href="/portal/staff/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-white transition">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login/staff" })}
            title="Sign out"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800 hover:text-red-400 transition mt-1 text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-96 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search clients, case notes, or IDs..." 
                className="w-full bg-slate-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button title="New Google Doc" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-blue-600">
                <FileText className="w-4 h-4" />
              </button>
              <button title="New Google Sheet" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-emerald-600">
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button title="New MSFT Word" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-indigo-600">
                <FileBox className="w-4 h-4" />
              </button>
              <button title="New MSFT Excel" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-green-700">
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition shadow-sm border border-slate-100">
                 <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-200"></div>

            {/* Notifications Bell with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl border border-slate-100 transition-colors shadow-sm ${showNotifications ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-slate-50 text-slate-400 hover:text-teal-600'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-charcoal-900">Live Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full uppercase tracking-widest leading-none">{unreadCount} UNREAD</span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto w-full custom-scrollbar">
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="px-5 py-4 hover:bg-slate-50 transition cursor-pointer border-b border-slate-50 last:border-0 group">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            alert.type === 'f2f' ? 'bg-rose-100 text-rose-600' : 
                            alert.type === 'audit' ? 'bg-amber-100 text-amber-600' : 
                            'bg-indigo-100 text-indigo-600'
                          }`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <p className="text-sm font-bold text-charcoal-900 group-hover:text-teal-600 transition truncate">
                                {alert.title}
                              </p>
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {alert.client} • {alert.type.toUpperCase()} Priority
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer">
                    View All Activity Log
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-charcoal-900 leading-none">{session?.user?.name ?? "Staff"}</p>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1">{session?.user?.role ?? "staff"}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white">
                M
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
