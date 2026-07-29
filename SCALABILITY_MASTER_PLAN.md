# Scalability Master Plan

Scaling from 100 → 1K → 10K → 100K → 1M → 10M+ products without a rewrite.

---

## Current Architecture Snapshot

| Layer | Technology | Capacity |
|-------|-----------|----------|
| Data storage | Static `.ts` files in memory | ~100 |
| Product registry | `Map<string, Product>` (RAM) | ~1K |
| Build | `next build` — full rebuild | ~1K |
| Search | Client-side, full-array scan in browser | ~1K |
| Caching | In-memory LRU, 1000 entries, 5min TTL | ~1K |
| Images | `/public/images/` local files | ~1K |
| CDN | None | — |
| Routes | SSG via `generateStaticParams` | ~10K |
| Category pages | None | 0 |
| Pagination | None | 0 |
| Database | None (in-memory only) | — |

---

## Already Scalable ✅

These layers handle 10M+ without change:

| Component | Why It Scales |
|-----------|---------------|
| **CMS Provider abstraction** | `registerProvider`/`createProvider` factory pattern — swap local for Postgres without touching page code |
| **Cache layer** | Thread-safe `getOrSet` with TTL, LRU eviction, pattern invalidation — just switch backend from in-memory to Redis |
| **Product type** | Single `Product` interface, no per-provider schema — any backend maps to it |
| **SEO engine** | Pure functions, no I/O — `generateSEO()` and `generateSchema()` are O(1) per product |
| **Schema generation** | Stateless JSON-LD builder, no external dependencies |
| **Sitemap generation** | Streaming XML builder — can handle 10M+ URLs with pagination |
| **RSS feed** | Streaming XML — same pattern as sitemap |
| **Component architecture** | Stateless server components + thin client wrappers — scales horizontally |
| **CSS/styling system** | CSS custom properties, no runtime style computation — zero cost at scale |
| **Animation system** | CSS animations + Framer Motion `whileInView` — only animates visible elements |
| **Personalization** | localStorage-based — zero server cost |
| **Image component** | Next/Image with lazy loading, srcset, AVIF/WebP — efficient by default |
| **Affiliate engine** | Pure functions, no external calls at render time |
| **Analytics** | Client-side fire-and-forget — no server impact |

---

## Bottlenecks & Blockers ❌

### Data & Storage

| Bottleneck | Severity | Kicks In At |
|------------|----------|-------------|
| Static `.ts` files shipped to client | 🔴 Critical | 1K |
| All products loaded into RAM on every build | 🔴 Critical | 10K |
| No database — no querying, filtering, pagination | 🔴 Critical | 10K |
| `getAllProducts()` returns everything with no limit/offset | 🔴 Critical | 10K |
| No per-product file lazy-loading | 🟡 High | 1K |
| `products` registry is a single JS module | 🟡 High | 1K |
| Image files in `/public/` — no CDN, no remote storage | 🟡 High | 10K |

### Build & Deploy

| Bottleneck | Severity | Kicks In At |
|------------|----------|-------------|
| Full `next build` rebuilds every page every time | 🔴 Critical | 10K |
| No ISR / incremental static regeneration | 🔴 Critical | 10K |
| No static export (`output: "export"` commented out) | 🟡 High | 10K |
| No build caching (Turborepo, Nx) | 🟡 Medium | 10K |
| No distributed build (Vercel remote caching) | 🟡 Medium | 100K |

### Routing & Search

| Bottleneck | Severity | Kicks In At |
|------------|----------|-------------|
| No category/brand listing pages | 🟡 High | 1K |
| No search results page (modal-only) | 🟡 High | 10K |
| Client-side search iterates full array | 🔴 Critical | 10K |
| No server-side search (Elasticsearch/MeiliSearch) | 🔴 Critical | 100K |
| No pagination on homepage | 🟡 Medium | 1K |
| No `generateStaticParams` for category/brand pages | 🟡 High | 1K |

