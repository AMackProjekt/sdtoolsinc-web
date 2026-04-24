import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = ["users", "compliance", "analytics", "audit", "content", "security", "settings"];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Admin Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/admin/dashboard"
    />
  );
}
