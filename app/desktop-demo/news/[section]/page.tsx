import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = ["articles", "announcements", "media", "feeds", "press", "archive", "settings"];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function NewsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Newsroom Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/news/dashboard"
    />
  );
}
