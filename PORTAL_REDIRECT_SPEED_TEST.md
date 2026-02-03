# Portal Redirect Speed Test - Phase 1 Critical Fix #3

**Date:** February 2, 2026  
**Scope:** Main login → portal handoff + portal auth callback → dashboard

---

## Objective
Measure and verify portal redirect times for justice-involved users. Target end-to-end handoff time: **< 3 seconds** from login action to portal landing page.

---

## Instrumentation Added (Code Changes)

To enable reliable timing data in production, lightweight client instrumentation has been added:

### LocalStorage Timing Keys
- **portal_redirect_start_ms** — Timestamp (ms) recorded at login action start
- **portal_redirect_result** — Result JSON written after landing in portal

### Instrumented Portals
- **Client Portal**: [apps/client-portal/components/RedirectTiming.tsx](apps/client-portal/components/RedirectTiming.tsx)
- **Case Manager Portal**: [apps/casemgr-portal/components/RedirectTiming.tsx](apps/casemgr-portal/components/RedirectTiming.tsx)
- **Admin Portal**: [apps/admin-portal/components/RedirectTiming.tsx](apps/admin-portal/components/RedirectTiming.tsx)

### Login Start Trigger (Timing Start)
- Client Portal login page (password + Azure OAuth)
- Case Manager login page (password)
- Admin login page (password)

---

## How to Run the Speed Test (Production)

1. Open portal login page
2. Start a login action (password or Azure OAuth)
3. After redirect completes, open DevTools Console and run:

```js
JSON.parse(localStorage.getItem('portal_redirect_result'))
```

### Expected Output
```json
{
  "portal": "client",
  "durationMs": 1840,
  "completedAt": "2026-02-02T18:44:12.123Z",
  "url": "https://toolsinc-client-portal.azurestaticapps.net/dashboard"
}
```

---

## Target Metrics

| Portal | Target | Status |
|--------|--------|--------|
| Client | < 3.0s | 🔄 Pending live test |
| Case Manager | < 3.0s | 🔄 Pending live test |
| Admin | < 3.0s | 🔄 Pending live test |

---

## Observations (To be filled after live test)

- Client Portal:
  - Median: ___ ms
  - P95: ___ ms

- Case Manager Portal:
  - Median: ___ ms
  - P95: ___ ms

- Admin Portal:
  - Median: ___ ms
  - P95: ___ ms

---

## Next Actions

1. Run 5 tests per portal in production
2. Record median + P95 results
3. If any portal exceeds 3s:
   - Check Supabase latency
   - Optimize auth callback route
   - Enable CDN caching on static assets

---

**Status:** In progress — instrumentation deployed, live measurements pending
