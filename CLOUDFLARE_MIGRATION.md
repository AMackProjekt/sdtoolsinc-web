# Cloudflare migration gates — sdtoolsinc.org

Source: `AMackProjekt/sdtoolsinc-web`. Current live application appears to use Azure Static Web Apps; Cloudflare currently manages DNS and Access. **Do not cut over DNS until gates pass.**

## Plan

1. Merge and test login correction [PR #48](https://github.com/AMackProjekt/sdtoolsinc-web/pull/48) and glass dock [PR #47](https://github.com/AMackProjekt/sdtoolsinc-web/pull/47), after reviewing build output. Keep the original deployment available for rollback.
2. Verify Supabase project ownership and active status. **Never substitute AMackProjekt's Supabase project for T.O.O.L.S. Inc.** Determine whether the current deployed data/users are in `witgsjkbxflqlvvgmghu` or the dedicated T.O.O.L.S. project `mfczjuaczockysuwxxgh`. Do not switch refs before migrating users/data and session settings securely.
3. Run `npm ci`, `npm run build`, and `npx vinext check` on a full checkout. Address compatibility findings. Cloudflare recommends `npx vinext init` with a parallel vinext build; retain the original Next build until validated.
4. On a **migration branch**, run `npx vinext init`; configure a distinct Cloudflare Worker preview and add secrets using Cloudflare secret bindings (not committed source). Validate SSR, all routes, assets, authentication callbacks, DocuReady preplan/intake, accepted-enrollment gating, and backend API authorization.
5. Cloudflare Access at `/portal` verifies an email address but does not create a Supabase session. Either preserve Supabase login behind Access or implement a verified Cloudflare Access JWT-to-app-session integration; **never trust a client-provided email header**.
6. Test signup denial, authorized user roles, magic links, logout, recovery, 72-hour plan -> prepopulated intake -> V4 enrolled workforce pathway, privacy and no-PHI logging. Test `/portal` path behavior and any subpaths.
7. Only after production-like preview and explicit rollback plan, change the proxied DNS/origin route from Azure to Cloudflare Worker and verify TLS/Access/caching. Preserve existing Azure deployment for rapid rollback.

## Do not migrate automatically

- Supabase Auth / PostgreSQL / RLS is not a drop-in Cloudflare D1 replacement; retain it until a separately audited data migration is done.
- Do not change existing client authorization tables or loosen RLS to make a build pass.
- Do not automatically copy secrets from other businesses or repositories.

## Required configuration (names only)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, auth redirect allowlist, Cloudflare Access application identifiers, Worker secrets, GitHub CI credentials.

## Go/no-go

No DNS cutover unless build, all auth paths, all backend permissions, data access, and rollback tests pass. Cloudflare guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
