"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { ExternalLink, CheckCircle2, Circle, ChevronDown, ChevronUp, Plug } from "lucide-react";

/* ── Brand logos as inline SVG ─────────────────────────────────────── */
const M365Logo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="13" height="13" rx="2" fill="#F25022" />
    <rect x="17" y="1" width="14" height="13" rx="2" fill="#7FBA00" />
    <rect x="1" y="17" width="13" height="14" rx="2" fill="#00A4EF" />
    <rect x="17" y="17" width="14" height="14" rx="2" fill="#FFB900" />
  </svg>
);

const GoogleWorkspaceLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#fff" />
    <path d="M28.5 16c0-.9-.08-1.76-.22-2.6H16v4.92h7.02a5.99 5.99 0 01-2.6 3.93v3.27h4.2C27.18 23.13 28.5 19.8 28.5 16z" fill="#4285F4" />
    <path d="M16 29c3.53 0 6.48-1.17 8.64-3.18l-4.2-3.27C19.13 23.5 17.65 24 16 24c-3.4 0-6.28-2.3-7.31-5.38H4.35v3.38A13 13 0 0016 29z" fill="#34A853" />
    <path d="M8.69 18.62A7.8 7.8 0 018.25 16c0-.9.16-1.78.44-2.62V9.99H4.35A13 13 0 003 16c0 2.1.5 4.08 1.35 5.86l4.34-3.24z" fill="#FBBC05" />
    <path d="M16 8c1.93 0 3.65.66 5.01 1.97l3.75-3.75C22.47 4.06 19.52 3 16 3A13 13 0 004.35 9.99l4.34 3.39C9.72 10.3 12.6 8 16 8z" fill="#EA4335" />
  </svg>
);

const AdobeAcrobatLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#FF0000" />
    <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10S21.52 6 16 6zm-1 14.5h-4l4-9 4 9h-4z" fill="#fff" fillRule="evenodd" />
    <path d="M10 20.5h12" stroke="#fff" strokeWidth="1.2" />
  </svg>
);

const AdobeExpressLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#FF0000" />
    <text x="16" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#fff">Xd</text>
  </svg>
);

const CanvaLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#7D2AE8" />
    <text x="16" y="21" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#fff">Ca</text>
  </svg>
);

const BriteCalendarLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#0EA5E9" />
    <rect x="6" y="10" width="20" height="16" rx="2" fill="#fff" />
    <rect x="6" y="6" width="20" height="6" rx="2" fill="#0369A1" />
    <rect x="10" y="4" width="2.5" height="5" rx="1" fill="#BAE6FD" />
    <rect x="19.5" y="4" width="2.5" height="5" rx="1" fill="#BAE6FD" />
    <rect x="9" y="16" width="4" height="4" rx="1" fill="#0EA5E9" />
    <rect x="14" y="16" width="4" height="4" rx="1" fill="#0EA5E9" />
    <rect x="19" y="16" width="4" height="4" rx="1" fill="#0EA5E9" />
  </svg>
);

const ADPLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#D0021B" />
    <text x="16" y="22" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="bold" fill="#fff">ADP</text>
  </svg>
);

const ClarityHMISLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#1E3A5F" />
    <circle cx="16" cy="12" r="5" fill="#4A9EDE" />
    <path d="M7 26c0-5 4-8 9-8s9 3 9 8" stroke="#4A9EDE" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="22" cy="10" r="3" fill="#7EC8F0" opacity=".85" />
    <circle cx="10" cy="10" r="3" fill="#7EC8F0" opacity=".85" />
  </svg>
);

/* ── Integration data ───────────────────────────────────────────────── */
export interface AppIntegration {
  id: string;
  name: string;
  category: "Microsoft" | "Google" | "Adobe" | "Productivity" | "Workforce" | "HMIS";
  logo: () => JSX.Element;
  description: string;
  features: string[];
  connectUrl: string;
  docsUrl: string;
  color: string;
  border: string;
}

