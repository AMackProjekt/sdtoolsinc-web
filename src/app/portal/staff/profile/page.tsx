"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Badge, Clock, Shield, ExternalLink, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function StaffProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePhoto = useQuery(api.functions.getProfilePhoto, {
    userEmail: session?.user?.email ?? "",
  });

  useEffect(() => {
    if (profilePhoto?.photoUrl) {
      setPhotoPreview(profilePhoto.photoUrl);
    }
  }, [profilePhoto]);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (confirm("Are you sure you want to delete your profile photo?")) {
      setIsUploading(true);
      try {
        const response = await fetch("/api/profile-photo", {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete photo");
        }

        setPhotoPreview(null);
        alert("Profile photo deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete photo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

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
            {/* Photo with Upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt={session.user.name ?? "User"} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Upload photo"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
                aria-label="Upload profile photo"
              />
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
            {photoPreview && (
              <button
                onClick={handleDeletePhoto}
                disabled={isUploading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition border border-rose-100 text-left font-bold text-rose-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <span>Deleting photo...</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Delete Profile Photo</span>
                    <X className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
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
