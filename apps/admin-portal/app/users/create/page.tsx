"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { useAuth } from "@/lib/admin-auth";
import { ArrowLeft, Save, X, AlertCircle, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/cn";

type UserRole = "client" | "case_manager" | "moderator" | "admin" | "viewer";
type UserStatus = "active" | "inactive";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

type ToastType = "success" | "error" | "info";

interface Toast {
  type: ToastType;
  message: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { isAuthenticated, hasPermission } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "client",
    status: "active",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Show toast notification
  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/admin/users', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to create user');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("success", "User created successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/users");
      }, 2000);
    } catch (err) {
      console.error("Error creating user:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to create user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/users");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-brand/5 via-transparent to-transparent" />

      {/* Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -2 }}
              onClick={handleCancel}
              className="flex items-center gap-2 mb-6 text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Users</span>
            </motion.button>

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand to-brand2">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text">Create New User</h1>
                  <p className="text-muted">Add a new user to the platform</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="glass rounded-xl p-8 border border-border"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    First Name <span className="text-brand">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 bg-panel border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 transition-all",
                      errors.firstName
                        ? "border-brand focus:border-brand focus:ring-brand/20"
                        : "border-border focus:border-brand/50 focus:ring-brand/20"
                    )}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-brand flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Last Name <span className="text-brand">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 bg-panel border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 transition-all",
                      errors.lastName
                        ? "border-brand focus:border-brand focus:ring-brand/20"
                        : "border-border focus:border-brand/50 focus:ring-brand/20"
                    )}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-brand flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Email Address <span className="text-brand">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 bg-panel border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 transition-all",
                      errors.email
                        ? "border-brand focus:border-brand focus:ring-brand/20"
                        : "border-border focus:border-brand/50 focus:ring-brand/20"
                    )}
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-brand flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 bg-panel border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 transition-all",
                      errors.phone
                        ? "border-brand focus:border-brand focus:ring-brand/20"
                        : "border-border focus:border-brand/50 focus:ring-brand/20"
                    )}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-brand flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Role <span className="text-brand">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                  >
                    <option value="client">Client</option>
                    <option value="case_manager">Case Manager</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <p className="mt-2 text-xs text-muted">
                    Select the appropriate role for this user
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Status <span className="text-brand">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <p className="mt-2 text-xs text-muted">
                    Active users can log in and access the platform
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass hover:border-brand/40 text-text font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Create User</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div
              className={cn(
                "px-6 py-4 rounded-lg border shadow-xl backdrop-blur-xl flex items-start gap-3",
                toast.type === "success" &&
                  "bg-success/10 border-success/30 text-success",
                toast.type === "error" &&
                  "bg-brand/10 border-brand/30 text-brand",
                toast.type === "info" &&
                  "bg-brand2/10 border-brand2/30 text-brand2"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
                {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
                {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-current/70 hover:text-current transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
