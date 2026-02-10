"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PendingUser {
  Id: string;
  Email: string;
  DisplayName: string;
  Role: string;
  Status: string;
  CreatedAt: string;
}

export function PendingApprovalsWidget() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when backend is deployed
      // const response = await fetch('/api/v1/admin/users/pending', {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // setPendingUsers(data.users || []);

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPendingUsers([
        {
          Id: "1",
          Email: "newuser@example.com",
          DisplayName: "New User",
          Role: "Client",
          Status: "pending",
          CreatedAt: new Date().toISOString(),
        },
        {
          Id: "2",
          Email: "another@example.com",
          DisplayName: "Another User",
          Role: "Client",
          Status: "pending",
          CreatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      // TODO: Implement actual API call
      // await fetch(`/api/v1/admin/users/${userId}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // Remove from list
      setPendingUsers((prev) => prev.filter((u) => u.Id !== userId));
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      // TODO: Implement actual API call
      // await fetch(`/api/v1/admin/users/${userId}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason: 'Rejected from quick action' }),
      // });

      // Remove from list
      setPendingUsers((prev) => prev.filter((u) => u.Id !== userId));
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">
              Pending Approvals
            </h3>
            <p className="text-sm text-muted">
              Users waiting for account approval
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/users/pending")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-brand hover:bg-brand/10 transition-all"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchPendingUsers}
            className="mt-4 px-4 py-2 bg-panel rounded-lg text-sm text-text hover:bg-panel/80 transition"
          >
            Try Again
          </button>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm text-muted">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-panel rounded-lg p-4 hover:bg-panel/80 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text mb-1 truncate">
                    {user.DisplayName}
                  </h4>
                  <p className="text-sm text-muted truncate mb-2">
                    {user.Email}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={cn(
                        "px-2 py-1 rounded font-medium",
                        user.Role === "Admin"
                          ? "bg-red-500/20 text-red-400"
                          : user.Role === "CaseManager"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      )}
                    >
                      {user.Role}
                    </span>
                    <span className="text-muted">
                      {formatDate(user.CreatedAt)}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
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
                    onClick={() => handleReject(user.Id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500 transition-all"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/users/${user.Id}`)}
                    className="p-2 bg-brand/20 hover:bg-brand/30 rounded-lg text-brand transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {pendingUsers.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={() => router.push("/users/pending")}
                className="text-sm text-brand hover:text-brand2 transition"
              >
                +{pendingUsers.length - 3} more pending
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
