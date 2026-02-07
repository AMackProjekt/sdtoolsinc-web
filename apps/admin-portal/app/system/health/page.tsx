"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { StatCard } from "@/components/ui/StatCard";
import { ChartWrapper } from "@/components/ui/ChartWrapper";
import { useAuth } from "@/lib/admin-auth";
import {
  Activity,
  Database,
  Users,
  AlertTriangle,
  HardDrive,
  Cpu,
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
} from "recharts";

interface SystemMetrics {
  apiResponseTime: number;
  dbStatus: "healthy" | "warning" | "critical";
  activeSessions: number;
  errorRate: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

interface StorageData {
  name: string;
  used: number;
  total: number;
}

export default function SystemHealthPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [metrics, setMetrics] = useState<SystemMetrics>({
    apiResponseTime: 0,
    dbStatus: "healthy",
    activeSessions: 0,
    errorRate: 0,
    uptime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch system metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMetrics = async () => {
      setLoading(true);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/v1/admin/system/health');
        // const data = await response.json();
        // setMetrics(data);

        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setMetrics({
          apiResponseTime: 125,
          dbStatus: "healthy",
          activeSessions: 47,
          errorRate: 0.3,
          uptime: 99.98,
          cpuUsage: 32,
          memoryUsage: 64,
          diskUsage: 58,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Mock storage data
  const storageData: StorageData[] = [
    { name: "Database", used: 45, total: 100 },
    { name: "Media", used: 32, total: 50 },
    { name: "Logs", used: 8, total: 20 },
    { name: "Backups", used: 18, total: 30 },
  ];

  // Mock chart data for resource usage over time
  const resourceChartData = [
    { time: "00:00", cpu: 28, memory: 62, disk: 56 },
    { time: "04:00", cpu: 22, memory: 58, disk: 57 },
    { time: "08:00", cpu: 45, memory: 68, disk: 58 },
    { time: "12:00", cpu: 38, memory: 65, disk: 58 },
    { time: "16:00", cpu: 32, memory: 64, disk: 58 },
    { time: "20:00", cpu: 29, memory: 61, disk: 59 },
  ];

  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-success";
      case "warning":
        return "text-brand2";
      case "critical":
        return "text-brand";
      default:
        return "text-muted";
    }
  };

  // Helper to get health indicator
  const getHealthIndicator = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { color: "bg-brand", status: "critical" };
    if (value >= thresholds.warning) return { color: "bg-brand2", status: "warning" };
    return { color: "bg-success", status: "healthy" };
  };

  const cpuHealth = getHealthIndicator(metrics.cpuUsage, { warning: 70, critical: 85 });
  const memoryHealth = getHealthIndicator(metrics.memoryUsage, { warning: 75, critical: 90 });
  const diskHealth = getHealthIndicator(metrics.diskUsage, { warning: 80, critical: 90 });

  const formatUptime = (uptimePercent: number) => {
    const days = Math.floor((uptimePercent / 100) * 30);
    const hours = Math.floor(((uptimePercent / 100) * 30 - days) * 24);
    return `${days}d ${hours}h`;
  };

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
                    System Health
                  </h1>
                  <p className="text-muted">
                    Monitor system performance and resource usage
                  </p>
                </div>

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
              </div>
            </motion.div>

            {/* System Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                title="API Response Time"
                value={`${metrics.apiResponseTime}ms`}
                icon={<Activity className="w-5 h-5" />}
                variant={metrics.apiResponseTime < 200 ? "success" : "warning"}
                loading={loading}
                trend={{
                  value: 12,
                  isPositive: true,
                  label: "vs last hour",
                }}
              />

              <StatCard
                title="Database Status"
                value={
                  metrics.dbStatus.charAt(0).toUpperCase() +
                  metrics.dbStatus.slice(1)
                }
                icon={<Database className="w-5 h-5" />}
                variant={
                  metrics.dbStatus === "healthy"
                    ? "success"
                    : metrics.dbStatus === "warning"
                    ? "warning"
                    : "danger"
                }
                loading={loading}
              />

              <StatCard
                title="Active Sessions"
                value={metrics.activeSessions}
                icon={<Users className="w-5 h-5" />}
                variant="primary"
                loading={loading}
                trend={{
                  value: 8,
                  isPositive: true,
                  label: "vs yesterday",
                }}
              />

              <StatCard
                title="Error Rate"
                value={`${metrics.errorRate}%`}
                icon={<AlertTriangle className="w-5 h-5" />}
                variant={metrics.errorRate < 1 ? "success" : "danger"}
                loading={loading}
                trend={{
                  value: 0.2,
                  isPositive: false,
                  label: "vs last hour",
                }}
              />
            </motion.div>

            {/* Uptime Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-8"
            >
              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">System Uptime</h3>
                  <span className="text-3xl font-bold bg-gradient-to-r from-success to-brand2 bg-clip-text text-transparent">
                    {metrics.uptime}%
                  </span>
                </div>
                <div className="relative h-3 bg-panel rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.uptime}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-success to-brand2 rounded-full"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted">
                    Last 30 days: {formatUptime(metrics.uptime)}
                  </span>
                  <span className="text-success font-medium">Excellent</span>
                </div>
              </div>
            </motion.div>

            {/* Resource Usage Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8"
            >
              <ChartWrapper
                title="Resource Usage (24h)"
                description="CPU, Memory, and Disk usage over the last 24 hours"
                height="350px"
                loading={loading}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resourceChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      label={{ value: "Usage (%)", angle: -90, position: "insideLeft", fill: "rgba(148,163,184,.85)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(12,15,23,.92)",
                        border: "1px solid rgba(255,255,255,.12)",
                        borderRadius: 12,
                        padding: 12,
                      }}
                      labelStyle={{ color: "rgba(248,250,252,.96)", marginBottom: 8 }}
                      itemStyle={{ color: "rgba(248,250,252,.96)", fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cpu"
                      stroke="#ef4444"
                      fill="rgba(239,68,68,.14)"
                      strokeWidth={2}
                      name="CPU"
                    />
                    <Area
                      type="monotone"
                      dataKey="memory"
                      stroke="#f97316"
                      fill="rgba(249,115,22,.14)"
                      strokeWidth={2}
                      name="Memory"
                    />
                    <Area
                      type="monotone"
                      dataKey="disk"
                      stroke="#8b5cf6"
                      fill="rgba(139,92,246,.14)"
                      strokeWidth={2}
                      name="Disk"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </motion.div>

            {/* Storage Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Real-time Health Indicators */}
              <div className="glass rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-6">
                  Real-time Health Indicators
                </h3>
                <div className="space-y-5">
                  {/* CPU */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium text-text">CPU Usage</span>
                      </div>
                      <span className={cn("text-sm font-bold", cpuHealth.status === "healthy" ? "text-success" : cpuHealth.status === "warning" ? "text-brand2" : "text-brand")}>
                        {metrics.cpuUsage}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-panel rounded-full overflow-hidden">
                      <div
                        className={cn("absolute h-full rounded-full transition-all", cpuHealth.color)}
                        style={{ width: `${metrics.cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium text-text">Memory Usage</span>
                      </div>
                      <span className={cn("text-sm font-bold", memoryHealth.status === "healthy" ? "text-success" : memoryHealth.status === "warning" ? "text-brand2" : "text-brand")}>
                        {metrics.memoryUsage}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-panel rounded-full overflow-hidden">
                      <div
                        className={cn("absolute h-full rounded-full transition-all", memoryHealth.color)}
                        style={{ width: `${metrics.memoryUsage}%` }}
                      />
                    </div>
                  </div>

                  {/* Disk */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium text-text">Disk Usage</span>
                      </div>
                      <span className={cn("text-sm font-bold", diskHealth.status === "healthy" ? "text-success" : diskHealth.status === "warning" ? "text-brand2" : "text-brand")}>
                        {metrics.diskUsage}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-panel rounded-full overflow-hidden">
                      <div
                        className={cn("absolute h-full rounded-full transition-all", diskHealth.color)}
                        style={{ width: `${metrics.diskUsage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Legend */}
                <div className="mt-6 pt-6 border-t border-border flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-muted">Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand2" />
                    <span className="text-muted">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand" />
                    <span className="text-muted">Critical</span>
                  </div>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="glass rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-6">
                  Storage Breakdown
                </h3>
                <div className="space-y-4">
                  {storageData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text">{item.name}</span>
                        <span className="text-sm text-muted">
                          {item.used}GB / {item.total}GB
                        </span>
                      </div>
                      <div className="relative h-2 bg-panel rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.used / item.total) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="absolute h-full bg-gradient-to-r from-brand to-brand2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text">Total Used</span>
                    <span className="text-sm font-bold text-brand">
                      {storageData.reduce((sum, item) => sum + item.used, 0)}GB /{" "}
                      {storageData.reduce((sum, item) => sum + item.total, 0)}GB
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
