# API Reference

All API routes are under `/api/`. They are used primarily by the admin panel for CRUD operations.

---

## Products

### GET /api/products

Returns all products.

```bash
curl https://geetai.com/api/products
```

**Response `200`:**

```json
{
  "count": 1,
  "products": [
    {
      "slug": "macbook-pro-16-m4",
      "product": "MacBook Pro 16-inch",
      "brand": "Apple",
      "price": 2499,
      "currency": "USD",
      "rating": 4.8,
      "reviewCount": 128,
      "category": "laptops",
      "tags": ["apple", "m4", "pro", "laptop", "macbook"],
      "tagline": "The most powerful MacBook Pro ever...",
      "description": "Full description...",
      "images": [
        { "src": "/images/macbook-pro-16.jpg", "alt": "...", "width": 1200, "height": 800 }
      ],
      "features": [
        { "title": "M4 Pro Chip", "description": "...", "icon": "⚡" }
      ],
      "pros": ["Best-in-class performance"],
      "cons": ["Premium price point"],
      "specifications": [
        { "label": "Processor", "value": "Apple M4 Pro", "category": "Performance" }
      ],
      "buyLinks": [
        { "store": "Amazon", "url": "https://amazon.com/dp/...", "price": 2499, "currency": "USD", "available": true, "badge": "Best Price" }
      ],
      "comparison": { "with": "Dell XPS 16", "items": [] },
      "reviews": [],
      "faq": [],
      "alternatives": [],
      "accessories": [],
      "verdict": "Final verdict...",
      "guide": { "sections": [] },
      "seo": { "title": "...", "description": "...", "keywords": "..." }
    }
  ]
}
```

---

### POST /api/products

Create a new product.

```bash
curl -X POST https://geetai.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-new-product",
    "product": "My New Product",
    "brand": "BrandName",
    "price": 999,
    "currency": "USD",
    "rating": 4.0,
    "reviewCount": 0,
    "category": "electronics",
    "tagline": "Amazing product",
    "description": "Full description"
  }'
```

**Response `201`:**

```json
{
  "product": { "slug": "my-new-product", ... }
}
```

**Response `400`:**

```json
{
  "error": "Missing required field: product"
}
```

---

### GET /api/products/[slug]

Get a single product by slug.

```bash
curl https://geetai.com/api/products/macbook-pro-16-m4
```

**Response `200`:** Full product object.

**Response `404`:**

```json
{
  "error": "Product not found"
}
```

---

### PUT /api/products/[slug]

Update a product (partial update).

```bash
curl -X PUT https://geetai.com/api/products/macbook-pro-16-m4 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 2399,
    "rating": 4.9
  }'
```

**Response `200`:** Updated full product object.

**Response `404`:**

```json
{
  "error": "Product not found"
}
```

---

### DELETE /api/products/[slug]

Delete a product.

```bash
curl -X DELETE https://geetai.com/api/products/macbook-pro-16-m4
```

**Response `200`:**

```json
{
  "deleted": true
}
```

**Response `404`:**

```json
{
  "error": "Product not found"
}
```

---

## Export

### GET /export

Export all products as flat JSON.

```bash
curl https://geetai.com/api/export
```

**Response `200`:**

```json
{
  "count": 1,
  "products": [
    {
      "slug": "macbook-pro-16-m4",
      "product": "MacBook Pro 16-inch",
      "brand": "Apple",
      "price": 2499,
      "currency": "USD",
      "rating": 4.8,
      "reviewCount": 128,
      "category": "laptops",
      "tags": ["apple", "m4", "pro"],
      "tagline": "The most powerful...",
      "description": "Full description...",
      "primaryImage": "/images/macbook-pro-16.jpg",
      "buyLinks": "Amazon: $2,499 (available), Best Buy: $2,499 (available)",
      "seo": { "title": "...", "description": "...", "keywords": "..." },
      "comparisonWith": "Dell XPS 16"
    }
  ]
}
```

---

## RSS Feed

### GET /rss.xml

Returns RSS 2.0 XML feed.

```bash
curl https://geetai.com/rss.xml
```

Content-Type: `application/rss+xml; charset=utf-8`

---

## Search

Search is performed client-side via `engine/search/index.ts`. There is no dedicated search API endpoint — the search engine operates on the full product catalog in-memory.

```typescript
searchProducts(products, query, filters?)
// Scores across: name(10x), brand(8x), tags(6x), category(5x), description(4x), features(3x)
```

---

## Error Responses

All API routes return consistent error shapes:

```json
{
  "error": "Human-readable error message"
}
```

HTTP status codes: `200` (success), `201` (created), `400` (bad request), `404` (not found), `500` (server error).
