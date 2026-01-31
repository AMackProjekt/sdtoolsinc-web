"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type ReportType = "incident" | "grievance" | "concern" | "suggestion";

export default function ReportPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType>("concern");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const reportTypes: { value: ReportType; label: string; icon: string; description: string }[] = [
    {
      value: "concern",
      label: "General Concern",
      icon: "💬",
      description: "Share general concerns or feedback about services or programs",
    },
    {
      value: "incident",
      label: "Incident Report",
      icon: "⚠️",
      description: "Report safety concerns, harassment, or policy violations",
    },
    {
      value: "grievance",
      label: "Formal Grievance",
      icon: "📋",
      description: "File a formal complaint about treatment or services received",
    },
    {
      value: "suggestion",
      label: "Suggestion",
      icon: "💡",
      description: "Suggest improvements to programs, services, or facilities",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Generate tracking number
    const tracking = `${reportType.toUpperCase().substring(0, 3)}-${Date.now().toString().substring(-6)}`;
    
    // Simulate API call
    setTimeout(() => {
      setTrackingNumber(tracking);
      setSubmitted(true);
      setSubmitting(false);

      // In production: Send report to API/Supabase
      // await submitReport({ reportType, isAnonymous, name, email, subject, description, location, dateOfIncident });
    }, 1500);
  };

  const handleNewReport = () => {
    setSubmitted(false);
    setTrackingNumber("");
    setReportType("concern");
    setIsAnonymous(true);
    setName("");
    setEmail("");
    setSubject("");
    setDescription("");
    setLocation("");
    setDateOfIncident("");
  };

  if (submitted) {
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
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-7 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <GlowCard className="p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#02131a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight text-text mb-4">
                Report Submitted Successfully
              </h1>
              
              <p className="text-muted mb-8 leading-relaxed">
                Thank you for taking the time to share your {reportType === "grievance" ? "grievance" : reportType}. 
                {isAnonymous 
                  ? " Your identity will remain confidential." 
                  : " We will review your submission and respond within 3-5 business days."}
              </p>

              <div className="mb-8 p-6 rounded-lg bg-brand/10 border-2 border-brand/30">
                <div className="text-sm text-muted mb-2">Tracking Number</div>
                <div className="text-2xl font-bold font-mono text-brand">{trackingNumber}</div>
                <p className="text-xs text-muted mt-2">
                  Save this number to check the status of your submission
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleNewReport}
                  className={cn(
                    "w-full px-6 py-3 rounded-lg font-semibold transition-all",
                    "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                    "hover:shadow-glow"
                  )}
                >
                  Submit Another Report
                </button>
                
                <button
                  onClick={() => router.push("/portal/dashboard")}
                  className="w-full px-6 py-3 rounded-lg font-semibold border border-border text-text hover:bg-panel transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    );
  }

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
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Submit a Report or Grievance
          </h1>
          <p className="text-muted mb-8">
            We take all reports seriously. Your submission will be reviewed confidentially.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type Selection */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Report Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type) => (
                <label
                  key={type.value}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    reportType === type.value
                      ? "border-brand bg-brand/10"
                      : "border-border hover:border-brand/50"
                  )}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={reportType === type.value}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <div className="font-semibold text-text mb-1">{type.label}</div>
                      <div className="text-xs text-muted">{type.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </GlowCard>

          {/* Anonymous Toggle */}
          <GlowCard className="p-6">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0 mt-1"
              />
              <label htmlFor="anonymous" className="flex-1 cursor-pointer">
                <div className="font-semibold text-text mb-1">Submit Anonymously</div>
                <div className="text-sm text-muted">
                  Your identity will be kept completely confidential. We will not ask for or record any identifying information.
                </div>
              </label>
            </div>
          </GlowCard>

          {/* Contact Information (if not anonymous) */}
          {!isAnonymous && (
            <GlowCard className="p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
                Contact Information (Optional)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted mt-3">
                Providing contact information allows us to follow up with you directly about your report.
              </p>
            </GlowCard>
          )}

          {/* Report Details */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Report Details
            </h2>
            
            <div className="space-y-4">
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
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible about what happened, who was involved, and any other relevant information..."
                  required
                  rows={8}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
                />
                <p className="text-xs text-muted mt-2">
                  Be specific and factual. Include dates, times, locations, and names if applicable.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where did this occur?"
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Date of Incident (Optional)
                  </label>
                  <input
                    type="date"
                    value={dateOfIncident}
                    onChange={(e) => setDateOfIncident(e.target.value)}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Important Notice */}
          <GlowCard className="p-6 bg-brand/5 border-brand/30">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-brand flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-text">
                <div className="font-semibold mb-2">Important Information</div>
                <ul className="space-y-1 text-muted">
                  <li>• Reports are reviewed within 3-5 business days</li>
                  <li>• All reports are treated with strict confidentiality</li>
                  <li>• False reports may result in disciplinary action</li>
                  <li>• Emergency situations should be reported to 911 immediately</li>
                </ul>
              </div>
            </div>
          </GlowCard>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting || !subject || !description}
              className={cn(
                "flex-1 px-6 py-4 rounded-lg font-semibold transition-all text-lg",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/portal/dashboard")}
              className="px-6 py-4 rounded-lg font-semibold border border-border text-text hover:bg-panel transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
