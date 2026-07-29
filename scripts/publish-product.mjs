#!/usr/bin/env node

const API_KEY = process.env.GEMINI_API_KEY

const HELP = `
Usage:
  npm run publish -- <url|json|ai> [options]

Modes:
  npm run publish -- https://amazon.in/dp/B0XXX       Extract from URL
  npm run publish -- '{"name":"...","price":999}'      From JSON
  npm run publish:ai "Product Name" Brand category     From AI generation only

Options:
  --no-images       Skip image download
  --no-enrich       Skip AI enrichment
  --build           Run npm build after generation
  --help            Show this help
`

const args = process.argv.slice(2)
if (args.includes("--help") || !args.length) {
  console.log(HELP)
  process.exit(0)
}

const config = { downloadImages: true, enrichWithAI: true, skipExisting: true, runBuild: false }
const filtered = args.filter((a) => {
  if (a === "--no-images") { config.downloadImages = false; return false }
  if (a === "--no-enrich") { config.enrichWithAI = false; return false }
  if (a === "--build") { config.runBuild = true; return false }
  return true
})

const raw = filtered.join(" ")

async function main() {
  const { ProductPipeline } = await import("../src/engine/automation/pipeline.ts")

  let source

  if (raw.startsWith("{") || raw.startsWith("[")) {
    source = { type: "json", data: JSON.parse(raw) }
  } else if (raw.startsWith("http://") || raw.startsWith("https://")) {
    source = { type: "url", url: raw }
  } else {
    const parts = raw.split(" ")
    const category = parts.pop()
    const brand = parts.pop()
    const name = parts.join(" ")
    source = { type: "ai", productName: name, brand: brand || "Unknown", category: category || "laptops" }
  }

  console.log(`\n🔧 Input mode: ${source.type}`)
  if (source.type === "url") console.log(`   URL: ${source.url}`)
  if (source.type === "json") console.log(`   JSON data provided`)
  if (source.type === "ai") console.log(`   ${source.brand} ${source.productName} [${source.category}]`)

  const pipeline = new ProductPipeline(config, API_KEY)

  console.log(`\n🚀 Running pipeline...`)
  const result = await pipeline.run(source)

  console.log()
  if (result.success) {
    console.log(`✅ SUCCESS: ${result.productName}`)
    console.log(`   File: ${result.filePath || "N/A"}`)
    if (result.pages?.length) console.log(`   Pages: ${result.pages.length} generated`)
  } else {
    console.log(`❌ FAILED: ${result.error}`)
  }

  if (result.warnings.length) {
    console.log(`\n⚠️  Warnings:`)
    for (const w of result.warnings) console.log(`   • ${w}`)
  }

  console.log(`\n📁 Run 'npm run build' to generate pages.`)
}

main().catch((e) => {
  console.error(`\n❌ Pipeline error:`, e.message)
  process.exit(1)
})
