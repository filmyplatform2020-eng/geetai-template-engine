import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const WORKFLOW_DIR = join(__dirname, "..", "src", "data", "workflow")
const PRODUCTS_DIR = join(__dirname, "..", "src", "data", "products")

function main() {
  if (!existsSync(WORKFLOW_DIR)) mkdirSync(WORKFLOW_DIR, { recursive: true })

  const existing = {}
  try {
    const existingData = JSON.parse(readFileSync(join(WORKFLOW_DIR, "products.json"), "utf-8"))
    Object.assign(existing, existingData.products || {})
  } catch {}

  const files = readdirSync(PRODUCTS_DIR).filter(
    (f) => f.endsWith(".ts") && !["index.ts", "registry.ts"].includes(f)
  )

  let created = 0
  for (const file of files) {
    const slug = file.replace(".ts", "")
    if (!existing[slug]) {
      existing[slug] = {
        slug,
        status: "published",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        publishedAt: Date.now(),
      }
      created++
    }
  }

  writeFileSync(
    join(WORKFLOW_DIR, "products.json"),
    JSON.stringify({ products: existing }, null, 2)
  )

  console.log(`Workflow initialized:`)
  console.log(`  ${created} products set to "published"`)
  console.log(`  ${Object.keys(existing).length} total products in workflow`)
}

main()
