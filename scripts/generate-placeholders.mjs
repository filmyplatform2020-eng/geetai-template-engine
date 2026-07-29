import { writeFileSync, mkdirSync, readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const styles = [
  { id: "blush-rose",     accent: "#e8a0bf", light: "#fce8ef", text: "#1a1a2e" },
  { id: "champagne-pearl",accent: "#d4c4a8", light: "#f8f4ec", text: "#1a1a2e" },
  { id: "ice-baby-blue",  accent: "#a8c8e8", light: "#eef4f8", text: "#1a1a2e" },
  { id: "sage-mint",      accent: "#a8c8b8", light: "#eef4f0", text: "#1a1a2e" },
  { id: "lavender-mist",  accent: "#c4b8e8", light: "#f0ecf8", text: "#1a1a2e" },
  { id: "rose-quartz",    accent: "#e8b4c0", light: "#f8ecee", text: "#1a1a2e" },
  { id: "periwinkle-dream",accent: "#a8b4e8",light: "#eeecf8", text: "#1a1a2e" },
  { id: "warm-ivory",     accent: "#d4c8b8", light: "#f6f2ec", text: "#1a1a2e" },
  { id: "sky-petal",      accent: "#b8cce8", light: "#eef2f8", text: "#1a1a2e" },
  { id: "cream-blush",    accent: "#e8d0c0", light: "#f8f0ea", text: "#1a1a2e" },
  { id: "image-derived",  accent: "#5a6aae", light: "#e8ecf8", text: "#ffffff" },
  { id: "cosmic-purple",  accent: "#7c5cbf", light: "#f0ecf8", text: "#ffffff" },
  { id: "midnight-indigo",accent: "#2d2d6b", light: "#e8e8f4", text: "#ffffff" },
  { id: "tech-blue",      accent: "#2563eb", light: "#e8f0fe", text: "#ffffff" },
  { id: "emerald",        accent: "#059669", light: "#e8f8f0", text: "#ffffff" },
  { id: "crimson",        accent: "#dc2626", light: "#fce8e8", text: "#ffffff" },
  { id: "navy",           accent: "#1e3a5f", light: "#e8eef4", text: "#ffffff" },
  { id: "obsidian",       accent: "#1a1a2e", light: "#e8e8ee", text: "#ffffff" },
  { id: "gold-noir",      accent: "#b8860b", light: "#f8f0d8", text: "#ffffff" },
  { id: "rose-gold",      accent: "#e8b4b8", light: "#fce8ea", text: "#1a1a2e" },
]

const imageNames = ["front", "angle", "side", "display"]

const products = [
  "macbook-pro", "macbook-air-15-m3", "dell-xps-16-2025", "iphone-16-pro-max",
  "galaxy-s25-ultra", "sony-wh-1000xm6", "ipad-pro-13-m4", "apple-watch-ultra-3",
  "ps5-pro", "sony-a7v", "samsung-qd-oled", "airpods-pro-3",
  "nintendo-switch-2", "meta-quest-4", "dji-air-4", "kindle-scribe-2",
  "apple-studio-display-2", "logitech-mx-master-4", "google-pixel-9-pro", "sonos-era-300",
]

const imgDir = resolve(__dirname, "..", "public", "images")
mkdirSync(imgDir, { recursive: true })

for (let i = 0; i < products.length; i++) {
  const slug = products[i]
  const style = styles[i % styles.length]
  const accent = style.accent
  const light = style.light
  const textColor = style.text

  for (const name of imageNames) {
    const filename = `${slug}-${name}.svg`
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${light}"/>
      <stop offset="100%" style="stop-color:${accent}20"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.08"/>
      <stop offset="50%" style="stop-color:${accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0.08"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)" rx="16"/>
  <rect x="100" y="100" width="1000" height="600" fill="url(#shimmer)" rx="24"/>
  <rect x="100" y="100" width="1000" height="600" fill="none" stroke="${accent}30" stroke-width="1" rx="24"/>
  <text x="600" y="380" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="28" font-weight="600" fill="${textColor}">${label}</text>
  <text x="600" y="420" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="16" fill="${textColor}90">${name} view</text>
  <rect x="560" y="460" width="80" height="2" rx="1" fill="${accent}50"/>
</svg>`
    writeFileSync(`${imgDir}/${filename}`, svg)
  }

  // Hero cover image
  const coverFilename = `${slug}-cover.svg`
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accent}15"/>
      <stop offset="50%" style="stop-color:${light}"/>
      <stop offset="100%" style="stop-color:${accent}08"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#glow)"/>
  <text x="960" y="500" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="48" font-weight="700" fill="${textColor}">${label}</text>
  <text x="960" y="550" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="20" fill="${textColor}80">Hero Cover Image</text>
  <rect x="880" y="580" width="160" height="2" rx="1" fill="${accent}40"/>
</svg>`
  writeFileSync(`${imgDir}/${coverFilename}`, coverSvg)
}

console.log(`Generated ${products.length * (imageNames.length + 1)} SVG placeholders in ${imgDir}`)
