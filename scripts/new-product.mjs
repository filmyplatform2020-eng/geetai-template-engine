#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, "../src/data/products")

function prompt(q) {
  return new Promise((r) => {
    process.stdout.write(q)
    process.stdin.once("data", (d) => r(d.toString().trim()))
  })
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function main() {
  const name = await prompt("Product name: ")
  const brand = await prompt("Brand: ")
  const tagline = await prompt("Tagline: ")
  const description = await prompt("Description (short): ")
  const price = parseFloat(await prompt("Price: "))
  const category = await prompt("Category (laptops/phones/audio/watches/cameras/fragrance/health/finance): ") || "laptops"
  const currency = await prompt("Currency ($/€/£): ") || "$"

  const slug = slugify(`${brand}-${name}`)
  const filename = `${slug}.ts`
  const filepath = path.join(dataDir, filename)

  if (fs.existsSync(filepath)) {
    console.error(`File already exists: ${filename}`)
    process.exit(1)
  }

  const rating = 4.5
  const reviewCount = 0

  const content = `import type { Product } from "@/engine/product/types"

export const ${slug.replace(/-/g, "_")}: Product = {
  slug: "${slug}",
  product: "${name}",
  brand: "${brand}",
  tagline: "${tagline}",
  description: "${description}",
  price: ${price},
  currency: "${currency}",
  rating: ${rating},
  reviewCount: ${reviewCount},
  images: [
    { src: "/images/${slug}-1.jpg", alt: "${name} - Front view" },
    { src: "/images/${slug}-2.jpg", alt: "${name} - Side view" },
    { src: "/images/${slug}-3.jpg", alt: "${name} - Detail view" },
  ],
  features: [],
  pros: [],
  cons: [],
  specifications: [],
  reviews: [],
  faq: [],
  comparison: { with: "", items: [] },
  buyLinks: [],
  category: "${category}",
  tags: ["${brand.toLowerCase()}", "${category}"],
  alternatives: [],
  accessories: [],
  verdict: "",
  guide: { sections: [] },
  seo: {
    title: "${name} ${brand} Review | GeetAI",
    description: "${description.slice(0, 155)}",
    keywords: ["${name}", "${brand}", "review", "${category}"],
  },
}
`

  fs.writeFileSync(filepath, content)

  // Register in index.ts
  const indexPath = path.join(dataDir, "index.ts")
  let index = fs.readFileSync(indexPath, "utf-8")
  const importLine = `import { ${slug.replace(/-/g, "_")} } from "./${slug}"`
  const registryLine = `  [${slug.replace(/-/g, "_")}.slug]: ${slug.replace(/-/g, "_")},`

  if (!index.includes(slug)) {
    const lastImport = index.lastIndexOf("import")
    const afterLastImport = index.indexOf("\n", index.indexOf("\n", lastImport) + 1)
    index = index.slice(0, afterLastImport) + "\n" + importLine + index.slice(afterLastImport)

    const bracketPos = index.lastIndexOf("}")
    const beforeBracket = index.slice(0, bracketPos)
    const afterBracket = index.slice(bracketPos)
    if (!beforeBracket.trim().endsWith(",")) {
      index = beforeBracket.trimEnd() + "\n" + registryLine + "\n" + afterBracket
    } else {
      index = beforeBracket + "\n" + registryLine + "\n" + afterBracket
    }

    fs.writeFileSync(indexPath, index)
  }

  console.log(`\nCreated: ${filename}`)
  console.log(`Slug: ${slug}`)
  console.log(`Registered in src/data/products/index.ts`)
}

main().catch(console.error)
