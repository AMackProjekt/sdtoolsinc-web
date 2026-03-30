import Link from "next/link";
import { ShieldCheck, Users, UserRound, Lock } from "lucide-react";

const PORTALS = [
  {
    href: "/login/staff",
    icon: Users,
    accent: "teal",
    label: "Staff Portal",
    description: "Case managers, support staff, and coordinators",
    badge: "Org domain · 2FA required",
  },
  {
    href: "/login/client",
    icon: UserRound,
    accent: "blue",
    label: "Client Portal",
    description: "Participants accessing their case information",
    badge: "Username & password",
  },
  {
    href: "/login/admin",
    icon: ShieldCheck,
    accent: "violet",
    label: "Admin Portal",
    description: "Supervisors, champions, and enterprise administrators",
    badge: "Restricted access",
  },
];

const accentMap: Record<string, { card: string; icon: string; badge: string; arrow: string }> = {
  teal: {
    card: "border-teal-800/60 hover:border-teal-600 hover:bg-teal-950/30",
    icon: "bg-teal-900/60 text-teal-400",
    badge: "bg-teal-950 border-teal-800/70 text-teal-400",
    arrow: "text-teal-500",
  },
  blue: {
    card: "border-blue-800/60 hover:border-blue-600 hover:bg-blue-950/30",
    icon: "bg-blue-900/60 text-blue-400",
    badge: "bg-blue-950 border-blue-800/70 text-blue-400",
    arrow: "text-blue-500",
  },
  violet: {
    card: "border-violet-800/60 hover:border-violet-600 hover:bg-violet-950/30",
    icon: "bg-violet-900/60 text-violet-400",
    badge: "bg-violet-950 border-violet-800/70 text-violet-400",
    arrow: "text-violet-500",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Lock className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <span className="font-bold text-white block text-sm leading-none">T.O.O.LS INC</span>
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">CaseFlow Operations</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-md">
        <h1 className="text-3xl font-bold text-white mb-3">Sign in to your portal</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Select the portal that matches your role to continue.
        </p>
      </div>

      {/* Portal cards */}
      <div className="w-full max-w-sm space-y-3">
        {PORTALS.map(({ href, icon: Icon, accent, label, description, badge }) => {
          const styles = accentMap[accent];
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-2xl border bg-slate-900/60 px-5 py-4 transition-all duration-150 group ${styles.card}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm mb-0.5">{label}</div>
                <div className="text-xs text-slate-400 truncate">{description}</div>
                <div className={`inline-flex items-center gap-1.5 border text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${styles.badge}`}>
                  {badge}
                </div>
              </div>

              <svg
                className={`w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${styles.arrow}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-slate-600 text-center">
        Need access?{" "}
        <Link href="/request-access" className="text-teal-500 hover:text-teal-400 transition">
          Request an account
        </Link>
        {" · "}
        <Link href="/legal/privacy" className="hover:text-slate-400 transition">
          Privacy
        </Link>
      </p>
    </div>
  );
}
