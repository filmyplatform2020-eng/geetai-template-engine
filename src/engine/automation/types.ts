export type ProductInputMethod = "url" | "json" | "ai"

export interface URLSource {
  type: "url"
  url: string
}

export interface JSONSource {
  type: "json"
  data: Record<string, unknown>
}

export interface AISource {
  type: "ai"
  productName: string
  brand: string
  category: string
}

export type ProductSource = URLSource | JSONSource | AISource

export interface ScrapedData {
  productName: string
  brand: string
  price: number
  currency: string
  description: string
  images: string[]
  category?: string
  rating?: number
  reviewCount?: number
  url: string
}

export interface PipelineConfig {
  downloadImages: boolean
  enrichWithAI: boolean
  skipExisting: boolean
  runBuild: boolean
}

export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  downloadImages: true,
  enrichWithAI: true,
  skipExisting: true,
  runBuild: false,
}

export interface PipelineResult {
  slug: string
  productName: string
  success: boolean
  filePath?: string
  pages?: string[]
  error?: string
  warnings: string[]
}
