import type { ThemeName } from "@/engine/theme/types"
import type { Product } from "@/engine/product/types"
import { generatePalette, type ProductPalette } from "@/engine/color"
import { styleVariations, type StyleVariation } from "@/data/styles"
import { engineRegistry } from "./registry"
import { capabilityRegistry } from "./capabilities"
import { workflowRegistry } from "./workflow"

/* ── Existing types ── */

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

/* ── NEW: Engine metadata ── */

export const VERSION = { major: 1, minor: 0, patch: 0, label: "v1.0.0" } as const

export interface ResolvedTemplate {
  config: TemplateConfig
  style: StyleVariation
  palette: ProductPalette
  cssVars: Record<string, string>
  themeName: ThemeName | null
  resolvedAt: number
}

export interface EngineMetrics {
  resolveCount: number
  resolveTimeMs: number
  cacheHits: number
  errors: number
  lastResolveMs: number
}

export interface EngineConfig {
  useThemeEngine: boolean
  cacheEnabled: boolean
  defaultTheme: ThemeName
}

/* ── NEW: paletteToCssVars (moved from ProductPageTemplateV8) ── */

function paletteToCssVars(p: ProductPalette): Record<string, string> {
  return {
    "--color-accent": p.accent[500],
    "--color-accent-light": p.accentLight,
    "--color-accent-secondary": p.accentSecondary,
    "--color-accent-soft": p.accentSoft,
    "--color-accent-grad": p.accent[500],
    "--color-accent-grad-soft": p.accentSoft,
    "--text-primary": p.text.primary,
    "--text-secondary": p.text.secondary,
    "--text-muted": p.text.muted,
    "--bg": p.surface.bg,
    "--surface": p.surface.card,
    "--border-default": p.border.default,
    "--border-hover": p.border.hover,
    "--border-focus": p.border.focus,
    "--button-primary-bg": p.button.primary.bg,
    "--button-primary-text": p.button.primary.text,
    "--button-primary-hover": p.button.primary.hover,
    "--button-primary-pressed": p.button.primary.pressed,
    "--button-secondary-bg": p.button.secondary.bg,
    "--button-secondary-text": p.button.secondary.text,
    "--button-secondary-hover": p.button.secondary.hover,
    "--button-secondary-pressed": p.button.secondary.pressed,
    "--badge-success-bg": p.badge.success.bg,
    "--badge-success-text": p.badge.success.text,
    "--badge-success-border": p.badge.success.border,
    "--badge-warning-bg": p.badge.warning.bg,
    "--badge-warning-text": p.badge.warning.text,
    "--badge-warning-border": p.badge.warning.border,
    "--badge-danger-bg": p.badge.danger.bg,
    "--badge-danger-text": p.badge.danger.text,
    "--badge-danger-border": p.badge.danger.border,
    "--badge-neutral-bg": p.badge.neutral.bg,
    "--badge-neutral-text": p.badge.neutral.text,
    "--badge-neutral-border": p.badge.neutral.border,
    "--nav-active-bg": p.nav.active.bg,
    "--nav-active-text": p.nav.active.text,
    "--nav-active-shadow": p.nav.active.shadow,
    "--nav-inactive-text": p.nav.inactive.text,
    "--nav-capsule-bg": p.nav.capsule.bg,
    "--nav-capsule-border": p.nav.capsule.border,
    "--nav-capsule-shadow": p.nav.capsule.shadow,
    "--glass-bg": p.glass.bg,
    "--glass-border": p.glass.border,
    "--glass-blur": `${p.glass.blur}px`,
    "--state-hover": p.state.hover,
    "--state-pressed": p.state.pressed,
    "--state-focus": p.state.focus,
    "--state-overlay": p.state.overlay,
    "--shadow-default": p.shadow.color,
    "--shadow-intensity": String(p.shadow.intensity),
  }
}

/* ── NEW: template engine singleton ── */

class TemplateEngine {
  private _created = Date.now()
  private _metrics: EngineMetrics = {
    resolveCount: 0,
    resolveTimeMs: 0,
    cacheHits: 0,
    errors: 0,
    lastResolveMs: 0,
  }
  private _config: EngineConfig = {
    useThemeEngine: false,
    cacheEnabled: true,
    defaultTheme: "apple",
  }
  private _resolveCache = new Map<string, ResolvedTemplate>()

  /* version */

  get version() {
    return VERSION
  }

  /* config */

  get config(): EngineConfig {
    return { ...this._config }
  }

  updateConfig(updates: Partial<EngineConfig>): EngineConfig {
    this._config = { ...this._config, ...updates }
    return this.config
  }

  /* health */

  health() {
    return {
      status: "active" as const,
      uptime: Date.now() - this._created,
      lastResolve: this._metrics.lastResolveMs,
      totalResolved: this._metrics.resolveCount,
      cachedEntries: this._resolveCache.size,
      errors: this._metrics.errors,
    }
  }

