variable "tenant_id" {
  description = "Tenant identifier used for cost allocation and incident attribution."
  type        = string
}

variable "submission_id" {
  description = "Submission identifier used for cost allocation and incident attribution."
  type        = string
}

variable "cost_centre" {
  description = "Cost centre code used for automated governance and charge-back."
  type        = string
}

# ── Region ────────────────────────────────────────────────────────────────────

variable "primary_region" {
  description = "AWS region where the primary RDS instance is deployed."
  type        = string
}

variable "backup_region" {
  description = "AWS region where automated RDS backups are replicated (must differ from primary_region)."
  type        = string
}

# ── Database ──────────────────────────────────────────────────────────────────

variable "db_password" {
  description = "Master password for the RDS PostgreSQL instance. Store this in a secrets manager; never commit a real value."
  type        = string
  sensitive   = true
}

variable "db_subnet_ids" {
  description = "List of subnet IDs (in at least two AZs) for the RDS DB subnet group."
  type        = list(string)
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.medium"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for the RDS instance (GiB)."
  type        = number
  default     = 20
}
