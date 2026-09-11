import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/auth/', '/portal/'] },
    sitemap: 'https://sdtoolsinc.org/sitemap.xml',
    host: 'https://sdtoolsinc.org',
  };
}
