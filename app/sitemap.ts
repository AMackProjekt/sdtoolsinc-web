import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Sitemap includes public information pages, excluding archived referral and protected portal routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/reentry", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/resources", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/first-steps", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/partnerships", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" as const },
  ];
  return entries.map(({ path, priority, changeFrequency }) => ({
    url: `https://sdtoolsinc.org${path}`,
    priority,
    changeFrequency,
  }));
}
