import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AiConfig, GeneratedProduct } from "./types"
import { PRODUCT_SYSTEM_PROMPT, getCategoryPrompt } from "./prompts"

export class GeminiEngine {
  private client: GoogleGenerativeAI
  private model: string

  constructor(config: AiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model ?? "gemini-2.5-flash"
  }

  async generateProduct(productName: string, brand: string, category?: string): Promise<GeneratedProduct> {
    const catHint = category ? `Category: ${category}\n${getCategoryPrompt(category)}` : ""
    const prompt = `Generate complete product review data for: ${brand} ${productName}\n${catHint}\n\nGenerate realistic, detailed product data with accurate specs, pricing, and reviews. Output ONLY valid JSON.`

    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: PRODUCT_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json\s*/i, "").replace(/```\s*$/, "").trim()
    return JSON.parse(cleaned) as GeneratedProduct
  }

  async generateProductBatch(products: { name: string; brand: string; category?: string }[]): Promise<GeneratedProduct[]> {
    const results: GeneratedProduct[] = []
    for (const p of products) {
      try {
        const result = await this.generateProduct(p.name, p.brand, p.category)
        results.push(result)
        console.log(`  ✓ ${p.brand} ${p.name} → ${result.slug}`)
      } catch (e) {
        console.error(`  ✗ ${p.brand} ${p.name}: ${e instanceof Error ? e.message : e}`)
      }
    }
    return results
  }
}
