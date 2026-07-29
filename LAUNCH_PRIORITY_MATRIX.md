# Launch Priority Matrix

Execution roadmap: classify every issue into Launch-critical, Scale-critical, Enterprise-critical, or Optional.

---

## Bucket A — Must Fix Before First Public Launch

*Directly causes: security problems, data loss, revenue loss, broken website, SEO penalties, legal/compliance issues.*

| # | Risk | Problem | Becomes Critical At | Effort | Benefit |
|---|------|---------|---------------------|--------|---------|
| 1 | **Admin panel has zero authentication** | Anyone with the URL can create, edit, delete products and modify SEO. Active vulnerability — not theoretical. | **Day 1** | 2 days | Prevents catastrophic data loss and malicious content injection |
| 2 | **API write routes have zero authentication** | `/api/products` POST/PUT/DELETE are unprotected. Automated scripts can destroy the catalog. | **Day 1** | 1 day | Prevents data destruction via API abuse |
| 3 | **No input validation on API write endpoints** | POST/PUT accept arbitrary JSON. Malformed data silently corrupts the product registry. No type checking at runtime. | **Day 1** | 1 day | Prevents data corruption from bad API calls or buggy admin UI |
| 4 | **No error boundaries on section components** | A crash in any section (e.g., CustomerReviews rendering bad data) takes down the entire product page. White screen. | **Day 1** | 0.5 day | Prevents total page failure; isolates crashes to a single section |
| 5 | **No custom 404 or 500 error pages** | Deleted/renamed products show generic Next.js 404. App errors show "Internal Server Error" with stack traces in development. Unprofessional, bad for SEO. | **Day 1** | 0.5 day | Professional error handling, retains users on broken paths |
| 6 | **No canonical URL tags on product pages** | Products accessible via multiple paths or parameters will be treated as duplicate content by Google. Dilutes ranking signals. | **Day 1** | 0.5 day | Prevents SEO duplicate content penalties from the start |
| 7 | **No draft/published separation + human review gate for AI content** | AI-generated product descriptions, specs, and reviews go live without editorial review. Hallucinated features, incorrect pricing, fake reviews published automatically. | **Day 1** (if AI pipeline active) | 1 day | Prevents publishing hallucinated/incorrect content that damages credibility |
| 8 | **No backup/restore for product data** | Products exist only as TypeScript files. Corrupt a file, lose the data. No automated backups, no point-in-time recovery. | **Day 1** | 1 day | Guarantees data can be recovered after any failure |

**Total effort: ~7.5 days** — non-negotiable pre-launch work.

---

## Bucket B — Must Fix Before 100K Products

*These work fine for an MVP with hundreds of products but break before approximately 100K products.*

