"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { useAuth } from "@/lib/admin-auth";
import {
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/cn";

// TypeScript types
interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  role: string;
  action: "create" | "update" | "delete" | "view" | "login" | "logout" | "export";
  resource: "users" | "clients" | "assignments" | "audit" | "reports" | "settings" | "auth";
  status: "success" | "failure";
  details: {
    description: string;
    ipAddress: string;
    userAgent: string;
    changes?: Record<string, { old: any; new: any }>;
    reason?: string;
    metadata?: Record<string, any>;
  };
}

// Mock audit data
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-26T14:32:15Z",
    user: "John Doe",
    userId: "usr_001",
    role: "admin",
    action: "update",
    resource: "users",
    status: "success",
    details: {
      description: "Updated user profile for Sarah Johnson",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      changes: {
        role: { old: "viewer", new: "case_manager" },
        status: { old: "inactive", new: "active" },
      },
      metadata: { target_user: "usr_002", target_email: "sarah.j@example.com" },
    },
  },
  {
    id: "2",
    timestamp: "2024-01-26T14:28:42Z",
    user: "Admin System",
    userId: "sys_001",
    role: "super_admin",
    action: "create",
    resource: "clients",
    status: "success",
    details: {
      description: "New client record created by automated intake",
      ipAddress: "10.0.0.1",
      userAgent: "System/1.0 Automation",
      metadata: {
        client_id: "clt_154",
        intake_form: "form_2024_001",
        assigned_to: "usr_005",
      },
    },
  },
  {
    id: "3",
    timestamp: "2024-01-26T14:15:03Z",
    user: "Michael Brown",
    userId: "usr_003",
    role: "moderator",
    action: "delete",
    resource: "assignments",
    status: "failure",
    details: {
      description: "Attempted to delete active assignment",
      ipAddress: "172.16.0.23",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      reason: "Insufficient permissions - cannot delete active assignments",
      metadata: { assignment_id: "asn_098", client_id: "clt_143" },
    },
  },
  {
    id: "4",
    timestamp: "2024-01-26T13:55:18Z",
    user: "Sarah Johnson",
    userId: "usr_002",
    role: "case_manager",
    action: "export",
    resource: "reports",
    status: "success",
    details: {
      description: "Exported monthly client progress report",
      ipAddress: "192.168.1.88",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
      metadata: {
        report_type: "client_progress",
        period: "2024-01",
        format: "csv",
        records: 47,
      },
    },
  },
  {
    id: "5",
    timestamp: "2024-01-26T13:42:29Z",
    user: "Emily Davis",
    userId: "usr_004",
    role: "viewer",
    action: "view",
    resource: "audit",
    status: "failure",
    details: {
      description: "Attempted to access audit logs",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
      reason: "Insufficient permissions - viewer role cannot access audit logs",
    },
  },
  {
    id: "6",
    timestamp: "2024-01-26T13:30:45Z",
    user: "Robert Wilson",
    userId: "usr_007",
    role: "admin",
    action: "update",
    resource: "settings",
    status: "success",
    details: {
      description: "Updated system security settings",
      ipAddress: "10.0.1.50",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0",
      changes: {
        session_timeout: { old: "30m", new: "60m" },
        mfa_required: { old: false, new: true },
      },
      metadata: { affected_users: "all", effective_date: "2024-01-27" },
    },
  },
  {
    id: "7",
    timestamp: "2024-01-26T13:15:22Z",
    user: "David Lee",
    userId: "usr_005",
    role: "case_manager",
    action: "create",
    resource: "assignments",
    status: "success",
    details: {
      description: "Created new case assignment",
      ipAddress: "192.168.1.67",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0",
      metadata: {
        client_id: "clt_156",
        case_manager: "usr_005",
        program: "job_readiness",
        start_date: "2024-01-27",
      },
    },
  },
  {
    id: "8",
    timestamp: "2024-01-26T12:58:11Z",
    user: "Jennifer Martinez",
    userId: "usr_006",
    role: "case_manager",
    action: "update",
    resource: "clients",
    status: "success",
    details: {
      description: "Updated client contact information",
      ipAddress: "192.168.1.91",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      changes: {
        phone: { old: "+1-555-0123", new: "+1-555-0199" },
        address: { old: "123 Old St", new: "456 New Ave" },
      },
      metadata: { client_id: "clt_142", verification_status: "pending" },
    },
  },
  {
    id: "9",
    timestamp: "2024-01-26T12:30:00Z",
    user: "John Doe",
    userId: "usr_001",
    role: "admin",
    action: "login",
    resource: "auth",
    status: "success",
    details: {
      description: "Admin user logged in successfully",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      metadata: { login_method: "password", mfa_verified: true },
    },
  },
  {
    id: "10",
    timestamp: "2024-01-26T12:15:33Z",
    user: "Unknown User",
    userId: "unknown",
    role: "none",
    action: "login",
    resource: "auth",
    status: "failure",
    details: {
      description: "Failed login attempt",
      ipAddress: "203.0.113.42",
      userAgent: "Python-requests/2.31.0",
      reason: "Invalid credentials",
      metadata: { attempted_email: "admin@example.com", attempts: 3 },
    },
  },
  {
    id: "11",
    timestamp: "2024-01-26T11:45:18Z",
    user: "Sarah Johnson",
    userId: "usr_002",
    role: "case_manager",
    action: "view",
    resource: "clients",
    status: "success",
    details: {
      description: "Viewed client profile",
      ipAddress: "192.168.1.88",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
      metadata: { client_id: "clt_145", access_reason: "case_review" },
    },
  },
  {
    id: "12",
    timestamp: "2024-01-26T11:22:05Z",
    user: "Michael Brown",
    userId: "usr_003",
    role: "moderator",
    action: "delete",
    resource: "users",
    status: "failure",
    details: {
      description: "Attempted to delete admin user",
      ipAddress: "172.16.0.23",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      reason: "Cannot delete users with admin role",
      metadata: { target_user: "usr_001", protection_level: "high" },
    },
  },
];

