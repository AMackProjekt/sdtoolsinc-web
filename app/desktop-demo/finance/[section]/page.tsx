import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = ["transactions", "invoices", "budgets", "reports", "payroll", "documents", "settings"];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function FinanceSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Finance Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/finance/dashboard"
    />
  );
}
