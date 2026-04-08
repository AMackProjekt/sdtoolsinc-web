"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Newspaper, Plus, X, Trash2, Globe, Phone, Mail,
  Check, Eye, EyeOff, Download, Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Release = {
  id: number;
  title: string;
  date: string;
  status: "Draft" | "Published";
  tags: string[];
  body: string;
};


const BRAND_ASSETS = [
  { name: "Primary Logo (Dark)",   format: "SVG / PNG", color: "#06CEF0" },
  { name: "Primary Logo (Light)",  format: "SVG / PNG", color: "#FFFFFF" },
  { name: "Icon Mark",             format: "SVG / PNG", color: "#06CEF0" },
  { name: "Brand Guidelines PDF",  format: "PDF",       color: "#94A3B8" },
];

export default function NewsroomPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [downloadedAsset, setDownloadedAsset] = useState<string | null>(null);

  const [form, setForm] = useState({ title: "", body: "", tags: "", status: "Draft" as "Draft" | "Published" });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/newsroom")
      .then((r) => r.json())
      .then((data) => { if (data.releases) setReleases(data.releases as Release[]); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleAddRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const newRelease: Release = {
      id:     Date.now(),
      title:  form.title.trim(),
      body:   form.body.trim(),
      date:   new Date().toISOString().slice(0, 10),
      status: form.status,
      tags:   form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setReleases((prev) => [newRelease, ...prev]);
    fetch("/api/enterprise/newsroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRelease),
    }).catch(() => {});
    setForm({ title: "", body: "", tags: "", status: "Draft" });
    setShowForm(false);
  };

  const togglePublished = (id: number) => {
    setReleases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "Published" ? "Draft" : "Published" } : r))
    );
    fetch(`/api/enterprise/newsroom`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "toggle" }),
    }).catch(() => {});
  };

  const deleteRelease = (id: number) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
    fetch(`/api/enterprise/newsroom?id=${id}`, { method: "DELETE" }).catch(() => {});
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = (name: string) => {
    setDownloadedAsset(name);
    setTimeout(() => setDownloadedAsset(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <Newspaper size={22} className="text-cyan-400" /> Newsroom
          </h1>
          <p className="mt-1 text-sm text-slate-400">Press releases, brand assets, and media contacts</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
            showForm
              ? "bg-slate-800 border-slate-700 text-slate-300"
              : "bg-cyan-900/40 border-cyan-700/40 text-cyan-400 hover:bg-cyan-900/60"
          )}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Release</>}
        </button>
      </div>

      {/* Create release form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlowCard className="bg-slate-900 border-cyan-700/40 p-5 overflow-hidden space-y-4">
              <h3 className="text-sm font-bold text-cyan-400">New Press Release</h3>
              <form onSubmit={handleAddRelease} className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Release headline…"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Body</label>
                  <textarea
                    rows={4}
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Write the release body…"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Tags <span className="normal-case text-slate-600">(comma-separated)</span></label>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="Programs, Funding, Partnership"
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Publish as</label>
                    <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                      {(["Draft", "Published"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, status: s }))}
                          className={cn(
                            "px-4 py-2 text-sm font-semibold transition",
                            form.status === s ? "bg-cyan-700 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-600 transition">
                    Add Release
                  </button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary counts */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Total Releases",     value: releases.length, color: "text-cyan-400" },
          { label: "Published",          value: releases.filter((r) => r.status === "Published").length, color: "text-emerald-400" },
          { label: "Drafts",             value: releases.filter((r) => r.status === "Draft").length,     color: "text-amber-400" },
        ].map(({ label, value, color }) => (
          <GlowCard key={label} className="bg-slate-900 border-slate-800 p-4 flex-1 min-w-[140px]">
            <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">{label}</div>
          </GlowCard>
        ))}
      </div>

      {/* Press releases list */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Press Releases</h2>
        <div className="space-y-3">
          {loadingData ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-xl bg-slate-800/50" />
            ))
          ) : releases.length === 0 ? (
            <div className="text-sm text-slate-500 py-8 text-center">No press releases found.</div>
          ) : releases.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-semibold",
                        r.status === "Published"
                          ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                          : "bg-amber-900/40 text-amber-400 border-amber-700/40"
                      )}>
                        {r.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{r.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">{r.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePublished(r.id)}
                      title={r.status === "Published" ? "Unpublish" : "Publish"}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                    >
                      {r.status === "Published" ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                    </button>
                    <button
                      onClick={() => deleteRelease(r.id)}
                      title="Delete release"
                      className="rounded-lg p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-900/20 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{r.body}</p>
                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        <Tag size={9} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Brand assets + Media contact */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand assets */}
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Brand Assets</h2>
          <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
            {BRAND_ASSETS.map((asset, i) => (
              <div
                key={asset.name}
                className={cn(
                  "flex items-center justify-between px-5 py-3",
                  i < BRAND_ASSETS.length - 1 && "border-b border-slate-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                    style={{ backgroundColor: asset.color + "20", color: asset.color, border: `1px solid ${asset.color}40` }}
                  >
                    T
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{asset.name}</div>
                    <div className="text-xs text-slate-500">{asset.format}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(asset.name)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  {downloadedAsset === asset.name ? <><Check size={12} className="text-emerald-400" /> Saved</> : <><Download size={12} /> Download</>}
                </button>
              </div>
            ))}
          </GlowCard>
        </div>

        {/* Media contact */}
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Media Contact</h2>
          <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-4">
            <div>
              <div className="text-sm font-bold text-white">Rachel Torres</div>
              <div className="text-xs text-slate-400">Communications Director</div>
            </div>
            {[
              { label: "Email",   icon: Mail,  value: "media@sdtools.org",  field: "email" },
              { label: "Phone",   icon: Phone, value: "(619) 555-0192",     field: "phone" },
              { label: "Website", icon: Globe, value: "www.sdtools.org",    field: "web"   },
            ].map(({ label, icon: Icon, value, field }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={13} className="text-slate-500 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{label}</div>
                    <div className="text-sm text-slate-300 font-mono">{value}</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(value, field)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  {copiedField === field ? <span className="text-emerald-400">Copied!</span> : "Copy"}
                </button>
              </div>
            ))}
          </GlowCard>
        </div>
      </div>
    </motion.div>
  );
}
