'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { ChartWrapper } from '@/components/ui/ChartWrapper'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'

const programCompletionData = [
  { month: 'Jan', completed: 8, inProgress: 15, total: 23 },
  { month: 'Feb', completed: 10, inProgress: 18, total: 28 },
  { month: 'Mar', completed: 12, inProgress: 20, total: 32 },
  { month: 'Apr', completed: 14, inProgress: 22, total: 36 },
  { month: 'May', completed: 17, inProgress: 24, total: 41 },
  { month: 'Jun', completed: 19, inProgress: 26, total: 45 },
]

const employmentData = [
  { category: 'Employed Full-Time', value: 27, color: '#22c55e' },
  { category: 'Employed Part-Time', value: 15, color: '#84cc16' },
  { category: 'Job Seeking', value: 12, color: '#eab308' },
  { category: 'Not Seeking', value: 8, color: '#64748b' },
]

const clientProgressData = [
  { milestone: '30-Day', completed: 38, target: 45 },
  { milestone: '60-Day', completed: 28, target: 40 },
  { milestone: '90-Day', completed: 19, target: 35 },
  { milestone: 'Program Complete', completed: 12, target: 30 },
]

const outcomeMetrics = [
  { metric: 'Employment Rate', value: 68, change: 5, trend: 'up' },
  { metric: 'Housing Stability', value: 82, change: 3, trend: 'up' },
  { metric: 'Program Completion', value: 75, change: 8, trend: 'up' },
  { metric: 'Recidivism Rate', value: 12, change: -4, trend: 'down' },
]

export default function ReportsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [dateRange, setDateRange] = useState('6months')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    console.log(`Exporting as ${format}`)
    alert(`Report export as ${format.toUpperCase()} - Feature coming soon!`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Reports & Analytics</h1>
            <p className="text-muted">Track client progress and program outcomes</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              📊 Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('json')}>
              📄 Export JSON
            </Button>
            <Button variant="primary" onClick={() => handleExport('pdf')}>
              📑 Export PDF
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-muted">Date Range:</label>
            <div className="flex gap-2">
              {[
                { value: '1month', label: 'Last Month' },
                { value: '3months', label: 'Last 3 Months' },
                { value: '6months', label: 'Last 6 Months' },
                { value: '1year', label: 'Last Year' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === option.value
                      ? 'bg-brand text-white'
                      : 'bg-glass text-muted hover:text-text'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Outcome Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {outcomeMetrics.map((metric) => (
            <div key={metric.metric} className="glass rounded-xl p-6">
              <div className="text-sm text-muted mb-2">{metric.metric}</div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-text">{metric.value}%</div>
                <div className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Program Completion Rates */}
          <ChartWrapper 
            title="Program Completion Trends" 
            description="Monthly completion and enrollment data"
            height="350px"
            onExport={() => handleExport('csv')}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                <XAxis 
                  dataKey="month"
                  tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,.12)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,.12)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(12,15,23,.95)",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "rgba(248,250,252,.96)" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Bar dataKey="completed" fill="rgba(56,189,248,.85)" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" fill="rgba(45,212,191,.85)" name="In Progress" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Employment Status */}
          <ChartWrapper 
            title="Employment Status Distribution" 
            description="Current employment breakdown"
            height="350px"
            onExport={() => handleExport('csv')}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.category}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {employmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(12,15,23,.95)",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Client Progress by Milestone */}
        <ChartWrapper 
          title="Client Progress by Milestone" 
          description="Achievement rates compared to targets"
          height="350px"
          onExport={() => handleExport('csv')}
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientProgressData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis 
                type="number"
                tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,.12)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="milestone"
                tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,.12)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(12,15,23,.95)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="rgba(56,189,248,.85)" name="Completed" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" fill="rgba(148,163,184,.3)" name="Target" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Summary Statistics */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-6">Summary Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted">Client Demographics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Total Active Clients</span>
                  <span className="text-text font-medium">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">New Clients This Month</span>
                  <span className="text-text font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Average Age</span>
                  <span className="text-text font-medium">34 years</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted">Engagement Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Avg. Appointments/Client</span>
                  <span className="text-text font-medium">3.2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Attendance Rate</span>
                  <span className="text-text font-medium">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Response Rate</span>
                  <span className="text-text font-medium">92%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted">Program Outcomes</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Success Rate</span>
                  <span className="text-text font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Retention Rate</span>
                  <span className="text-text font-medium">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Avg. Program Duration</span>
                  <span className="text-text font-medium">6.5 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