| # | Risk | Problem | Becomes Critical At | Effort | Benefit |
|---|------|---------|---------------------|--------|---------|
| 1 | **All products live in static TypeScript files** | Every product requires writing code. Full rebuild for every change. No querying, no filtering, no pagination. | 1K products | 3 days | Enables non-developer content operations; enables querying, filtering, pagination |
| 2 | **Registry is a single JS module importing every product** | `registry.ts` imports all products. At 10K products, this single file imports 10K modules. Webpack memory exhaustion. | 5K products | 2 days | Eliminates build-time memory bottleneck; enables lazy loading |
| 3 | **No ISR, no incremental builds** | Every change triggers a full `next build`. At 10K pages, builds take hours. No way to update a single product. | 5K products | 1 day | Drops build time from hours to seconds per product change |
| 4 | **`getAllProducts()` returns everything — no pagination** | Homepage, API, and admin all load every product. At 10K products, the homepage ships 10MB+ of JSON. | 5K products | 0.5 day | Keeps page size constant regardless of catalog size |
| 5 | **Client-side search iterates full product array** | Search ships the entire catalog to the browser and filters in JavaScript. At 10K products, search freezes the main thread. | 5K products | 2 days | Sub-50ms search regardless of catalog size |
| 6 | **No batch processing / queue system** | AI generation runs synchronously. A failure at product 50/100 loses all progress. No concurrency, no retry, no dead letter handling. | 1K AI-generated products | 2 days | Reliable batch processing; resilience against API failures |
| 7 | **Images are local files in `/public/` (currently empty)** | No CDN. No remote storage. Every image request hits the origin server. At scale, this destroys performance and costs. | 1K products with images | 1 day | CDN delivery, offloaded origin, scalable storage |
| 8 | **No Content Security Policy headers** | No CSP means XSS vulnerabilities have no second line of defense. Acceptable for MVP but risky as the platform grows. | 10K products | 0.5 day | Mitigates XSS risk across all pages |
| 9 | **No CI/CD pipeline** | Every deploy is manual. No automated testing. No staging environment. No rollback. Works for a small team, breaks with multiple contributors. | 5 editors | 1 day | Automated quality gates; deploy with confidence; rollback support |
| 10 | **No content versioning / audit log** | Every edit is permanent. No undo. No who-changed-what-when tracking. Acceptable for a single editor, problematic with a team. | 5 editors | 2 days | Undo capability; accountability; compliance readiness |
| 11 | **No rate limiting on API routes** | Public API can be hammered without throttling. Acceptable for low-traffic MVP, but a single abuse incident at scale causes downtime. | 100K monthly visits | 0.5 day | Prevents accidental or malicious DDoS of API endpoints |
| 12 | **No redirect strategy for renamed/deleted products** | Changing a product slug breaks all existing links, bookmarks, and search rankings. Each broken link loses traffic. | 1K products (slugs will change) | 1 day | Preserves SEO equity when slugs change; prevents 404 traffic loss |
| 13 | **No OpenGraph image generation per product** | Social shares use a generic image. Lower click-through rates from social media. Not a launch blocker but important for growth. | 1K products | 1 day | Improves social sharing CTR; differentiated previews per product |
| 14 | **Affiliate links are static strings with no validation** | If a merchant changes their URL format, links silently 404. No expiry detection, no automated updates. | 1K affiliate links | 1 day | Prevents revenue loss from dead affiliate links |
| 15 | **No scheduled publishing** | Editors can't schedule content to go live on a specific date. All changes go live immediately or require manual timing. | 5 editors | 1 day | Enables content calendar execution; separates publish from create |
| 16 | **No search results page (`/search?q=...`)** | Search is modal-only. No SEO for search queries. Users who don't use the modal can't find products by search. | 1K products | 1 day | Captures search traffic; improves product discoverability |
| 17 | **No error standardization in API responses** | API errors have no consistent format. Client developers must guess error types from raw HTTP status codes. | 3 API consumers | 0.5 day | Consistent error handling; easier client integration |
| 18 | **No E2E tests running in CI** | Playwright suite exists but all tests fail (browsers not installed). No automated quality verification. | 10 deploys | 1 day | Prevents regressions; enables confident shipping |
| 19 | **No monitoring for business metrics** | No dashboard for product count, traffic, affiliate clicks, AI costs, build times. Operational blind spot as platform grows. | 10K monthly visits | 2 days | Visibility into platform health; data-driven decisions |
| 20 | **Two separate theming systems not consolidated** | `src/engine/theme/` (8 themes) and `src/data/styles.ts` (10 variations) coexist independently. Components use `--color-accent` from styles, ignoring theme engine. Duplicate maintenance burden. | 10 variations | 1 day | Single source of truth for theming; reduced maintenance |
| 21 | **No hreflang tags or locale-specific SEO** | Expanding to multiple countries without language annotations. Google can't serve the right language to the right user. | First non-English product | 1 day | Correct multi-language indexing; regional search visibility |
| 22 | **No structured logging** | No log levels, no correlation IDs, no searchable log format. Debugging production issues requires guesswork. | 10K daily requests | 1 day | Debuggable production; faster incident resolution |

