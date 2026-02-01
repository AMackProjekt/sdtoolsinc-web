"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  initializeAdminSetup,
  verifyEmailCode,
  validatePassword,
  createAdminUserFromSetup,
  storeAdminUser,
  DEFAULT_ADMIN,
  type SetupState,
} from "@/lib/admin-setup";

export default function AdminSetupPage() {
  const router = useRouter();
  const [setupState, setSetupState] = useState<SetupState | null>(null);
  const [email, setEmail] = useState(DEFAULT_ADMIN.email);
  const [verificationInput, setVerificationInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState(DEFAULT_ADMIN.name);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Send verification email
  const handleStartSetup = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate email
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      // Initialize setup state
      const newSetupState = initializeAdminSetup(email);
      setSetupState(newSetupState);
      setSuccess(
        `Verification code sent to ${email}. Check your email for the code.`
      );

      // In production, send actual email via backend API
      console.log(
        "Verification Code (dev only):",
        newSetupState.verificationCode
      );
    } catch (err) {
      setError("Failed to start setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify email
  const handleVerifyEmail = async () => {
    if (!setupState) return;

    setError("");
    setLoading(true);

    try {
      if (verifyEmailCode(verificationInput, setupState.verificationCode)) {
        setSetupState({
          ...setupState,
          step: "set_password",
          emailVerified: true,
        });
        setSuccess("Email verified! Now set your password.");
        setVerificationInput("");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password
  const handleSetPassword = async () => {
    if (!setupState) return;

    setError("");
    setPasswordErrors([]);
    setLoading(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Validate password strength
      const validation = validatePassword(password);
      if (!validation.valid) {
        setPasswordErrors(validation.errors);
        return;
      }

      // Move to profile setup
      setSetupState({
        ...setupState,
        step: "profile_setup",
        user: {
          ...setupState.user,
          password,
        },
      });
      setSuccess("Password set successfully! Now complete your profile.");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Complete setup
  const handleCompleteSetup = async () => {
    if (!setupState) return;

    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!fullName.trim()) {
        setError("Please enter your full name");
        return;
      }

      // Create admin user
      const adminUser = createAdminUserFromSetup({
        ...setupState,
        user: {
          ...setupState.user,
          name: fullName,
        },
      });

      // Store user (with password from previous step)
      storeAdminUser(adminUser, setupState.user.password || "");

      setSuccess("Setup complete! Redirecting to dashboard...");
      setSetupState({
        ...setupState,
        step: "complete",
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Setup
            </h1>
            <p className="text-gray-600">Initialize your administrator account</p>
          </div>

          {/* Progress Indicator */}
          {setupState && (
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm font-semibold">
                <span
                  className={
                    setupState.step === "verify_email" ||
                    setupState.emailVerified
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                >
                  Email
                </span>
                <span
                  className={
                    setupState.step === "set_password" ||
                    (setupState.step === "profile_setup" ||
                      setupState.step === "complete")
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                >
                  Password
                </span>
                <span
                  className={
                    setupState.step === "profile_setup" ||
                    setupState.step === "complete"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                >
                  Profile
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width:
                      setupState.step === "verify_email"
                        ? "33%"
                        : setupState.step === "set_password"
                          ? "66%"
                          : "100%",
                  }}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Step 1: Email Verification */}
          {!setupState ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>
              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          ) : setupState.step === "verify_email" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                A verification code has been sent to{" "}
                <strong>{setupState.user.email}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Dev: {setupState.verificationCode}
              </p>
              <button
                onClick={handleVerifyEmail}
                disabled={loading || verificationInput.length !== 6}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          ) : setupState.step === "set_password" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Create a strong password for your admin account.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) {
                      const { errors } = validatePassword(e.target.value);
                      setPasswordErrors(errors);
                    } else {
                      setPasswordErrors([]);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>

              {passwordErrors.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <p className="font-semibold mb-2">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {passwordErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleSetPassword}
                disabled={
                  loading || !password || passwordErrors.length > 0 || !confirmPassword
                }
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Setting..." : "Continue"}
              </button>
            </div>
          ) : setupState.step === "profile_setup" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-2">✓ Permissions Granted:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>User Management (Create, Read, Update, Delete)</li>
                  <li>Client Portal Data Integration</li>
                  <li>Case Manager Portal Data Integration</li>
                  <li>Tools Management & Configuration</li>
                  <li>Assign Clients & Case Managers</li>
                  <li>Audit & Reporting</li>
                  <li>System Configuration</li>
                </ul>
              </div>

              <button
                onClick={handleCompleteSetup}
                disabled={loading || !fullName.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Completing..." : "Complete Setup"}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <p className="text-green-600 font-semibold">
                Setup complete! Redirecting...
              </p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-blue-100 text-sm">
          <p>🔐 Admin Portal Setup</p>
          <p className="text-blue-200 mt-1">
            Full administrative access for system management
          </p>
        </div>
      </div>
    </div>
  );
}
