import { extractFromURL } from './src/engine/automation/extractor'

async function main() {
  const url = process.argv[2] || 'https://store.google.com/product/pixel_9_pro'
  console.log('URL:', url)
  const result = await extractFromURL(url)
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error)
