# Folder Structure

```
geetai-template-engine/
├── .github/
│   └── workflows/
│       └── ci.yml                    # 3-job CI pipeline (quality, e2e, a11y)
│
├── e2e/
│   ├── a11y.spec.ts                  # Accessibility E2E tests (3 tests)
│   ├── navigation.spec.ts            # Navigation E2E tests (6 tests)
│   ├── review-page.spec.ts           # Review page E2E tests (5 tests)
│   └── search.spec.ts                # Search E2E tests (2 tests)
│
├── public/                           # Static assets (images, fonts)
│
├── scripts/
│   └── new-product.mjs               # Interactive CLI to scaffold a new product
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/                    # Admin panel pages
│   │   │   ├── layout.tsx            # Admin layout (sidebar + content area)
│   │   │   └── page.tsx              # Dashboard page (stat cards + data table)
│   │   │   ├── products/             # Product management
│   │   │   │   ├── page.tsx          # Product list (paginated table)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Edit product form
│   │   │   ├── new/                  # New product form
│   │   │   │   └── page.tsx
│   │   │   ├── categories/           # Category listing
│   │   │   │   └── page.tsx
│   │   │   ├── brands/               # Brand listing
│   │   │   │   └── page.tsx
│   │   │   ├── templates/            # Template configuration viewer
│   │   │   │   └── page.tsx
│   │   │   ├── themes/               # Theme picker
│   │   │   │   └── page.tsx
│   │   │   ├── seo/                  # SEO metadata viewer per product
│   │   │   │   └── page.tsx
│   │   │   ├── affiliate/            # Affiliate link management
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/            # Analytics dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── settings/             # Site settings
│   │   │   │   └── page.tsx
│   │   │   └── build/                # Build status display
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                      # API routes
│   │   │   └── products/
│   │   │       ├── route.ts          # GET (list) / POST (create)
│   │   │       └── [slug]/
│   │   │           └── route.ts      # GET / PUT / DELETE by slug
│   │   │
│   │   ├── export/
│   │   │   └── route.ts              # GET /export — JSON export all products
│   │   │
│   │   ├── guide/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Buying guide page
│   │   │
│   │   ├── review/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product review page
│   │   │
│   │   ├── rss.xml/
│   │   │   └── route.ts              # RSS 2.0 feed
│   │   │
│   │   ├── globals.css               # Global styles + CSS animations
│   │   ├── HomeCatalog.tsx           # Homepage product catalog section
│   │   ├── layout.tsx                # Root layout (providers + HTML shell)
│   │   ├── page.tsx                  # Homepage (hero + catalog)
│   │   ├── robots.ts                 # robots.txt configuration
│   │   └── sitemap.ts               # XML sitemap configuration
│   │
│   ├── cms/                          # CMS abstraction layer
│   │   ├── adapters/
│   │   │   └── index.ts             # CMS adapter (instantiated once, 13 exports)
│   │   ├── cache/
│   │   │   └── index.ts             # In-memory cache with TTL + LRU eviction
│   │   ├── config.ts                # CMS configuration (provider + cache settings)
│   │   ├── providers/
│   │   │   ├── index.ts             # Provider registry (factory pattern)
│   │   │   └── local.ts             # Local TypeScript provider (in-memory Map)
│   │   └── types/
│   │       └── index.ts             # ProviderId, ProductProvider interface
│   │
│   ├── components/                   # React components
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── DataTable.tsx         # Generic sortable/paginated table
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   ├── StatCard.tsx          # Metric display card
│   │   │   └── TopNav.tsx            # Admin top navigation bar
│   │   │
│   │   ├── animation/               # Animation wrapper components
│   │   │   ├── AnimatedSection.tsx   # Core animation wrapper (7 types)
│   │   │   ├── FadeIn.tsx            # Fade-in wrapper
│   │   │   ├── Floating.tsx          # Infinite float animation
│   │   │   ├── Parallax.tsx          # Scroll-driven parallax
│   │   │   ├── Reveal.tsx            # Clip-path reveal
│   │   │   ├── ScaleIn.tsx           # Scale-in wrapper
│   │   │   ├── SlideIn.tsx           # Directional slide-in
│   │   │   ├── StaggerContainer.tsx  # Staggered list container
│   │   │   └── StaggerItem.tsx       # Staggered list item
│   │   │
│   │   ├── hero/                    # Hero section components
│   │   │   ├── AuroraBackground.tsx  # Animated aurora gradient blobs
│   │   │   ├── FloatingMacbook.tsx   # 3D MacBook mockup with mouse tracking
│   │   │   ├── GlassFeatureCards.tsx  # Feature highlight cards
│   │   │   ├── Hero.tsx              # Main hero assembly
│   │   │   ├── HeroHeading.tsx       # Animated heading with CTA
│   │   │   ├── MouseGlow.tsx         # Cursor-following radial glow
│   │   │   └── ParticleField.tsx     # Canvas-based particle system
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Footer.tsx            # Site footer (4 columns)
│   │   │   └── Header.tsx            # Navigation header + search
│   │   │
│   │   ├── personalization/         # Personalization components
│   │   │   ├── RecentlyViewed.tsx    # Cross-tab persistent recently viewed
│   │   │   ├── RecommendedAccessories.tsx  # Accessory recommendations
│   │   │   ├── RelatedProducts.tsx   # Category-based related products
│   │   │   └── TrendingProducts.tsx   # Top-rated trending products
│   │   │
│   │   ├── providers/               # Context providers
│   │   │   ├── AnalyticsProvider.tsx  # Analytics script injection
│   │   │   ├── LenisProvider.tsx      # Smooth scrolling
│   │   │   ├── SentryProvider.tsx     # Error tracking
│   │   │   └── ThemeProvider.tsx      # CSS custom property injection
│   │   │
│   │   ├── search/                  # Search components
│   │   │   ├── SearchBar.tsx         # Search trigger button
│   │   │   ├── SearchModal.tsx       # Full-screen search modal
│   │   │   └── SearchProvider.tsx     # Search state context
│   │   │
│   │   ├── sections/                # Page section components
│   │   │   ├── BuyOptions.tsx        # Affiliate buy link listings
│   │   │   ├── ComparisonTable.tsx    # Product comparison grid
│   │   │   ├── CTA.tsx               # Call-to-action card
│   │   │   ├── CustomerReviews.tsx    # Review cards
│   │   │   ├── FAQ.tsx               # Accordion FAQ
│   │   │   ├── FeatureGrid.tsx       # Feature highlight grid
│   │   │   ├── ImageGallery.tsx      # Product image gallery
│   │   │   ├── ProsCons.tsx          # Pros/cons comparison
│   │   │   ├── StickyMobileCTA.tsx   # Fixed bottom bar (mobile)
│   │   │   ├── Specifications.tsx     # Spec table grouped by category
│   │   │   ├── TrustBar.tsx          # Brand trust indicators
│   │   │   ├── VariantPicker.tsx     # Color/storage/bundle selector
│   │   │   └── VideoSection.tsx      # Video embed section
│   │   │
│   │   ├── seo/                     # SEO components
│   │   │   ├── Breadcrumbs.tsx       # Semantic breadcrumb nav
│   │   │   ├── LoadMetrics.tsx       # Core Web Vitals reporting
│   │   │   ├── PreloadImages.tsx     # Image preload links
│   │   │   ├── ResourceHints.tsx     # Preconnect/prefetch hints
│   │   │   └── SchemaOrg.tsx         # JSON-LD structured data
│   │   │
│   │   ├── ui/                      # Base UI components
│   │   │   ├── Badge.tsx             # Status badge (6 variants)
│   │   │   ├── Button.tsx            # Animated button (4 variants, 3 sizes)
│   │   │   ├── Card.tsx              # Glass card with hover effect
│   │   │   ├── Container.tsx         # Max-width responsive container
│   │   │   ├── GlassCard.tsx         # Glass card with shimmer
│   │   │   ├── OptimizedImage.tsx    # Next.js Image with blur placeholder
│   │   │   ├── PriceCard.tsx         # Pricing card with feature list
│   │   │   ├── Rating.tsx            # Star rating display
│   │   │   ├── SectionTitle.tsx      # Animated section heading
│   │   │   └── Tags.tsx              # Tag badge list with overflow
│   │   │
│   │   └── i18n/                    # Internationalization components
│   │       ├── CurrencyDisplay.tsx   # Localized currency formatter
│   │       └── LocaleSwitcher.tsx    # Region dropdown selector
│   │
│   ├── data/                        # Product data
│   │   └── products/
│   │       ├── index.ts             # Re-exports all CMS functions
│   │       ├── registry.ts          # ProductCatalog (slug → Product mapping)
│   │       └── macbook-pro.ts       # MacBook Pro 16" M4 Pro product data
│   │
│   ├── engine/                      # Pure logic engines (zero JSX)
│   │   ├── affiliate/
│   │   │   └── index.ts            # Merchant ranking, sorting, pricing
│   │   ├── analytics/
│   │   │   ├── config.ts           # Event types, analytics config interface
│   │   │   ├── provider.ts         # Multi-provider event dispatching
│   │   │   └── scripts.ts          # Script tag generation
│   │   ├── animation/
│   │   │   └── index.ts            # Framer Motion variants and transitions
│   │   ├── assets/
│   │   │   └── ai/
│   │   │       ├── index.ts        # AI asset engine factory
│   │   │       ├── prompts.ts       # Context-aware prompt generation
│   │   │       └── types.ts        # AI provider types
│   │   ├── design/
│   │   │   ├── index.ts            # Glass, gradient, spacing utilities
│   │   │   └── ai.ts              # Auto-detect template + theme from category
│   │   ├── i18n/
│   │   │   ├── config.ts           # 6-region configuration
│   │   │   ├── index.ts            # Region exports
│   │   │   └── pricing.ts          # Currency conversion + formatting
│   │   ├── image/
│   │   │   └── index.ts            # Srcset, sizes, blur placeholder generation
│   │   ├── performance/
│   │   │   └── index.ts            # Resource hints, critical path
│   │   ├── personalization/
│   │   │   └── index.ts            # Recently viewed, trending, related
│   │   ├── product/
│   │   │   └── types.ts            # THE single Product type hub
│   │   ├── search/
│   │   │   └── index.ts            # 6-dimension product scoring
│   │   ├── sentry/
│   │   │   └── index.ts            # Error capture utilities
│   │   ├── templates/
│   │   │   └── index.ts            # 8 template configs + auto-selector
│   │   ├── theme/
│   │   │   ├── config.ts           # Active theme + getTheme()
│   │   │   ├── themes.ts           # 8 full theme definitions
│   │   │   └── types.ts            # Theme config type definitions
│   │   └── variant/
│   │       └── index.ts            # Variant application and defaults
│   │
│   ├── hooks/                      # React hooks
│   │   ├── useMousePosition.ts     # Mouse position tracker
│   │   └── useReducedMotion.ts     # prefers-reduced-motion detection
│   │
│   └── lib/                        # Shared utilities
│       ├── test-setup.ts           # Vitest + testing-library setup
│       ├── types.ts                # Shared type definitions
│       └── url.ts                  # URL safety utilities
│
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Vitest configuration
├── playwright.config.ts            # Playwright configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
└── package-lock.json               # Lockfile
```