// Inline AuditLogTable Component
interface AuditLogTableProps {
  logs: AuditLog[];
  loading: boolean;
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
}

function AuditLogTable({ logs, loading, expandedRows, onToggleRow }: AuditLogTableProps) {
  if (loading) {
    return (
      <div className="glass rounded-xl border border-border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <RefreshCw className="w-8 h-8 text-brand animate-spin" />
          <p className="text-muted">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="glass rounded-xl border border-border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <FileText className="w-12 h-12 text-muted/50" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text mb-1">No Audit Logs Found</h3>
            <p className="text-sm text-muted">
              Try adjusting your filters or date range
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-panel/50">
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Resource
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Details
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-muted uppercase tracking-wider w-12">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={cn(
                  "border-b border-border/50 hover:bg-glass transition-colors",
                  expandedRows.has(log.id) && "bg-glass"
                )}
              >
                <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text">{log.user}</span>
                    <span className="text-xs text-muted">{log.userId}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-md capitalize",
                      log.role === "admin" || log.role === "super_admin"
                        ? "bg-brand/20 text-brand"
                        : log.role === "case_manager"
                        ? "bg-brand2/20 text-brand2"
                        : log.role === "moderator"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted/20 text-muted"
                    )}
                  >
                    {log.role.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text capitalize">{log.action}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text capitalize">{log.resource}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {log.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-danger" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium capitalize",
                        log.status === "success" ? "text-success" : "text-danger"
                      )}
                    >
                      {log.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted max-w-xs truncate">
                  {log.details.description}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggleRow(log.id)}
                    className="p-1 hover:bg-glass rounded transition-colors"
                  >
                    {expandedRows.has(log.id) ? (
                      <ChevronDown className="w-4 h-4 text-brand" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted" />
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="p-4 hover:bg-glass transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text">{log.user}</span>
                  {log.status === "success" ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger" />
                  )}
                </div>
                <p className="text-xs text-muted mb-2">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-md capitalize",
                      log.role === "admin" || log.role === "super_admin"
                        ? "bg-brand/20 text-brand"
                        : log.role === "case_manager"
                        ? "bg-brand2/20 text-brand2"
                        : "bg-muted/20 text-muted"
                    )}
                  >
                    {log.role.replace(/_/g, " ")}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-glass rounded-md text-text capitalize">
                    {log.action}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-glass rounded-md text-text capitalize">
                    {log.resource}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onToggleRow(log.id)}
                className="p-1 hover:bg-glass rounded transition-colors ml-2"
              >
                {expandedRows.has(log.id) ? (
                  <ChevronDown className="w-5 h-5 text-brand" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted">{log.details.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Expanded Row Details */}
      <AnimatePresence>
        {logs.map((log) =>
          expandedRows.has(log.id) ? (
            <motion.div
              key={`expanded-${log.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border bg-panel/30 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-3">
                  Detailed Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted mb-1">IP Address</p>
                    <p className="text-sm text-text font-mono">{log.details.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted mb-1">User Agent</p>
                    <p className="text-sm text-text truncate">{log.details.userAgent}</p>
                  </div>
                </div>

                {log.details.reason && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-1">Failure Reason</p>
                    <p className="text-sm text-danger">{log.details.reason}</p>
                  </div>
                )}

                {log.details.changes && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Changes Made</p>
                    <div className="bg-bg rounded-lg p-3 space-y-2">
                      {Object.entries(log.details.changes).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-text capitalize">{key}:</span>
                          <span className="text-danger font-mono">{JSON.stringify(value.old)}</span>
                          <span className="text-muted">→</span>
                          <span className="text-success font-mono">{JSON.stringify(value.new)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {log.details.metadata && (
                  <div>
                    <p className="text-xs font-semibold text-muted mb-2">Metadata (JSON)</p>
                    <pre className="bg-bg rounded-lg p-3 text-xs text-text overflow-x-auto font-mono">
                      {JSON.stringify(log.details.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Page Component
export default function AuditPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // State management
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [userFilter, setUserFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch audit logs
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLogs(MOCK_AUDIT_LOGS);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
        setLogs(MOCK_AUDIT_LOGS);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isAuthenticated]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.user.toLowerCase().includes(query) ||
          log.details.description.toLowerCase().includes(query) ||
          log.details.ipAddress.toLowerCase().includes(query)
      );
    }

    // User filter
    if (userFilter !== "all") {
      result = result.filter((log) => log.userId === userFilter);
    }

    // Resource filter
    if (resourceFilter !== "all") {
      result = result.filter((log) => log.resource === resourceFilter);
    }

    // Action filter
    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((log) => log.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((log) => new Date(log.timestamp) >= new Date(dateFrom));
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((log) => new Date(log.timestamp) <= toDate);
    }

    return result;
  }, [logs, searchQuery, userFilter, resourceFilter, actionFilter, statusFilter, dateFrom, dateTo]);

  // Get unique values for filters
  const uniqueUsers = useMemo(
    () => Array.from(new Set(logs.map((log) => ({ id: log.userId, name: log.user })))),
    [logs]
  );
  const uniqueResources = useMemo(() => Array.from(new Set(logs.map((log) => log.resource))), [logs]);
  const uniqueActions = useMemo(() => Array.from(new Set(logs.map((log) => log.action))), [logs]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExport = () => {
    // Generate CSV
    const headers = ["Timestamp", "User", "Role", "Action", "Resource", "Status", "Description", "IP Address"];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.user,
      log.role,
      log.action,
      log.resource,
      log.status,
      log.details.description,
      log.details.ipAddress,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setUserFilter("all");
    setResourceFilter("all");
    setActionFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    userFilter !== "all" ||
    resourceFilter !== "all" ||
    actionFilter !== "all" ||
    statusFilter !== "all" ||
    dateFrom ||
    dateTo;

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
                  <h1 className="text-3xl font-bold text-text mb-2">Audit Logs</h1>
                  <p className="text-muted">
                    Track all system activities, user actions, and security events
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all",
                      autoRefresh
                        ? "bg-success/20 border border-success/40 text-success"
                        : "glass hover:border-brand/40 text-text"
                    )}
                  >
                    <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
                    <span className="hidden sm:inline">
                      {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                    <span className="hidden sm:inline">Refresh</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </motion.button>
                </div>
              </div>

              {/* Stats Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <FileText className="w-4 h-4 text-brand" />
                  <span className="text-sm font-medium text-text">
                    Total Logs: <span className="font-bold text-brand">{logs.length}</span>
                  </span>
                  <span className="text-muted">•</span>
                  <span className="text-sm text-muted">Showing: {filteredLogs.length}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-text">
                    Success:{" "}
                    <span className="font-bold text-success">
                      {filteredLogs.filter((l) => l.status === "success").length}
                    </span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <XCircle className="w-4 h-4 text-danger" />
                  <span className="text-sm font-medium text-text">
                    Failures:{" "}
                    <span className="font-bold text-danger">
                      {filteredLogs.filter((l) => l.status === "failure").length}
                    </span>
                  </span>
                </div>
              </motion.div>
            </motion.div>

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
                    placeholder="Search by user, description, or IP address..."
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
                  {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand" />}
                </motion.button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="glass rounded-xl border border-border p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* User Filter */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">User</label>
                          <select
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                            className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                          >
                            <option value="all">All Users</option>
                            {uniqueUsers.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Resource Filter */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">
                            Resource
                          </label>
                          <select
                            value={resourceFilter}
                            onChange={(e) => setResourceFilter(e.target.value)}
                            className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                          >
                            <option value="all">All Resources</option>
                            {uniqueResources.map((r) => (
                              <option key={r} value={r} className="capitalize">
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Action Filter */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Action</label>
                          <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                          >
                            <option value="all">All Actions</option>
                            {uniqueActions.map((a) => (
                              <option key={a} value={a} className="capitalize">
                                {a}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                          >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="failure">Failure</option>
                          </select>
                        </div>

                        {/* Date From */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">
                            Date From
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                            />
                          </div>
                        </div>

                        {/* Date To */}
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">
                            Date To
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                            <input
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      {hasActiveFilters && (
                        <div className="flex justify-end pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={clearFilters}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-text hover:text-brand bg-glass border border-border hover:border-brand/40 transition-all"
                          >
                            Clear All Filters
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Audit Log Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <AuditLogTable
                logs={filteredLogs}
                loading={loading}
                expandedRows={expandedRows}
                onToggleRow={handleToggleRow}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