  /* metrics */

  get metrics(): EngineMetrics {
    return { ...this._metrics }
  }

  /* dependencies */

  dependencies() {
    return [
      { name: "Color Intelligence Engine", version: "1.0.0", status: "linked" as const, type: "color" },
      { name: "Theme Engine", version: "1.0.0", status: "optional" as const, type: "theme" },
      { name: "Product Engine", version: "1.0.0", status: "linked" as const, type: "data" },
      { name: "Style Registry", version: "1.0.0", status: "linked" as const, type: "data" },
      { name: "Engine Registry", version: "1.0.0", status: "self" as const, type: "registry" },
      { name: "Capability Registry", version: "1.0.0", status: "self" as const, type: "registry" },
      { name: "Workflow Registry", version: "1.0.0", status: "self" as const, type: "registry" },
    ]
  }

  /* ── style selection ── */

  getStyle(product: Product, allProducts: Product[], styleOverride?: StyleVariation): StyleVariation {
    if (styleOverride) return styleOverride
    const productIndex = allProducts.findIndex((p) => p.slug === product.slug)
    return styleVariations[productIndex >= 0 ? productIndex % styleVariations.length : 0]
  }

  /* ── core orchestration ── */

  resolve(
    product: Product,
    allProducts: Product[],
    styleOverride?: StyleVariation,
  ): ResolvedTemplate {
    const start = performance.now()

    try {
      const config = getTemplateForCategory(product.category)
      const style = this.getStyle(product, allProducts, styleOverride)
      const palette = generatePalette(
        style.accent,
        style.accentLight,
        style.accentSecondary,
        style.accentSoft,
        parseFloat(style.glassOpacity),
        parseInt(style.glassBlur),
        parseFloat(String(style.glassBorderOpacity)),
        style.shadowColor,
        parseFloat(style.shadowIntensity),
        style.shadowHighlight,
        style.bgColor,
      )
      const cssVars = paletteToCssVars(palette)

      const result: ResolvedTemplate = {
        config,
        style,
        palette,
        cssVars,
        themeName: this._config.useThemeEngine ? config.theme : null,
        resolvedAt: Date.now(),
      }

      const elapsed = performance.now() - start
      this._metrics.resolveCount++
      this._metrics.resolveTimeMs += elapsed
      this._metrics.lastResolveMs = elapsed

      return result
    } catch (e) {
      this._metrics.errors++
      throw e
    }
  }
}

export const templateEngine = new TemplateEngine()

/* ── registration ── */

engineRegistry.register({
  name: "Template Engine",
  version: `${VERSION.major}.${VERSION.minor}.${VERSION.patch}`,
  capabilities: [
    "template-selection",
    "style-resolution",
    "palette-generation",
    "css-variable-injection",
    "theme-routing",
  ],
  dependencies: [
    "Color Intelligence Engine",
    "Product Engine",
    "Style Registry",
  ],
  status: "active",
})

capabilityRegistry.register({
  name: "template-selection",
  engine: "Template Engine",
  description: "Maps product categories to template configurations",
  version: "1.0.0",
})
capabilityRegistry.register({
  name: "style-resolution",
  engine: "Template Engine",
  description: "Resolves style variations for product rendering",
  version: "1.0.0",
})
capabilityRegistry.register({
  name: "palette-generation",
  engine: "Template Engine",
  description: "Generates WCAG-compliant color palettes via Color Intelligence Engine",
  version: "1.0.0",
})
capabilityRegistry.register({
  name: "css-variable-injection",
  engine: "Template Engine",
  description: "Converts ProductPalette to CSS custom properties",
  version: "1.0.0",
})
capabilityRegistry.register({
  name: "theme-routing",
  engine: "Template Engine",
  description: "Routes to Theme Engine when enabled",
  version: "1.0.0",
})

workflowRegistry.registerStep({
  name: "template-selection",
  engine: "Template Engine",
  order: 1,
  required: true,
  description: "Select template config from product category",
})
workflowRegistry.registerStep({
  name: "style-resolution",
  engine: "Template Engine",
  order: 2,
  required: true,
  description: "Resolve style variation from product index",
})
workflowRegistry.registerStep({
  name: "palette-generation",
  engine: "Template Engine",
  order: 3,
  required: true,
  description: "Generate WCAG color palette via Color Intelligence Engine",
})
workflowRegistry.registerStep({
  name: "css-variable-injection",
  engine: "Template Engine",
  order: 4,
  required: true,
  description: "Map ProductPalette to CSS custom properties",
})
workflowRegistry.registerStep({
  name: "theme-routing",
  engine: "Template Engine",
  order: 5,
  required: false,
  description: "Optional Theme Engine application",
})
