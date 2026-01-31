"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

export default function ReportPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"report" | "grievance" | "history">("report");
  
  // Form state
  const [type, setType] = useState<"report" | "grievance" | "feedback">("report");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // History state
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }

    // Mock reports history
    const mockReports = [
      {
        id: "1",
        type: "report",
        subject: "Facility Issue",
        status: "resolved",
        created_at: new Date(Date.now() - 604800000).toISOString(),
        priority: "medium"
      },
      {
        id: "2",
        type: "grievance",
        subject: "Service Concern",
        status: "under_review",
        created_at: new Date(Date.now() - 259200000).toISOString(),
        priority: "high"
      }
    ];
    setReports(mockReports);
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // In production: Submit to Supabase
      // await supabase.from('reports').insert({...})
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSubject("");
        setDescription("");
        setCategory("");
        setAnonymous(false);
        setPriority("medium");
      }, 3000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "under_review":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/portal/dashboard")} className="text-brand hover:text-brand2">
              ← Back to Dashboard
            </button>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Report & Grievance Portal
          </h1>
          <p className="text-muted">
            Safely report concerns or file grievances. All submissions are confidential and taken seriously.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "report"
                ? "text-brand border-brand"
                : "text-muted border-transparent hover:text-text"
            }`}
          >
            📋 Submit Report
          </button>
          <button
            onClick={() => setActiveTab("grievance")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "grievance"
                ? "text-brand border-brand"
                : "text-muted border-transparent hover:text-text"
            }`}
          >
            📝 File Grievance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "history"
                ? "text-brand border-brand"
                : "text-muted border-transparent hover:text-text"
            }`}
          >
            📊 My Submissions
          </button>
        </div>

        {/* Submit Report/Grievance Form */}
        {(activeTab === "report" || activeTab === "grievance") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlowCard className="p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
                {activeTab === "report" ? "Submit a Report" : "File a Grievance"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anonymous Option */}
                <div className="flex items-center justify-between p-4 bg-bg/50 rounded-lg border border-border">
                  <div>
                    <div className="text-sm font-semibold text-text">Submit Anonymously</div>
                    <div className="text-xs text-muted">Your identity will not be shared</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnonymous(!anonymous)}
                    className={cn(
                      "relative w-14 h-8 rounded-full transition-colors",
                      anonymous ? "bg-brand" : "bg-border"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform",
                        anonymous && "translate-x-6"
                      )}
                    />
                  </button>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="">Select a category...</option>
                    {activeTab === "report" ? (
                      <>
                        <option value="safety">Safety Concern</option>
                        <option value="misconduct">Staff Misconduct</option>
                        <option value="facility">Facility Issue</option>
                        <option value="health">Health & Wellness</option>
                        <option value="discrimination">Discrimination</option>
                        <option value="other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="treatment">Unfair Treatment</option>
                        <option value="policy">Policy Violation</option>
                        <option value="service">Service Quality</option>
                        <option value="access">Access to Services</option>
                        <option value="rights">Rights Violation</option>
                        <option value="other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Priority Level
                  </label>
                  <div className="flex gap-3">
                    {(["low", "medium", "high", "urgent"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriority(level)}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-lg font-semibold transition-all border text-sm",
                          priority === level
                            ? "bg-gradient-to-br from-brand to-brand2 text-[#02131a] border-transparent"
                            : "bg-bg/50 text-text border-border hover:border-brand/50"
                        )}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue"
                    required
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Detailed Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide as much detail as possible. Include dates, times, locations, and names if applicable."
                    rows={8}
                    required
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                  />
                  <p className="mt-2 text-xs text-muted">
                    Be specific and include relevant details. All submissions are treated with strict confidentiality.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting || submitted}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold transition-all",
                      submitted
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow",
                      (submitting || submitted) && "cursor-not-allowed opacity-75"
                    )}
                  >
                    {submitting ? "Submitting..." : submitted ? "✓ Submitted Successfully" : "Submit"}
                  </button>
                  
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-muted"
                    >
                      Your submission has been received and will be reviewed promptly.
                    </motion.div>
                  )}
                </div>
              </form>
            </GlowCard>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {reports.length === 0 ? (
              <GlowCard className="p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-text mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-muted">
                  Your submitted reports and grievances will appear here
                </p>
              </GlowCard>
            ) : (
              reports.map((report) => (
                <GlowCard key={report.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-lg font-extrabold text-text mb-1">
                        {report.subject}
                      </div>
                      <div className="text-sm text-muted">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • 
                        Submitted {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold uppercase border",
                        getStatusColor(report.status)
                      )}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className={cn(
                      "px-2 py-1 rounded-full",
                      report.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                      report.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                      report.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    )}>
                      {report.priority.toUpperCase()} PRIORITY
                    </span>
                    <span>Reference ID: {report.id}</span>
                  </div>
                </GlowCard>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
