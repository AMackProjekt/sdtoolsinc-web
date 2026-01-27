"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  UserCheck,
  Link as LinkIcon,
  FileText,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/admin-auth";
import { PERMISSIONS, hasAnyPermission } from "@/lib/rbac";
import { cn } from "@/lib/cn";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermissions?: string[];
};

const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    requiredPermissions: [PERMISSIONS.USERS_READ],
  },
  {
    name: "Clients",
    href: "/clients",
    icon: UserCheck,
    requiredPermissions: [PERMISSIONS.CLIENTS_READ],
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: LinkIcon,
    requiredPermissions: [PERMISSIONS.CLIENTS_ASSIGN],
  },
  {
    name: "Audit Log",
    href: "/audit",
    icon: FileText,
    requiredPermissions: [PERMISSIONS.AUDIT_READ],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart,
    requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    requiredPermissions: [PERMISSIONS.SETTINGS_READ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get user permissions from RBAC
  const userPermissions = user?.permissions || [];
  
  // Convert AdminPermission[] to permission strings for RBAC check
  const permissionStrings: string[] = [];
  userPermissions.forEach((perm) => {
    // Map old permission format to new RBAC format
    if (perm === "manage_users") {
      permissionStrings.push(PERMISSIONS.USERS_READ, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_UPDATE);
    } else if (perm === "manage_cases") {
      permissionStrings.push(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_CREATE, PERMISSIONS.CLIENTS_UPDATE);
    } else if (perm === "audit_logs") {
      permissionStrings.push(PERMISSIONS.AUDIT_READ);
    } else if (perm === "view_analytics") {
      permissionStrings.push(PERMISSIONS.REPORTS_VIEW);
    } else if (perm === "manage_settings") {
      permissionStrings.push(PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_UPDATE);
    }
  });

  // Filter nav items based on permissions
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true; // No permissions required (Dashboard)
    }
    return hasAnyPermission(permissionStrings, item.requiredPermissions);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Don't render sidebar if not authenticated or not mounted
  if (!mounted || !isAuthenticated || !user) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand2 text-white shadow-2xl lg:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? (
          <ChevronLeft className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{
          x: isMobileOpen || window.innerWidth >= 1024 ? 0 : -280,
          width: isCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 z-50 h-screen border-r border-border bg-panel/95 backdrop-blur-xl",
          "lg:relative lg:translate-x-0",
          "flex flex-col"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand2 shadow-lg">
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
            </motion.div>
          )}

          {/* Desktop Collapse Toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-glass hover:bg-brand/10 text-muted hover:text-brand border border-border hover:border-brand/40 transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {visibleNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-brand/20 to-brand2/20 text-text border border-brand/40 shadow-lg shadow-brand/10"
                        : "text-muted hover:text-text hover:bg-glass border border-transparent hover:border-border"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all",
                        active
                          ? "text-brand"
                          : "text-muted group-hover:text-text"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-semibold tracking-tight">
                        {item.name}
                      </span>
                    )}
                    {active && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-brand"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* User Info Footer */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-border"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg glass border border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-sm font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-text leading-tight truncate">
                  {user.name}
                </span>
                <span className="text-xs text-muted leading-tight truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
}
