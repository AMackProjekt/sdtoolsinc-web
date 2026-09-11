import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/reentry', '/resources', '/first-steps', '/partnerships', '/interest', '/referral', '/demos', '/privacy-policy'];
  return pages.map((path, index) => ({
    url: `https://sdtoolsinc.org${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.7,
  }));
}
