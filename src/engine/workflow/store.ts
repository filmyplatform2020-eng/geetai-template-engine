import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"
import type { WorkflowStore, WorkflowProduct, ProductStatus } from "./types"

const DATA_DIR = join(process.cwd(), "src", "data", "workflow")
const STORE_PATH = join(DATA_DIR, "products.json")

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readStore(): WorkflowStore {
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8"))
  } catch {
    return { products: {} }
  }
}

function writeStore(store: WorkflowStore): void {
  ensureDir()
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

export function getWorkflowProduct(slug: string): WorkflowProduct | undefined {
  return readStore().products[slug]
}

export function getAllWorkflowProducts(): WorkflowProduct[] {
  return Object.values(readStore().products)
}

export function getProductsByStatus(status: ProductStatus): WorkflowProduct[] {
  return getAllWorkflowProducts().filter((p) => p.status === status)
}

export function createWorkflowProduct(slug: string, initialStatus: ProductStatus = "draft"): WorkflowProduct {
  const store = readStore()
  const now = Date.now()
  const product: WorkflowProduct = {
    slug,
    status: initialStatus,
    createdAt: now,
    updatedAt: now,
  }
  store.products[slug] = product
  writeStore(store)
  return product
}

export function updateWorkflowStatus(slug: string, status: ProductStatus, reviewer?: string): WorkflowProduct | null {
  const store = readStore()
  const product = store.products[slug]
  if (!product) return null

  product.status = status
  product.updatedAt = Date.now()
  if (reviewer) {
    product.reviewedBy = reviewer
    product.reviewedAt = Date.now()
  }
  if (status === "published") product.publishedAt = Date.now()
  writeStore(store)
  return product
}

export function productExists(slug: string): boolean {
  return slug in readStore().products
}
