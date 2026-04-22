import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = [
  "participants",
  "case-notes",
  "programs",
  "schedule",
  "reports",
  "resources",
  "settings",
];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function StaffSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Staff Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/staff/dashboard"
    />
  );
}
