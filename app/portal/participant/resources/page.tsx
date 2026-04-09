"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FileText, Download, ExternalLink, BookOpen, Video, Link as LinkIcon } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "link";
  category: string;
  url: string;
};

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Life Skills Workbook",
    description: "A comprehensive workbook covering essential life skills for independent living.",
    type: "document",
    category: "Life Skills",
    url: "#",
  },
  {
    id: "2",
    title: "Job Search Guide",
    description: "Step-by-step guidance for finding and applying to jobs in your area.",
    type: "document",
    category: "Employment",
    url: "#",
  },
  {
    id: "3",
    title: "Financial Budgeting Basics",
    description: "Learn to create a personal budget and manage money effectively.",
    type: "video",
    category: "Financial Literacy",
    url: "#",
  },
  {
    id: "4",
    title: "Community Support Directory",
    description: "Local resources and support organizations available to participants.",
    type: "link",
    category: "Community",
    url: "#",
  },
  {
    id: "5",
    title: "Resume Template Pack",
    description: "Professional resume templates tailored for entry-level positions.",
    type: "document",
    category: "Employment",
    url: "#",
  },
  {
    id: "6",
    title: "Mental Wellness Video Series",
    description: "Short videos covering stress management, mindfulness, and wellbeing.",
    type: "video",
    category: "Wellness",
    url: "#",
  },
];

const TYPE_ICON = {
  document: <Download className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  link: <ExternalLink className="h-5 w-5" />,
};

const CATEGORIES = ["All", ...Array.from(new Set(RESOURCES.map((r) => r.category)))];

export default function ParticipantResourcesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const filtered =
    activeCategory === "All"
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-teal-100">Resources</h1>
        <p className="mt-1 text-sm text-teal-300/70">
          Guides, videos, and tools to support your journey.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-teal-500 text-white"
                : "bg-teal-900/40 text-teal-300 hover:bg-teal-800/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <div
            key={resource.id}
            className="flex flex-col rounded-xl border border-teal-900/40 bg-teal-950/60 p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                {TYPE_ICON[resource.type]}
              </div>
              <span className="rounded-full bg-teal-900/40 px-2.5 py-0.5 text-xs text-teal-400 capitalize">
                {resource.category}
              </span>
            </div>
            <h3 className="font-semibold text-teal-100">{resource.title}</h3>
            <p className="mt-1 flex-1 text-sm text-teal-300/70">{resource.description}</p>
            <a
              href={resource.url}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
            >
              {resource.type === "document" ? "Download" : resource.type === "video" ? "Watch" : "Visit"}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-teal-900/40 py-16 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-teal-700" />
          <p className="text-teal-400">No resources found in this category.</p>
        </div>
      )}
    </div>
  );
}
