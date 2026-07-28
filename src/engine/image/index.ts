export interface ImageConfig {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  blur?: string
  format?: "webp" | "avif" | "jpg" | "png"
}

export function generateSrcSet(src: string, widths = [480, 768, 1024, 1440, 1920]): string {
  return widths.map((w) => `${src}?w=${w} ${w}w`).join(", ")
}

export function generateSizes(breakpoints: Record<string, string> = {}): string {
  const defaults = { "(max-width: 480px)": "100vw", default: "100vw" }
  const merged = { ...defaults, ...breakpoints }
  return Object.entries(merged)
    .map(([k, v]) => (k === "default" ? v : `${k} ${v}`))
    .join(", ")
}

export function getPlaceholderBlur(_width = 32, _height = 32): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzA2MDYwZSIvPjwvc3ZnPg=="
}

export function generateImageSizes(
  width: number,
  height: number
): { aspectRatio: number; srcSet: string; sizes: string } {
  return {
    aspectRatio: width / height,
    srcSet: generateSrcSet(`/images/product`),
    sizes: generateSizes(),
  }
}
