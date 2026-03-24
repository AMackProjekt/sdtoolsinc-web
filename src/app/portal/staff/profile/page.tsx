"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Badge, Clock, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function StaffProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const initials = (session.user.name ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Your Profile</h1>
          <p className="text-slate-500 mt-1">Manage your staff account information.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 md:px-8 pb-8">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end md:gap-6 -mt-16 mb-8 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
              {initials}
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="text-2xl font-bold text-charcoal-900">{session.user.name ?? "Staff Member"}</h2>
              <p className="text-teal-600 font-bold uppercase tracking-tight text-sm mt-1">The Champ Is Here</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</p>
              </div>
              <p className="text-sm font-bold text-charcoal-900">{session.user.email}</p>
            </div>

            {/* Role */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</p>
              </div>
              <p className="text-sm font-bold text-charcoal-900">Staff Member</p>
            </div>

            {/* Account Status */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Status</p>
              </div>
              <p className="text-sm font-bold text-teal-900">Active & Verified</p>
            </div>

            {/* Authentication */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Sign In</p>
              </div>
              <p className="text-sm font-bold text-charcoal-900">Today</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
            <Link
              href="/portal/staff/settings"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100"
            >
              <span className="font-bold text-charcoal-900">Settings & Preferences</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Link>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 text-left font-bold text-charcoal-900">
              Change Password
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-1">Security & 2FA</h3>
            <p className="text-sm text-indigo-800">
              Your account is protected by two-factor authentication (2FA). A verification code is sent to your email whenever you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
