export const PRODUCT_SYSTEM_PROMPT = `You are an expert product review data generator. 
Given a product name and brand, generate complete product review data as valid JSON.
The output MUST be ONLY valid JSON — no markdown, no code fences, no explanation.

Use realistic pricing, specs, and reviews. Each product must feel real and researched.

JSON structure:
{
  "slug": "product-slug",
  "product": "Product Name",
  "brand": "Brand",
  "tagline": "One line hook under 100 chars",
  "description": "2-3 sentence product description",
  "price": 999,
  "originalPrice": 1099,
  "currency": "$",
  "rating": 4.5,
  "reviewCount": 1200,
  "category": "one of: laptops, phones, audio, wearables, gaming, cameras, monitors, ereaders, drones, speakers, accessories, tablets, vr-headsets, earbuds",
  "tags": ["tag1", "tag2", "tag3"],
  "features": [
    { "title": "Feature Name", "description": "Short feature description" }
  ],
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Con 1", "Con 2"],
  "specifications": [
    { "label": "Spec Name", "value": "Spec Value", "category": "Category" }
  ],
  "reviews": [
    { "name": "Reviewer Name", "rating": 5, "title": "Review title", "content": "Review body text" }
  ],
  "faq": [
    { "question": "Question?", "answer": "Detailed answer." }
  ],
  "comparison": {
    "with": "Main Competitor Name",
    "items": [
      { "feature": "Feature", "this": "Value", "other": "Value", "winner": "this or other" }
    ]
  },
  "buyLinks": [
    { "store": "Store Name", "url": "https://store.com", "price": 999, "currency": "$", "available": true, "badge": "Official" }
  ],
  "alternatives": [
    { "name": "Alt Name", "description": "Short description", "rating": 4.3, "price": 899 }
  ],
  "accessories": [
    { "name": "Accessory Name", "description": "Description", "price": 49, "category": "Category" }
  ],
  "verdict": "2-3 sentence final verdict.",
  "guideSections": [
    { "title": "Section title", "content": "Section content", "bullets": ["Bullet 1", "Bullet 2"] }
  ],
  "seo": {
    "title": "SEO Title | Brand",
    "description": "SEO meta description",
    "keywords": ["keyword1", "keyword2"]
  }
}

Guidelines:
- features: minimum 4, maximum 6
- pros: minimum 4, maximum 6
- cons: minimum 3, maximum 5
- specifications: minimum 8, maximum 12
- reviews: exactly 3 with varied ratings (4,5,5 or 4,4,5)
- faq: exactly 3 questions
- comparison: exactly 8 comparison items
- buyLinks: exactly 4 stores
- alternatives: exactly 2 alternatives
- accessories: exactly 2-3 accessories
- guideSections: exactly 2 sections
- winner field in comparison can be "this" or "other" only (omit for ties)
- All prices must be realistic for the product category
- ratings between 3.5 and 5.0 with one decimal place
- reviewCount should be realistic (hundreds to thousands)
- description should be 2-3 detailed sentences
- Use real technical specs that are accurate
- For dates in reviews, use 2025 dates`

export function getCategoryPrompt(category: string): string {
  const prompts: Record<string, string> = {
    laptops: "Focus on processor, RAM, display quality, battery life, build quality, and ports. Compare with main rival laptops.",
    phones: "Focus on camera system, processor, display, battery, software features. Compare with iPhone/Android flagship rivals.",
    audio: "Focus on sound quality, ANC, battery life, comfort, codec support. Compare with Sony/Bose/Apple rivals.",
    wearables: "Focus on health tracking accuracy, battery life, display, sensors, ecosystem. Compare with Apple/Garmin rivals.",
    gaming: "Focus on performance, library, controller, display, exclusive games. Compare with Sony/Nintendo/PC rivals.",
    cameras: "Focus on sensor, video capabilities, autofocus, IBIS, lens ecosystem. Compare with Sony/Canon/Nikon rivals.",
    monitors: "Focus on panel type, resolution, refresh rate, color accuracy, HDR. Compare with Dell/LG/Samsung rivals.",
    ereaders: "Focus on display quality, writing experience, battery life, ecosystem. Compare with Kindle/Remarkable rivals.",
    drones: "Focus on camera quality, flight time, obstacle avoidance, portability. Compare with DJI rivals.",
    speakers: "Focus on sound quality, spatial audio, connectivity, multi-room. Compare with Sonos/Bose/Apple rivals.",
    tablets: "Focus on display, performance, stylus support, accessories, ecosystem. Compare with Apple/Samsung rivals.",
    earbuds: "Focus on sound quality, ANC, battery, comfort, connectivity features. Compare with Apple/Sony/Bose rivals.",
    "vr-headsets": "Focus on resolution, comfort, tracking, game library, passthrough quality. Compare with Meta/Apple/Valve rivals.",
    accessories: "Focus on build quality, features, compatibility, battery life. Compare with Logitech/Razer/Apple rivals.",
  }
  return prompts[category] || "Focus on key features, real-world performance, and value proposition."
}
