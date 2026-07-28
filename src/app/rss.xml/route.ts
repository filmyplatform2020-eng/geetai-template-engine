import { getAllProducts } from "@/data/products"

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export async function GET() {
  const baseUrl = "https://geetai.com"
  const products = getAllProducts()

  const items = products
    .map(
      (p) => `
  <item>
    <title>${escapeXml(p.product)} ${escapeXml(p.brand)} Review</title>
    <link>${baseUrl}/review/${p.slug}</link>
    <description>${escapeXml(p.description.slice(0, 200))}</description>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <guid>${baseUrl}/review/${p.slug}</guid>
    <category>${escapeXml(p.category)}</category>
  </item>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GeetAI Reviews</title>
    <link>${baseUrl}</link>
    <description>Premium product reviews and buying guides.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
