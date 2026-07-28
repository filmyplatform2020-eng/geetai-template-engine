# Product Schema

The `Product` type is the single source of truth for all product data. It is defined in `src/engine/product/types.ts` and imported by 36 files across the codebase.

---

## Type Definition

```typescript
interface Product {
  slug: string
  product: string
  brand: string
  tagline: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  rating: number
  reviewCount: number
  images: ProductImage[]
  features: ProductFeature[]
  pros: string[]
  cons: string[]
  specifications: Specification[]
  reviews: Review[]
  faq: FAQItem[]
  comparison: Comparison
  buyLinks: BuyLink[]
  category: string
  tags: string[]
  videoUrl?: string
  alternatives: Alternative[]
  accessories: Accessory[]
  verdict: string
  guide: BuyingGuide
  seo: SEOInput
}
```

---

## Field Reference

### Basic Info

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `string` | URL-safe unique identifier (e.g., `"macbook-pro-16-m4"`) |
| `product` | `string` | Product display name (e.g., `"MacBook Pro 16-inch"`) |
| `brand` | `string` | Manufacturer name |
| `tagline` | `string` | Short marketing tagline (1 sentence) |
| `description` | `string` | Full product description (1-3 paragraphs) |
| `category` | `string` | Product category (determines template selection) |
| `tags` | `string[]` | Search keywords and related terms |

### Pricing

| Field | Type | Description |
|-------|------|-------------|
| `price` | `number` | Current price in specified currency |
| `originalPrice` | `number?` | Original MSRP (for showing savings) |
| `currency` | `string` | ISO currency code (e.g., `"USD"`, `"INR"`) |

### Ratings

| Field | Type | Description |
|-------|------|-------------|
| `rating` | `number` | Average rating (0-5 scale) |
| `reviewCount` | `number` | Total number of user reviews |

### Images

```typescript
interface ProductImage {
  src: string       // Image URL or path
  alt: string       // Alt text for accessibility + SEO
  width: number     // Image width in pixels
  height: number    // Image height in pixels
}
```

### Features

```typescript
interface ProductFeature {
  title: string     // Feature name (e.g., "M4 Pro Chip")
  description: string  // Feature explanation
  icon: string      // Emoji icon identifier
}
```

### Specifications

```typescript
interface Specification {
  label: string     // Spec name (e.g., "Processor")
  value: string     // Spec value (e.g., "Apple M4 Pro")
  category: string  // Grouping category (e.g., "Performance", "Display")
}
```

### Reviews

```typescript
interface Review {
  id: string          // Unique identifier
  name: string        // Reviewer name
  avatar: string      // Avatar URL or initial
  rating: number      // 1-5 stars
  title: string       // Review headline
  content: string     // Full review text
  date: string        // ISO date string
  verified: boolean   // Verified purchase badge
}
```

### FAQ

```typescript
interface FAQItem {
  question: string    // Question text
  answer: string      // Answer text
}
```

### Comparison

```typescript
interface Comparison {
  with: string                        // Competitor name (e.g., "Dell XPS 16")
  items: ComparisonItem[]
}

interface ComparisonItem {
  feature: string     // Feature name (e.g., "Battery Life")
  this: string        // This product's value
  other: string       // Competitor's value
  winner: 'this' | 'other' | 'tie'   // Which is better
}
```

### Buy Links

```typescript
interface BuyLink {
  store: string       // Store name (e.g., "Amazon", "Best Buy")
  url: string         // Affiliate URL
  price: number       // Current price at this store
  currency: string    // Currency code
  available: boolean  // Currently in stock?
  badge?: string      // Optional badge ("Best Price", "Sale", "Exclusive")
}
```

### Alternatives

```typescript
interface Alternative {
  name: string        // Product name
  slug: string        // URL slug
  description: string // Brief description
  rating: number      // Average rating
  price: number       // Price
  pros: string[]      // Key advantages
  cons: string[]      // Key disadvantages
}
```

### Accessories

```typescript
interface Accessory {
  name: string        // Accessory name
  slug: string        // URL slug
  description: string // Brief description
  price: number       // Price
  image: string       // Image URL
  category: string    // Category (e.g., "Cables", "Cases")
}
```

### Buying Guide

```typescript
interface BuyingGuide {
  sections: BuyingGuideSection[]
}

interface BuyingGuideSection {
  title: string     // Section heading
  content: string   // Section content (markdown-compatible)
  bullets: string[] // Key bullet points
}
```

### SEO

```typescript
interface SEOInput {
  title: string         // Custom page title
  description: string   // Meta description
  keywords: string      // Comma-separated keywords
}
```

---

## Example Product File

A complete single product file (`src/data/products/macbook-pro.ts`, ~256 lines) contains all fields filled with real data. This serves as the reference implementation.

---

## How to Add a New Product

### Option 1: Interactive CLI

```bash
npm run new-product
```

This prompts for name, brand, tagline, description, price, category, and currency. It auto-generates a slug, creates a new `.ts` file with a skeleton `Product` object, and registers it in the registry.

### Option 2: Manual

1. Create `src/data/products/your-product.ts`:

```typescript
import type { Product } from '@/engine/product/types'

export const yourProduct: Product = {
  slug: 'your-product-slug',
  product: 'Your Product Name',
  brand: 'BrandName',
  tagline: 'Short compelling tagline',
  description: 'Full description...',
  price: 999,
  currency: 'USD',
  rating: 4.5,
  reviewCount: 42,
  images: [
    { src: '/images/product.jpg', alt: 'Product photo', width: 1200, height: 800 }
  ],
  features: [],
  pros: [],
  cons: [],
  specifications: [],
  reviews: [],
  faq: [],
  comparison: { with: 'Competitor', items: [] },
  buyLinks: [],
  category: 'your-category',
  tags: [],
  alternatives: [],
  accessories: [],
  verdict: 'Final verdict...',
  guide: { sections: [] },
  seo: { title: '', description: '', keywords: '' }
}
```

2. Register in `src/data/products/registry.ts`:

```typescript
import { yourProduct } from './your-product'

export const products: ProductCatalog = {
  'macbook-pro-16-m4': macbookProProduct,
  'your-product-slug': yourProduct,
}
```

The product is now live at `/review/your-product-slug` and `/guide/your-product-slug`.