### Caching & Performance

| Bottleneck | Severity | Kicks In At |
|------------|----------|-------------|
| In-memory cache only (1000 entries) | 🟡 High | 10K |
| No Redis / external cache | 🔴 Critical | 100K |
| No CDN for images or pages | 🟡 High | 10K |
| No `stale-while-revalidate` headers | 🟡 Medium | 10K |
| No `remotePatterns` for external images in next.config | 🟡 Medium | 10K |

---

## Phase 1: Before 100K Products

*Minimal investment, high leverage.*

### 1.1 Add a Database

**Technology:** PostgreSQL (via Supabase or Neon for managed).

**Goal:** Products live in a database, not in `.ts` files.

**Migration:**
```
Static .ts files
  → New PostgresProvider implements ProductProvider interface
  → Write migration script: read all .ts files → upsert into Postgres
  → Set CMS_PROVIDER=postgresql in env
  → Keep local provider as fallback
```

**Schema:**
```sql
CREATE TABLE products (
  slug            TEXT PRIMARY KEY,
  data            JSONB NOT NULL,     -- Full Product type
  category        TEXT NOT NULL,
  brand           TEXT NOT NULL,
  price           NUMERIC NOT NULL,
  rating          REAL NOT NULL,
  review_count    INTEGER NOT NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_updated ON products(updated_at);
```

**Why JSONB:** The `Product` type has 30+ fields and nested objects. A normalized schema would require 12+ tables. JSONB allows the existing code to work unchanged while still being indexable and queryable.

### 1.2 Add Category & Brand Listing Pages

```typescript
// src/app/category/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await getCategories() // from DB
  return categories.map(c => ({ slug: c }))
}

// Same pattern for src/app/brand/[slug]/page.tsx
```

Both pages use the same section components (FeatureGrid, ComparisonTable, etc.) with category-level data.

### 1.3 Add Pagination to Homepage

```typescript
const PAGE_SIZE = 48
export default async function HomePage({ searchParams }) {
  const page = Number(searchParams.page) || 1
  const products = await getProducts({ limit: PAGE_SIZE, offset: (page-1)*PAGE_SIZE })
  const total = await getProductCount()
}
```

### 1.4 Enable ISR

```typescript
export const revalidate = 3600 // 1 hour
// or per-page:
export default async function Page() { ... }
export const revalidate = 86400 // 24 hours for product pages
```

### 1.5 Move Images to Remote Storage + CDN

- Store images in S3 / Cloudflare R2 / Supabase Storage
- Configure `remotePatterns` in `next.config.ts`
- Add CDN (Cloudflare, Vercel Edge, or CloudFront)

### 1.6 Add Server-Side Search

**Option A (up to 100K):** PostgreSQL full-text search
```sql
SELECT * FROM products
WHERE to_tsvector('english', data->>'description') @@ plainto_tsquery('english', $query)
ORDER BY ts_rank(to_tsvector('english', data->>'description'), plainto_tsquery('english', $query)) DESC
LIMIT 20;
```

**Option B (100K+):** MeiliSearch or Typesense — zero-config, sub-50ms search, typo-tolerant.

---

## Phase 2: Before 1M Products

*Moderate investment, major capacity jump.*

### 2.1 Split CMS Provider

The current local provider keeps ALL products in RAM. At 1M products (~50GB+), this is impossible.

**New PostgresProvider** queries the database with pagination, filtering, and column selection. The `Product` type is hydrated from JSONB on read, not held in memory.

### 2.2 Add Redis Cache Layer

Replace the in-memory LRU with Redis:
- Cache product queries: `GET product:{slug}` → 10ms response, zero DB load
- Cache category/brand listing: `GET category:{slug}:page:{n}`
- Cache search results: `GET search:{query}:{filters}`
- TTL: 5min for products, 1min for listings, 30s for search
- `stale-while-revalidate` pattern for all caches

