"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { ChartWrapper } from "@/components/ui/ChartWrapper";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/lib/admin-auth";
import {
  TrendingUp,
  Download,
  FileText,
  Users,
  Briefcase,
  Award,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface CaseManagerWorkload {
  id: string;
  name: string;
  activeClients: number;
  completedCases: number;
  pendingTasks: number;
  responseRate: number;
}

interface ClientOutcome {
  category: string;
  value: number;
  color: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch report data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = (reportName: string) => {
    console.log(`Exporting ${reportName}...`);
  };

  // Mock data for user growth
  const userGrowthData = [
    { month: "Jan", users: 120, active: 95 },
    { month: "Feb", users: 145, active: 115 },
    { month: "Mar", users: 180, active: 142 },
    { month: "Apr", users: 210, active: 168 },
    { month: "May", users: 245, active: 196 },
    { month: "Jun", users: 280, active: 225 },
  ];

  // Mock data for assignment distribution
  const assignmentDistributionData = [
    { name: "Completed", value: 45, color: "#10b981" },
    { name: "In Progress", value: 32, color: "#f97316" },
    { name: "Pending", value: 18, color: "#ef4444" },
    { name: "On Hold", value: 5, color: "#8b5cf6" },
  ];

  // Mock data for case manager workload
  const caseManagerWorkload: CaseManagerWorkload[] = [
    {
      id: "1",
      name: "Sarah Chen",
      activeClients: 12,
      completedCases: 45,
      pendingTasks: 8,
      responseRate: 98,
    },
    {
      id: "2",
      name: "Michael Brown",
      activeClients: 15,
      completedCases: 38,
      pendingTasks: 12,
      responseRate: 95,
    },
    {
      id: "3",
      name: "Emily Davis",
      activeClients: 10,
      completedCases: 52,
      pendingTasks: 5,
      responseRate: 99,
    },
    {
      id: "4",
      name: "Robert Johnson",
      activeClients: 14,
      completedCases: 41,
      pendingTasks: 9,
      responseRate: 96,
    },
    {
      id: "5",
      name: "Lisa Martinez",
      activeClients: 11,
      completedCases: 48,
      pendingTasks: 7,
      responseRate: 97,
    },
  ];

  // Mock data for client outcomes
  const clientOutcomesData = [
    { month: "Jan", employed: 8, training: 12, support: 15 },
    { month: "Feb", employed: 12, training: 15, support: 18 },
    { month: "Mar", employed: 15, training: 18, support: 20 },
    { month: "Apr", employed: 18, training: 20, support: 22 },
    { month: "May", employed: 22, training: 22, support: 24 },
    { month: "Jun", employed: 25, training: 25, support: 26 },
  ];

  // DataTable columns for case manager workload
  const workloadColumns = [
    {
      key: "name",
      label: "Case Manager",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand2 text-white text-sm font-bold flex items-center justify-center">
            {value.charAt(0)}
          </div>
          <span className="font-medium text-text">{value}</span>
        </div>
      ),
    },
    {
      key: "activeClients",
      label: "Active Clients",
      sortable: true,
      render: (value: number) => (
        <span className="text-text font-medium">{value}</span>
      ),
    },
    {
      key: "completedCases",
      label: "Completed Cases",
      sortable: true,
      render: (value: number) => (
        <span className="text-success font-medium">{value}</span>
      ),
    },
    {
      key: "pendingTasks",
      label: "Pending Tasks",
      sortable: true,
      render: (value: number) => (
        <span className="text-brand2 font-medium">{value}</span>
      ),
    },
    {
      key: "responseRate",
      label: "Response Rate",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-panel rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-text font-medium text-sm">{value}%</span>
        </div>
      ),
    },
  ];

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-text mb-2">
                    Reports & Analytics
                  </h1>
                  <p className="text-muted">
                    Comprehensive insights and data visualization
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
                    <span>Refresh</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport("all-reports")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand to-brand2 text-white font-medium hover:shadow-lg hover:shadow-brand/25 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-1">280</h3>
                <p className="text-sm text-muted">Total Users</p>
                <p className="text-xs text-success mt-2">+14% this month</p>
              </div>

              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-brand2/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-brand2" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-1">62</h3>
                <p className="text-sm text-muted">Active Cases</p>
                <p className="text-xs text-success mt-2">+8% this week</p>
              </div>

              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-1">45</h3>
                <p className="text-sm text-muted">Completed</p>
                <p className="text-xs text-success mt-2">+22% this month</p>
              </div>

              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-xs text-muted">Last updated</span>
                </div>
                <h3 className="text-2xl font-bold text-text mb-1">97%</h3>
                <p className="text-sm text-muted">Success Rate</p>
                <p className="text-xs text-muted mt-2">Just now</p>
              </div>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-8"
            >
              <ChartWrapper
                title="User Growth"
                description="Total and active users over the last 6 months"
                height="350px"
                loading={loading}
                onExport={() => handleExport("user-growth")}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(12,15,23,.92)",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 12,
                        padding: 12,
                      }}
                      labelStyle={{ color: "rgba(248,250,252,.96)", marginBottom: 8 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#ef4444"
                      fill="rgba(239,68,68,.14)"
                      strokeWidth={2}
                      name="Total Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stroke="#f97316"
                      fill="rgba(249,115,22,.14)"
                      strokeWidth={2}
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </motion.div>

            {/* Assignment Distribution & Client Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {/* Assignment Distribution */}
              <ChartWrapper
                title="Assignment Distribution"
                description="Current status of all assignments"
                height="350px"
                loading={loading}
                onExport={() => handleExport("assignment-distribution")}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignmentDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assignmentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(12,15,23,.92)",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: "rgba(248,250,252,.96)" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>

              {/* Client Outcomes */}
              <ChartWrapper
                title="Client Outcomes"
                description="Monthly outcomes by category"
                height="350px"
                loading={loading}
                onExport={() => handleExport("client-outcomes")}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientOutcomesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(12,15,23,.92)",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: "rgba(248,250,252,.96)" }}>
                          {value}
                        </span>
                      )}
                    />
                    <Bar dataKey="employed" fill="#10b981" name="Employed" />
                    <Bar dataKey="training" fill="#f97316" name="In Training" />
                    <Bar dataKey="support" fill="#8b5cf6" name="Ongoing Support" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </motion.div>

            {/* Case Manager Workload Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-text">
                    Case Manager Workload
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Performance metrics by case manager
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("workload")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-brand/40 text-text transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
              </div>

              <DataTable
                data={caseManagerWorkload}
                columns={workloadColumns}
                loading={loading}
                emptyMessage="No case manager data available"
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
