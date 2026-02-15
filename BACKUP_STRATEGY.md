# Operational Security & Backup Strategy

## Database Backups

### Supabase Automated Backups
- **Frequency**: Daily at 2 AM UTC
- **Retention**: 30 days (Pro plan)
- **Location**: AWS S3 (managed by Supabase)
- **Status**: ✅ Enabled by default

**Enable in Supabase Dashboard:**
1. Go to Project Settings → Backup
2. Configure automated daily backup schedule
3. Set retention policy (default: 30 days)

### Manual Backup Procedure
```bash
# Export database
pg_dump "postgresql://user:password@db-host:5432/database" > backup.sql

# Upload to Azure Blob Storage
az storage blob upload --account-name <storage> --container-name backups --name backup-$(date +%s).sql --file backup.sql
```

### Restore Procedure
```bash
# Download backup
az storage blob download --account-name <storage> --container-name backups --name backup-XXX.sql --file restore.sql

# Restore database
psql "postgresql://user:password@db-host:5432/database" < restore.sql
```

---

## Application Code Backups

### GitHub Repository
- **Primary**: All code backed up in GitHub
- **Frequency**: Per commit
- **Retention**: Unlimited
- **Protection**: Branch protection rules on `main`

### Azure Static Web Apps Backups
- **Frequency**: Automatic on deployment
- **Location**: Azure Blob Storage
- **Retention**: 30 days
- **Recovery**: Instant rollback via Azure Portal

---

## Secrets & Configuration Backups

### Environment Variables
- **Location**: Azure Key Vault
- **Backup**: Managed by Azure (geo-redundant)
- **Access**: Role-based (IAM)

### Enable Key Vault Backup
```bash
# Create backup
az keyvault backup start --vault-name <vault-name> --backup-blob-container-uri <sas-uri>

# Monitor backup
az keyvault backup restore --vault-name <vault-name> --blob-container-uri <uri>
```

---

## Monitoring & Alerting

### Backup Health Checks
- Daily backup validation logs
- Alert if backup fails (via Email/SMS)
- Automated retry on failure

### Configure Alerts (Azure Monitor)
1. Create Action Group for notifications
2. Set alert rule for backup failures
3. Link to Azure DevOps Work Items

---

## Disaster Recovery Plan

### RTO/RPO Targets
- **RTO** (Recovery Time Objective): < 1 hour
- **RPO** (Recovery Point Objective): < 1 day

### Failover Procedure
1. Detect outage via health checks
2. Activate secondary region (if configured)
3. Restore from latest backup
4. Validate data integrity
5. Switch DNS to new endpoint
6. Monitor for 24 hours

### Testing
- Monthly backup restoration test
- Quarterly full DR simulation
- Document all runbooks

---

## Compliance

### GDPR/CCPA Data Retention
- User data: Retained per privacy policy
- Backups: Retained up to 30 days
- Old backups automatically deleted
- Data deletion requests: Honored within 30 days

### Audit Trail
- All backups logged in audit tables
- Access logged and monitored
- Retention compliance reported weekly

---

## Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Supabase Pro Backups | $25/month | Automatic |
| Azure Blob Storage (1TB) | ~$15/month | Pay-as-used |
| Key Vault | $0.6 per operation | On-demand |
| **Total** | **~$40/month** | - |

---

## Next Steps

- [ ] Enable automated Supabase backups
- [ ] Configure Azure Key Vault backup
- [ ] Setup backup health monitoring
- [ ] Test restore procedure
- [ ] Document runbooks in Wiki
- [ ] Schedule monthly restore tests
- [ ] Brief team on outage procedures

**Last Review**: February 14, 2026
**Next Review**: August 14, 2026
