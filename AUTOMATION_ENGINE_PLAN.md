# AUTOMATION ENGINE PLAN

> Phase 2 of Launch Workflow
> How to go from Product URL → Published Page in one automated flow

---

## Vision

```
Product URL / ID / JSON
        ↓
[ Automation Engine ]
        ↓
Product JSON + Images + Theme + Style + SEO + Schema + Page
        ↓
Ready to Publish
```

---

## 1. Current Architecture — What Already Exists

### ✅ Fully Built & Ready

| Layer | Location | What It Does |
|-------|----------|-------------|
| **Product Types** | `src/engine/product/types.ts` | Full `Product` interface (25+ fields) |
| **CMS Adapter** | `src/cms/` | Provider pattern (local, JSON, headless). `LocalProvider` reads from `.ts` files |
| **Template Registry** | `src/engine/templates/` | 8 templates, each with layout/gallery/CTA/card/animation config |
| **Theme System** | `src/engine/theme/` | 8 full themes with 40+ CSS custom properties each |
| **Style Variations** | `src/data/styles.ts` | 10 accent color schemes |
| **Design Detector** | `src/engine/design/ai.ts` | Category → Template → Theme auto-assignment |
| **SEO Generator** | `src/engine/seo/` | `generateSEO()` + `generateBreadcrumbs()` + full `@graph` Schema.org |
| **Affiliate Utils** | `src/engine/affiliate/` | Sort by merchant priority, lowest price, savings calc |
| **AI Engine** | `src/engine/ai/` | Gemini client, prompts, template-generator, autonomous loop |
| **Personalization** | `src/engine/personalization/` | Related products, trending, recently viewed |
| **Search Engine** | `src/engine/search/` | Full-text search with scoring + filters |
| **Animation Engine** | `src/engine/animation/` | 15+ Framer Motion presets |
| **Variant Engine** | `src/engine/variant/` | Color/size variant application |
| **Review Page** | `src/app/review/[slug]/` | 18-section template with OG + Schema |
| **Guide Page** | `src/app/guide/[slug]/` | Buying guide with alternatives + accessories |
| **RSS Feed** | `src/app/rss.xml/route.ts` | RSS 2.0 product feed |
| **Sitemap** | `src/app/sitemap.ts` | Auto-generated sitemap |
| **Export API** | `src/app/export/route.ts` | JSON export of all products |
| **Static Pages** | Build output | 38 SSG pages (19 review + 19 guide) |

### ⚠️ Exists But Dead/Wired

| Component | Status |
|-----------|--------|
| Analytics Provider | All config commented out, not imported |
| Sentry | Code exists, `@sentry/nextjs` not installed |
| GlassSection | Component exists, never used |

### ❌ Missing (Must Build)

| Missing Piece | Why Needed |
|--------------|-----------|
| **Product URL Scraper** | Extract product data from Amazon/Flipkart/Croma/Reliance |
| **Image Auto-Downloader** | Download product images into `/public/images/` |
| **Data → JSON Transformer** | Map scraped/input data to `Product` interface |
| **Validation Layer** | Validate incoming data against `Product` schema |
| **Pipeline Orchestrator** | Chain: URL → scrape → generate → write → register → build |
| **Auto-Registration** | Add to registry + index automatically |
| **One-Shot CLI Command** | `npm run publish -- https://amazon.in/dp/B0XXX` |

---

## 2. Automation Pipeline Design

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────┐
│                    INPUT                                 │
│  Product URL / Product ID / Product JSON                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  1. PRODUCT EXTRACTOR (new)                              │
│     - Scrape product data from URL                       │
│     - Parse product ID → lookup                          │
│     - Validate incoming JSON                             │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  2. DATA ENRICHER (new)                                  │
│     - If missing data, call Gemini AI to fill gaps      │
│     - Generate tagline, description, pros/cons          │
│     - Generate FAQ, comparison data, buying guide       │
│     - Generate SEO metadata                             │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  3. DESIGN ASSIGNER (reuses existing)                    │
│     - detectDesign(category) → template + theme          │
│     - Assign style variation (by index or hash)          │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  4. IMAGE PIPELINE (new)                                 │
│     - Download hero/gallery images to /public/images/    │
│     - Generate placeholder blur data                     │
│     - Generate srcset + sizes                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  5. FILE GENERATOR (reuses existing)                     │
│     - template-generator.ts → write .ts file            │
│     - Add to registry.ts                                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  6. PUBLISH TRIGGER (new)                                │
│     - Run `npm run build`                                │
│     - Generate sitemap (auto by Next.js)                │
│     - Generate RSS (auto by Next.js)                    │
│     - Output: ready-to-deploy                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
              PUBLISHED PAGE
