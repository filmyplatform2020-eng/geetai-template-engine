import { GeminiEngine } from "./gemini"
import { generateProductFile, addToRegistry, countProducts } from "./template-generator"
import type { AiConfig } from "./types"

const DEFAULT_BATCHES: { name: string; brand: string; category?: string }[][] = [
  [
    { name: "Galaxy Book 5 Ultra", brand: "Samsung", category: "laptops" },
    { name: "ThinkPad X1 Fold 2", brand: "Lenovo", category: "laptops" },
    { name: "Pixel 11 Pro", brand: "Google", category: "phones" },
    { name: "OnePlus Open 2", brand: "OnePlus", category: "phones" },
    { name: "Nothing Ear 3", brand: "Nothing", category: "earbuds" },
  ],
  [
    { name: "Razer Blade 18", brand: "Razer", category: "laptops" },
    { name: "Surface Laptop 7", brand: "Microsoft", category: "laptops" },
    { name: "Xiaomi 16 Ultra", brand: "Xiaomi", category: "phones" },
    { name: "Garmin Fenix 9", brand: "Garmin", category: "wearables" },
    { name: "Bose QC Ultra Earbuds 2", brand: "Bose", category: "earbuds" },
  ],
  [
    { name: "Framework Laptop 17", brand: "Framework", category: "laptops" },
    { name: "ASUS ROG Phone 10", brand: "ASUS", category: "phones" },
    { name: "SteelSeries Arctis Nova 5", brand: "SteelSeries", category: "audio" },
    { name: "Oura Ring 5", brand: "Oura", category: "wearables" },
    { name: "DJI Mini 5 Pro", brand: "DJI", category: "drones" },
  ],
  [
    { name: "Canon EOS R6 Mark III", brand: "Canon", category: "cameras" },
    { name: "LG C6 OLED TV", brand: "LG", category: "monitors" },
    { name: "Pixel Watch 4", brand: "Google", category: "wearables" },
    { name: "Kobo Elipsa 3", brand: "Kobo", category: "ereaders" },
    { name: "Sonos Arc Ultra", brand: "Sonos", category: "speakers" },
  ],
  [
    { name: "Alienware 38 QD-OLED", brand: "Dell", category: "monitors" },
    { name: "Fujifilm X-T6", brand: "Fujifilm", category: "cameras" },
    { name: "Withings ScanWatch 4", brand: "Withings", category: "wearables" },
    { name: "Shokz OpenRun Pro 2", brand: "Shokz", category: "audio" },
    { name: "Nanoleaf Blocks", brand: "Nanoleaf", category: "accessories" },
  ],
]

export class AutonomousLoop {
  private gemini: GeminiEngine
  private targetCount: number
  private batchIndex: number
  private delayMs: number
  private running: boolean

  constructor(config: AiConfig, targetCount = 50, delayMs = 5000) {
    this.gemini = new GeminiEngine(config)
    this.targetCount = targetCount
    this.batchIndex = 0
    this.delayMs = delayMs
    this.running = false
  }

  async start(): Promise<void> {
    this.running = true
    console.log(`\n🚀 Starting autonomous template generation loop`)
    console.log(`   Target: ${this.targetCount} products`)
    console.log(`   Current: ${countProducts()} products\n`)

    let currentCount = countProducts()

    while (this.running && currentCount < this.targetCount) {
      const batch = this.getNextBatch()
      console.log(`\n📦 Batch ${this.batchIndex} (${currentCount}/${this.targetCount})`)

      for (const item of batch) {
        if (!this.running || countProducts() >= this.targetCount) break

        try {
          const product = await this.gemini.generateProduct(item.name, item.brand, item.category)
          const result = generateProductFile(product)

          if (result.success) {
            addToRegistry(product.slug)
            currentCount = countProducts()
            console.log(`   ✅ ${item.brand} ${item.name} → ${result.filePath}`)
          } else {
            if (result.error?.includes("already exists")) {
              console.log(`   ⏭️  ${item.brand} ${item.name} — already exists`)
            } else {
              console.error(`   ❌ ${item.brand} ${item.name}: ${result.error}`)
            }
          }
        } catch (e) {
          console.error(`   ❌ ${item.brand} ${item.name}: ${e instanceof Error ? e.message : e}`)
        }

        if (countProducts() < this.targetCount) {
          console.log(`   ⏳ Waiting ${this.delayMs / 1000}s before next...`)
          await this.sleep(this.delayMs)
        }
      }

      this.batchIndex++
      currentCount = countProducts()

      if (currentCount < this.targetCount) {
        console.log(`\n📊 Progress: ${currentCount}/${this.targetCount} products`)
        console.log(`⏳ Waiting ${this.delayMs / 1000}s before next batch...\n`)
        await this.sleep(this.delayMs)
      }
    }

    console.log(`\n🎉 Done! Generated ${countProducts()} products total.`)
    console.log(`📁 Files in: src/data/products/`)
    console.log(`🏗️  Run: npm run build\n`)
    this.running = false
  }

  stop(): void {
    this.running = false
    console.log("\n🛑 Loop stopped by user")
  }

  private getNextBatch() {
    return DEFAULT_BATCHES[this.batchIndex % DEFAULT_BATCHES.length].filter(() => countProducts() < this.targetCount)
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
  }
}
