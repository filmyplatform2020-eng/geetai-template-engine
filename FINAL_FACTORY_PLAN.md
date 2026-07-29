# FINAL FACTORY PLAN

> Launch V1 Scope Freeze — 12 outputs, 6 blockers, then ship.
> V2 features moved to BACKLOG — not implemented now.

---

## LAUNCH V1 SCOPE

| # | Output | Status |
|---|--------|--------|
| 1 | Product JSON | ✅ DONE |
| 2 | Images | ⚠️ Needs sharp optimization |
| 3 | Theme Selection | ✅ DONE |
| 4 | Style Variation | ✅ DONE |
| 5 | Product Page | ✅ DONE |
| 6 | Buying Guide | ✅ DONE |
| 7 | Review Page | ✅ DONE |
| 8 | SEO Metadata | ⚠️ Needs OG path fix |
| 9 | OpenGraph | ⚠️ Needs OG path fix |
| 10 | Schema.org | ✅ DONE |
| 11 | Merchant Buttons | ⚠️ Needs affiliate tags |
| 12 | Build Verification | ⚠️ Needs verification script |

## V2 BACKLOG (Do not implement now)

| Priority | Feature |
|----------|---------|
| P1 | Related Products |
| P1 | Pinterest Pin |
| P1 | Instagram Post |
| P1 | Facebook Post |
| P1 | Twitter/X Post |
| P1 | Blog Draft |
| P2 | Email Draft |
| P2 | YouTube Description |
| P2 | Thumbnail Prompt |
| P2 | AI Image Prompt |
| P2 | AI Video Prompt |
| P3 | Batch scaling (100→100K) |

---

## 1. INPUT

One of:
```
Amazon URL     → https://amazon.in/dp/B0XXX
Flipkart URL   → https://flipkart.com/p/XXX
Croma URL      → https://croma.com/XXX
Reliance URL   → https://reliance-digital.in/XXX
Product URL    → https://any-store.com/product/XXX
Product JSON   → {"name": "...", "price": 999}
Product Name   → "MacBook Pro 16 M4"
```

| # | Output | Status | Engine/Module | Work Needed |
|---|--------|--------|---------------|-------------|
| 1 | **Product JSON** | ✅ DONE | `generateProductFile()` in template-generator | None |
| 2 | **Optimized Images** | ⚠️ PARTIAL | `downloadProductImages()` in automation/images | Needs sharp optimization (resize, webp) |
| 3 | **Theme Selection** | ✅ DONE | `detectDesign()` in design/ai | None |
| 4 | **Style Variation** | ✅ DONE | `getStyleForProductIndex()` in data/styles | None |
| 5 | **Product Page** | ✅ DONE | SSG pages at `/review/[slug]` | None |
| 6 | **Buying Guide** | ✅ DONE | `guide.sections` in Product type, rendered on page | None |
| 7 | **Review Page** | ✅ DONE | Same as product page | None |
| 8 | **SEO Metadata** | ✅ DONE | `generateSEO()` in seo | None |
| 9 | **OpenGraph** | ⚠️ PARTIAL | `SEOData` has OG fields, but images may be broken | Fix OG image path resolution |
| 10 | **Schema.org** | ✅ DONE | `productSchema()` in seo/schema | None |
| 11 | **FAQ** | ✅ DONE | In schema + page | None |
| 12 | **Pros & Cons** | ✅ DONE | In Product type, rendered | None |
| 13 | **Specifications** | ✅ DONE | In Product type, rendered | None |
| 14 | **Related Products** | ⚠️ PARTIAL | `alternatives` exist in data, but no category-based derivation | Build `deriveRelatedProducts()` |
| 15 | **Merchant Buttons** | ✅ DONE | `buyLinks` rendered with affiliate sorting | None |
| 16 | **Social Assets** | ❌ MISSING | OG image + social card generation | Build `generateSocialImage()` |
| 17 | **Pinterest Pin** | ❌ MISSING | No template | Build text template |
| 18 | **Instagram Post** | ❌ MISSING | No template | Build text template |
| 19 | **Facebook Post** | ❌ MISSING | No template | Build text template |
| 20 | **Twitter/X Post** | ❌ MISSING | No template | Build text template |
| 21 | **Blog Draft** | ❌ MISSING | No template | Build text template |
| 22 | **Email Draft** | ❌ MISSING | No template | Build text template |
| 23 | **YouTube Description** | ❌ MISSING | No template | Build text template |
| 24 | **Thumbnail Prompt** | ❌ MISSING | No AI prompt | Build template |
| 25 | **AI Image Prompt** | ❌ MISSING | No AI prompt | Build template |
| 26 | **AI Video Prompt** | ❌ MISSING | No AI prompt | Build template |

### Summary