export const PRODUCTIVITY_INTEGRATIONS: AppIntegration[] = [
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    category: "Microsoft",
    logo: M365Logo,
    description: "Connect Word, Excel, PowerPoint, Teams, Outlook, and OneDrive directly within your portal workspace.",
    features: ["Single Sign-On via Azure AD", "OneDrive file attachments", "Teams meeting links", "Outlook calendar sync", "Office Online editing"],
    connectUrl: "https://login.microsoftonline.com",
    docsUrl: "https://learn.microsoft.com/microsoft-365",
    color: "text-sky-400",
    border: "border-sky-800/30 bg-sky-950/40",
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "Google",
    logo: GoogleWorkspaceLogo,
    description: "Integrate Gmail, Drive, Docs, Sheets, Slides, Google Meet, and Google Calendar with your portal.",
    features: ["Google SSO", "Drive file sharing", "Meet video links", "Google Calendar sync", "Docs/Sheets collaboration"],
    connectUrl: "https://workspace.google.com",
    docsUrl: "https://workspace.google.com/intl/en/features/",
    color: "text-emerald-400",
    border: "border-emerald-800/30 bg-emerald-950/40",
  },
  {
    id: "adobe-acrobat",
    name: "Adobe Acrobat",
    category: "Adobe",
    logo: AdobeAcrobatLogo,
    description: "View, edit, annotate, and e-sign PDF documents without leaving your portal. Powered by Adobe Acrobat APIs.",
    features: ["Inline PDF viewer", "E-signature workflows", "Document annotation", "PDF form fill", "Secure send & track"],
    connectUrl: "https://acrobat.adobe.com",
    docsUrl: "https://developer.adobe.com/document-services/",
    color: "text-red-400",
    border: "border-red-800/30 bg-red-950/40",
  },
  {
    id: "adobe-express",
    name: "Adobe Express",
    category: "Adobe",
    logo: AdobeExpressLogo,
    description: "Create stunning social posts, flyers, presentations, and branded materials with Adobe Express templates.",
    features: ["Quick-start templates", "Brand kit sync", "Social media sizing", "One-click resize", "Asset export"],
    connectUrl: "https://express.adobe.com",
    docsUrl: "https://developer.adobe.com/express/",
    color: "text-orange-400",
    border: "border-orange-800/30 bg-orange-950/40",
  },
  {
    id: "canva",
    name: "Canva",
    category: "Productivity",
    logo: CanvaLogo,
    description: "Design professional graphics, presentations, certificates, and reports directly within your workflow.",
    features: ["30,000+ templates", "Team collaboration", "Brand kit", "Presentation mode", "Direct publish"],
    connectUrl: "https://www.canva.com",
    docsUrl: "https://www.canva.dev",
    color: "text-purple-400",
    border: "border-purple-800/30 bg-purple-950/40",
  },
  {
    id: "brite-calendar",
    name: "Brite Calendar",
    category: "Productivity",
    logo: BriteCalendarLogo,
    description: "Smart scheduling and event management. Sync appointments, program sessions, and team availability.",
    features: ["Smart scheduling", "Recurring events", "Team availability", "Reminder notifications", "iCal / ICS export"],
    connectUrl: "https://www.brite.app",
    docsUrl: "https://www.brite.app",
    color: "text-cyan-400",
    border: "border-cyan-800/30 bg-cyan-950/40",
  },
  {
    id: "adp-workforce",
    name: "ADP Workforce Now",
    category: "Workforce",
    logo: ADPLogo,
    description: "Integrate HR, payroll, time tracking, and benefits management. Sync employee data seamlessly with your portal.",
    features: ["Payroll sync", "Time & attendance", "Benefits enrollment", "Employee directory sync", "Onboarding workflows"],
    connectUrl: "https://workforcenow.adp.com",
    docsUrl: "https://developers.adp.com",
    color: "text-red-400",
    border: "border-red-800/30 bg-red-950/40",
  },
  {
    id: "clarity-hmis",
    name: "Clarity HMIS",
    category: "HMIS",
    logo: ClarityHMISLogo,
    description: "Homeless Management Information System. Track client intake, services, outcomes, and federal reporting.",
    features: ["Client intake & enrollment", "Service tracking", "HUD APR reporting", "CoC program management", "HMIS data standards"],
    connectUrl: "https://clarityhs.com",
    docsUrl: "https://help.clarityhs.com",
    color: "text-blue-400",
    border: "border-blue-800/30 bg-blue-950/40",
  },
];

