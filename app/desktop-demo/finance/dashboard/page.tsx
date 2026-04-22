"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { DollarSign, TrendingUp, Receipt, CreditCard, PieChart } from "lucide-react";

const CHART = [
  { name: "Jan", value: 142000, secondary: 118000 },
  { name: "Feb", value: 158000, secondary: 132000 },
  { name: "Mar", value: 171000, secondary: 145000 },
  { name: "Apr", value: 163000, secondary: 140000 },
  { name: "May", value: 185000, secondary: 162000 },
  { name: "Jun", value: 198000, secondary: 174000 },
  { name: "Jul", value: 204000, secondary: 180000 },
];

export default function FinanceDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Finance"
      chartLabel="Revenue vs. Budget (monthly, $)"
      chartColor="rgba(52,211,153,.85)"
      kpis={[
        { label: "Total Revenue (YTD)", value: "$1.22M", delta: "+14%", trend: "up", icon: DollarSign, iconBg: "bg-emerald-500/20", iconFg: "text-emerald-400" },
        { label: "Budget Utilization", value: "81%", delta: "+3%", trend: "up", icon: PieChart, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Pending Invoices", value: "27", delta: "-5", trend: "down", icon: Receipt, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Net Margin", value: "23.4%", delta: "+1.2%", trend: "up", icon: TrendingUp, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "Invoice #INV-2047 Paid: $18,400", meta: "Today, 2:15 PM", badge: "Paid", badgeColor: "bg-emerald-500/20 text-emerald-300" },
        { id: "2", title: "Payroll Run: July 15 — $204K", meta: "Today, 12:00 PM", badge: "Payroll", badgeColor: "bg-sky-500/20 text-sky-300" },
        { id: "3", title: "Budget Amendment: Q3 Marketing +$12K", meta: "Yesterday", badge: "Budget", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "4", title: "Expense Report: Admin Q2 Approved", meta: "2 days ago", badge: "Approved", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "5", title: "Transaction Alert: Unusual Charge Flagged", meta: "3 days ago", badge: "Alert", badgeColor: "bg-rose-500/20 text-rose-300" },
      ]}
      quickLinks={[
        { label: "Transactions", href: "/desktop-demo/finance/transactions", icon: DollarSign, iconBg: "bg-emerald-500/20", iconFg: "text-emerald-400" },
        { label: "Invoices", href: "/desktop-demo/finance/invoices", icon: Receipt, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Payroll", href: "/desktop-demo/finance/payroll", icon: CreditCard, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Reports", href: "/desktop-demo/finance/reports", icon: TrendingUp, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
      ]}
    />
  );
}