**Total effort: ~26.5 days** — do this before the catalog exceeds 1K products.

---

## Bucket C — Must Fix Before 1 Million Products

*Enterprise scaling. Acceptable at 100K products but becomes critical before 1M.*

| # | Risk | Problem | Becomes Critical At | Effort | Benefit |
|---|------|---------|---------------------|--------|---------|
| 1 | **No database read replicas** | All queries hit a single Postgres instance. As traffic grows, query latency increases. No separation of read/write loads. | 500K products | 2 days | Linear read scaling; write isolation |
| 2 | **No distributed queue (Redis-backed)** | Single-process queue becomes a bottleneck. No horizontal worker scaling. Job processing backs up. | 1M daily AI operations | 2 days | Reliable async processing at scale |
| 3 | **No upgrade path from PostgreSQL FTS to Elasticsearch** | Full-text search in Postgres works at 100K but degrades at 1M+ documents. No faceted search, no typo tolerance at scale. | 500K products | 3 days | Sub-50ms search at 1M+ documents |
| 4 | **No distributed build system** | Even with ISR, initial catalog build at 1M products requires distributed workers. Single-machine build is impractical. | 500K products | 3 days | Parallel build completion in minutes, not days |
| 5 | **No multi-region deployment** | All traffic served from one region. Global users experience high latency. Single-region failure takes down the entire platform. | 10M monthly visits globally | 5 days | Regional latency under 100ms; regional fault isolation |
| 6 | **No service layer between routes and data** | Page components import CMS adapters directly. As business logic grows, this coupling prevents independent scaling of routes and data access. | 100 API consumers | 2 days | Independent evolvability of API and data layers |
| 7 | **No performance/load testing in CI** | No benchmark for whether the platform handles traffic spikes. A single unoptimized query at scale brings down the site. | 100K daily visits | 2 days | Verified performance baseline; regression detection |
| 8 | **No CDN for HTML caching** | ISR handles per-page caching but there's no edge cache for HTML. Every uncached request hits the origin. | 1M daily visits | 2 days | Edge-served pages; zero origin load for cached content |
| 9 | **No comprehensive observability (OpenTelemetry)** | Distributed tracing across services. Correlation between frontend, API, database, queue, and CDN. Without this, debugging across services is guesswork. | 10M daily requests | 3 days | End-to-end request tracing; capacity planning data |
| 10 | **No database sharding strategy** | A single Postgres instance has a practical limit. At 10M products, writes become a bottleneck regardless of read replicas. | 5M products | 3 days | Horizontal write scaling; infinite catalog growth |

**Total effort: ~27 days** — begin planning when catalog exceeds 100K products.

---

## Bucket D — Optional

*Nice-to-have. Should never delay launch. Revisit annually.*

