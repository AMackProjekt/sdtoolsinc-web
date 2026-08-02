"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/lib/admin-auth";
import {
  UserPlus,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  X,
  CheckCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Assignment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  caseManagerId: string;
  caseManagerName: string;
  caseManagerEmail: string;
  assignedDate: string;
  status: "active" | "inactive" | "pending";
}

type ToastType = "success" | "error" | "info";

interface Toast {
  type: ToastType;
  message: string;
}

// Mock data - Replace with actual API call
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    clientId: "c1",
    clientName: "Marcus Johnson",
    clientEmail: "marcus.j@example.com",
    caseManagerId: "cm1",
    caseManagerName: "Sarah Chen",
    caseManagerEmail: "sarah.chen@tools.org",
    assignedDate: "2024-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    clientId: "c2",
    clientName: "David Williams",
    clientEmail: "d.williams@example.com",
    caseManagerId: "cm2",
    caseManagerName: "Michael Brown",
    caseManagerEmail: "m.brown@tools.org",
    assignedDate: "2024-01-20T14:30:00Z",
    status: "active",
  },
  {
    id: "3",
    clientId: "c3",
    clientName: "Jennifer Taylor",
    clientEmail: "j.taylor@example.com",
    caseManagerId: "cm1",
    caseManagerName: "Sarah Chen",
    caseManagerEmail: "sarah.chen@tools.org",
    assignedDate: "2024-01-22T09:15:00Z",
    status: "active",
  },
  {
    id: "4",
    clientId: "c4",
    clientName: "Robert Anderson",
    clientEmail: "r.anderson@example.com",
    caseManagerId: "cm3",
    caseManagerName: "Emily Davis",
    caseManagerEmail: "emily.d@tools.org",
    assignedDate: "2024-01-25T11:20:00Z",
    status: "pending",
  },
  {
    id: "5",
    clientId: "c5",
    clientName: "Lisa Martinez",
    clientEmail: "lisa.m@example.com",
    caseManagerId: "cm2",
    caseManagerName: "Michael Brown",
    caseManagerEmail: "m.brown@tools.org",
    assignedDate: "2024-01-18T16:45:00Z",
    status: "active",
  },
  {
    id: "6",
    clientId: "c6",
    clientName: "James Wilson",
    clientEmail: "james.w@example.com",
    caseManagerId: "cm1",
    caseManagerName: "Sarah Chen",
    caseManagerEmail: "sarah.chen@tools.org",
    assignedDate: "2024-01-10T08:00:00Z",
    status: "inactive",
  },
];

