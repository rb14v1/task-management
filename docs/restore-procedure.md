# Database Restore Procedure — Task-test-1

> **Test status:** This procedure must be tested at least once before go-live.
> Record the date and outcome in the table at the bottom of this document.

---

## Overview

Task-test-1 uses PostgreSQL 16.  Two complementary backup strategies are in place:

| Environment | Mechanism | Retention | Cross-region |
|-------------|-----------|-----------|--------------|
| Production (AWS RDS) | Automated RDS snapshots + PITR | 30 days | ✅ via `aws_db_instance_automated_backups_replication` |
| Local / Docker | `prodrigestivill/postgres-backup-local` daily dumps | 30 days (+ 4 weekly, 1 monthly) | Manual off-site copy |

---

## 1. Production restore — AWS RDS Point-in-Time Recovery (PITR)

PITR is enabled automatically on the `task-test-1-postgres` RDS instance because
`backup_retention_period = 30`.  You can restore to any second within the retention window.

### 1a. Console (recommended for first-time operators)

1. Open **AWS Console → RDS → Databases → task-test-1-postgres**.
2. Click **Actions → Restore to point in time**.
3. Select **Latest restorable time** or enter a custom UTC timestamp.
4. Choose a new DB identifier (e.g. `task-test-1-restored-YYYYMMDD`).
5. Keep all other settings identical to the source instance.
6. Click **Restore DB instance** and wait for status `Available` (~5–15 min).
7. Update the `DATABASE_URL` in the application's environment/secret to point to
   the new endpoint, then restart the application.

### 1b. AWS CLI

```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier task-test-1-postgres \
  --target-db-instance-identifier task-test-1-restored-$(date +%Y%m%d) \
  --restore-time 2026-09-28T03:00:00Z   # replace with target UTC timestamp
```

Wait for the instance to become available:

```bash
aws rds wait db-instance-available \
  --db-instance-identifier task-test-1-restored-$(date +%Y%m%d)
```

### 1c. Restore from cross-region replica backup

If the primary region is unavailable, automated backups are replicated to
`var.backup_region` via `aws_db_instance_automated_backups_replication`.

```bash
# List replicated backups in the backup region
aws rds describe-db-instance-automated-backups \
  --region <backup_region> \
  --query "AutomatedBackups[?DBInstanceIdentifier=='task-test-1-postgres']"

# Restore from the replicated backup
aws rds restore-db-instance-to-point-in-time \
  --region <backup_region> \
  --source-db-instance-automated-backups-arn <arn-from-above> \
  --target-db-instance-identifier task-test-1-dr-$(date +%Y%m%d) \
  --restore-time <ISO8601-timestamp>
```

---

## 2. Local / Docker restore from dump file

Daily dumps are stored in the `db-backups` Docker volume under `/backups/`.

### 2a. List available dumps

```bash
docker run --rm \
  -v task-test-1_db-backups:/backups \
  alpine ls -lh /backups/taskmanagement/
```

### 2b. Restore a specific dump

```bash
# Identify the dump file (e.g. taskmanagement-2026-09-28T03-00-00.sql.gz)
DUMP_FILE=taskmanagement-2026-09-28T03-00-00.sql.gz

# Restore into a running local db container
docker exec -i $(docker compose ps -q db) \
  psql -U taskmanagement taskmanagement < \
  <(docker run --rm -v task-test-1_db-backups:/backups alpine \
      sh -c "gunzip -c /backups/taskmanagement/${DUMP_FILE}")
```

---

## 3. Post-restore verification checklist

- [ ] Application starts and connects to the restored database successfully.
- [ ] Smoke-test: log in with a known user account.
- [ ] Verify recent records are present up to the chosen restore point.
- [ ] Confirm no orphaned foreign-key records (run any existing data-integrity scripts).
- [ ] Update monitoring/alerting to target the new DB endpoint (if changed).
- [ ] Decommission the old broken instance only after verification passes.

---

## 4. Restore test log

| Date | Tester | Restore type | Target timestamp | Outcome | Notes |
|------|--------|-------------|-----------------|---------|-------|
| — | — | — | — | Pending | Must complete before go-live |
