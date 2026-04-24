"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  Newspaper,
  Edit3,
  Image,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  Calendar,
  Megaphone,
} from "lucide-react";

const KPIs = [
  { label: "Published Articles", value: "38", icon: Newspaper, change: "+5 this month" },
  { label: "Drafts",             value: "7",  icon: Edit3,     change: "3 awaiting review" },
  { label: "Media Files",        value: "154",icon: Image,     change: "+12 uploaded" },
  { label: "Monthly Views",      value: "2,840", icon: Eye,   change: "+18% vs last month" },
];

const ARTICLES = [
  { title: "Q3 Program Impact Report Released",     author: "Aaliyah Brooks",  category: "Reports",       date: "Jul 14, 2025", status: "published" },
  { title: "New Partnership with Metro Housing",    author: "Marcus Johnson",  category: "Partnerships",  date: "Jul 12, 2025", status: "published" },
  { title: "Staff Spotlight: Priya Sharma",         author: "Sandra Nguyen",   category: "Staff News",    date: "Jul 10, 2025", status: "published" },
  { title: "Summer Youth Program Enrollment Open",  author: "Devon Clarke",    category: "Announcements", date: "Jul 9, 2025",  status: "published" },
  { title: "Annual Fundraising Gala Recap",         author: "James Thornton",  category: "Events",        date: "Jul 7, 2025",  status: "draft" },
  { title: "Mental Health Awareness Campaign",      author: "Aaliyah Brooks",  category: "Health",        date: "Jul 20, 2025", status: "scheduled" },
];

const MEDIA = [
  { type: "Images",    count: 98,  total: 200 },
  { type: "Videos",    count: 31,  total: 100 },
  { type: "Documents", count: 25,  total: 100 },
];

const ANNOUNCEMENTS = [
  { title: "Board Meeting — Q3 Financial Overview",    date: "Jul 22, 2025",   status: "upcoming" },
  { title: "Staff Appreciation Week Kickoff",          date: "Jul 28, 2025",   status: "upcoming" },
  { title: "Community Resource Fair",                  date: "Aug 3, 2025",    status: "upcoming" },
  { title: "Volunteer Orientation Session",            date: "Aug 10, 2025",   status: "upcoming" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  published: { label: "Published", color: "bg-emerald-900/40 text-emerald-400 border-emerald-700/50" },
  draft:     { label: "Draft",     color: "bg-slate-700/40 text-slate-400 border-slate-600/50" },
  scheduled: { label: "Scheduled", color: "bg-rose-900/40 text-rose-400 border-rose-700/50" },
  upcoming:  { label: "Upcoming",  color: "bg-amber-900/40 text-amber-400 border-amber-700/50" },
};

export default function NewsDashboardPage() {
  return (
    <div className="p-5 md:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">News &amp; Media</h1>
        <p className="mt-1 text-sm text-slate-400">Manage articles, announcements, and media content.</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIs.map(({ label, value, icon: Icon, change }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
          >
            <GlowCard className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">{value}</p>
                  <p className="mt-1.5 text-xs text-slate-400">{change}</p>
                </div>
                <div className="rounded-lg bg-rose-900/50 p-2.5 text-rose-400">
                  <Icon size={20} />
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Articles */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <GlowCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-50">Recent Articles</h2>
              <button className="text-xs text-rose-400 hover:text-rose-300 transition">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400">
                  <tr className="border-b border-slate-700/50">
                    <th className="pb-2 pr-4 font-semibold">Title</th>
                    <th className="pb-2 pr-4 font-semibold">Author</th>
                    <th className="pb-2 pr-4 font-semibold">Category</th>
                    <th className="pb-2 pr-4 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {ARTICLES.map((a, i) => {
                    const s = STATUS_CONFIG[a.status];
                    return (
                      <tr key={i} className="border-b border-slate-700/30 last:border-0">
                        <td className="py-2.5 pr-4 max-w-[180px]">
                          <span className="block truncate font-medium text-slate-100">{a.title}</span>
                        </td>
                        <td className="py-2.5 pr-4 whitespace-nowrap">{a.author}</td>
                        <td className="py-2.5 pr-4 whitespace-nowrap text-slate-400">{a.category}</td>
                        <td className="py-2.5 pr-4 whitespace-nowrap text-slate-400">{a.date}</td>
                        <td className="py-2.5">
                          <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${s.color}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Media Library */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.37 }}
          >
            <GlowCard className="p-5">
              <h2 className="mb-4 text-sm font-bold text-slate-50">Media Library</h2>
              <div className="space-y-4">
                {MEDIA.map(({ type, count, total }) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={type}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-slate-300">{type}</span>
                        <span className="text-slate-400">{count} / {total}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/50">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #e11d48, #f43f5e)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          </motion.div>

          {/* Scheduled Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.44 }}
          >
            <GlowCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-50">Announcements</h2>
                <Megaphone size={15} className="text-rose-400" />
              </div>
              <div className="space-y-3">
                {ANNOUNCEMENTS.map((a, i) => {
                  const s = STATUS_CONFIG[a.status];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-800/40 px-3 py-2.5">
                      <div className="mt-0.5 rounded bg-rose-900/40 p-1 text-rose-400">
                        <Calendar size={12} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug text-slate-100 truncate">
                          {a.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{a.date}</p>
                      </div>
                      <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>

      {/* Trending */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <GlowCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-rose-400" />
            <h2 className="text-sm font-bold text-slate-50">Content Performance</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Top Article",   value: "Q3 Program Impact Report", sub: "1,240 views" },
              { label: "Avg. Read Time", value: "3m 42s",                   sub: "This month" },
              { label: "Engagement Rate", value: "67%",                      sub: "+8% vs last month" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg bg-slate-800/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</p>
                <p className="mt-1.5 text-lg font-extrabold tracking-tight text-slate-50">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
