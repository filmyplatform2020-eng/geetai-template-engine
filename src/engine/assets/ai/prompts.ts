import type { Product } from "@/engine/product/types"
import type { AssetPrompt, AssetType } from "./types"

const STYLE_MAP: Record<string, string> = {
  laptops: "sleek, minimalist, tech editorial",
  phones: "glossy, premium, studio lighting",
  watches: "luxury, macro detail, dramatic shadows",
  cameras: "sharp, technical, gear photography",
  fragrance: "elegant, soft lighting, editorial",
  audio: "dark, moody, neon accents",
  health: "clean, bright, wellness aesthetic",
  finance: "corporate, clean, blue tones",
}

const DIMENSIONS: Record<AssetType, { w: number; h: number; style: string }> = {
  hero: { w: 1920, h: 1080, style: "wide angle, cinematic lighting, product photography" },
  gallery: { w: 1200, h: 1200, style: "studio photography, clean background, detailed" },
  lifestyle: { w: 1600, h: 1067, style: "lifestyle photography, natural lighting, real world setting" },
  background: { w: 3840, h: 2160, style: "abstract, gradient, subtle texture, no text" },
  pinterest: { w: 1000, h: 1500, style: "vertical, vibrant, pin-worthy, text overlay friendly" },
  opengraph: { w: 1200, h: 630, style: "clean, branded, social media ready" },
  youtube_thumbnail: { w: 1280, h: 720, style: "bold, high contrast, clickable design" },
  instagram_post: { w: 1080, h: 1080, style: "square, aesthetic, social media, high engagement" },
  story_cover: { w: 1080, h: 1920, style: "vertical, immersive, gradient overlay" },
}

export function generatePrompt(product: Product, type: AssetType): AssetPrompt {
  const dim = DIMENSIONS[type]
  const categoryStyle = STYLE_MAP[product.category] ?? "premium product photography"
  const features = product.features.slice(0, 3).map((f) => f.title).join(", ")

  const prompt = [
    type === "hero" ? `${product.product} by ${product.brand}, ${dim.style}` : "",
    type === "lifestyle" ? `${product.product} in use, professional setting, ${dim.style}` : "",
    type === "gallery" ? `${product.product}, ${dim.style}, multiple angles, detail shots` : "",
    type === "pinterest" ? `${product.product} ${product.brand}, ${dim.style}, vertical composition` : "",
    type === "opengraph" ? `${product.product} review, ${product.brand}, ${dim.style}` : "",
    type === "youtube_thumbnail" ? `${product.product} review, ${product.brand}, "${product.rating}/5 stars", ${dim.style}` : "",
    type === "background" ? `${categoryStyle}, ${dim.style}` : "",
    type === "instagram_post" ? `${product.product} ${product.brand}, ${dim.style}, square crop` : "",
    type === "story_cover" ? `${product.product} ${product.brand}, ${dim.style}` : "",
  ]
    .filter(Boolean)
    .join(". ")
    .trim() || `${product.product} ${product.brand}, ${categoryStyle}, ${dim.style}`

  return {
    type,
    label: `${product.product} - ${type}`,
    prompt: `${prompt}. Features: ${features}. Professional photography, 8K, sharp focus.`,
    width: dim.w,
    height: dim.h,
    style: dim.style,
  }
}

export function generateAllAssetPrompts(product: Product): AssetPrompt[] {
  const types: AssetType[] = [
    "hero", "gallery", "lifestyle", "background",
    "pinterest", "opengraph", "youtube_thumbnail",
    "instagram_post", "story_cover",
  ]
  return types.map((type) => generatePrompt(product, type))
}
