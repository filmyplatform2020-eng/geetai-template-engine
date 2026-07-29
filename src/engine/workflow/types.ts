export type ProductStatus = "draft" | "ai_generated" | "review" | "approved" | "published" | "archived"

export interface WorkflowProduct {
  slug: string
  status: ProductStatus
  createdAt: number
  updatedAt: number
  reviewedBy?: string
  reviewedAt?: number
  publishedAt?: number
  notes?: string
}

export interface WorkflowStore {
  products: Record<string, WorkflowProduct>
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  severity: "error" | "warning"
}

export interface PublishResult {
  success: boolean
  error?: string
  backupPath?: string
  details?: ValidationResult
}
