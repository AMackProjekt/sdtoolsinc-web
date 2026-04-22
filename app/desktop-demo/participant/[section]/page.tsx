import { DesktopSectionPlaceholder } from "@/components/desktop-demo/DesktopSectionPlaceholder";

const SECTIONS = [
  "courses",
  "goals",
  "journal",
  "self-care",
  "messages",
  "profile",
  "resources",
  "integrations",
  "settings",
];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function ParticipantSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <DesktopSectionPlaceholder
      portal="Participant Portal"
      section={section.replace(/-/g, " ")}
      dashboardHref="/desktop-demo/participant/dashboard"
    />
  );
}
