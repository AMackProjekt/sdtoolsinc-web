"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { submitReport, getUserReports, Report } from "@/lib/supabase";
import { cn } from "@/lib/cn";

const CATEGORIES = [
  "Harassment",
  "Safety Concern",
  "Discrimination",
  "Program Issue",
  "Facility Issue",
  "Staff Conduct",
  "Policy Concern",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-blue-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "urgent", label: "Urgent", color: "text-red-400" },
];

export default function ReportPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [reportType, setReportType] = useState<"report" | "grievance" | "feedback">("report");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    if (activeTab === "history") {
      loadReports();
    }
  }, [isAuthenticated, activeTab, router]);

  const loadReports = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getUserReports(user.id);
    setReports(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title || !description) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const result = await submitReport({
      userId: user?.id,
      reportType,
      category,
      priority,
      title,
      description,
      anonymous,
    });

    if (result) {
      alert("Report submitted successfully");
      // Reset form
      setCategory("");
      setTitle("");
      setDescription("");
      setAnonymous(false);
      setPriority("medium");
      setActiveTab("history");
    } else {
      alert("Failed to submit report");
    }
    setSubmitting(false);
  };

  if (!user && !anonymous) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "reviewing":
        return "text-blue-400";
      case "resolved":
        return "text-green-400";
      case "closed":
        return "text-gray-400";
      default:
        return "text-muted";
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="text-brand hover:text-brand2"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-extrabold text-text">Report & Grievance</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-7 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("submit")}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === "submit"
                ? "bg-gradient-to-r from-brand to-brand2 text-[#02131a]"
                : "bg-panel text-muted hover:text-text"
            )}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === "history"
                ? "bg-gradient-to-r from-brand to-brand2 text-[#02131a]"
                : "bg-panel text-muted hover:text-text"
            )}
          >
            View History
          </button>
        </div>

        {activeTab === "submit" ? (
          // Submit Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlowCard className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-text mb-2">
                  Submit a Report, Grievance, or Feedback
                </h2>
                <p className="text-muted">
                  Your voice matters. All submissions are reviewed and taken seriously.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-3">
                    Type of Submission *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "report", label: "🚨 Report", desc: "Safety or policy violation" },
                      { value: "grievance", label: "⚖️ Grievance", desc: "Formal complaint" },
                      { value: "feedback", label: "💬 Feedback", desc: "General comments" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setReportType(type.value as any)}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          reportType === type.value
                            ? "border-brand bg-brand/10"
                            : "border-border hover:border-brand/50"
                        )}
                      >
                        <div className="font-semibold text-text mb-1">{type.label}</div>
                        <div className="text-xs text-muted">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-3">
                    Priority Level *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value as any)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all font-semibold",
                          priority === p.value
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border text-muted hover:border-brand/50"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                    placeholder="Brief summary of the issue"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={8}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                    placeholder="Provide as much detail as possible. Include dates, times, locations, and names if relevant."
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-panel border border-border">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="anonymous" className="block text-sm font-semibold text-text mb-1 cursor-pointer">
                      Submit Anonymously
                    </label>
                    <p className="text-xs text-muted">
                      Your identity will not be visible to reviewers. Note: Anonymous submissions may take longer to resolve.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Report"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setTitle("");
                      setDescription("");
                      setAnonymous(false);
                      setPriority("medium");
                    }}
                    className="px-8 py-4 rounded-lg font-semibold border border-border text-muted hover:text-text transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        ) : (
          // History View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-text mb-4">
                Your Submission History
              </h2>
              
              {loading ? (
                <GlowCard className="p-8 text-center">
                  <div className="text-muted">Loading reports...</div>
                </GlowCard>
              ) : reports.length === 0 ? (
                <GlowCard className="p-8 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-muted">No reports submitted yet</p>
                </GlowCard>
              ) : (
                reports.map((report) => (
                  <GlowCard key={report.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-text text-lg">{report.title}</h3>
                          <span className={cn("text-xs font-semibold uppercase", getStatusColor(report.status))}>
                            {report.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <span>Type: {report.report_type}</span>
                          <span>•</span>
                          <span>Category: {report.category}</span>
                          <span>•</span>
                          <span className={PRIORITIES.find(p => p.value === report.priority)?.color}>
                            Priority: {report.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted mb-4">{report.description}</p>
                    
                    {report.resolution && (
                      <div className="p-4 rounded-lg bg-brand/10 border border-brand/30">
                        <p className="text-sm font-semibold text-brand mb-1">Resolution:</p>
                        <p className="text-sm text-muted">{report.resolution}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted">
                      <span>Submitted: {new Date(report.created_at).toLocaleString()}</span>
                      {report.anonymous && (
                        <span className="px-2 py-1 rounded bg-glass text-brand">Anonymous</span>
                      )}
                    </div>
                  </GlowCard>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
