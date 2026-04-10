"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  FileText,
  Download,
  ExternalLink,
  Video,
  BookOpen,
  Link as LinkIcon,
  Search,
  Upload,
  Users,
} from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "link" | "template";
  category: string;
  url: string;
  audience: "staff" | "participant" | "both";
};

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Case Management Handbook",
    description: "Comprehensive guide covering intake, assessment, goal setting, and closure procedures.",
    type: "document",
    category: "Case Management",
    url: "#",
    audience: "staff",
  },
  {
    id: "2",
    title: "Intake Assessment Template",
    description: "Standardized intake form template for new participant onboarding.",
    type: "template",
    category: "Templates",
    url: "#",
    audience: "staff",
  },
  {
    id: "3",
    title: "Trauma-Informed Care Training",
    description: "Video training series on trauma-informed approaches for case workers.",
    type: "video",
    category: "Training",
    url: "#",
    audience: "staff",
  },
  {
    id: "4",
    title: "Community Partner Directory",
    description: "Up-to-date list of community partners, services, and referral contacts.",
    type: "link",
    category: "Community",
    url: "#",
    audience: "both",
  },
  {
    id: "5",
    title: "Goal-Setting Framework",
    description: "SMART goal methodology and documentation guidelines for participant plans.",
    type: "document",
    category: "Case Management",
    url: "#",
    audience: "staff",
  },
  {
    id: "6",
    title: "Crisis Intervention Protocol",
    description: "Step-by-step procedures for handling participant crises and escalations.",
    type: "document",
    category: "Protocols",
    url: "#",
    audience: "staff",
  },
  {
    id: "7",
    title: "Benefits & Eligibility Guide",
    description: "Overview of public benefits programs and eligibility criteria for referrals.",
    type: "document",
    category: "Community",
    url: "#",
    audience: "both",
  },
  {
    id: "8",
    title: "Monthly Progress Note Template",
    description: "Standardized template for documenting monthly participant progress notes.",
    type: "template",
    category: "Templates",
    url: "#",
    audience: "staff",
  },
  {
    id: "9",
    title: "Staff Onboarding Checklist",
    description: "New staff orientation checklist covering systems, policies, and procedures.",
    type: "document",
    category: "Training",
    url: "#",
    audience: "staff",
  },
];

const TYPE_ICON: Record<Resource["type"], React.ReactNode> = {
  document: <Download className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  link: <ExternalLink className="h-5 w-5" />,
  template: <FileText className="h-5 w-5" />,
};

const TYPE_ACTION: Record<Resource["type"], string> = {
  document: "Download",
  video: "Watch",
  link: "Visit",
  template: "Use Template",
};

const CATEGORIES = ["All", ...Array.from(new Set(RESOURCES.map((r) => r.category)))];

export default function StaffResourcesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/staff/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const filtered = RESOURCES.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-sky-100">Staff Resources</h1>
          <p className="mt-1 text-sm text-slate-400">
            Tools, templates, and training materials for case managers and staff.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-sky-800/40 bg-sky-900/30 px-4 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-900/50 transition">
          <Upload className="h-4 w-4" />
          Upload Resource
        </button>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-600/60 focus:outline-none focus:ring-1 focus:ring-sky-600/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-sky-600 text-white"
                  : "bg-sky-900/30 text-sky-300 hover:bg-sky-800/40 border border-sky-800/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Total Resources", value: RESOURCES.length, color: "text-sky-400", bg: "bg-sky-900/30" },
          { label: "Documents", value: RESOURCES.filter((r) => r.type === "document").length, color: "text-violet-400", bg: "bg-violet-900/30" },
          { label: "Templates", value: RESOURCES.filter((r) => r.type === "template").length, color: "text-amber-400", bg: "bg-amber-900/30" },
          { label: "Training Videos", value: RESOURCES.filter((r) => r.type === "video").length, color: "text-emerald-400", bg: "bg-emerald-900/30" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 rounded-xl ${s.bg} border border-slate-700/40 px-4 py-3`}>
            <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
            <span className="text-sm text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <div
            key={resource.id}
            className="flex flex-col rounded-xl border border-sky-900/30 bg-sky-950/40 p-5 hover:border-sky-700/40 transition-colors"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                {TYPE_ICON[resource.type]}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-sky-900/40 px-2.5 py-0.5 text-xs text-sky-400 capitalize">
                  {resource.category}
                </span>
                {resource.audience === "both" && (
                  <span className="flex items-center gap-1 rounded-full bg-slate-800/60 px-2 py-0.5 text-xs text-slate-400">
                    <Users className="h-3 w-3" />
                    Shared
                  </span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-sky-100">{resource.title}</h3>
            <p className="mt-1 flex-1 text-sm text-slate-400">{resource.description}</p>
            <a
              href={resource.url}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              {TYPE_ACTION[resource.type]}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sky-900/40 py-16 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-sky-800" />
          <p className="text-slate-400">No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
}
