import * as cheerio from "cheerio"

async function main() {
  const url = process.argv[2] || "https://www.reliancedigital.in/apple-iphone-16-pro-max-desert-titanium-256-gb/p/493519507"
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    signal: AbortSignal.timeout(10000),
  })
  const html = await res.text()
  const $ = cheerio.load(html)
  $('script[type="application/ld+json"]').each((_, el) => {
    const txt = $(el).text()
    try {
      const data = JSON.parse(txt)
      console.log(JSON.stringify(data, null, 2).slice(0, 2000))
    } catch {
      console.log("Parse fail for:", txt.slice(0, 200))
    }
  })
}

main().catch(console.error)
