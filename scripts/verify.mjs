#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"
import { execSync } from "child_process"

const ROOT = path.resolve(process.argv[2] || ".")
const PRODUCTS_DIR = path.join(ROOT, "src/data/products")
const IMAGES_DIR = path.join(ROOT, "public/images")

const results = []

function check(label, ok, detail = "") {
  results.push({ label, ok, detail })
  console.log(`  ${ok ? "✅" : "❌"} ${label}${detail ? ` — ${detail}` : ""}`)
}

function findProductFiles() {
  return fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".ts") && !["index.ts", "registry.ts"].includes(f))
}

function extractSimpleFields(content) {
  const fields = {}
  const patterns = [
    ["slug", /slug:\s*"([^"]+)"/],
    ["product", /product:\s*"([^"]+?)"(?:,|\s*\/\/)/],
    ["brand", /brand:\s*"([^"]+)"/],
    ["price", /price:\s*(\d+)/],
    ["rating", /rating:\s*([\d.]+)/],
    ["reviewCount", /reviewCount:\s*(\d+)/],
    ["category", /category:\s*"([^"]+)"/],
    ["seoTitle", /seo:\s*\{[\s\S]*?title:\s*"([^"]+)"/],
    ["seoDesc", /seo:\s*\{[\s\S]*?description:\s*"([^"]+)"/],
    ["verdict", /verdict:\s*"([^"]+?)"(?:,|\s*\n)/],
    ["images", /images:\s*\[([\s\S]*?)\]/],
    ["buyLinks", /buyLinks:\s*\[([\s\S]*?)\]/],
    ["features", /features:\s*\[([\s\S]*?)\]/],
    ["pros", /pros:\s*\[([\s\S]*?)\]/],
    ["cons", /cons:\s*\[([\s\S]*?)\]/],
    ["specs", /specifications:\s*\[([\s\S]*?)\]/],
    ["reviews", /reviews:\s*\[([\s\S]*?)\]/],
    ["faq", /faq:\s*\[([\s\S]*?)\]/],
  ]

  for (const [key, regex] of patterns) {
    const match = content.match(regex)
    if (match) fields[key] = match[1]
  }

  return fields
}

function countArray(content, arrayName) {
  const match = content.match(new RegExp(`${arrayName}:\\s*\\[([\\s\\S]*?)\\]`))
  if (!match) return 0
  const items = match[1].match(/\{\s*\w/g)
  return items ? items.length : 0
}

function extractImageSrcs(content) {
  const srcs = []
  const regex = /src:\s*"([^"]+)"/g
  let match
  while ((match = regex.exec(content)) !== null) {
    srcs.push(match[1])
  }
  return srcs
}

function extractBuyLinks(content) {
  const links = []
  const blockMatch = content.match(/buyLinks:\s*\[([\s\S]*?)\]/)
  if (!blockMatch) return links

  const itemRegex = /\{\s*store:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"[\s\S]*?\}/g
  let match
  while ((match = itemRegex.exec(blockMatch[1])) !== null) {
    links.push({ store: match[1], url: match[2] })
  }
  return links
}

function main() {
  const productFiles = findProductFiles()
  const filterSlug = process.argv[3]

  const files = filterSlug
    ? productFiles.filter((f) => f === `${filterSlug}.ts`)
    : productFiles

  if (!files.length) {
    console.log(`No product files found${filterSlug ? ` for slug: ${filterSlug}` : ""}`)
    process.exit(1)
  }

  console.log(`\n🔍 VERIFICATION REPORT`)
  console.log(`   Products: ${files.length} file(s)`)
  console.log()

  let allPassed = true

  for (const file of files) {
    const filePath = path.join(PRODUCTS_DIR, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const slug = path.basename(file, ".ts")
    const fields = extractSimpleFields(content)

    console.log(`\n── ${slug} ──`)

    check("File readable", true)
    check("Product name", !!fields.product, fields.product || "missing")
    check("Brand", !!fields.brand, fields.brand || "missing")
    check("Price > 0", Number(fields.price) > 0, `${fields.price || 0}`)
    check("Rating 0-5", Number(fields.rating) > 0 && Number(fields.rating) <= 5, fields.rating || "missing")
    check("SEO title", !!fields.seoTitle)
    check("SEO description", !!fields.seoDesc)
    check("Verdict present", !!fields.verdict)

    const imageSrcs = extractImageSrcs(content)
    check("Images defined", imageSrcs.length > 0, `${imageSrcs.length} image(s)`)

    for (const src of imageSrcs) {
      const imgPath = path.join(IMAGES_DIR, path.basename(src))
      check(`Image: ${src}`, fs.existsSync(imgPath), fs.existsSync(imgPath) ? `${fs.statSync(imgPath).size} bytes` : "not found")
    }

    const links = extractBuyLinks(content)
    check("Buy links exist", links.length > 0, `${links.length} link(s)`)

    for (const bl of links) {
      const isPlaceholder = bl.url === "#" || bl.url.startsWith("https://example") || bl.url.startsWith("http://example")
      check(`Valid URL: ${bl.store}`, !isPlaceholder, isPlaceholder ? "placeholder" : bl.url.slice(0, 60))
    }

    const linkCount = countArray(content, "pros")
    check("Pros/Cons", linkCount > 0)

    const featCount = countArray(content, "features")
    check("Features", featCount >= 4, `${featCount} items`)

    const specCount = countArray(content, "specifications")
    check("Specifications", specCount >= 8, `${specCount} items`)

    const revCount = countArray(content, "reviews")
    check("Reviews", revCount >= 3, `${revCount} items`)

    const faqCount = countArray(content, "faq")
    check("FAQ", faqCount >= 3, `${faqCount} items`)
  }

  console.log(`\n── SYSTEM CHECKS ──`)

  try {
    execSync("npm test", { cwd: ROOT, stdio: "pipe", timeout: 60000 })
    check("Tests pass", true)
  } catch {
    check("Tests pass", false)
    allPassed = false
  }

  try {
    execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe", timeout: 60000 })
    check("Typecheck passes", true)
  } catch {
    check("Typecheck passes", false)
    allPassed = false
  }

  try {
    const output = execSync("npm run build 2>&1", { cwd: ROOT, stdio: "pipe", timeout: 300000 }).toString()
    const hasPages = output.includes("/review/") || output.includes("/guide/")
    check("Build succeeds", true)
    check("Pages generated", hasPages)
  } catch {
    check("Build succeeds", false)
    allPassed = false
  }

  console.log()
  console.log(`── SUMMARY ──`)
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📊 Score: ${Math.round((passed / results.length) * 100)}%`)
  console.log()

  if (!allPassed) {
    process.exit(1)
  }
}

main()