```

### What We Reuse vs Build New

| Step | Reuse Existing | Build New |
|------|---------------|-----------|
| 1. Extract | — | `src/engine/automation/extractor.ts` — URL scrapers |
| 2. Enrich | Gemini engine (`src/engine/ai/gemini.ts`), prompts (`src/engine/ai/prompts.ts`) | `src/engine/automation/enricher.ts` — bridge between scraping and AI |
| 3. Design | `detectDesign()` in `src/engine/design/ai.ts`, `styleVariations` in `src/data/styles.ts` | — |
| 4. Images | `src/engine/image/index.ts` (srcset/sizes/blur) | `src/engine/automation/images.ts` — download + store |
| 5. File Gen | `generateProductFile()`, `addToRegistry()` in `src/engine/ai/template-generator.ts` | — |
| 6. Publish | — | `src/engine/automation/publisher.ts` — build + verify |

---

## 3. Recommended Free Resources

| Resource | Why It Fits | How To Use |
|----------|------------|-----------|
| **`open-graph-scraper`** (npm) | Extract product data, images, meta tags from any URL | Scrape Amazon/Flipkart product page → get title, price, images, description |
| **`@vercel/og` (ImageResponse)** | Generate per-product OG images from JSX | `app/review/[slug]/opengraph-image.tsx` renders product name + price + rating → auto OG image |
| **`sharp`** (npm) | Resize + optimize downloaded product images | Auto-convert hero images to WebP/AVIF, generate thumbnails |
| **`schema-dts`** (npm, dev) | TypeScript types for all Schema.org vocab | Replace hand-written schema types in `src/engine/seo/schema.ts` |
| **`cheerio`** (npm) | Fast server-side HTML parser for scraping | Parse product pages server-side (lighter than Puppeteer) |
| **GitHub Actions: `technote-space/broken-link-checker-action`** | PR gate for broken affiliate links | Run on deploy to verify all buy links are live |
| **GitHub Actions: `bojieyang/indexnow-action@v2`** | Submit new URLs to Bing/Yandex | After each new product publish, ping search engines |
| **Next.js built-in `generateStaticParams`** | Auto-generate pages for all products | Already using it for 19 products — scales to thousands |
| **Next.js built-in `generateMetadata`** | Auto-generate OG + Twitter + canonical per page | Already doing this for review pages — extend to guide pages |

---

## 4. Files to Create

### New Module: `src/engine/automation/`

```
src/engine/automation/
├── index.ts              # Re-exports
├── types.ts              # Pipeline types
├── extractor.ts          # URL scraper (cheerio/open-graph-scraper)
├── enricher.ts           # AI data enrichment bridge
├── images.ts             # Image download + optimization
├── validator.ts          # Product JSON validation
├── pipeline.ts           # Full orchestration pipeline
├── publisher.ts          # Build + verify
└── __tests__/            # Tests
```

### New Script: `scripts/publish-product.mjs`

One CLI command:
```bash
npm run publish -- https://amazon.in/dp/B0XXX
```
Or with options:
```bash
npm run publish:ai -- "Samsung Galaxy Book 5" "Samsung" "laptops"
```

### Files Modified (minimal)

| File | Change |
|------|--------|
| `src/engine/ai/template-generator.ts` | Add image path override (allow real paths instead of auto-generated) |
| `src/data/products/registry.ts` | No direct change — `addToRegistry()` handles this |
| `package.json` | Add `npm run publish` + `npm run publish:ai` scripts |
| `.env.example` | Document `GEMINI_API_KEY` and any scraper keys |

---

## 5. Implementation Order

| Step | Milestone | Files | Effort | Risk |
|------|-----------|-------|--------|------|
| 1 | **Validator** — validate product JSON against schema | `validator.ts` + types | Small | Low |
| 2 | **Enricher** — bridge scraped data with Gemini AI to fill gaps | `enricher.ts` | Medium | Medium (API dependent) |
| 3 | **Extractor** — scrape product URL using cheerio | `extractor.ts` | Medium | Medium (site structure changes) |
| 4 | **Image Pipeline** — download + optimize images | `images.ts` | Medium | Low |
| 5 | **CLI Command** — `scripts/publish-product.mjs` | `publish-product.mjs` | Small | Low |
| 6 | **Pipeline Orchestrator** — chain everything together | `pipeline.ts` | Small | Low |
| 7 | **Guide Page Metadata** — add OG + Schema to guide pages | `src/app/guide/[slug]/page.tsx` | Small | Low |
| 8 | **Proof of Concept** — run one real product through the full pipeline | All of the above | — | Tests correctness |

---

## 6. Proof of Concept Plan (After Approval)

1. Pick **one real product URL** (e.g., Amazon India — any category)
2. Run it through:
   - Extractor → scrape title, price, images, description
   - Enricher → Gemini fills pros/cons/FAQ/comparison/verdict
   - Designer → auto-assigns template + theme + style
   - Image Pipeline → download images to `/public/images/`
   - File Generator → write `.ts` + registry
   - Build → verify 2 new pages generated
3. Verify output manually
4. If successful → ready to scale

---

## 7. Risks

| Risk | Mitigation |
|------|-----------|
| Amazon/Flipkart blocks scraping | Use `open-graph-scraper` (lightweight, respects robots.txt), fallback to manual JSON input |
| Gemini generates low-quality data | Improve prompts with real scraped context, add human-review gate |
| Images fail to download | Fallback to AI-generated placeholder images, flag for manual review |
| Build time grows with 1000+ products | Static site generation is fast — 1000 products ≈ 60-90s build |
| URL structure changes on ecommerce sites | Keep extractors modular — fix one adapter, not the whole pipeline |

---

## 8. Architecture Principle

> "Every new file is in `src/engine/automation/`. We never touch the page templates, theme system, or existing engines. The automation layer is a **consumer** of everything already built, not a modifier."

---

**Next:** Awaiting approval to begin Proof of Concept.
