import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = ["org", "users", "metrics", "audit", "compliance", "integrations", "settings"];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function EnterpriseSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Enterprise Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/enterprise/dashboard"
    />
  );
}
