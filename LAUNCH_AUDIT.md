# LAUNCH AUDIT — GeetAI Template Engine

> Phase 1 of Launch Workflow
> Generated: 2026-07-28

---

## Project Vision

This is an **AI-powered Product Publishing Engine**. The goal: generate and publish thousands of premium product pages using one master template. For every product we only need product info, images, merchant links, category, and theme colour — everything else auto-generated.

---

## 1. Current Architecture Status

| Component | Status |
|-----------|--------|
| Next.js 16.2.12 + React 19.2.4 | ✅ |
| TypeScript 5.x | ✅ |
| Tailwind CSS v4 | ✅ |
| Framer Motion 12.x + GSAP 3.x | ✅ |
| Glass UI system (CSS vars + utility classes) | ✅ |
| AI Engine (Gemini SDK) | ✅ Built, needs API key |
| Design Engine | ✅ |
| Search Engine | ✅ |
| Personalization Engine | ✅ |
| i18n / Pricing Engine | ✅ |
| Analytics Engine (wired but dead) | ⚠️ Commented out |
| SEO Engine | ✅ Partial |
| Affiliate Engine | ⚠️ Placeholder URLs |
| CMS Engine | ✅ |
| Sentry (package not installed) | ❌ |

---

## 2. Existing Templates (8)

| Template | Category Mappings | Products Covered |
|----------|------------------|-----------------|
| `laptop` | laptops, computers, tablets | 7 products |
| `phone` | phones, smartphones, mobile | 2 products |
| `watch` | watches, wearables | 1 product |
| `camera` | cameras, photography | 1 product |
| `perfume` | fragrance, perfume, beauty | 0 products |
| `audio` | audio, headphones, speakers | 1 product |
| `health` | health, fitness, wellness | 0 products |
| `finance` | finance, business, software | 0 products |

**Gap:** 12/19 products (63%) fall back to laptop template — monitors, gaming, earbuds, drones, ereaders, vr-headsets, speakers, accessories have no dedicated template.

---

## 3. Existing Section Components (17)

```
BuyOptions, ComparisonTable, CoverSection, CTA, CustomerReviews, FAQ,
FeatureGrid, ImageGallery, MerchantComparison, ProsCons, Specifications,
StickyBuyBar, StickyMobileCTA, TrustBar, VariantPicker, Verdict, VideoSection
```

**Gap:** `GlassSection` component exists but is not used anywhere.

---

## 4. Existing Pages

| Page Type | Route | Pages Generated | Status |
|-----------|-------|----------------|--------|
| Review | `/review/[slug]` | 19 | ✅ Full features + OG + Schema |
| Guide | `/guide/[slug]` | 19 | ⚠️ OG + Schema MISSING |
| Homepage | `/` | 1 | ⚠️ Minimal (3 sections), no OG |
| Export | `/export` | 1 | ✅ |
| RSS | `/rss.xml` | 1 | ✅ Functional |
| Sitemap | `/sitemap.xml` | 1 | ✅ Functional |
| Robots | `/robots.txt` | 1 | ⚠️ No /admin disallow |
| Admin (12 pages) | `/admin/*` | 12 | ⚠️ No auth, no persistence |
| API (5 routes) | `/api/*` | — | ⚠️ No auth, in-memory only |

---

## 5. Products (19 total)

| Slug | Category | Template | originalPrice | Has real images |
|------|----------|----------|---------------|-----------------|
| macbook-pro-16-m4 | laptops | laptop | $3,499 | ❌ |
| macbook-air-15-m3 | laptops | laptop | $1,499 | ❌ |
| dell-xps-16-2025 | laptops | laptop | $1,999 | ❌ |
| iphone-16-pro-max | phones | phone | $1,299 | ❌ |
| galaxy-s25-ultra | phones | phone | $1,499 | ❌ |
| sony-wh-1000xm6 | audio | audio | — missing | ❌ |
| ipad-pro-13-m4 | tablets | laptop | $1,399 | ❌ |
| apple-watch-ultra-3 | wearables | watch | $899 | ❌ |
| ps5-pro | gaming | laptop (fallback) | $699 | ❌ |
| sony-a7v | cameras | camera | — missing | ❌ |
| samsung-qd-oled-49 | monitors | laptop (fallback) | $2,299 | ❌ |
| airpods-pro-3 | earbuds | laptop (fallback) | $249 | ❌ |
| nintendo-switch-2 | gaming | laptop (fallback) | — missing | ❌ |
| meta-quest-4 | vr-headsets | laptop (fallback) | $599 | ❌ |
| dji-air-4 | drones | laptop (fallback) | $1,399 | ❌ |
| kindle-scribe-2 | ereaders | laptop (fallback) | $419 | ❌ |
| apple-studio-display-2 | monitors | laptop (fallback) | $1,699 | ❌ |
| logitech-mx-master-4s | accessories | laptop (fallback) | — missing | ❌ |
| sonos-era-300 | speakers | laptop (fallback) | $449 | ❌ |

---

## 6. Style Variations (10)

