import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs"
import { join } from "path"
import type { Product } from "@/engine/product/types"
import type { PublishResult } from "./types"
import { updateWorkflowStatus } from "./store"
import { validateProduct } from "./validate"

const PRODUCTS_DIR = join(process.cwd(), "src", "data", "products")
const BACKUPS_DIR = join(process.cwd(), "src", "data", "backups")
const REGISTRY_PATH = join(PRODUCTS_DIR, "registry.ts")

function ensureBackupDir(): void {
  if (!existsSync(BACKUPS_DIR)) mkdirSync(BACKUPS_DIR, { recursive: true })
}

function createBackup(slug: string): string {
  ensureBackupDir()
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupDir = join(BACKUPS_DIR, `${slug}-${timestamp}`)
  mkdirSync(backupDir, { recursive: true })

  // Backup the product file
  const productPath = join(PRODUCTS_DIR, `${slug}.ts`)
  if (existsSync(productPath)) {
    copyFileSync(productPath, join(backupDir, `${slug}.ts`))
  }

  // Backup the registry
  if (existsSync(REGISTRY_PATH)) {
    copyFileSync(REGISTRY_PATH, join(backupDir, "registry.ts"))
  }

  return backupDir
}

function slugToConst(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9]/g, "_").replace(/^_|_$/g, "")
}

function generateProductFile(slug: string, data: Product): string {
  const constName = slugToConst(slug)
  return `import type { Product } from "@/engine/product/types"

export const ${constName}: Product = ${JSON.stringify(data, null, 2)}
`
}

function addToRegistry(slug: string): boolean {
  const constName = slugToConst(slug)
  const importLine = `import { ${constName} } from "./${slug}"`
  const entryLine = `  [${constName}.slug]: ${constName},`

  let registry = ""
  try {
    registry = readFileSync(REGISTRY_PATH, "utf-8")
  } catch {
    return false
  }

  // Check if already registered
  if (registry.includes(entryLine.trim())) return true

  // Add import after the last import
  const importEnd = registry.lastIndexOf("import ")
  const afterLastImport = registry.indexOf("\n", registry.indexOf("\n", importEnd) + 1)
  registry = registry.slice(0, afterLastImport) + "\n" + importLine + registry.slice(afterLastImport)

  // Add entry before the closing brace
  const closeBrace = registry.lastIndexOf("}")
  if (closeBrace === -1) return false
  registry = registry.slice(0, closeBrace) + ",\n" + entryLine + "\n" + registry.slice(closeBrace)

  writeFileSync(REGISTRY_PATH, registry)
  return true
}

export async function publishProduct(slug: string, data: Product, reviewer?: string): Promise<PublishResult> {
  // Validate
  const validation = validateProduct(data)
  if (!validation.valid) {
    return {
      success: false,
      error: "Validation failed. Fix errors before publishing.",
      details: validation,
    }
  }

  try {
    // Create backup
    const backupPath = createBackup(slug)

    // Write product file
    const productPath = join(PRODUCTS_DIR, `${slug}.ts`)
    writeFileSync(productPath, generateProductFile(slug, data))

    // Add to registry
    addToRegistry(slug)

    // Update workflow status
    updateWorkflowStatus(slug, "published", reviewer)

    return {
      success: true,
      backupPath,
      details: validation,
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error during publish"
    return {
      success: false,
      error: message,
    }
  }
}
