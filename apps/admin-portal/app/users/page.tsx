"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { UserTable, type User } from "@/components/ui/UserTable";
import { useAuth } from "@/lib/admin-auth";
import {
  Search,
  Filter,
  UserPlus,
  Users as UsersIcon,
  Download,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

// Mock data - Replace with actual API call when backend is ready
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-26T10:30:00Z",
    createdAt: "2023-12-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "case_manager",
    status: "active",
    lastLogin: "2024-01-26T09:15:00Z",
    createdAt: "2024-01-02T10:20:00Z",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    role: "moderator",
    status: "active",
    lastLogin: "2024-01-25T16:45:00Z",
    createdAt: "2023-11-20T14:30:00Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2024-01-20T11:20:00Z",
    createdAt: "2023-10-10T09:00:00Z",
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "case_manager",
    status: "active",
    lastLogin: "2024-01-26T08:00:00Z",
    createdAt: "2024-01-15T13:45:00Z",
  },
  {
    id: "6",
    name: "Jennifer Martinez",
    email: "j.martinez@example.com",
    role: "case_manager",
    status: "active",
    lastLogin: "2024-01-26T07:30:00Z",
    createdAt: "2023-12-01T10:00:00Z",
  },
  {
    id: "7",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-25T18:00:00Z",
    createdAt: "2023-09-05T08:30:00Z",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    role: "viewer",
    status: "inactive",
    lastLogin: null,
    createdAt: "2024-01-18T15:20:00Z",
  },
];

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, user, hasPermission } = useAuth();
  
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch users from API
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch('/api/v1/admin/users', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // if (!response.ok) throw new Error('Failed to fetch users');
        // const data = await response.json();
        // setUsers(data.users);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUsers(MOCK_USERS);
        setFilteredUsers(MOCK_USERS);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Failed to load users");
        // Still show mock data on error for development
        setUsers(MOCK_USERS);
        setFilteredUsers(MOCK_USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  // Filter users based on search and filters
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, statusFilter, users]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      // TODO: Implement actual API call
      // await fetch(`/api/v1/admin/users/${user.id}/toggle-status`, {
      //   method: 'PATCH',
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const handleViewDetails = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleCreateUser = () => {
    router.push("/users/new");
  };

  const handleExport = () => {
    // TODO: Implement CSV/Excel export
    console.log("Exporting users...");
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = Array.from(new Set(users.map((u) => u.role)));

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
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
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text mb-2">
                    User Management
                  </h1>
                  <p className="text-muted">
                    Manage users, roles, and permissions across the platform
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw
                      className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateUser}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create New User</span>
                  </motion.button>
                </div>
              </div>

              {/* Stats Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass"
              >
                <UsersIcon className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium text-text">
                  Total Users:{" "}
                  <span className="font-bold text-brand">{users.length}</span>
                </span>
                <span className="text-muted">•</span>
                <span className="text-sm text-muted">
                  Showing: {filteredUsers.length}
                </span>
              </motion.div>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-500 mb-1">
                      Error Loading Users
                    </h3>
                    <p className="text-sm text-red-400">{error}</p>
                    <p className="text-xs text-muted mt-2">
                      Showing mock data for development. API endpoint may not be
                      available yet.
                    </p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 space-y-4"
            >
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-panel border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                    showFilters
                      ? "bg-brand/20 border border-brand/40 text-brand"
                      : "glass hover:border-brand/40 text-text"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {(roleFilter !== "all" || statusFilter !== "all") && (
                    <span className="w-2 h-2 rounded-full bg-brand" />
                  )}
                </motion.button>
              </div>

              {/* Filter Dropdowns */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3 overflow-hidden"
                  >
                    {/* Role Filter */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-muted mb-2">
                        Filter by Role
                      </label>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                      >
                        <option value="all">All Roles</option>
                        {uniqueRoles.map((role) => (
                          <option key={role} value={role}>
                            {role
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-muted mb-2">
                        Filter by Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(roleFilter !== "all" || statusFilter !== "all") && (
                      <div className="flex items-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setRoleFilter("all");
                            setStatusFilter("all");
                          }}
                          className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-text hover:bg-glass border border-border hover:border-brand/40 transition-all whitespace-nowrap"
                        >
                          Clear Filters
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <UserTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