cosmic-purple, gold-noir, azure, cyberpunk-neon, tech-blue, rose-gold, emerald, navy, midnight-indigo, crimson

Products cycle via `index % 10` — functional but shared.

---

## 7. API Integrations

| Integration | Status |
|-------------|--------|
| Gemini AI | ✅ Installed, engine built. Needs API key to run |
| Google Analytics | ⚠️ Config exists but commented out |
| Google Tag Manager | ⚠️ Config exists but commented out |
| Microsoft Clarity | ⚠️ Config exists but commented out |
| Meta Pixel | ⚠️ Config exists but commented out |
| Pinterest Tag | ⚠️ Config exists but commented out |
| Sentry | ❌ Code exists but `@sentry/nextjs` not installed |
| Affiliate Networks | ❌ No network integration — all URLs are bare domains |

---

## 8. Tests (14 unit + ~12 e2e)

```
✓ 14 unit tests (affiliate, seo, search, personalization)
✓ ~12 E2E tests (navigation, review-page, search, a11y)
```

**Gaps:** No admin tests, no API tests, no UI component tests.

---

## 9. Documentation

**17 markdown files — excellent coverage:**
ARCHITECTURE.md, FOLDER_STRUCTURE.md, THEME_ENGINE.md, CMS.md, ADMIN.md, SEO.md, AFFILIATE.md, IMAGE_ENGINE.md, ANIMATION.md, TEMPLATE_REGISTRY.md, PRODUCT_SCHEMA.md, API_REFERENCE.md, DEPLOYMENT.md, CONTRIBUTING.md, CHANGELOG.md, AGENTS.md, CLAUDE.md

Plus README.md (114 lines) with badges and quick start.

**Missing:** `.env.example`

---

## 10. Duplicate Code

- `src/components/ui/GlassSection.tsx` — exists but is unused
- `src/components/analytics/AnalyticsProvider.tsx` — exists but unused, all config commented out
- `src/engine/sentry/` — all code, package not installed

---

## 11. Unused Components

| Component | Why Unused |
|-----------|-----------|
| `GlassSection.tsx` | Never imported anywhere |
| `AnalyticsProvider.tsx` | Not imported in layout.tsx |
| `TrackScroll.tsx` | Not wired into any page |
| `TrackEvent.tsx` | Not wired into any page |

---

## 12. Missing Production Assets

- **Images:** `/public/images/` is EMPTY. All 19 products reference images that don't exist.
- **Favicon:** No custom favicon.
- **Manifest:** No PWA manifest.json.
- **Deployment config:** No `vercel.json`, no Dockerfile, no `.github/workflows/` CI/CD.

---

## 13. Launch Checklist Summary

### 🔴 CRITICAL (Must fix before launch)

| # | Issue | Impact |
|---|-------|--------|
| C1 | **No product images** — `/public/images/` empty, 19 products broken | Every page has broken images |
| C2 | **No affiliate links** — all URLs are bare `amazon.com`, no `?tag=` | $0 affiliate revenue |
| C3 | **Homepage has no OG/Twitter/Schema** — root layout: only title + description | No social preview when shared |
| C4 | **No error pages** — missing `error.tsx`, `not-found.tsx`, `loading.tsx` | Null UX on 404/errors |

### 🟡 HIGH

| # | Issue | Impact |
|---|-------|--------|
| H1 | **`@sentry/nextjs` not installed** — sentry code will crash at runtime | Potential crash on errors |
| H2 | **`sharp` not installed** (Next.js requires it for production images) | Image optimization degraded |
| H3 | **Analytics all commented out, provider not wired** | Zero insight from day 1 |
| H4 | **Guide pages lack OG/Twitter/Schema metadata** | Guide pages invisible on social |
| H5 | **12/19 products use laptop template (wrong category)** | Suboptimal product display |

### 🟢 MEDIUM

| # | Issue | Impact |
|---|-------|--------|
| M1 | No `.env.example` | Poor DX for new developers |
| M2 | No PWA support (manifest, service worker) | No install prompt, no offline |
| M3 | No security headers (CSP, HSTS) in next.config | Security risk |
| M4 | No CI/CD pipeline (`.github/workflows/`) | No automated deploy |
| M5 | No admin auth — `/admin/*` open to anyone | Security risk |
| M6 | No API auth — `/api/*` open to anyone | Data exposure risk |
| M7 | 4 products missing `originalPrice` | No discount badge shown |
| M8 | RSS feed pubDate is unstable (changes per request) | Feed readers may misbehave |

### 🔵 LOW

| # | Issue | Impact |
|---|-------|--------|
| L1 | Homepage only 3 sections | Could be richer |
| L2 | Sitemap sparse — no category pages, no admin disallow | Minor SEO gap |
| L3 | Perfume/health/finance templates have 0 products | Unused code |
| L4 | Admin settings not persistent (useState only) | Minor UX gap |
| L5 | Unused GlassSection component | Already built, just unwired |

---

## Next Step

Proceed to **Phase 2 — LAUNCH_PLAN.md** with milestone breakdown.

Wait for user approval before writing any code.
