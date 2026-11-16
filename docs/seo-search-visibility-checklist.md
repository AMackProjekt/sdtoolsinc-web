# Search visibility release checklist — T.O.O.L.S. Inc.

Updated November 2026.

## Implemented in repository
- Homepage canonical: https://sdtoolsinc.org/
- Organization and WebSite schema with legal name, alternate name, location, service categories, confirmed organizational website and contact info.
- Updated SEO metadata, title, and descriptions for justice-involved support, displaced veterans, community resources, and DocuReady.
- Official crown/torch image used by website metadata.
- Next.js generated sitemap and robots, excluding protected and archived referral routes.
- Google Analytics 4 measurement ID `G-CLEPBVEEFX`, preserved from existing source, now loaded only with user consent.
- Accessible social sharing (Facebook, LinkedIn, X, WhatsApp, email, copying the URL).

## Blocking release verification
1. Confirm Azure CI succeeded on the latest commit, and check `https://sdtoolsinc.org/` and `https://www.sdtoolsinc.org/` in a fresh, non-cached browser. External search retrieval currently surfaces two **different older homepage versions**, even though Cloudflare DNS records for both hosts target the same Azure Static Web App. Determine whether this is stale web index/cache, Azure custom hostname behavior, or a deployment mismatch before introducing a host redirect.
2. Verify `https://sdtoolsinc.org/robots.txt` and `https://sdtoolsinc.org/sitemap.xml` actually return HTTP 200 and the expected content in a live browser.
3. Verify page title, canonical, JSON-LD, OpenGraph and Twitter tags in rendered HTML via View Source or an independent structured-data validator. Some social platforms do not support SVG `og:image`; test Facebook Sharing Debugger and LinkedIn Post Inspector, and prepare a PNG/JPEG 1200×630 image if missing.
4. Verify `G-CLEPBVEEFX` maps to the correct organization property and appears in GA4 Realtime **only after opt-in**; test decline, accept, and withdrawal in a fresh browser. No form content or client PII must be sent as analytics events.
5. Confirm ownership in Google Search Console for the domain property `sdtoolsinc.org`; submit `https://sdtoolsinc.org/sitemap.xml`, inspect the homepage and key service URLs, and request indexing only if necessary.
6. Confirm the actual official social account URLs before using any as `sameAs`. Avoid linking unrelated companies with similar names.
7. Google Business Profile: establish one only if organizational eligibility is satisfied; keep business name, address/service area, official phone and website consistent across directory profiles.

## Organic search strategy
- Prioritize searches for the organization's actual identity and locally specific services, including “T.O.O.L.S. Inc. San Diego”, “Together Overcoming Obstacles and Limitations”, “reentry support San Diego”, “displaced veterans resources San Diego”, and “DocuReady PrePlan”.
- Publish useful and verified service content, transparent eligibility, available geographic coverage, and clear program contacts. Build individual pages for displaced-veteran and community-support services once the operational descriptions are confirmed.
- Seek legitimate backlinks from confirmed partner organizations, community resource directories and local partners. Avoid paid link schemes, keyword stuffing, fake reviews and multiple fake profiles.
- Monitor Google Search Console impressions, clicks, average position, indexed pages and branded-vs-service queries weekly.

**No one can guarantee positions 1–5 in Google for arbitrary searches.** Search results vary with intent, geography, competition, personalization and Google's indexing decisions. SEO metadata helps identify content but is not itself a ranking guarantee.
