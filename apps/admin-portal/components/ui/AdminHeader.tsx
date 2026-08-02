"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth, type AdminRole } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";

// Role badge color mapping
const ROLE_COLORS: Record<AdminRole, { bg: string; text: string }> = {
  super_admin: { bg: "bg-brand/20", text: "text-brand" },
  admin: { bg: "bg-brand2/20", text: "text-brand2" },
  moderator: { bg: "bg-accent/20", text: "text-accent" },
  viewer: { bg: "bg-muted/20", text: "text-muted" },
};

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  viewer: "Viewer",
};

export function AdminHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", href: "/users" },
    { name: "Clients", href: "/clients" },
    { name: "Assignments", href: "/assignments" },
    { name: "Audit", href: "/audit" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand2 shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-text leading-none">
                T.O.O.L.S Inc
              </span>
              <span className="text-xs font-medium text-brand tracking-wide leading-none mt-0.5">
                Admin Portal
              </span>
            </div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-3 py-2 text-sm font-medium text-muted hover:text-text hover:bg-glass rounded-lg transition-all duration-200"
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              {/* User Info */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg glass border border-border">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-text leading-tight">
                    {user.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold leading-tight mt-0.5 px-1.5 py-0.5 rounded ${
                      ROLE_COLORS[user.role].bg
                    } ${ROLE_COLORS[user.role].text}`}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-text bg-panel hover:bg-brand/10 border border-border hover:border-brand/40 rounded-lg transition-all duration-200"
              >
                Logout
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text hover:text-brand transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 space-y-1">
              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-muted hover:text-text hover:bg-glass rounded-lg transition-all"
                >
                  {link.name}
                </motion.a>
              ))}

              {/* User Info Section */}
              <div className="pt-3 mt-3 border-t border-border space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg glass border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-base font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted leading-tight">{user.email}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold leading-tight mt-1 px-1.5 py-0.5 rounded self-start ${
                        ROLE_COLORS[user.role].bg
                      } ${ROLE_COLORS[user.role].text}`}
                    >
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-sm font-medium text-text bg-brand/10 hover:bg-brand/20 border border-brand/40 hover:border-brand/60 rounded-lg transition-all"
                >
                  Logout
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