### 2.3 Implement Incremental Builds

**Option A (Recommended):** On-demand ISR
```typescript
// src/app/api/revalidate/route.ts
export async function POST(req: Request) {
  const { slug } = await req.json()
  revalidatePath(`/review/${slug}`)
  revalidatePath(`/guide/${slug}`)
  revalidatePath(`/sitemap.xml`)
  return Response.json({ revalidated: true })
}
```

**Option B:** Static export + incremental deployment

### 2.4 Add Build Queue

When the pipeline generates 1000+ products in a batch:
- Queue product generation jobs in Bull/BullMQ with Redis
- Process N-at-a-time (configurable concurrency)
- On completion, trigger ISR for just the changed slugs
- Status dashboard in `/admin/build-status`

### 2.5 Add Content Delivery Network

- Cloudflare or Vercel Edge for HTML caching
- Cache product pages at edge: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600`
- Cache images at CDN with long TTL (30 days)
- Purge per-product on update via webhook

### 2.6 Optimize Image Pipeline

- Generate multiple sizes per image at upload time (not request time)
- Store in S3/R2 with CDN prefix
- Use WebP + AVIF formats
- Implement image CDN (imgix, Cloudinary, or self-hosted Thumbor)

---

## Phase 3: Before 10M Products

*Major infrastructure.*

### 3.1 Distributed Build System

At 10M products, a single `next build` is impractical even with ISR.

**Strategy:** Pre-compute + lazy hydrate
```typescript
export const dynamic = "force-static"
export const revalidate = 86400 * 7 // weekly
```
Product pages are generated on first visit (ISR), then cached at CDN for a week. Only popular products ever get generated. Long-tail products generate on first request.

### 3.2 Shard the Database

- Shard by `category` or hash of `slug`
- Read replicas for listing pages (eventually consistent)
- Write master for product updates

### 3.3 Upgrade Search

- Elasticsearch or MeiliSearch cluster (3+ nodes)
- Real-time indexing on product create/update
- Faceted search with category, brand, price range, rating, tags
- Typo tolerance, synonyms, stemming

### 3.4 Add Recommendations Engine

- Collaborative filtering (also-viewed, also-bought)
- Content-based (category + tag similarity)
- Trending detection (velocity of views/ratings)
- Redis for real-time counters

### 3.5 Add Monitoring & Observability

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking (already integrated) |
| OpenTelemetry | Distributed tracing |
| Grafana + Prometheus | System metrics |
| Datadog / New Relic | APM (optional) |
| Custom dashboards | Build times, queue depth, cache hit rates |

### 3.6 Multi-Region Deployment

- Deploy to US, EU, APAC regions
- Regional CDN + regional database read replicas
- Global routing via Cloudflare Argo or Vercel Edge

---

## Technology Recommendations

| Layer | 100-10K | 10K-100K | 100K-1M | 1M-10M |
|-------|---------|----------|---------|--------|
| **Database** | PostgreSQL (Supabase/Neon) | Same | + Read replicas | + Sharding |
| **Cache** | In-memory (current) | Redis (Upstash/Vercel KV) | + CDN caching | + Multi-region Redis |
| **Search** | PostgreSQL FTS | MeiliSearch | MeiliSearch cluster | Elasticsearch |
| **Images** | Local `/public/` | S3/R2 + CDN | + Image CDN | + Automated pipeline |
| **Build** | `next build` | ISR | + On-demand ISR | + Distributed ISR |
| **CDN** | Vercel Edge | Cloudflare | + Regional | + Multi-region |
| **Queue** | None | Bull/BullMQ | + Worker pool | + Auto-scaling workers |
| **Monitoring** | Sentry | + Custom logs | + OpenTelemetry | + Full observability |
| **Recommendations** | None | Category-based | + Redis counters | + ML model |

---

## Migration Strategy

### No-Risk Changes (Do Now)
- Add PostgresProvider (coexists with local provider)
- Add category/brand listing pages (new routes, don't touch existing)
- Add pagination to homepage (backward compatible, default page=1)
- Enable ISR (drop-in, existing pages unchanged)

### Low-Risk Changes (Before 10K)
- Move images to S3/R2 (update `remotePatterns`, existing URLs redirect)
- Add PostgreSQL FTS search endpoint (new API route, existing client co-exists)
- Configure CDN for images (update image URLs in product data)

### Medium-Risk Changes (Before 100K)
- Swap local provider → PostgresProvider (single config change, same interface)
- Add Redis cache (via CMS cache abstraction — swap implementation)
- Enable ISR with on-demand revalidation (new API endpoint)

### High-Risk Changes (Before 1M)
- Shard database (requires data migration + connection management)
- Upgrade to Elasticsearch (requires reindexing + query rewrite)
- Multi-region deployment (requires infra + cross-region sync)

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CMS provider swap breaks pages | Low | High | Keep both providers active; dark-read Postgres for a week before switching |
| ISR causes stale content | Medium | Medium | Set appropriate TTLs; add webhook-based purging |
| CDN cache invalidation misses | Medium | Low | Short TTLs (1h) for product pages; long TTLs (30d) for images |
| Database becomes bottleneck | Medium | High | Read replicas at 100K; sharding at 1M; Redis in front at all times |
| Search latency degrades | Medium | Medium | PostgreSQL FTS → MeiliSearch → Elasticsearch progression |
| Build times explode | High | High | ISR eliminates rebuild requirement; on-demand ISR for updates |
| Image storage costs | Medium | Medium | R2 with no egress fees; optimize compression; lazy resize |
| Migration data loss | Low | Critical | Test migration on staging with full dataset; keep local files as backup |

---

## Architectural Invariants

These must never break during scaling:

1. **`Product` type interface** — All providers return the same `Product` shape
2. **Template rendering** — `ProductPageTemplate` receives a `Product` object and renders it identically regardless of provider
3. **Component props** — Section components accept the same props at 100 products as at 10M
4. **CSS custom property theming** — `var(--color-accent)` works identically whether set by inline style or ThemeProvider
5. **SEO metadata** — `generateSEO()` and `generateSchema()` are pure functions with zero I/O
6. **Search API** — Same response shape whether backed by PostgreSQL FTS or Elasticsearch
7. **Admin UI** — Admin pages work with any provider through the same adapter interface

---

## Current Scores & Targets

| Metric | Current | 100K Target | 1M Target | 10M Target |
|--------|---------|-------------|-----------|------------|
| Build time | 45s | < 5min | < 15min | < 30min |
| Page TTFP (CDN cached) | ~500ms | < 100ms | < 100ms | < 100ms |
| Page TTFP (ISR cold) | ~500ms | < 200ms | < 200ms | < 200ms |
| Search latency (P95) | < 10ms | < 50ms | < 100ms | < 200ms |
| API response (product) | < 5ms | < 20ms | < 50ms | < 100ms |
| Product page Lighthouse | 85+ | 90+ | 90+ | 90+ |
| Image load time | ~200ms | < 100ms | < 50ms | < 50ms |
| Cache hit rate | 0% (none) | 80%+ | 90%+ | 95%+ |
| Deployment frequency | Manual | Automated | Automated | Automated |

---

## Immediate Actions (This Sprint)

1. Create PostgresProvider implementing `ProductProvider` interface — **1-2 days**
2. Add category and brand listing pages — **1 day**
3. Add pagination to homepage — **0.5 day**
4. Enable ISR with `revalidate = 3600` — **0.5 day**
5. Configure `remotePatterns` for CDN images — **0.5 day**
6. Add PostgreSQL full-text search endpoint — **1 day**
7. Deploy Postgres (Supabase/Neon) — **2 hours**

Total: **~6 days** to reach 100K-ready.
