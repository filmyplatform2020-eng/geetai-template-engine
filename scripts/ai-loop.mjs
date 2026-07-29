#!/usr/bin/env node
import { GoogleGenerativeAI } from "@google/generative-ai"
import * as fs from "fs"
import * as path from "path"

const PRODUCTS_DIR = path.resolve("src/data/products")
const REGISTRY_FILE = path.resolve("src/data/products/registry.ts")

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error("❌ Set GEMINI_API_KEY env var")
  console.error("   export GEMINI_API_KEY=your-key")
  process.exit(1)
}

const TARGET = parseInt(process.argv[2] || "50", 10)
const DELAY = parseInt(process.argv[3] || "8000", 10)

const client = new GoogleGenerativeAI(API_KEY)

function countFiles() {
  return fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".ts") && !["index.ts", "registry.ts"].includes(f)).length
}

function importName(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function addToRegistry(slug) {
  const name = importName(slug)
  const imp = `import { ${name} } from "./${slug}"`
  const entry = `  [${name}.slug]: ${name},`
  let c = fs.readFileSync(REGISTRY_FILE, "utf-8")
  if (c.includes(entry.trim())) return false
  const li = c.lastIndexOf("\nimport {")
  const ip = c.indexOf("\n", li) + 1
  c = c.slice(0, ip) + imp + "\n" + c.slice(ip)
  const le = c.lastIndexOf("},")
  const ep = c.lastIndexOf("\n", le - 1) + 1
  c = c.slice(0, ep) + entry + "\n" + c.slice(ep)
  fs.writeFileSync(REGISTRY_FILE, c, "utf-8")
  return true
}

const SYSTEM_PROMPT = `You are an expert product review data generator.
Given a product name and brand, generate complete product review data as valid JSON.
Output ONLY valid JSON — no markdown, no code fences.

{
  "slug": "product-slug",
  "product": "Product Name", "brand": "Brand", "tagline": "One line hook",
  "description": "2-3 sentence description",
  "price": 999, "originalPrice": 1099, "currency": "$",
  "rating": 4.5, "reviewCount": 1200,
  "category": "laptops|phones|audio|wearables|gaming|cameras|monitors|ereaders|drones|speakers|tablets|earbuds|vr-headsets|accessories",
  "tags": ["tag1", "tag2"],
  "features": [{"title": "Name", "description": "Desc"}],
  "pros": [], "cons": [],
  "specifications": [{"label": "Name", "value": "Value", "category": "Cat"}],
  "reviews": [{"name": "Name", "rating": 5, "title": "Title", "content": "Body"}],
  "faq": [{"question": "Q?", "answer": "A."}],
  "comparison": {"with": "Rival", "items": [{"feature": "F", "this": "V", "other": "V"}]},
  "buyLinks": [{"store": "S", "url": "https://s.com", "price": 999, "currency": "$", "available": true, "badge": "Official"}],
  "alternatives": [{"name": "Alt", "description": "Desc", "rating": 4.3, "price": 899}],
  "accessories": [{"name": "Acc", "description": "Desc", "price": 49, "category": "Cat"}],
  "verdict": "2-3 sentence verdict.",
  "guideSections": [{"title": "Title", "content": "Content", "bullets": ["b1","b2"]}],
  "seo": {"title": "SEO Title", "description": "SEO Desc", "keywords": ["kw1"]}
}`

const BATCHES = [
  ["Galaxy Book 5 Ultra", "Samsung", "laptops"], ["ThinkPad X1 Fold 2", "Lenovo", "laptops"],
  ["Pixel 11 Pro", "Google", "phones"], ["OnePlus Open 2", "OnePlus", "phones"],
  ["Nothing Ear 3", "Nothing", "earbuds"],
  ["Razer Blade 18", "Razer", "laptops"], ["Surface Laptop 7", "Microsoft", "laptops"],
  ["Xiaomi 16 Ultra", "Xiaomi", "phones"], ["Garmin Fenix 9", "Garmin", "wearables"],
  ["Bose QC Ultra Earbuds 2", "Bose", "earbuds"],
  ["Framework Laptop 17", "Framework", "laptops"], ["ASUS ROG Phone 10", "ASUS", "phones"],
  ["SteelSeries Arctis Nova 5", "SteelSeries", "audio"], ["Oura Ring 5", "Oura", "wearables"],
  ["DJI Mini 5 Pro", "DJI", "drones"],
  ["Canon EOS R6 Mark III", "Canon", "cameras"], ["LG C6 OLED TV", "LG", "monitors"],
  ["Pixel Watch 4", "Google", "wearables"], ["Kobo Elipsa 3", "Kobo", "ereaders"],
  ["Sonos Arc Ultra", "Sonos", "speakers"],
  ["Alienware 38 QD-OLED", "Dell", "monitors"], ["Fujifilm X-T6", "Fujifilm", "cameras"],
  ["Withings ScanWatch 4", "Withings", "wearables"], ["Shokz OpenRun Pro 2", "Shokz", "audio"],
  ["Nanoleaf Blocks", "Nanoleaf", "accessories"],
]

async function generate(name, brand, category) {
  const prompt = `Generate product data for: ${brand} ${name}\nCategory: ${category}\nOutput ONLY valid JSON.`
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  })
  const r = await model.generateContent(prompt)
  const cleaned = r.response.text().replace(/```json\s*/i, "").replace(/```\s*$/, "").trim()
  return JSON.parse(cleaned)
}

