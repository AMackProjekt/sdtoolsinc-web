# Broken Link Audit - Phase 1 Critical Fix #4

**Date:** February 2, 2026  
**Scope:** app/, components/, apps/ source files

---

## Summary
A static scan of source files identified external URLs used across the platform. This audit flags **likely broken or placeholder links** and lists **production URLs that require live verification**.

> ⚠️ This is a source-level audit (no HTTP checks performed yet). Live validation should be run after deployment.

---

## A) Likely Broken / Placeholder / Dev Links (Action Required)

These URLs appear to be placeholders, local development targets, or malformed strings. They should be replaced or removed:

- http://localhost:3000/demo-recording
- http://localhost:3001
- http://localhost:3002
- http://localhost:3003
- https://api.yourapp.com
- https://example.org
- https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
- https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
- https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
- https://portal.sdtoolsinc.org/.auth/login/aad/callback (verify active SWA login endpoint)

**Notes:**
- The Azure/S3 template URLs may be intended for documentation or placeholders.
- Localhost links must never appear in production content.

---

## B) Production URLs (Require Live Verification)

These are real public-facing URLs used in the application. They should be checked for availability and correctness:

- https://sdtoolsinc.org
- https://toolsinc-client-portal.azurestaticapps.net
- https://toolsinc-casemgr-portal.azurestaticapps.net
- https://toolsinc-admin-portal.azurestaticapps.net
- https://client.sdtoolsinc.org
- https://admin.sdtoolsinc.org
- https://staff.sdtoolsinc.org
- https://forms.cloud.microsoft/r/G0kkRW4F7q
- https://forms.office.com/r/G0kkRW4F7q
- https://blue-desert-08d808f10.azurestaticapps.net/api

---

## C) External Resource Links (Require Live Verification)

These are external resources used for reentry support. Each should be validated:

- https://www.211sandiego.org
- https://www.sandiegocounty.gov/hhsa
- https://www.sandiegocounty.gov/hhsa/programs/bhs
- https://www.sandiegofoodbank.org
- https://www.sdrescue.org
- https://www.sandiegolibrary.org
- https://www.sdhc.org
- https://www.sdhc.org/homelessness-solutions
- https://www.sdhc.org/housing-opportunities
- https://www.sdmts.com/fares-passes/reduced-fare
- https://www.workforce.org
- https://www.ymcasd.org
- https://www.dreamsforchange.org
- https://www.epath.org
- https://www.gridalternatives.org
- https://www.homestartonline.org
- https://www.maacproject.org
- https://www.svdpsd.org
- https://www.thinkdignity.org
- https://www.feedingsandiego.org
- https://www.neighbor.org
- https://www.casacornelia.org
- https://www.steppingstonesd.org
- https://www.careeronestop.org/LocalHelp/AmericanJobCenters/american-job-centers.aspx
- https://www.lassd.org
- https://www.scripps.org/services/behavioral-health
- https://www.namisandiego.org
- https://www.mcalisterinstitute.org
- https://www.ctcbehavioralhealth.com
- https://www.apibehavioral.com
- https://www.pbhealth.com
- https://www.chgsd.com
- https://www.ccdsd.org
- https://www.cde.ca.gov/sp/cd/op
- https://www.sdccd.edu
- https://www.cccapply.org
- https://www.jobcorps.gov
- https://www.indeed.com/career-advice
- https://www.linkedin.com/learning/
- https://www.khanacademy.org
- https://www.khanacademy.org/math
- https://www.khanacademy.org/math/algebra
- https://www.khanacademy.org/science
- https://www.khanacademy.org/humanities/grammar
- https://www.khanacademy.org/humanities/us-history
- https://www.edx.org
- https://www.coursera.org/courses?query=free
- https://www.codecademy.com/catalog/subject/all
- https://www.lightandsaltlearning.org
- https://ged.com
- https://ged.com/study/
- https://ged.com/study/ged_math/
- https://ged.com/study/ged_science/
- https://ged.com/study/practice_test/
- https://www.duolingo.com
- https://www.youtube.com/education
- https://www.lyft.com/access
- https://www.sandiego.dressforsuccess.org
- https://www.sandiego.gov/treasurer/fec
- https://www.amazon.com/Navigating-Spiritual-Warfare-UNDERSTANDING-OVERCOMING/dp/B0CX5JB7BL

---

## D) Social & Analytics (Verify Active)

- https://www.instagram.com/sd_t.o.o.ls_inc
- https://www.facebook.com/TOOLsInc
- https://www.tiktok.com/@toolsinc
- https://www.googletagmanager.com/gtag/js?id=G-CLEPBVEEFX

---

## Next Steps

1. **Run live link validation** (HTTP HEAD/GET) for sections B–D
2. **Replace/remove placeholder URLs** listed in section A
3. **Verify all SWA portal domains** and update if renamed

---

**Status:** Audit complete, live verification pending
