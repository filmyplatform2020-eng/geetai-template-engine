export type AIProvider = "openai" | "replicate" | "stability" | "midjourney" | "custom"

export interface AIImageRequest {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  style?: string
  provider?: AIProvider
}

export interface AIImageResult {
  url: string
  provider: AIProvider
  prompt: string
}

export interface AssetPrompt {
  type: AssetType
  label: string
  prompt: string
  width: number
  height: number
  style: string
}

export type AssetType =
  | "hero"
  | "gallery"
  | "lifestyle"
  | "background"
  | "pinterest"
  | "opengraph"
  | "youtube_thumbnail"
  | "instagram_post"
  | "story_cover"