function writeFile(product) {
  const slug = product.slug
  const fp = path.join(PRODUCTS_DIR, `${slug}.ts`)
  if (fs.existsSync(fp)) return { slug, error: "exists" }

  const name = importName(slug)
  const images = [
    { src: `/images/${slug}-front.jpg`, alt: `${product.product} front` },
    { src: `/images/${slug}-angle.jpg`, alt: `${product.product} angled` },
    { src: `/images/${slug}-back.jpg`, alt: `${product.product} back` },
  ]

  const ci = (product.comparison?.items || []).map((i) => {
    const o = { feature: i.feature, this: i.this, other: i.other }
    if (i.winner === "this" || i.winner === "other") o.winner = i.winner
    return o
  })

  const rdates = ["2025-12-10", "2025-11-20", "2025-10-30", "2025-12-01", "2025-11-15"]
  const revs = (product.reviews || []).map((r, idx) => ({
    id: `r${idx}`,
    name: r.name, rating: r.rating, title: r.title, content: r.content,
    date: rdates[idx % rdates.length], verified: true,
  }))

  const data = {
    slug, product: product.product, brand: product.brand,
    tagline: product.tagline, description: product.description,
    price: product.price, originalPrice: product.originalPrice, currency: product.currency,
    rating: product.rating, reviewCount: product.reviewCount,
    images, features: product.features || [],
    pros: product.pros || [], cons: product.cons || [],
    specifications: product.specifications || [],
    reviews: revs, faq: product.faq || [],
    comparison: { with: product.comparison?.with || "", items: ci },
    buyLinks: product.buyLinks || [],
    category: product.category || "laptops", tags: product.tags || [],
    videoUrl: `https://www.youtube.com/watch?v=example-${slug}`,
    alternatives: product.alternatives || [],
    accessories: product.accessories || [],
    verdict: product.verdict || "",
    guide: { sections: product.guideSections || [] },
    seo: product.seo || { title: "", description: "", keywords: [] },
  }

  const json = JSON.stringify(data, null, 2).replace(/"(\w+)":/g, "$1:")
  fs.writeFileSync(fp, `import type { Product } from "@/engine/product/types"\n\nexport const ${name}: Product = ${json}\n`)
  return { slug, file: fp }
}

async function main() {
  console.log(`\n🚀 Autonomous Template Generator`)
  console.log(`   Target: ${TARGET} products`)
  console.log(`   Current: ${countFiles()} products\n`)

  let idx = 0
  while (countFiles() < TARGET) {
    const batch = BATCHES
    const item = batch[idx % batch.length]
    const [name, brand, category] = item
    const count = countFiles()

    console.log(`[${count}/${TARGET}] ${brand} ${name}...`)

    try {
      const product = await generate(name, brand, category)
      const result = writeFile(product)

      if (result.error === "exists") {
        console.log(`   ⏭️  Already exists`)
      } else {
        addToRegistry(product.slug)
        console.log(`   ✅ ${result.file}`)
      }
    } catch (e) {
      console.error(`   ❌ ${e.message}`)
    }

    if (countFiles() < TARGET) {
      console.log(`   ⏳ ${DELAY / 1000}s delay...\n`)
      await new Promise((r) => setTimeout(r, DELAY))
    }
    idx++
  }

  console.log(`\n🎉 Done! ${countFiles()} products total.`)
  console.log(`🏗️  Run: npm run build\n`)
}

main().catch(console.error)
