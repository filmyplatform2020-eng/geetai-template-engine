# SEO Infrastructure

The SEO engine auto-generates complete metadata, structured data, sitemaps, RSS feeds, and robots.txt for every product page. No manual SEO configuration is needed per product beyond the `seo` field in the Product schema.

---

## Architecture

```mermaid
graph TD
    SE[SEO Engine<br/>engine/seo/]
    SC[Schema.org Generator<br/>engine/seo/schema.ts]
    BM[Breadcrumb Generator<br/>engine/seo/index.ts]

    SO[SchemaOrg Component<br/>components/seo/]
    BC[Breadcrumbs Component<br/>components/seo/]
    RH[ResourceHints Component<br/>components/seo/]
    PI[PreloadImages Component<br/>components/seo/]
    LM[LoadMetrics Component<br/>components/seo/]

    SM[Sitemap<br/>app/sitemap.ts]
    RB[Robots<br/>app/robots.ts]
    RSS[RSS Feed<br/>app/rss.xml/route.ts]
    MD[Page Metadata<br/>generateMetadata()]

    SE --> SO
    SE --> BC
    SE --> MD

    SC --> SO
    BM --> BC
    SM --> RB
```

---

## SEO Engine

`src/engine/seo/index.ts` — generates `SEOData` from a `Product`:

```typescript
function generateSEO(product: Product, baseUrl?: string): SEOData
```

Returns:

```typescript
interface SEOData {
  title: string              // "{product} {brand} Review — GeetAI"
  description: string        // First 160 chars of product tagline
  keywords: string           // Comma-separated product, brand, category, tags
  ogTitle: string
  ogDescription: string
  ogImage: string            // First product image
  ogType: 'website'
  ogUrl: string              // Canonical URL
  twitterCard: 'summary_large_image'
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonical: string          // https://geetai.com/review/{slug}
  robots: string             // "index, follow"
}
```

### Breadcrumbs

```typescript
function generateBreadcrumbs(product: Product): BreadcrumbItem[]
// Returns: [{ name: 'Home', url: '/' }, { name: category, url: '/category/...' },
//            { name: product.product, url: '/review/{slug}' }]
```

---

## Schema.org Generator

`src/engine/seo/schema.ts` — generates a complete `@graph` with 7 node types:

```typescript
function productSchema(product: Product): {
  '@context': 'https://schema.org'
  '@graph': object[]
}
```

### Graph Nodes

| # | Type | Content |
|---|------|---------|
| 1 | `Product` | Name, description, brand, image, SKU, color, MPN |
| 2 | `Review` | Each product review (author, rating, content, date) |
| 3 | `Offer` | Per buyLink (price, currency, availability, URL, seller) |
| 4 | `AggregateRating` | RatingValue, reviewCount, bestRating |
| 5 | `FAQPage` | Each FAQ item as Question/Answer |
| 6 | `BreadcrumbList` | Breadcrumb items with position |
| 7 | `Organization` | Site identity (name: "GeetAI", URL) |
| 8 | `WebSite` | Site search URL pattern |

### SchemaOrg Component

The `SchemaOrg` component renders the JSON-LD as a `<script>` tag:

```tsx
<SchemaOrg product={product} />
// Outputs: <script type="application/ld+json">{...}</script>
```

---

## Page Metadata

Every review and guide page uses `generateMetadata()` for dynamic meta tags:

```typescript
// src/app/review/[slug]/page.tsx
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const product = await getProduct(params.slug)
  const seo = generateSEO(product, BASE_URL)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: { title: seo.ogTitle, description: seo.ogDescription,
                 images: [{ url: seo.ogImage }], type: seo.ogType },
    twitter: { card: seo.twitterCard, title: seo.twitterTitle,
               description: seo.twitterDescription, images: [seo.twitterImage] },
    alternates: { canonical: seo.canonical },
    robots: seo.robots,
  }
}
```

---

## Sitemap

`src/app/sitemap.ts` generates an XML sitemap:

```typescript
// Static entries
{ url: 'https://geetai.com', changeFrequency: 'daily', priority: 1.0 }

// Per product
{ url: `https://geetai.com/review/${slug}`, changeFrequency: 'weekly', priority: 0.9 }
{ url: `https://geetai.com/guide/${slug}`, changeFrequency: 'monthly', priority: 0.7 }
```

---

## Robots.txt

`src/app/robots.ts` — allows all crawlers, disallows `/api/`, points to sitemap:

```
User-agent: *
Disallow: /api/
Sitemap: https://geetai.com/sitemap.xml
```

---

## RSS Feed

`GET /rss.xml` — RSS 2.0 feed with one `<item>` per product:

| Field | Value |
|-------|-------|
| title | `"{product} {brand} Review"` |
| link | `https://geetai.com/review/{slug}` |
| description | Truncated to 200 characters |
| pubDate | Current timestamp |
| guid | Product slug |
| category | Product category |

Content-Type: `application/rss+xml; charset=utf-8`

---

## SEO Components

| Component | Purpose |
|-----------|---------|
| `SchemaOrg` | Injects `application/ld+json` structured data |
| `Breadcrumbs` | Semantic `<ol>` breadcrumb with `aria-label` |
| `ResourceHints` | `<link rel="preconnect">`, `<link rel="dns-prefetch">` hints |
| `PreloadImages` | `<link rel="preload">` for first 4 product images |
| `LoadMetrics` | Client-side LCP/FID/CLS reporting via `PerformanceObserver` |

---

## Performance SEO

```typescript
// engine/performance/index.ts
generateResourceHints(images)  // Returns ResourceHint array for preload
getCriticalPath(slug)           // Returns critical route dependencies
```

The `ResourceHints` component generates preconnect links for Google Fonts and GTM, plus preload for hero images.
