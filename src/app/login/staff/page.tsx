"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Lock, ShieldCheck } from "lucide-react";

export default function StaffLogin() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/portal/staff" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-charcoal-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">Staff Portal</h1>
          <p className="text-slate-500 text-sm mt-2">Google Workspace authentication is required.</p>
          <div className="mt-3 flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Role enforced by middleware
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-charcoal-900 text-white font-semibold py-3 rounded-lg hover:bg-charcoal-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Continue With Google"}
        </button>

        {session?.user?.email && (
          <p className="text-xs text-slate-500 text-center">
            Signed in as {session.user.email}. Continue to staff portal after role validation.
          </p>
        )}

        <p className="text-center text-xs text-slate-400">
          Participant access: <Link href="/login/client" className="text-teal-600 hover:text-teal-700 font-semibold">Client Login</Link>
        </p>
      </div>
    </div>
  );
}
