export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const big = parseInt(clean, 16)
  return [(big >> 16) & 255, (big >> 8) & 255, big & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function channelLuminance(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type WcagLevel = "AAA" | "AA" | "AA-Large" | "Fail"

export function wcagLevel(ratio: number, size: "normal" | "large" = "normal"): WcagLevel {
  if (size === "large") {
    if (ratio >= 4.5) return "AAA"
    if (ratio >= 3) return "AA"
    return "Fail"
  }
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  return "Fail"
}

const LIGHT_TEXT = "#ffffff"
const DARK_TEXT = "#0a0a0f"

function isLight(hex: string): boolean {
  return relativeLuminance(hex) > 0.5
}

export function bestTextColor(bg: string): string {
  const lightRatio = contrastRatio(LIGHT_TEXT, bg)
  const darkRatio = contrastRatio(DARK_TEXT, bg)
  return lightRatio >= darkRatio ? LIGHT_TEXT : DARK_TEXT
}

export function blendWithWhite(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

export function blendWithBlack(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

export function emphasize(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const lum = relativeLuminance(hex)
  if (lum > 0.5) {
    return blendWithBlack(hex, amount)
  }
  return blendWithWhite(hex, amount)
}

export function accessibleForeground(bg: string, hint?: string): string {
  const ideal = bestTextColor(bg)
  if (!hint) return ideal
  const hintRatio = contrastRatio(hint, bg)
  if (hintRatio >= 4.5) return hint
  if (hintRatio >= 3) return hint
  return ideal
}
