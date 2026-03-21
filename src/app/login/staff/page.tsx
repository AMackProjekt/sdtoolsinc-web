"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, UserPlus, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

function StaffLoginInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"signin" | "request" | "qr">("signin");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "", reason: "" });
  const [origin, setOrigin] = useState("https://projekt-dfc.vercel.app");

  useEffect(() => {
    if (searchParams.get("tab") === "request") setTab("request");
    setOrigin(window.location.origin);
  }, [searchParams]);

  const clientLoginUrl = `${origin}/login/client`;

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.org) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-4">

        {/* Tab switcher */}
        <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm p-1">
          <button
            onClick={() => setTab("signin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "signin" ? "bg-charcoal-900 text-white shadow" : "text-slate-500 hover:text-charcoal-900"
            }`}
          >
            <Lock className="w-4 h-4" /> Sign In
          </button>
          <button
            onClick={() => { setTab("request"); setSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "request" ? "bg-teal-600 text-white shadow" : "text-slate-500 hover:text-charcoal-900"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Request Access
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "qr" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-charcoal-900"
            }`}
          >
            <QrCode className="w-4 h-4" /> Share QR
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          {tab === "signin" && (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-charcoal-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-charcoal-900">Staff Portal</h1>
                <p className="text-slate-500 text-sm mt-2 text-center">CaseFlow Command — authorized personnel only</p>
                <div className="mt-3 flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Primary access: Mack (DFC Case Manager)
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="staff@dreamforchange.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-slate-600">
                    <input type="checkbox" className="mr-2 rounded text-teal-600 focus:ring-teal-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-teal-600 hover:text-teal-700">Forgot password?</a>
                </div>

                <Link
                  href="/portal/staff"
                  className="w-full block text-center mt-6 bg-charcoal-900 text-white font-medium py-2.5 rounded-lg hover:bg-charcoal-800 transition"
                >
                  Sign In
                </Link>
              </form>

              <p className="mt-6 text-center text-xs text-slate-400">
                Not Mack?{" "}
                <button onClick={() => setTab("request")} className="text-teal-600 hover:text-teal-700 font-bold underline underline-offset-2">
                  Request read-only access
                </button>
              </p>
            </>
          )}

          {tab === "request" && !submitted && (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-charcoal-900">Request Access</h1>
                <p className="text-slate-500 text-sm mt-2 text-center">
                  Read-only access for case managers. Mack will review and approve.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleRequest}>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="you@organization.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Organization / Department</label>
                  <input
                    type="text"
                    required
                    value={form.org}
                    onChange={e => setForm({ ...form, org: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="Dreams for Change / Housing Authority"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 mb-1">Reason for Access <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition h-20 resize-none text-sm"
                    placeholder="Brief description of why you need access..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-lg hover:bg-teal-700 transition shadow-lg shadow-teal-500/20"
                >
                  Submit Access Request
                </button>
              </form>
            </>
          )}

          {tab === "qr" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <QrCode className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-charcoal-900">Client Portal QR</h1>
              <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs">
                Share this with participants so they can access their portal instantly.
              </p>
              <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner inline-block">
                <QRCodeSVG
                  value={clientLoginUrl}
                  size={200}
                  level="H"
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                />
              </div>
              <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 w-full text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Links to</p>
                <p className="text-xs font-bold text-teal-600 truncate">{clientLoginUrl}</p>
              </div>
              <a
                href={clientLoginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full block text-center py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm"
              >
                Open Client Login
              </a>
            </div>
          )}

          {tab === "request" && submitted && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6 border border-teal-100">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-charcoal-900 mb-2">Request Sent</h2>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Your read-only access request has been submitted to <span className="font-bold text-charcoal-900">Mack</span>. You'll receive an email once it's approved.
              </p>
              <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-left w-full">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted as</p>
                <p className="text-sm font-bold text-charcoal-900">{form.name}</p>
                <p className="text-xs text-slate-500">{form.email} · {form.org}</p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", org: "", reason: "" }); }}
                className="mt-6 text-sm text-teal-600 hover:text-teal-700 font-bold"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500">
          Not a staff member?{" "}
          <Link href="/login/client" className="text-teal-600 hover:text-teal-700 font-medium">
            Go to Client Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function StaffLogin() {
  return (
    <Suspense>
      <StaffLoginInner />
    </Suspense>
  );
}
