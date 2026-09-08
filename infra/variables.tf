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