const CATEGORY_BADGE: Record<string, string> = {
  Microsoft: "bg-sky-900/50 text-sky-300",
  Google: "bg-emerald-900/50 text-emerald-300",
  Adobe: "bg-red-900/50 text-red-300",
  Productivity: "bg-purple-900/50 text-purple-300",
  Workforce: "bg-orange-900/50 text-orange-300",
  HMIS: "bg-blue-900/50 text-blue-300",
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Component ──────────────────────────────────────────────────────── */
export function IntegrationsPanel({
  portalName,
  accentColor = "text-violet-400",
  excludeIds = [],
}: {
  portalName: string;
  accentColor?: string;
  excludeIds?: string[];
}) {
  const apps = excludeIds.length
    ? PRODUCTIVITY_INTEGRATIONS.filter((a) => !excludeIds.includes(a.id))
    : PRODUCTIVITY_INTEGRATIONS;
  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(`tools_integrations_${portalName}`) ?? "{}");
    } catch {
      return {};
    }
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(`tools_integrations_${portalName}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const connectedCount = apps.filter((a) => !!connected[a.id]).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={cn("text-lg font-bold tracking-tight", accentColor)}>
            <Plug size={16} className="mr-2 inline-block" />
            Productivity Integrations
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Connect your favourite tools to the {portalName} portal.
          </p>
        </div>
        <div className="text-xs font-semibold text-muted">
          {connectedCount} / {apps.length} connected
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((app, i) => {
          const isConnected = !!connected[app.id];
          const isOpen = expanded === app.id;
          return (
            <motion.div key={app.id} custom={i} initial="hidden" animate="show" variants={fade}>
              <GlowCard className={cn("border p-5 transition-shadow", app.border, isConnected && "ring-1 ring-emerald-500/30")}>
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <app.logo />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text">{app.name}</span>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", CATEGORY_BADGE[app.category])}>
                          {app.category}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {isConnected ? (
                          <CheckCircle2 size={11} className="text-emerald-400" />
                        ) : (
                          <Circle size={11} className="text-slate-500" />
                        )}
                        <span className={cn("text-[11px] font-medium", isConnected ? "text-emerald-400" : "text-slate-500")}>
                          {isConnected ? "Connected" : "Not connected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggle(app.id)}
                    className={cn(
                      "relative mt-1 h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                      isConnected ? "bg-emerald-500" : "bg-slate-700"
                    )}
                    aria-label={isConnected ? `Disconnect ${app.name}` : `Connect ${app.name}`}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                        isConnected ? "translate-x-4" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs leading-relaxed text-muted">{app.description}</p>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="mt-3 flex items-center gap-1 text-[11px] font-medium text-muted hover:text-text transition-colors"
                >
                  {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {isOpen ? "Hide features" : "View features"}
                </button>

                {/* Expandable feature list */}
                {isOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-1 border-t border-white/10 pt-3"
                  >
                    {app.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[11px] text-muted">
                        <CheckCircle2 size={10} className={app.color} />
                        {f}
                      </li>
                    ))}
                  </motion.ul>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={app.connectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80",
                      isConnected
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/10 text-slate-300"
                    )}
                  >
                    <ExternalLink size={10} />
                    {isConnected ? "Open" : "Connect"}
                  </a>
                  <a
                    href={app.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-muted transition-colors"
                  >
                    Docs ↗
                  </a>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
