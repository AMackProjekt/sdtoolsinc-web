import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = ["employees", "onboarding", "leave", "training", "performance", "wellness", "settings"];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function HRSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="HR Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/hr/dashboard"
    />
  );
}