export default function AssignmentsPage() {
  const router = useRouter();
  const { isAuthenticated, hasPermission } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Filters
  const [caseManagerFilter, setCaseManagerFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch assignments from API
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/v1/admin/assignments', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // if (!response.ok) throw new Error('Failed to fetch assignments');
        // const data = await response.json();
        // setAssignments(data.assignments);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAssignments(MOCK_ASSIGNMENTS);
        setFilteredAssignments(MOCK_ASSIGNMENTS);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load assignments"
        );
        setAssignments(MOCK_ASSIGNMENTS);
        setFilteredAssignments(MOCK_ASSIGNMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [isAuthenticated]);

  // Filter assignments
  useEffect(() => {
    let result = [...assignments];

    if (caseManagerFilter !== "all") {
      result = result.filter((a) => a.caseManagerId === caseManagerFilter);
    }

    if (clientFilter !== "all") {
      result = result.filter((a) => a.clientId === clientFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    setFilteredAssignments(result);
  }, [caseManagerFilter, clientFilter, statusFilter, assignments]);

  // Handlers
  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    showToast("success", "Assignments refreshed");
  };

  const handleEdit = (assignment: Assignment) => {
    // TODO: Implement edit modal or navigation
    showToast("info", `Edit assignment for ${assignment.clientName}`);
  };

  const handleRemove = async (assignment: Assignment) => {
    if (!confirm(`Remove assignment for ${assignment.clientName}?`)) return;

    try {
      // TODO: API call to remove assignment
      setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
      showToast("success", "Assignment removed successfully");
    } catch (err) {
      showToast("error", "Failed to remove assignment");
    }
  };

  const handleExport = () => {
    showToast("info", "Exporting assignments...");
  };

  const handleAddAssignment = () => {
    // TODO: Open modal or navigate to create page
    showToast("info", "Add new assignment");
  };

  // Get unique case managers and clients for filters
  const uniqueCaseManagers = Array.from(
    new Set(assignments.map((a) => a.caseManagerId))
  ).map((id) => {
    const assignment = assignments.find((a) => a.caseManagerId === id);
    return {
      id,
      name: assignment?.caseManagerName || "",
    };
  });

  const uniqueClients = Array.from(
    new Set(assignments.map((a) => a.clientId))
  ).map((id) => {
    const assignment = assignments.find((a) => a.clientId === id);
    return {
      id,
      name: assignment?.clientName || "",
    };
  });

  // DataTable columns
  const columns = [
    {
      key: "clientName",
      label: "Client Name",
      sortable: true,
      render: (value: string, row: Assignment) => (
        <div>
          <div className="font-medium text-text">{value}</div>
          <div className="text-xs text-muted">{row.clientEmail}</div>
        </div>
      ),
    },
    {
      key: "caseManagerName",
      label: "Case Manager",
      sortable: true,
      render: (value: string, row: Assignment) => (
        <div>
          <div className="font-medium text-text">{value}</div>
          <div className="text-xs text-muted">{row.caseManagerEmail}</div>
        </div>
      ),
    },
    {
      key: "assignedDate",
      label: "Assigned Date",
      sortable: true,
      render: (value: string) => (
        <span className="text-text">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
            value === "active" && "bg-success/20 text-success",
            value === "inactive" && "bg-muted/20 text-muted",
            value === "pending" && "bg-brand2/20 text-brand2"
          )}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const rowActions = (assignment: Assignment) => (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleEdit(assignment)}
        className="p-2 rounded-lg hover:bg-glass text-brand2 hover:text-brand transition-colors"
        title="Edit assignment"
      >
        <Edit className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleRemove(assignment)}
        className="p-2 rounded-lg hover:bg-glass text-muted hover:text-brand transition-colors"
        title="Remove assignment"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );

  if (!isAuthenticated) {
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text mb-2">
                    Assignment Management
                  </h1>
                  <p className="text-muted">
                    Manage client-to-case-manager assignments
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all disabled:opacity-50"
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
                    onClick={handleAddAssignment}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Assignment</span>
                  </motion.button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass"
              >
                <Users className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium text-text">
                  Total Assignments:{" "}
                  <span className="font-bold text-brand">{assignments.length}</span>
                </span>
                <span className="text-muted">•</span>
                <span className="text-sm text-muted">
                  Showing: {filteredAssignments.length}
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
                  className="mb-6 p-4 rounded-lg bg-brand/10 border border-brand/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-brand">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-brand">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all mb-4",
                  showFilters
                    ? "bg-brand/20 border border-brand/40 text-brand"
                    : "glass hover:border-brand/40 text-text"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(caseManagerFilter !== "all" ||
                  clientFilter !== "all" ||
                  statusFilter !== "all") && (
                  <span className="w-2 h-2 rounded-full bg-brand" />
                )}
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Case Manager
                      </label>
                      <select
                        value={caseManagerFilter}
                        onChange={(e) => setCaseManagerFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                      >
                        <option value="all">All Case Managers</option>
                        {uniqueCaseManagers.map((cm) => (
                          <option key={cm.id} value={cm.id}>
                            {cm.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Client
                      </label>
                      <select
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                      >
                        <option value="all">All Clients</option>
                        {uniqueClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Assignments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <DataTable
                data={filteredAssignments}
                columns={columns}
                loading={loading}
                rowActions={rowActions}
                emptyMessage="No assignments found"
                pagination
                itemsPerPage={10}
              />
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
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div
              className={cn(
                "px-6 py-4 rounded-lg border shadow-xl backdrop-blur-xl flex items-start gap-3",
                toast.type === "success" &&
                  "bg-success/10 border-success/30 text-success",
                toast.type === "error" && "bg-brand/10 border-brand/30 text-brand",
                toast.type === "info" &&
                  "bg-brand2/10 border-brand2/30 text-brand2"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
                {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
                {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
              </div>
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-current/70 hover:text-current"
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
