"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { useAuth } from "@/lib/admin-auth";
import { cn } from "@/lib/cn";
import {
  Search,
  UserCheck,
  Users,
  X,
  Check,
  AlertCircle,
  Filter,
  RefreshCw,
  Download,
  ChevronDown,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react";

// Types
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "unassigned" | "assigned";
  priority: "low" | "medium" | "high";
  enrolledDate: string;
};

type CaseManager = {
  id: string;
  name: string;
  email: string;
  caseloadCount: number;
  maxCaseload: number;
  department: string;
  avatar?: string;
};

type Assignment = {
  id: string;
  clientId: string;
  clientName: string;
  caseManagerId: string;
  caseManagerName: string;
  assignedDate: string;
  status: "active" | "inactive";
  notes: string;
};

// Mock Data
const MOCK_CASE_MANAGERS: CaseManager[] = [
  {
    id: "cm1",
    name: "Sarah Johnson",
    email: "sarah.j@tools.org",
    caseloadCount: 8,
    maxCaseload: 25,
    department: "Job Readiness",
  },
  {
    id: "cm2",
    name: "Michael Chen",
    email: "m.chen@tools.org",
    caseloadCount: 15,
    maxCaseload: 25,
    department: "Education",
  },
  {
    id: "cm3",
    name: "Emily Rodriguez",
    email: "e.rodriguez@tools.org",
    caseloadCount: 22,
    maxCaseload: 25,
    department: "Mental Health",
  },
  {
    id: "cm4",
    name: "David Kim",
    email: "d.kim@tools.org",
    caseloadCount: 12,
    maxCaseload: 25,
    department: "Housing Support",
  },
  {
    id: "cm5",
    name: "Jennifer Martinez",
    email: "j.martinez@tools.org",
    caseloadCount: 5,
    maxCaseload: 20,
    department: "Legal Aid",
  },
  {
    id: "cm6",
    name: "Robert Taylor",
    email: "r.taylor@tools.org",
    caseloadCount: 25,
    maxCaseload: 25,
    department: "Substance Abuse",
  },
];

const MOCK_UNASSIGNED_CLIENTS: Client[] = [
  {
    id: "c1",
    name: "James Wilson",
    email: "james.w@example.com",
    phone: "(555) 123-4567",
    status: "unassigned",
    priority: "high",
    enrolledDate: "2024-01-25T10:30:00Z",
  },
  {
    id: "c2",
    name: "Patricia Brown",
    email: "patricia.b@example.com",
    phone: "(555) 234-5678",
    status: "unassigned",
    priority: "medium",
    enrolledDate: "2024-01-24T14:20:00Z",
  },
  {
    id: "c3",
    name: "Christopher Davis",
    email: "chris.d@example.com",
    phone: "(555) 345-6789",
    status: "unassigned",
    priority: "low",
    enrolledDate: "2024-01-23T09:15:00Z",
  },
  {
    id: "c4",
    name: "Linda Anderson",
    email: "linda.a@example.com",
    phone: "(555) 456-7890",
    status: "unassigned",
    priority: "high",
    enrolledDate: "2024-01-26T08:45:00Z",
  },
  {
    id: "c5",
    name: "Daniel Thomas",
    email: "daniel.t@example.com",
    phone: "(555) 567-8901",
    status: "unassigned",
    priority: "medium",
    enrolledDate: "2024-01-22T16:30:00Z",
  },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    clientId: "c10",
    clientName: "Marcus Johnson",
    caseManagerId: "cm1",
    caseManagerName: "Sarah Johnson",
    assignedDate: "2024-01-15T10:00:00Z",
    status: "active",
    notes: "Focus on job placement assistance and resume building",
  },
  {
    id: "a2",
    clientId: "c11",
    clientName: "Angela Smith",
    caseManagerId: "cm2",
    caseManagerName: "Michael Chen",
    assignedDate: "2024-01-18T14:30:00Z",
    status: "active",
    notes: "Enrolled in GED program, weekly check-ins required",
  },
  {
    id: "a3",
    clientId: "c12",
    clientName: "Robert Garcia",
    caseManagerId: "cm3",
    caseManagerName: "Emily Rodriguez",
    assignedDate: "2024-01-10T09:15:00Z",
    status: "active",
    notes: "Mental health support and crisis intervention",
  },
  {
    id: "a4",
    clientId: "c13",
    clientName: "Maria Lopez",
    caseManagerId: "cm4",
    caseManagerName: "David Kim",
    assignedDate: "2024-01-20T11:45:00Z",
    status: "active",
    notes: "Emergency housing placement needed, coordinating with shelters",
  },
  {
    id: "a5",
    clientId: "c14",
    clientName: "Thomas White",
    caseManagerId: "cm1",
    caseManagerName: "Sarah Johnson",
    assignedDate: "2024-01-12T13:20:00Z",
    status: "inactive",
    notes: "Successfully placed in employment, transitioning to alumni program",
  },
];

