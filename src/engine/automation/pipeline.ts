import { GeminiEngine } from "@/engine/ai"
import { generateProductFile, addToRegistry } from "@/engine/ai/template-generator"
import { detectDesign } from "@/engine/design/ai"
import { extractProduct } from "./extractor"
import { enrichProduct } from "./enricher"
import { validateGeneratedProduct, validateProduct } from "./validator"
import { downloadProductImages } from "./images"
import { runBuild } from "./publisher"
import type { ProductSource, PipelineConfig, PipelineResult, ScrapedData } from "./types"
import { DEFAULT_PIPELINE_CONFIG } from "./types"

export class ProductPipeline {
  private gemini?: GeminiEngine
  private config: PipelineConfig

  constructor(config: Partial<PipelineConfig> = {}, apiKey?: string) {
    this.config = { ...DEFAULT_PIPELINE_CONFIG, ...config }
    if (apiKey) {
      this.gemini = new GeminiEngine({ apiKey })
    }
  }

  async run(source: ProductSource): Promise<PipelineResult> {
    const warnings: string[] = []

    // 1. Extract
    const extracted = await extractProduct(source)
    if (extracted.error || !extracted.data) {
      return { slug: "", productName: "", success: false, error: extracted.error || "Extraction returned no data", warnings }
    }

    // 2. Detect design (template + theme)
    const design = detectDesign(extracted.data.category || "laptops")
    warnings.push(`Assigned template: ${design.template.id}, theme: ${design.theme}`)

    // 3. Enrich with AI
    const enriched = await enrichProduct(extracted.data, this.gemini)
    warnings.push(...enriched.warnings)
    if (enriched.error) {
      return { slug: "", productName: extracted.data.productName, success: false, error: enriched.error, warnings }
    }
    if (!enriched.product) {
      return { slug: "", productName: extracted.data.productName, success: false, error: "Enrichment produced no product", warnings }
    }

    // 4. Validate
    const validation = validateGeneratedProduct(enriched.product)
    if (!validation.valid) {
      const errors = validation.issues.filter((i) => i.severity === "error").map((i) => `${i.field}: ${i.message}`)
      return {
        slug: enriched.product.slug,
        productName: enriched.product.product,
        success: false,
        error: `Validation failed: ${errors.join("; ")}`,
        warnings,
      }
    }

    // 5. Download images
    if (this.config.downloadImages) {
      const imgResult = await downloadProductImages(enriched.product.slug, extracted.data)
      enriched.product.buyLinks = enriched.product.buyLinks || []
      if (imgResult.images.length > 0 && (!enriched.product.buyLinks[0]?.url || enriched.product.buyLinks[0].url === "")) {
        enriched.product.buyLinks[0] = {
          ...enriched.product.buyLinks[0],
          store: "Amazon",
          url: extracted.data.url,
          price: extracted.data.price,
          currency: extracted.data.currency,
          available: true,
          badge: "Best Price",
        }
      }
      warnings.push(...imgResult.errors.map((e) => `Image error: ${e}`))
      if (imgResult.images.length) {
        warnings.push(`Downloaded ${imgResult.images.length} images`)
      }
    }

    // 6. Generate file
    const writeResult = generateProductFile(enriched.product)
    if (!writeResult.success) {
      return {
        slug: enriched.product.slug,
        productName: enriched.product.product,
        success: false,
        error: writeResult.error || "File generation failed",
        warnings,
      }
    }

    // 7. Register
    try {
      addToRegistry(enriched.product.slug)
      warnings.push(`Registered in registry`)
    } catch {
      warnings.push(`Warning: could not auto-register in registry.ts`)
    }

    // 8. Optional: build
    let pages: string[] | undefined
    if (this.config.runBuild) {
      const buildResult = runBuild()
      pages = buildResult.pages
      if (!buildResult.success) {
        warnings.push(`Build had issues: ${buildResult.error}`)
      } else {
        warnings.push(`Build passed, ${pages?.length || 0} pages generated`)
      }
    }

    return {
      slug: enriched.product.slug,
      productName: enriched.product.product,
      success: true,
      filePath: writeResult.filePath,
      pages,
      warnings,
    }
  }
}

export { extractProduct } from "./extractor"
export { enrichProduct } from "./enricher"
export { validateGeneratedProduct, validateProduct } from "./validator"
export { downloadProductImages } from "./images"
export { runBuild } from "./publisher"
