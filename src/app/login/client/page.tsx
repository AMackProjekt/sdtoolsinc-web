"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function ClientLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/portal/client" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-teal-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
            CFC
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to your client portal.</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full block text-center mt-2 bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition shadow-sm disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Continue With Google"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          Staff member? <Link href="/login/staff" className="text-charcoal-600 hover:text-charcoal-900 font-medium">Go to Staff Login</Link>
        </div>
      </div>
    </div>
  );
}