// Helper functions
const getCaseloadStatus = (count: number, max: number) => {
  const percentage = (count / max) * 100;
  if (percentage < 40) return { label: "Low", color: "success" };
  if (percentage < 80) return { label: "Medium", color: "warning" };
  return { label: "High", color: "danger" };
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-danger bg-danger/10 border-danger/30";
    case "medium":
      return "text-warning bg-warning/10 border-warning/30";
    case "low":
      return "text-success bg-success/10 border-success/30";
    default:
      return "text-muted bg-glass border-border";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ClientAssignmentsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // State
  const [caseManagers] = useState<CaseManager[]>(MOCK_CASE_MANAGERS);
  const [unassignedClients, setUnassignedClients] = useState<Client[]>(
    MOCK_UNASSIGNED_CLIENTS
  );
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedManager, setSelectedManager] = useState<CaseManager | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let result = [...assignments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (assignment) =>
          assignment.clientName.toLowerCase().includes(query) ||
          assignment.caseManagerName.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((assignment) => assignment.status === statusFilter);
    }

    return result;
  }, [assignments, searchQuery, statusFilter]);

  // Handlers
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSelectedManager(null);
  };

  const handleManagerSelect = (manager: CaseManager) => {
    if (!selectedClient) {
      return;
    }
    setSelectedManager(manager);
    setShowConfirmModal(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedClient || !selectedManager) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create new assignment
    const newAssignment: Assignment = {
      id: `a${assignments.length + 1}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      caseManagerId: selectedManager.id,
      caseManagerName: selectedManager.name,
      assignedDate: new Date().toISOString(),
      status: "active",
      notes: assignmentNotes,
    };

    // Update state
    setAssignments([newAssignment, ...assignments]);
    setUnassignedClients(unassignedClients.filter((c) => c.id !== selectedClient.id));

    // Update case manager caseload
    const updatedManagers = caseManagers.map((cm) =>
      cm.id === selectedManager.id
        ? { ...cm, caseloadCount: cm.caseloadCount + 1 }
        : cm
    );

    // Reset state
    setLoading(false);
    setShowConfirmModal(false);
    setSelectedClient(null);
    setSelectedManager(null);
    setAssignmentNotes("");
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelAssignment = () => {
    setShowConfirmModal(false);
    setSelectedManager(null);
    setAssignmentNotes("");
  };

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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text mb-2">
                    Client Assignments
                  </h1>
                  <p className="text-muted">
                    Assign clients to case managers and track caseload distribution
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass hover:border-brand/40 text-text transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </motion.button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass"
                >
                  <UserCheck className="w-4 h-4 text-brand" />
                  <span className="text-sm font-medium text-text">
                    Unassigned:{" "}
                    <span className="font-bold text-brand">
                      {unassignedClients.length}
                    </span>
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass"
                >
                  <Users className="w-4 h-4 text-brand2" />
                  <span className="text-sm font-medium text-text">
                    Active Assignments:{" "}
                    <span className="font-bold text-brand2">
                      {assignments.filter((a) => a.status === "active").length}
                    </span>
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass"
                >
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-text">
                    Case Managers:{" "}
                    <span className="font-bold text-accent">
                      {caseManagers.length}
                    </span>
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-success" />
                  <div>
                    <h3 className="text-sm font-semibold text-success">
                      Assignment Successful!
                    </h3>
                    <p className="text-sm text-success/80">
                      Client has been assigned to the case manager.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Two-Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Left Column - Case Managers */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="glass rounded-xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand" />
                    Case Managers
                  </h2>
                  <span className="text-sm text-muted">
                    {caseManagers.length} total
                  </span>
                </div>

                <div className="space-y-3">
                  {caseManagers.map((manager, index) => {
                    const status = getCaseloadStatus(
                      manager.caseloadCount,
                      manager.maxCaseload
                    );
                    const isSelected = selectedManager?.id === manager.id;
                    const percentage =
                      (manager.caseloadCount / manager.maxCaseload) * 100;

                    return (
                      <motion.button
                        key={manager.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => handleManagerSelect(manager)}
                        disabled={!selectedClient || manager.caseloadCount >= manager.maxCaseload}
                        className={cn(
                          "w-full p-4 rounded-lg border transition-all text-left",
                          isSelected
                            ? "bg-brand/10 border-brand/40 shadow-lg shadow-brand/10"
                            : "bg-panel border-border hover:border-brand/30 hover:bg-glass",
                          !selectedClient || manager.caseloadCount >= manager.maxCaseload
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        )}
                        whileHover={
                          selectedClient && manager.caseloadCount < manager.maxCaseload
                            ? { scale: 1.02, y: -2 }
                            : {}
                        }
                        whileTap={
                          selectedClient && manager.caseloadCount < manager.maxCaseload
                            ? { scale: 0.98 }
                            : {}
                        }
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-sm font-bold flex-shrink-0">
                              {manager.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-text">
                                {manager.name}
                              </h3>
                              <p className="text-xs text-muted">
                                {manager.department}
                              </p>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium",
                              status.color === "success" &&
                                "bg-success/20 text-success",
                              status.color === "warning" &&
                                "bg-warning/20 text-warning",
                              status.color === "danger" && "bg-danger/20 text-danger"
                            )}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">Caseload</span>
                            <span className="font-semibold text-text">
                              {manager.caseloadCount} / {manager.maxCaseload}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                status.color === "success" && "bg-success",
                                status.color === "warning" && "bg-warning",
                                status.color === "danger" && "bg-danger"
                              )}
                            />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Right Column - Unassigned Clients */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="glass rounded-xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-brand2" />
                    Unassigned Clients
                  </h2>
                  <span className="text-sm text-muted">
                    {unassignedClients.length} waiting
                  </span>
                </div>

                {selectedClient && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-lg bg-brand/10 border border-brand/30 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text">
                        Client Selected: {selectedClient.name}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Click a case manager to assign this client
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="ml-auto text-text hover:text-brand transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                <div className="space-y-3">
                  {unassignedClients.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                      <p className="text-muted text-sm">
                        No unassigned clients at this time
                      </p>
                    </div>
                  ) : (
                    unassignedClients.map((client, index) => {
                      const isSelected = selectedClient?.id === client.id;

                      return (
                        <motion.button
                          key={client.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          onClick={() => handleClientSelect(client)}
                          className={cn(
                            "w-full p-4 rounded-lg border transition-all text-left",
                            isSelected
                              ? "bg-brand2/10 border-brand2/40 shadow-lg shadow-brand2/10"
                              : "bg-panel border-border hover:border-brand2/30 hover:bg-glass"
                          )}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-semibold text-text mb-1">
                                {client.name}
                              </h3>
                              <p className="text-xs text-muted">{client.email}</p>
                              <p className="text-xs text-muted">{client.phone}</p>
                            </div>

                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium border",
                                getPriorityColor(client.priority)
                              )}
                            >
                              {client.priority.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted">
                            <Calendar className="w-3 h-3" />
                            <span>Enrolled: {formatDate(client.enrolledDate)}</span>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>

            {/* Assignments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="glass rounded-xl p-6 border border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-text">
                  Assignment History
                </h2>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as "all" | "active" | "inactive")
                      }
                      className="pl-10 pr-8 py-2 bg-panel border border-border rounded-lg text-sm text-text focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted">
                        Case Manager
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted">
                        Assigned Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <AlertCircle className="w-12 h-12 text-muted/40 mx-auto mb-3" />
                          <p className="text-muted text-sm">No assignments found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map((assignment, index) => (
                        <motion.tr
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.3 }}
                          className="border-b border-border/50 hover:bg-glass/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <p className="text-sm font-medium text-text">
                              {assignment.clientName}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm text-text">
                              {assignment.caseManagerName}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-sm text-muted">
                              <Clock className="w-3 h-3" />
                              {formatDate(assignment.assignedDate)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                assignment.status === "active"
                                  ? "bg-success/20 text-success"
                                  : "bg-muted/20 text-muted"
                              )}
                            >
                              {assignment.status === "active" ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              {assignment.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3 h-3 text-muted flex-shrink-0" />
                              <p className="text-xs text-muted line-clamp-2 max-w-xs">
                                {assignment.notes}
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Assignment Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedClient && selectedManager && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelAssignment}
              className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-panel border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 pointer-events-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-text mb-2">
                      Confirm Assignment
                    </h2>
                    <p className="text-sm text-muted">
                      Review the assignment details before confirming
                    </p>
                  </div>
                  <button
                    onClick={handleCancelAssignment}
                    className="text-muted hover:text-text transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Assignment Details */}
                <div className="space-y-4 mb-6">
                  {/* Client Info */}
                  <div className="p-4 rounded-lg bg-glass border border-border">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                      Client
                    </p>
                    <p className="text-sm font-semibold text-text">
                      {selectedClient.name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {selectedClient.email}
                    </p>
                  </div>

                  {/* Case Manager Info */}
                  <div className="p-4 rounded-lg bg-glass border border-border">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                      Case Manager
                    </p>
                    <p className="text-sm font-semibold text-text">
                      {selectedManager.name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {selectedManager.department} • Current Caseload:{" "}
                      {selectedManager.caseloadCount}
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                      Assignment Notes (Optional)
                    </label>
                    <textarea
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      placeholder="Add any relevant notes about this assignment..."
                      rows={4}
                      className="w-full px-4 py-3 bg-glass border border-border rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelAssignment}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-glass border border-border text-text font-medium hover:bg-panel transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmAssignment}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirm Assignment
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
