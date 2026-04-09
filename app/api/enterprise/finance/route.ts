import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    summary: {
      totalBudget: 2400000,
      spent: 1187430,
      remaining: 1212570,
      percentUsed: 49.5,
      ytdRevenue: 892000,
      ytdExpenses: 1187430,
      netPosition: -295430,
      lastUpdated: new Date().toISOString(),
    },
    grants: [
      { id: "G-001", name: "HUD Community Grant", amount: 450000, received: 450000, spent: 312000, status: "Active", dueDate: "2026-09-30" },
      { id: "G-002", name: "State Housing Fund", amount: 280000, received: 140000, spent: 98000, status: "Active", dueDate: "2026-06-15" },
      { id: "G-003", name: "Federal Title IV Grant", amount: 320000, received: 320000, spent: 320000, status: "Closed", dueDate: "2025-12-31" },
      { id: "G-004", name: "Corporate Sponsorship - Tech", amount: 75000, received: 0, spent: 0, status: "Pending", dueDate: "2026-12-31" },
    ],
    budgetLines: [
      { category: "Personnel & Benefits", allocated: 980000, spent: 621500, percent: 63.4 },
      { category: "Program Services", allocated: 580000, spent: 298000, percent: 51.4 },
      { category: "Administrative", allocated: 210000, spent: 143800, percent: 68.5 },
      { category: "Technology & Systems", allocated: 145000, spent: 62100, percent: 42.8 },
      { category: "Facilities & Operations", allocated: 220000, spent: 124730, percent: 56.7 },
      { category: "Marketing & Outreach", allocated: 85000, spent: 42300, percent: 49.8 },
      { category: "Training & Development", allocated: 110000, spent: 48200, percent: 43.8 },
      { category: "Capital Expenditures", allocated: 70000, spent: 26800, percent: 38.3 },
    ],
    monthlyFlow: [
      { month: "Jan", revenue: 72000, expenses: 94500 },
      { month: "Feb", revenue: 68000, expenses: 89200 },
      { month: "Mar", revenue: 95000, expenses: 102800 },
      { month: "Apr", revenue: 88000, expenses: 97400 },
      { month: "May", revenue: 112000, expenses: 108900 },
      { month: "Jun", revenue: 98000, expenses: 104200 },
      { month: "Jul", revenue: 104000, expenses: 112300 },
      { month: "Aug", revenue: 87000, expenses: 98700 },
      { month: "Sep", revenue: 94000, expenses: 101400 },
      { month: "Oct", revenue: 74000, expenses: 77930 },
    ],
    compliance: {
      irs990Filed: true,
      auditStatus: "Completed — FY2025",
      nextAuditDue: "2026-12-01",
      boardApproved: true,
      reserves990: 185000,
    },
    recentTransactions: [
      { id: "T-1041", date: "2026-04-08", description: "Staff Payroll", category: "Personnel", amount: -48200, type: "expense" },
      { id: "T-1040", date: "2026-04-07", description: "HUD Grant Disbursement", category: "Grant", amount: 35000, type: "income" },
      { id: "T-1039", date: "2026-04-06", description: "Facility Lease - Main Office", category: "Facilities", amount: -8400, type: "expense" },
      { id: "T-1038", date: "2026-04-05", description: "Software Subscriptions", category: "Technology", amount: -2890, type: "expense" },
      { id: "T-1037", date: "2026-04-04", description: "Program Supplies", category: "Program Services", amount: -1240, type: "expense" },
      { id: "T-1036", date: "2026-04-03", description: "Individual Donation", category: "Development", amount: 2500, type: "income" },
    ],
  });
}
