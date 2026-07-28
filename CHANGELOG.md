# Changelog

## [0.1.0] — 2025-07-28

### Initial Release

**Architecture**
- Strict layered DAG: `app/ → components/ → engine/ → cms/ + data/`
- Single Product type hub in `engine/product/types.ts` (imported by 36 files)
- Zero circular dependencies, zero TypeScript errors
- 146+ TS/TSX files, ~7,841 LOC

**Template Engine**
- 8 product templates with auto-selection by category
- Category → template mapping for laptops, phones, watches, cameras, perfume, audio, health, finance
- Template configs control hero layout, gallery style, CTA style, card style, animation intensity, typography, background effects

**Theme System**
- 8 complete themes: Apple, Luxury Dark, Minimal White, Gaming, Tech, Fashion, Health, Finance
- Each theme: 21 color slots, 7 typography settings, 5 glass properties, 6 animation parameters, 4 layout properties
- CSS custom property injection via ThemeProvider (zero runtime overhead)

**CMS Abstraction**
- Provider interface with 10 required/optional methods
- 10 provider types: local, JSON, markdown, MDX, YAML, headless, REST, GraphQL, Supabase, PostgreSQL
- In-memory cache with TTL + LRU eviction
- Factory pattern provider registry

**Pages**
- Homepage with hero section + product catalog
- Review pages (`/review/[slug]`) — full product reviews with all sections
- Guide pages (`/guide/[slug]`) — buying guides with alternatives and accessories
- Admin panel — 11 pages (dashboard, products, categories, brands, templates, themes, SEO, affiliate, analytics, settings, build status)

**API**
- `GET /api/products` — list all products
- `POST /api/products` — create product
- `GET /api/products/[slug]` — get product
- `PUT /api/products/[slug]` — update product
- `DELETE /api/products/[slug]` — delete product
- `GET /export` — flat JSON export
- `GET /rss.xml` — RSS 2.0 feed

**SEO**
- Auto-generated Schema.org `@graph` with 7 node types
- Open Graph and Twitter Card metadata
- Dynamic sitemap.xml, robots.txt
- RSS 2.0 feed
- Breadcrumbs, resource hints, image preloading
- Core Web Vitals reporting (LCP, FID, CLS)

**Affiliate Engine**
- 3-tier merchant priority ranking
- Automatic price comparison and savings calculation
- 6-region i18n: US, GB, IN, DE, AU, JP
- Regional affiliate URL rewriting
- Currency conversion with tax handling

**Animation System**
- Framer Motion: 7 animation types, stagger, parallax, floating, reveal
- GSAP: ScrollTrigger hero fade-out
- CSS: Aurora background, float, shimmer, pulse, twinkle
- Lenis smooth scrolling (lerp 0.08)
- `useReducedMotion` accessibility hook

**Image Engine**
- Responsive srcset/sizes generation
- Inline SVG blur placeholders (zero network requests)
- OptimizedImage component with lazy loading and priority flag

**Analytics**
- Multi-provider: GA4, GTM, Clarity, Meta Pixel, Pinterest
- Event tracking: product view, affiliate click, search, scroll depth, CTA clicks, variant changes, gallery clicks
- Scroll depth tracking at 25/50/75/90/100%

**Error Tracking**
- Sentry integration with structured capture (errors, 404s, broken images, affiliate failures, hydration mismatches)

**Personalization**
- Recently viewed (localStorage, cross-tab sync via useSyncExternalStore)
- Trending products (rating × reviewCount scoring)
- Related products (category + tag matching)
- Recommended accessories

**Search Engine**
- 6-dimension scoring: name (10x), brand (8x), tags (6x), category (5x), description (4x), features (3x)
- Real-time filtering by category, brand, price range, rating, tags
- Keyboard navigation in search modal

**DevOps**
- CI pipeline: quality → e2e → a11y
- 14 passing unit tests
- 16 E2E tests across Chromium, Firefox, iPhone 15
- Interactive `new-product` CLI script
- TypeScript strict mode
- ESLint with Next.js + TypeScript rules

**Components**
- 23 UI components (Container, Button, Card, GlassCard, PriceCard, Badge, Tags, Rating, SectionTitle, OptimizedImage)
- 7 hero components (Hero, AuroraBackground, ParticleField, FloatingMacbook, GlassFeatureCards, HeroHeading, MouseGlow)
- 13 section components (FeatureGrid, ImageGallery, VideoSection, Specifications, ProsCons, ComparisonTable, BuyOptions, CustomerReviews, FAQ, CTA, VariantPicker, StickyMobileCTA, TrustBar)
- 9 animation components (AnimatedSection, FadeIn, ScaleIn, SlideIn, Reveal, Floating, Parallax, StaggerContainer, StaggerItem)
- 5 SEO components (SchemaOrg, Breadcrumbs, ResourceHints, PreloadImages, LoadMetrics)
- 4 personalization components (RelatedProducts, RecentlyViewed, TrendingProducts, RecommendedAccessories)
- 4 provider components (ThemeProvider, LenisProvider, SentryProvider, AnalyticsProvider)
- 2 search components (SearchBar, SearchModal)
- 2 layout components (Header, Footer)
- 2 i18n components (CurrencyDisplay, LocaleSwitcher)
- 4 admin components (DataTable, Sidebar, StatCard, TopNav)

**Hooks**
- `useReducedMotion()` — prefers-reduced-motion detection
- `useMousePosition()` — mouse tracking with normalized coordinates

**Data**
- MacBook Pro 16" M4 Pro as reference product implementation
- Full product data: 6 features, 21 specs, 4 reviews, 5 FAQs, comparison, 4 buy links, 3 alternatives, 4 accessories