| Status | Count | Items |
|--------|-------|-------|
| ✅ DONE | 8 | Product JSON, Theme, Style, Product Page, Review Page, Guide, Schema.org, SEO |
| ⚠️ NEEDS FIX | 4 | Images (sharp), OG path, Affiliate tags, Verification |

---

## 3. LAUNCH V1 ARCHITECTURE

The existing automation pipeline at `src/engine/automation/` is sufficient for V1.

Only these 4 modules need modification:
- `src/engine/automation/images.ts` — add sharp optimization
- `src/engine/seo/index.ts` — fix OG image path
- `src/engine/affiliate/` — add URL tag rewriter
- New: `scripts/verify.mjs` — post-publish verification

### 3.1 Core Types

```typescript
// The shared context passed through every stage
interface FactoryContext {
  source: ProductSource           // Original input
  scraped?: ScrapedData           // From extractor
  product?: GeneratedProduct      // From enricher
  design?: AIDesignConfig         // From detectDesign
  style?: StyleVariation          // From getStyleForProductIndex
  seo?: SEOData                   // From generateSEO
  schema?: object                 // From productSchema
  artifacts: FactoryArtifact[]    // All generated files
  warnings: string[]
  errors: string[]
  startTime: number
}

// Every output file the factory produces
interface FactoryArtifact {
  id: string                      // e.g., "product-json", "twitter-post"
  type: ArtifactType              // "json" | "image" | "text" | "html" | "prompt"
  label: string                   // Human-readable name
  path?: string                   // File path on disk
  content?: string                // Inline content (for text posts)
  size?: number                   // File size in bytes
}

type ArtifactType = "json" | "image" | "text" | "html" | "prompt" | "schema"
```

### 3.2 Stage Interface

```typescript
interface FactoryStage {
  name: string
  run(ctx: FactoryContext): Promise<FactoryContext>
}
```

Every stage is:
- **Independent** — receives context, returns augmented context
- **Skippable** — if a stage has already run or has no input, it passes through
- **Non-destructive** — never removes data from context

---

## 4. LAUNCH V1 BLOCKERS — Implementation Plan

### Blocker 1: Image Optimization (sharp → webp)
**File:** `src/engine/automation/images.ts`

After downloading source images, run sharp to produce:
- `{slug}-{label}.webp` — 1200px wide, webp quality 82
- `{slug}-{label}-thumb.webp` — 600px wide

### Blocker 2: OG Image Path Resolution
**File:** `src/engine/seo/index.ts`

The `generateSEO()` function reads `product.images[0]?.src` which may reference non-existent paths. Fix: verify the image file exists, fall back to a default OG image if missing.

### Blocker 3: Affiliate Tag Rewriter
**File:** `src/engine/affiliate/index.ts`

Add `appendAffiliateTag(url, store)` that injects `?tag=geetai-21` into known merchant URLs (Amazon.in, Flipkart, Croma, Reliance).

### Blocker 4: Batch Build Optimisation
**File:** `src/engine/automation/publisher.ts`

Support generating N product files, then running a single build instead of per-product builds.

### Blocker 5: Final Verification
**File:** `scripts/verify.mjs`

Post-publish script that checks: images exist on disk, no placeholder URLs, build succeeded, SEO title/desc present, affiliate tags present.



---

## 5. LAUNCH V1 CLI

```bash
# Single product
npm run publish -- https://amazon.in/dp/B0XXX --build

# From JSON
npm run publish -- '{"name":"iPhone 16","price":999}' --build

# AI-generated (no URL)
npm run publish:ai "MacBook Pro 16" "Apple" "laptops" --build
```

---

## 6. VISUAL ENHANCEMENTS (Launch-Safe)

| Enhancement | Implementation | Location | Priority |
|-------------|----------------|----------|----------|
| **Atropos tilt** | `npm i atropos`, new `ProductTiltCard` component | `src/components/ui/ProductTiltCard.tsx` | P1 |
| **Ken Burns CSS** | CSS animation class on hero images | `src/components/CoverSection.tsx` | P1 |
| **Section reveal** | Use existing `fadeInUp` from animation engine | Component-level wrapping | P2 |
| **Glass effects** | Already present in templates (cardStyle: "glass") | Template config → CSS | ✅ Already done |
| **CSS parallax** | `transform: translateZ()` on scroll containers | Template-level | P2 |

All visual work is additive — new components that wrap existing ones, zero engine changes.

---

## 7. PRE-PUBLISH QUALITY GATE

Every publish runs this checklist:

```
✅ Images: Exist on disk for product
✅ SEO: Title and Description present
✅ Links: No placeholder URLs (#, https://example)
✅ Affiliate: Amazon/Flipkart URLs have ?tag= tracking param
✅ Build: npm run build succeeds
✅ Tests: npm test passes
✅ Typecheck: tsc --noEmit passes
```


