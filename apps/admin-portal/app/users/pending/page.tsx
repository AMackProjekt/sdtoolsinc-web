"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { useAuth } from "@/lib/admin-auth";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  CheckSquare,
  X as XIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PendingUser {
  Id: string;
  Email: string;
  DisplayName: string;
  Role: string;
  Status: string;
  CreatedAt: string;
  EntraId?: string;
}

export default function PendingUsersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [users, setUsers] = useState<PendingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectUserId, setRejectUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch pending users
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPendingUsers();
  }, [isAuthenticated]);

  // Filter users
  useEffect(() => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.DisplayName.toLowerCase().includes(query) ||
          user.Email.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.Role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/admin/users/pending');
      // const data = await response.json();
      // setUsers(data.users || []);

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUsers: PendingUser[] = [
        {
          Id: "1",
          Email: "john.doe@example.com",
          DisplayName: "John Doe",
          Role: "Client",
          Status: "pending",
          CreatedAt: new Date().toISOString(),
        },
        {
          Id: "2",
          Email: "jane.smith@example.com",
          DisplayName: "Jane Smith",
          Role: "Client",
          Status: "pending",
          CreatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          Id: "3",
          Email: "staff@sdtoolsinc.org",
          DisplayName: "New Staff Member",
          Role: "CaseManager",
          Status: "pending",
          CreatedAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      // TODO: Implement actual API call
      // await fetch(`/api/v1/admin/users/${userId}/approve`, {
      //   method: 'POST',
      // });

      setUsers((prev) => prev.filter((u) => u.Id !== userId));
      setSelectedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.size === 0) return;

    try {
      // TODO: Implement actual API call
      // await fetch('/api/v1/admin/users/bulk-approve', {
      //   method: 'POST',
      //   body: JSON.stringify({ userIds: Array.from(selectedUsers) }),
      // });

      setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.Id)));
      setSelectedUsers(new Set());
    } catch (err) {
      console.error("Error bulk approving users:", err);
    }
  };

  const openRejectModal = (userId: string) => {
    setRejectUserId(userId);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectUserId || !rejectReason.trim()) return;

    try {
      // TODO: Implement actual API call
      // await fetch(`/api/v1/admin/users/${rejectUserId}/reject`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reason: rejectReason }),
      // });

      setUsers((prev) => prev.filter((u) => u.Id !== rejectUserId));
      setSelectedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rejectUserId);
        return newSet;
      });
      setShowRejectModal(false);
      setRejectUserId(null);
      setRejectReason("");
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.Id)));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const uniqueRoles = Array.from(new Set(users.map((u) => u.Role)));

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-brand/5 via-transparent to-transparent" />

      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text">
                    Pending Approvals
                  </h1>
                  <p className="text-muted">
                    Review and approve new user registrations
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <span className="text-sm font-medium text-text">
                  Total Pending:{" "}
                  <span className="font-bold text-yellow-500">{users.length}</span>
                </span>
                <span className="text-muted">•</span>
                <span className="text-sm text-muted">
                  Showing: {filteredUsers.length}
                </span>
                {selectedUsers.size > 0 && (
                  <>
                    <span className="text-muted">•</span>
                    <span className="text-sm font-medium text-brand">
                      {selectedUsers.size} selected
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Bulk Actions */}
            <AnimatePresence>
              {selectedUsers.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-text">
                    {selectedUsers.size} user(s) selected
                  </span>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBulkApprove}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg font-medium transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Selected</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedUsers(new Set())}
                      className="px-4 py-2 glass hover:border-brand/40 text-text rounded-lg font-medium transition-all"
                    >
                      Clear Selection
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-panel border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {loading ? (
                <div className="glass rounded-xl p-12 text-center">
                  <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted">Loading pending users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    No Pending Approvals
                  </h3>
                  <p className="text-muted">
                    All users have been reviewed. Great job!
                  </p>
                </div>
              ) : (
                <div className="glass rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-panel/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left">
                            <input
                              type="checkbox"
                              checked={
                                selectedUsers.size === filteredUsers.length &&
                                filteredUsers.length > 0
                              }
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded border-border bg-panel text-brand focus:ring-2 focus:ring-brand/20"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-text">
                            Requested
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-text">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.Id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-panel/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.has(user.Id)}
                                onChange={() => toggleSelectUser(user.Id)}
                                className="w-4 h-4 rounded border-border bg-panel text-brand focus:ring-2 focus:ring-brand/20"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-text">
                                  {user.DisplayName}
                                </div>
                                <div className="text-sm text-muted">
                                  {user.Email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-medium",
                                  user.Role === "Admin"
                                    ? "bg-red-500/20 text-red-400"
                                    : user.Role === "CaseManager"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-blue-500/20 text-blue-400"
                                )}
                              >
                                {user.Role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted">
                              {formatDate(user.CreatedAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(user.Id)}
                                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-500 transition-all"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => openRejectModal(user.Id)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500 transition-all"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-text mb-4">
                Reject User Application
              </h3>
              <p className="text-sm text-muted mb-4">
                Please provide a reason for rejecting this user application. This
                will be sent to the user via email.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                rows={4}
              />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 glass hover:border-brand/40 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
