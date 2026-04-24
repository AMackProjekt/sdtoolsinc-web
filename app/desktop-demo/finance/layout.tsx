"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, DollarSign, Receipt, TrendingUp, FileText, CreditCard, Settings, PieChart } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/finance/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/desktop-demo/finance/transactions", label: "Transactions", icon: DollarSign },
  { href: "/desktop-demo/finance/invoices",     label: "Invoices",     icon: Receipt },
  { href: "/desktop-demo/finance/budgets",      label: "Budgets",      icon: PieChart },
  { href: "/desktop-demo/finance/reports",      label: "Reports",      icon: TrendingUp },
  { href: "/desktop-demo/finance/payroll",      label: "Payroll",      icon: CreditCard },
  { href: "/desktop-demo/finance/documents",    label: "Documents",    icon: FileText },
  { href: "/desktop-demo/finance/settings",     label: "Settings",     icon: Settings },
];

export default function DesktopFinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Finance Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: DollarSign,
        theme: {
          sidebar:    "bg-slate-950 border-emerald-800/30",
          border:     "border-emerald-800/30",
          iconBg:     "bg-emerald-500/20",
          iconFg:     "text-emerald-400",
          activeBg:   "bg-emerald-700",
          navFg:      "text-emerald-300/60",
          hoverBg:    "hover:bg-emerald-900/40",
          userChipBg: "bg-emerald-900/30",
          brandFg:    "text-emerald-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
