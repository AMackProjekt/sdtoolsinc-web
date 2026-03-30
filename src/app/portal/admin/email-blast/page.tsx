"use client";

import { useState } from "react";
import { Send, Users, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";

export default function EmailBlastPage() {
  const [subject, setSubject]       = useState("");
  const [body, setBody]             = useState("");
  const [recipients, setRecipients] = useState("");
  const [status, setStatus]         = useState<null | { sent: number; failed: string[]; error?: string }>(null);
  const [loading, setLoading]       = useState(false);

  const recipientList = recipients
    .split(/[\n,;]+/)
    .map((r) => r.trim())
    .filter((r) => r.includes("@"));

  async function handleSend() {
    if (!subject || !body || recipientList.length === 0) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/email-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, recipients: recipientList }),
      });
      const data = await res.json() as { sent: number; failed: string[]; error?: string };
      setStatus(data);
      if (data.error) return;
      // Clear form on full success
      if (data.failed.length === 0) {
        setSubject("");
        setBody("");
        setRecipients("");
      }
    } catch {
      setStatus({ sent: 0, failed: recipientList, error: "Network error — check your connection." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Send className="w-5 h-5 text-violet-500" /> Staff Email Blast
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Compose and send a bulk email to staff members via Resend
        </p>
      </div>

      {/* Status banner */}
      {status && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${status.error || status.failed.length > 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
          {status.error || status.failed.length > 0 ? (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            {status.error ? (
              <p className="text-sm font-medium text-red-700">{status.error}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-emerald-700">
                  {status.sent} email{status.sent !== 1 ? "s" : ""} sent successfully
                </p>
                {status.failed.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Failed to send to: {status.failed.join(", ")}
                  </p>
                )}
              </>
            )}
          </div>
          <button onClick={() => setStatus(null)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Compose form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Subject *</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Staff Meeting — Thursday 2pm"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Message Body *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Write your message here…"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
            Recipients * — one email per line, or comma/semicolon-separated
          </label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            rows={4}
            placeholder={"abby@dreamsforchange.org\namalia@dreamsforchange.org\ncoco@dreamsforchange.org"}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">
              {recipientList.length > 0
                ? `${recipientList.length} valid recipient${recipientList.length !== 1 ? "s" : ""} detected`
                : "Enter recipient email addresses above"}
            </span>
          </div>
        </div>

        {/* Recipient Preview */}
        {recipientList.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 flex flex-wrap gap-1.5">
            {recipientList.map((email) => (
              <span key={email} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                {email}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { setSubject(""); setBody(""); setRecipients(""); setStatus(null); }}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Clear
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !subject || !body || recipientList.length === 0}
            className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending to {recipientList.length} recipient{recipientList.length !== 1 ? "s" : ""}…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {recipientList.length} recipient{recipientList.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Emails are sent via Resend. Each recipient receives an individual email — no addresses are exposed to other recipients.
      </p>
    </div>
  );
}
