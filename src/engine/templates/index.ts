import type { ThemeName } from "@/engine/theme/types"

export interface TemplateConfig {
  id: string
  label: string
  categories: string[]
  theme: ThemeName
  heroLayout: "center" | "split" | "full-image" | "minimal"
  galleryStyle: "grid" | "carousel" | "masonry" | "stacked"
  ctaStyle: "gradient" | "outline" | "pill" | "bordered"
  cardStyle: "glass" | "solid" | "border" | "elevated"
  animationIntensity: "subtle" | "moderate" | "high"
  typographyScale: "compact" | "normal" | "expressive"
  backgroundEffect: "aurora" | "grid" | "gradient" | "solid"
}

export const templates: TemplateConfig[] = [
  {
    id: "laptop",
    label: "Laptop",
    categories: ["laptops", "computers", "tablets"],
    theme: "apple",
    heroLayout: "center",
    galleryStyle: "grid",
    ctaStyle: "gradient",
    cardStyle: "glass",
    animationIntensity: "moderate",
    typographyScale: "normal",
    backgroundEffect: "aurora",
  },
  {
    id: "phone",
    label: "Phone",
    categories: ["phones", "smartphones", "mobile"],
    theme: "tech",
    heroLayout: "full-image",
    galleryStyle: "carousel",
    ctaStyle: "pill",
    cardStyle: "glass",
    animationIntensity: "high",
    typographyScale: "expressive",
    backgroundEffect: "gradient",
  },
  {
    id: "watch",
    label: "Watch",
    categories: ["watches", "wearables"],
    theme: "luxury-dark",
    heroLayout: "split",
    galleryStyle: "masonry",
    ctaStyle: "outline",
    cardStyle: "elevated",
    animationIntensity: "subtle",
    typographyScale: "compact",
    backgroundEffect: "solid",
  },
  {
    id: "camera",
    label: "Camera",
    categories: ["cameras", "photography"],
    theme: "minimal-white",
    heroLayout: "full-image",
    galleryStyle: "grid",
    ctaStyle: "bordered",
    cardStyle: "solid",
    animationIntensity: "moderate",
    typographyScale: "normal",
    backgroundEffect: "grid",
  },
  {
    id: "perfume",
    label: "Perfume",
    categories: ["fragrance", "perfume", "beauty"],
    theme: "fashion",
    heroLayout: "minimal",
    galleryStyle: "stacked",
    ctaStyle: "outline",
    cardStyle: "elevated",
    animationIntensity: "subtle",
    typographyScale: "expressive",
    backgroundEffect: "solid",
  },
  {
    id: "audio",
    label: "Audio",
    categories: ["audio", "headphones", "speakers"],
    theme: "gaming",
    heroLayout: "center",
    galleryStyle: "grid",
    ctaStyle: "gradient",
    cardStyle: "glass",
    animationIntensity: "high",
    typographyScale: "expressive",
    backgroundEffect: "aurora",
  },
  {
    id: "health",
    label: "Health",
    categories: ["health", "fitness", "wellness"],
    theme: "health",
    heroLayout: "split",
    galleryStyle: "grid",
    ctaStyle: "pill",
    cardStyle: "glass",
    animationIntensity: "moderate",
    typographyScale: "normal",
    backgroundEffect: "gradient",
  },
  {
    id: "finance",
    label: "Finance",
    categories: ["finance", "business", "software"],
    theme: "finance",
    heroLayout: "minimal",
    galleryStyle: "grid",
    ctaStyle: "bordered",
    cardStyle: "solid",
    animationIntensity: "subtle",
    typographyScale: "compact",
    backgroundEffect: "solid",
  },
]

export function getTemplateForCategory(category: string): TemplateConfig {
  const match = templates.find((t) => t.categories.includes(category.toLowerCase()))
  return match ?? templates[0]
}
