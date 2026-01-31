# 📦 Dependency Management Strategy

## Overview

This monorepo contains multiple Next.js applications that need consistent dependency versions to prevent compatibility issues.

## Current State

- **Root Portal**: Next.js 14.2.0
- **Client Portal**: Next.js 14.2.0
- **Case Manager Portal**: Next.js 16.1.3 ⚠️
- **Admin Portal**: Next.js 16.1.3 ⚠️

**Issue**: Inconsistent versions across the monorepo

## Automated Monitoring

### GitHub Actions Workflow
- **File**: `.github/workflows/dependency-updates.yml`
- **Schedule**: Every Monday at 9 AM UTC
- **Action**: Automatically creates GitHub issues for outdated dependencies
- **Labels**: `dependencies`, `maintenance`

### Manual Checks
Run anytime to analyze the monorepo:

```bash
npm run deps:check
```

This will show:
- All critical dependencies across packages
- Version inconsistencies (⚠️ warnings)
- Update recommendations

## Update Commands

### Check for outdated packages
```bash
npm run check-updates
```

### Security audit all packages
```bash
npm run security-audit
npm run deps:audit-all
```

### Update dependencies

**Update root only**:
```bash
npm run deps:update-root
```

**Update all portal apps**:
```bash
npm run deps:update-portals
```

**Update entire monorepo (root + portals + API)**:
```bash
npm run deps:update-all
```

### Update specific package
```bash
cd apps/client-portal
npm update next
npm update react
```

## Critical Dependencies to Keep in Sync

These should match across all packages:

| Package | Recommended | Reason |
|---------|------------|--------|
| `next` | ^16.1.3 | Latest stable |
| `react` | ^19.2.3 | Latest stable |
| `react-dom` | ^19.2.3 | Must match React |
| `typescript` | ^5.7.2 | Latest stable |
| `tailwindcss` | ^3.4.10 | LTS version |
| `framer-motion` | ^11.0.0 | Latest stable |

## Best Practices

1. **Weekly Review**: Check updates every Monday
2. **Test Before Deploy**: Always test locally after updating major versions
3. **Group Updates**: Update related packages together (React + React-DOM)
4. **Lock Files**: Never manually edit package-lock.json or yarn.lock
5. **Security First**: Always address security vulnerabilities immediately
6. **PR for Updates**: Create pull requests for dependency updates with changelog

## Handling Version Conflicts

If a package requires different versions in different apps:

1. Document the reason in a comment
2. Create a GitHub issue to track resolution
3. Schedule a migration task to align versions

Example conflict scenario:
```json
// apps/admin-portal/package.json
{ "next": "^16.1.3" }

// apps/client-portal/package.json
{ "next": "^14.2.0" } // ⚠️ Needs migration
```

## Next.js Major Version Upgrades

When upgrading Next.js (e.g., 14.x → 16.x):

1. **Read Release Notes**: Review breaking changes
2. **Update One App First**: Test in least critical app
3. **Test Thoroughly**: Run full test suite
4. **Update Others**: Gradually update remaining apps
5. **Commit & Document**: Document upgrade in PR

Example upgrade path:
```bash
# Step 1: Upgrade root first
npm install next@latest

# Step 2: Fix any breaking changes
# (adjust imports, configs, etc.)

# Step 3: Run tests
npm run build
npm run lint

# Step 4: Upgrade portals
cd apps/client-portal
npm install next@latest
# ... repeat for other apps
```

## Monitoring Tools

### Package Health Dashboard
- **GitHub**: Check workflow runs at `.github/workflows/dependency-updates.yml`
- **NPM**: Visit [npmjs.com](https://www.npmjs.com) to check latest versions
- **Dependabot**: (Optional) Enable GitHub Dependabot for automated PRs

### What to Watch

- Security vulnerabilities (high priority)
- Major version releases (requires testing)
- Peer dependency warnings (can cause issues)
- Breaking changes in changelogs

## Troubleshooting

### "peer dep warning" when installing
This usually means a package isn't compatible with another. Check the versions and update as needed.

### Build fails after update
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check changelogs for breaking changes
3. Run local dev server to test
4. Consult package documentation

### Version mismatch between apps
Run `npm run deps:check` to identify the issue, then update that specific package.

## Future Improvements

- [ ] Set up Dependabot for automated PRs
- [ ] Add pre-commit hooks to check for outdated deps
- [ ] Implement version pinning strategy
- [ ] Create dependency update checklist for CI/CD
- [ ] Add performance benchmarks after major updates

---

**Last Updated**: January 29, 2026
**Maintained By**: T.O.O.LS Inc Development Team
