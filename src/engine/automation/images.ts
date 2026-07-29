import * as fs from "fs"
import * as path from "path"
import type { ScrapedData } from "./types"

const IMAGES_DIR = path.resolve("public/images")

export interface DownloadResult {
  images: { src: string; alt: string }[]
  errors: string[]
}

async function optimizeWithSharp(inputPath: string, slug: string, label: string): Promise<{ webp: string; thumb: string } | null> {
  try {
    const sharp = (await import("sharp")).default
    const webpPath = path.join(IMAGES_DIR, `${slug}-${label}.webp`)
    const thumbPath = path.join(IMAGES_DIR, `${slug}-${label}-thumb.webp`)

    await sharp(inputPath)
      .resize(1200, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpPath)

    await sharp(inputPath)
      .resize(600, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath)

    return { webp: `/images/${slug}-${label}.webp`, thumb: `/images/${slug}-${label}-thumb.webp` }
  } catch {
    return null
  }
}

export async function downloadProductImages(slug: string, scraped: ScrapedData): Promise<DownloadResult> {
  const result: DownloadResult = { images: [], errors: [] }
  const urls = scraped.images.slice(0, 5)
  if (!urls.length) {
    result.images = generatePlaceholderImages(slug)
    return result
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  const labels = ["front", "angle", "back", "lifestyle", "detail"]

  for (let i = 0; i < urls.length; i++) {
    const label = labels[i] || String(i)
    const tmpPath = path.join(IMAGES_DIR, `tmp-${slug}-${label}`)

    try {
      const response = await fetch(urls[i])
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      fs.writeFileSync(tmpPath, buffer)

      const optimized = await optimizeWithSharp(tmpPath, slug, label)
      fs.unlinkSync(tmpPath)

      if (optimized) {
        result.images.push({ src: optimized.webp, alt: `${scraped.productName} ${label}`.trim() })
      } else {
        const fallback = `/images/${slug}-${label}.jpg`
        fs.writeFileSync(path.join(IMAGES_DIR, `${slug}-${label}.jpg`), buffer)
        result.images.push({ src: fallback, alt: `${scraped.productName} ${label}`.trim() })
      }
    } catch (e: unknown) {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
      result.errors.push(`Image ${i}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (!result.images.length) {
    result.images = generatePlaceholderImages(slug)
  }

  return result
}

function generatePlaceholderImages(slug: string): { src: string; alt: string }[] {
  return [
    { src: `/images/${slug}-front.webp`, alt: `${slug} front view` },
    { src: `/images/${slug}-angle.webp`, alt: `${slug} angled view` },
    { src: `/images/${slug}-back.webp`, alt: `${slug} back view` },
  ]
}
