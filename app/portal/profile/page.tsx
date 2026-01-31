"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [saved, setSaved] = useState(false);
  
  // Demographics state
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [veteranStatus, setVeteranStatus] = useState(false);
  const [disabilityStatus, setDisabilityStatus] = useState(false);
  
  // Contact information state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  
  // Preferences state
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    if (user) {
      setFullName(user.name || "");
      
      // Load demographics
      if (user.demographics) {
        setDateOfBirth(user.demographics.dateOfBirth || "");
        setGender(user.demographics.gender || "");
        setEthnicity(user.demographics.ethnicity || "");
        setVeteranStatus(user.demographics.veteranStatus || false);
        setDisabilityStatus(user.demographics.disabilityStatus || false);
      }
      
      // Load contact info
      if (user.contactInfo) {
        setPhoneNumber(user.contactInfo.phoneNumber || "");
        setAlternatePhone(user.contactInfo.alternatePhone || "");
        setAddress(user.contactInfo.address || "");
        setCity(user.contactInfo.city || "");
        setState(user.contactInfo.state || "");
        setZipCode(user.contactInfo.zipCode || "");
        setEmergencyContact(user.contactInfo.emergencyContact || "");
        setEmergencyPhone(user.contactInfo.emergencyPhone || "");
      }
      
      // Load preferences
      if (user.preferences) {
        setNotifications(user.preferences.notifications);
        setEmailUpdates(user.preferences.emailUpdates);
        setTheme(user.preferences.theme);
        setLanguage(user.preferences.language || "en");
      }
    }
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    try {
      updateProfile({ 
        name: fullName,
        demographics: {
          dateOfBirth,
          gender,
          ethnicity,
          veteranStatus,
          disabilityStatus,
        },
        contactInfo: {
          phoneNumber,
          alternatePhone,
          address,
          city,
          state,
          zipCode,
          emergencyContact,
          emergencyPhone,
        },
        preferences: {
          notifications,
          emailUpdates,
          theme,
          language,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
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

      <div className="mx-auto max-w-3xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Profile Settings
          </h1>
          <p className="text-muted">Manage your account and preferences</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          {/* Personal Information */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg bg-bg/50 border border-border px-4 py-3 text-muted cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Ethnicity (Optional)
                </label>
                <select
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="">Prefer not to say</option>
                  <option value="hispanic">Hispanic or Latino</option>
                  <option value="white">White</option>
                  <option value="black">Black or African American</option>
                  <option value="asian">Asian</option>
                  <option value="native">American Indian or Alaska Native</option>
                  <option value="pacific">Native Hawaiian or Pacific Islander</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={veteranStatus}
                    onChange={(e) => setVeteranStatus(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <span className="text-sm font-semibold text-text">Veteran</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disabilityStatus}
                    onChange={(e) => setDisabilityStatus(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <span className="text-sm font-semibold text-text">Has disability accommodations</span>
                </label>
              </div>
            </div>
          </GlowCard>
          
          {/* Contact Information */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Primary Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Alternate Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="(555) 987-6543"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="">Select</option>
                    <option value="CA">CA</option>
                    <option value="NY">NY</option>
                    <option value="TX">TX</option>
                    <option value="FL">FL</option>
                    <option value="IL">IL</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="90001"
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
              </div>
            </div>
          </GlowCard>
          
          {/* Emergency Contact */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Emergency Contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
            </div>
          </GlowCard>
          
          {/* Preferences & Customization */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Preferences & Customization
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <label className="flex items-center justify-between p-4 rounded-lg bg-bg border border-border cursor-pointer">
                  <div>
                    <div className="font-semibold text-text">Push Notifications</div>
                    <div className="text-sm text-muted">Receive updates about your courses and messages</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 rounded-lg bg-bg border border-border cursor-pointer">
                  <div>
                    <div className="font-semibold text-text">Email Updates</div>
                    <div className="text-sm text-muted">Get weekly progress reports via email</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>
          </GlowCard>

          {/* Security */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-text">Supabase + Azure Authentication Enabled</span>
              </div>

              <div className="text-xs text-muted">
                <p>Your account is secured with enterprise-grade encryption and multi-factor authentication support.</p>
              </div>

              <button className="text-sm text-brand hover:text-brand2 transition-colors font-semibold">
                Change Password →
              </button>
            </div>
          </GlowCard>

          {/* Account Info */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Account Information
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="text-text">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-400">Active ✓</span>
              </div>
            </div>
          </GlowCard>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow"
              )}
            >
              Save Changes
            </button>
            
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-brand"
              >
                ✓ Saved successfully
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