| # | Improvement | Why Skip | Revisit At |
|---|-------------|----------|------------|
| 1 | **AI prompt versioning system** | Prompts are hardcoded strings. Changes affect all future generations. A proper versioning system is valuable but not launch-blocking. | When AI generates >50% of content |
| 2 | **AI cost tracking dashboard** | No visibility into Gemini/image generation costs. Important for budgeting but not critical for launch. | Monthly AI spend exceeds $500 |
| 3 | **Visual regression testing (Chromatic/Percy)** | Style changes across 10 variations could break individual components. Automated visual diffing catches this. Valuable, not essential. | When 5+ editors modify components |
| 4 | **Service worker for offline support** | Offline access to product pages and cached search results. Improves mobile UX but adds complexity. | When mobile traffic exceeds 50% |
| 5 | **Bundle analysis automation** | Tracking bundle size impact of engine modules over time. Important for long-term performance budgeting. | When JS bundle exceeds 500KB |
| 6 | **RTL language support** | Requires layout mirroring for Arabic, Hebrew, etc. Significant effort for uncertain ROI. | When entering RTL-language markets |
| 7 | **Translation memory system** | Deduplicates translations across products. Reduces translation costs but requires integration with translation providers. | When supporting 3+ languages |
| 8 | **API client SDK auto-generation** | Auto-generates TypeScript/JavaScript clients from the API. Improves developer experience but not required. | When 5+ external API consumers exist |
| 9 | **A/B testing framework** | Full platform-level A/B testing for templates, CTAs, layouts. Valuable for optimization but not launch-critical. | When monthly traffic exceeds 100K visits |
| 10 | **Feature flag infrastructure** | Gradual rollouts of new features. Important for risk management at scale but overkill for launch. | When 10+ concurrent features in development |
| 11 | **Event sourcing / CQRS** | Full event history of every product change. Powerful for audit and replay but massive architectural complexity. | When regulatory compliance demands it |
| 12 | **Component documentation playground** | Living documentation of all UI components with props, states, and variations. Improves team velocity but not required for launch. | When 3+ frontend developers on the team |

---

## Launch Readiness Checklist (Bucket A)

*Every item must be complete before the site is accessible to the public.*

```
[ ] Admin panel authentication — login gate on all /admin/* routes
[ ] API write authentication — POST/PUT/DELETE require API key or session
[ ] Input validation on API write endpoints — schema validation for all mutations
[ ] Error boundaries on all section components — isolate component crashes
[ ] Custom 404 and 500 error pages — professional error handling
[ ] Canonical URL tags on all product pages — prevent duplicate content
[ ] Draft/published workflow (if AI pipeline active) — review gate before publish
[ ] Automated backup of product data — git-based or database dump
```

**Before launch, this is the ONLY document that matters.**

---

## Execution Phases

### Phase 0: Launch (Week 1-2)
- Implement all 8 Bucket A items
- Populate `/public/images/` with actual product images
- Verify Lighthouse scores ≥ 85 across Performance, Accessibility, SEO
- Manual QA of all 20 product pages
- Deploy with basic monitoring (Sentry only)

### Phase 1: Growth (Month 1-3)
- Bucket B items 1-6 (database, registry, ISR, pagination, search, queue)
- Bucket B items 7-11 (CDN, CSP, CI/CD, versioning, rate limiting)
- Add first 100 products via AI pipeline + editorial review

### Phase 2: Scale (Month 3-6)
- Bucket B items 12-22 (redirects, OG images, affiliate validation, search page, E2E, monitoring, hreflang)
- Reach 1,000 products
- Establish editorial workflow with 3+ editors

### Phase 3: Enterprise (Year 2+)
- Begin Bucket C items as catalog approaches 100K
- Multi-region when traffic justifies it
- Elasticsearch when Postgres FTS degrades

---

## Decision Framework

When deciding whether to fix something before launch, ask:

1. **Will this issue cause visible damage on Day 1?** → Bucket A
2. **Will this issue cause visible damage before we have 1,000 products?** → Bucket B
3. **Can we postpone this and fix it later without a rewrite?** → Bucket B, C, or D
4. **Is the fix faster than the cost of the failure?** → If yes, do it now regardless of bucket

**Example:** Admin auth costs 2 days to implement. A breach costs everything. **Bucket A.**
**Example:** Search results page costs 1 day. Without it, existing users can still find products via the modal. **Bucket B.**
**Example:** RTL language support costs 3 days. No RTL market planned. **Bucket D.**

---

## What This Enables

| Launch State | Capacity | Team Size | Traffic |
|-------------|----------|-----------|---------|
| After Bucket A | 20 products | 1-2 editors | Low |
| After Bucket B | 100K products | 5-20 editors | Millions of visits |
| After Bucket C | 10M products | 50+ editors | Billions of visits |

Each bucket builds on the previous without requiring a rewrite. The architecture supports all three.
