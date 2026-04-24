"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { BookOpen, FileText, Video, Image, Plus, Layout } from "lucide-react";
import { cn } from "@/lib/cn";

const CONTENT_TYPES = [
  {
    icon: BookOpen,
    label: "Courses",
    description: "Structured learning paths for participants.",
    count: 0,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: FileText,
    label: "Documents",
    description: "Policy guides, intake forms, and handouts.",
    count: 0,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: Video,
    label: "Videos",
    description: "Training recordings and participant walkthroughs.",
    count: 0,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Image,
    label: "Media",
    description: "Images and assets used across portal content.",
    count: 0,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function AdminContentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Content Management</h1>
          <p className="mt-1 text-sm text-slate-400">Manage courses, documents, videos, and media assets.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
          <Plus className="h-4 w-4" />
          New Content
        </button>
      </div>

      {/* Content type cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CONTENT_TYPES.map(({ icon: Icon, label, description, count, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlowCard className="p-5">
              <div className={cn("mb-3 inline-flex rounded-lg p-2.5", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div className="text-xl font-extrabold text-white">{count}</div>
              <div className="mt-0.5 font-semibold text-white">{label}</div>
              <div className="mt-1 text-xs text-slate-400">{description}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      <GlowCard className="flex flex-col items-center py-16 text-center">
        <Layout className="mb-4 h-10 w-10 opacity-25 text-violet-400" />
        <h3 className="text-lg font-semibold text-white">No content yet</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Create your first course or upload a document to get started. Content will appear here once added.
        </p>
        <button className="mt-6 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
          <Plus className="h-4 w-4" />
          Create Content
        </button>
      </GlowCard>
    </div>
  );
}
