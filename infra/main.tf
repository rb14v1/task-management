terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# default_tags propagates tenantId, submissionId, and costCentre to every AWS
# resource managed by this configuration, satisfying finops.resources_tagged.
provider "aws" {
  region = var.primary_region

  default_tags {
    tags = {
      tenantId     = var.tenant_id
      submissionId = var.submission_id
      costCentre   = var.cost_centre
    }
  }
}

# Secondary provider used solely for cross-region backup replication.
provider "aws" {
  alias  = "backup_region"
  region = var.backup_region

  default_tags {
    tags = {
      tenantId     = var.tenant_id
      submissionId = var.submission_id
      costCentre   = var.cost_centre
    }
  }
}

# ── RDS PostgreSQL ─────────────────────────────────────────────────────────────

resource "aws_db_subnet_group" "main" {
  name        = "task-test-1-db-subnet-group"
  subnet_ids  = var.db_subnet_ids
  description = "Subnet group for the Task-test-1 RDS instance."
}

resource "aws_db_instance" "main" {
  identifier        = "task-test-1-postgres"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_encrypted = true

  db_name  = "taskmanagement"
  username = "taskmanagement"
  password = var.db_password

  db_subnet_group_name = aws_db_subnet_group.main.name
  multi_az             = true

  # ── Backup & PITR ────────────────────────────────────────────────────────────
  # backup_retention_period > 0 enables both automated daily snapshots and
  # point-in-time recovery (PITR) for the RDS engine.
  backup_retention_period = 30        # 30-day minimum retention
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:30-Mon:05:30"

  # Retain a final snapshot when the instance is destroyed.
  skip_final_snapshot       = false
  final_snapshot_identifier = "task-test-1-final-snapshot"

  deletion_protection = true
}

# ── Cross-region backup replication ──────────────────────────────────────────
# Replicates automated backups to a separate AWS region, satisfying the
# requirement that backups are stored outside the primary region/account.
resource "aws_db_instance_automated_backups_replication" "main" {
  source_db_instance_arn = aws_db_instance.main.arn
  retention_period       = 30

  provider = aws.backup_region
}
