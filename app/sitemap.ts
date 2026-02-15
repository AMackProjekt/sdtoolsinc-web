import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://sdtoolsinc.org";

const routes = [
  "",
  "/first-steps/",
  "/interest/",
  "/referral/",
  "/partnerships/",
  "/reentry/",
  "/resources/",
  "/portal/portals/",
  "/portal/dashboard/",
  "/portal/ai-studio/",
  "/portal/mackai/",
  "/portal-coming-soon/",
  "/privacy-policy/",
  "/demos/",
  "/demos/first-steps/",
  "/demo-recording/",
  "/demo-recording/connection/",
  "/demo-recording/dashboard/",
  "/demo-recording/educational/",
  "/demo-recording/mackai/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return routes.map((route) => {
    let priority = 0.7;
    if (route === "") priority = 1;
    else if (route === "/portal/portals/" || route === "/portal/dashboard/") priority = 0.9;
    else if (route === "/interest/" || route === "/referral/") priority = 0.8;
    
    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
    };
  });
}
