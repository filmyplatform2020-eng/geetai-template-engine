# Architecture

## Layered Architecture (DAG)

The codebase enforces a **strict unidirectional dependency graph**. No layer may import from a layer above it.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        app/ (Pages)                                │
│  Server Components · Client Components · API Routes · Metadata     │
│  generateStaticParams · generateMetadata                           │
└────────────────────────┬────────────────────────────────────────────┘
                         │ imports
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     components/ (UI Layer)                          │
│  Hero · Cards · Gallery · Sections · SEO · Providers               │
│  Animation wrappers · Search · Layout · i18n                       │
└────────────────────────┬────────────────────────────────────────────┘
                         │ imports
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      engine/ (Logic Layer)                          │
│  theme/ · templates/ · affiliate/ · seo/ · image/ · variant/       │
│  search/ · analytics/ · i18n/ · sentry/ · performance/             │
│  personalization/ · design/ · product/ (types) · assets/ai/        │
└────────────────────────┬────────────────────────────────────────────┘
                         │ imports
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    cms/ + data/ (Data Layer)                        │
│  CMS providers · Cache · Adapters · Product data files             │
└─────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- `app/` may import from `components/`, `engine/`, `cms/`, `data/`, `lib/`, `hooks/`
- `components/` may import from `engine/`, `hooks/`, `lib/`
- `engine/` may import from nothing outside `engine/` (pure logic)
- `cms/` may import from `engine/` (for types)
- `data/` may import from `engine/` (for types)
- No circular imports are permitted — enforced by tooling

---

## Data Flow

```mermaid
sequenceDiagram
    participant Browser
    participant NextServer as Next.js Server
    participant CMS as CMS Adapter
    participant Cache as Cache Layer
    participant Provider as CMS Provider
    participant Data as Product Data

    Note over Browser,Data: Static Generation (Build Time)
    NextServer->>CMS: getProduct(slug)
    CMS->>Cache: getOrSet(product:{slug})
    Cache->>Provider: fetch()
    Provider->>Data: read product file
    Data-->>Provider: Product object
    Provider-->>Cache: cache & return
    Cache-->>CMS: Product
    CMS-->>NextServer: Product

    NextServer->>NextServer: generateMetadata(product)
    NextServer->>NextServer: generateStaticParams()

    Note over Browser,Data: Runtime API
    Browser->>NextServer: GET /api/products/[slug]
    NextServer->>CMS: getProduct(slug)
    CMS-->>NextServer: Product (JSON)
    NextServer-->>Browser: { product }

    Note over Browser,Data: Client-side Personalization
    Browser->>Browser: localStorage (recently viewed)
    Browser->>Browser: searchProducts() (in-memory)
```

---

## Rendering Flow

```mermaid
graph TD
    A[Request /review/macbook-pro-16-m4] --> B{Static?}
    B -->|Yes| C[Serve pre-rendered HTML]
    B -->|No, first visit| D[Server Component]
    D --> E[generateStaticParams]
    D --> F[generateMetadata]
    F --> G[SEO meta tags + Schema.org]
    D --> H[Render ReviewPageClient]

    H --> I[Client Component Hydrates]
    I --> J[Hero Section]
    I --> K[FeatureGrid]
    I --> L[ImageGallery]
    I --> M[Specifications]
    I --> N[ProsCons]
    I --> O[ComparisonTable]
    I --> P[BuyOptions]
    I --> Q[CustomerReviews]
    I --> R[FAQ]
    I --> S[StickyMobileCTA]

    J --> T[AuroraBackground + ParticleField + MouseGlow]
    J --> U[HeroHeading]
    J --> V[FloatingMacbook]

    subgraph "Server Component"
        D
        E
        F
        G
        H
    end

    subgraph "Client Component"
        I
        J
        K
        L
        M
        N
        O
        P
        Q
        R
        S
    end
```

---

## Component-Page Relationship

```mermaid
graph LR
    subgraph "Review Page /review/[slug]"
        RPC[ReviewPageClient]
        H[Hero]
        TB[TrustBar]
        BC[Breadcrumbs]
        VP[VariantPicker]
        FG[FeatureGrid]
        IG[ImageGallery]
        VS[VideoSection]
        SP[Specifications]
        PC[ProsCons]
        CT[ComparisonTable]
        BO[BuyOptions]
        CR[CustomerReviews]
        FAQ[FAQ]
        CTA[CTA]
        SCTA[StickyMobileCTA]
    end

    subgraph "Guide Page /guide/[slug]"
        GPC[GuidePageClient]
        GH[Guide Header]
        QV[Quick Verdict]
        GS[Guide Sections]
        BA[Best Alternatives]
        RA[RecommendedAccessories]
        GFAQ[Still Have Questions]
        GCTA[CTA]
    end

    subgraph "Admin /admin/*"
        AD[Admin Dashboard]
        AP[Admin Products]
        AT[Admin Templates]
        ATH[Admin Themes]
        ASEO[Admin SEO]
        AAF[Admin Affiliate]
        AAN[Admin Analytics]
    end
```

---

## Engine Architecture

```mermaid
graph TD
    subgraph "Engines"
        TE[Theme Engine<br/>8 themes · 21 colors each]
        TPE[Template Engine<br/>8 templates · auto-select]
        AE[Affiliate Engine<br/>Merchant ranking · pricing]
        SE[SEO Engine<br/>Schema · OG · Twitter]
        IE[Image Engine<br/>Srcset · blur · sizes]
        VE[Variant Engine<br/>Color · storage · bundle]
        SCE[Search Engine<br/>6-dimension scoring]
        ANE[Analytics Engine<br/>GA4 · GTM · Clarity · Meta · Pinterest]
        I18NE[i18n Engine<br/>6 regions · currency · tax]
        PSE[Personalization Engine<br/>Recent · trending · related]
        PE[Performance Engine<br/>Resource hints · critical path]
        ERE[Error Engine<br/>Sentry integration]
        DE[Design Engine<br/>Glass · gradients · auto-detect]
        AIE[AI Asset Engine<br/>DALL-E · SDXL · Stability]
    end

    TE --> DE
    TPE --> TE
    AE --> I18NE
    SE --> AE
    VE --> AE
    PSE --> SCE
```

---

## Data Flow for a Product Page Request

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant N as Next.js
    participant CMS as CMS Adapter
    participant E as Engines
    participant D as Data

    U->>B: Click product link
    B->>N: GET /review/macbook-pro-16-m4

    Note over N: Server Component
    N->>CMS: getProduct("macbook-pro-16-m4")
    CMS->>D: read product data
    D-->>CMS: Product object
    CMS-->>N: Product

    N->>E: generateSEO(product)
    E-->>N: SEOData (title, OG, Twitter, canonical)
    N->>E: productSchema(product)
    E-->>N: Schema.org @graph (7 nodes)

    Note over N: generateMetadata()
    N-->>B: HTML head (meta tags + JSON-LD)

    N->>N: Render HTML (server)
    N-->>B: Static HTML + JS bundle

    Note over B: Client Hydration
    B->>B: Hydrate React
    B->>E: getTemplateForCategory(category)
    B->>E: sortBuyLinks(buyLinks)
    B->>B: Track analytics events
    B->>B: Init animations (Framer Motion)
    B->>B: Init smooth scroll (Lenis)
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Strict layered DAG | Prevents circular imports, enforces separation of concerns |
| Single Product type hub | `engine/product/types.ts` imported by 36 files — change schema once |
| CMS provider pattern | Swap data sources with one config change; supports 10 provider types |
| Template auto-selection | `getTemplateForCategory(category)` maps products to layouts without manual config |
| Server/client split | Data fetching and metadata in server components; interactivity in client components |
| Static generation | All product pages pre-rendered at build time via `generateStaticParams()` |
| Inline SVG blur placeholders | Zero network requests for image placeholders |
| Analytics multi-provider | Push to all configured providers simultaneously from one `trackEvent()` call |
| Theme as CSS custom properties | Themes inject variables on `:root` — no runtime CSS generation |
| Personalization via localStorage | Recently viewed persists across sessions without a backend |

---

## Future Extension Points

- **New CMS provider** — Implement `ProductProvider` interface in `src/cms/providers/` and register it
- **New template** — Add a `TemplateConfig` entry in `src/engine/templates/`
- **New theme** — Add a `ThemeConfig` entry in `src/engine/theme/themes.ts`
- **New AI provider** — Add generation logic in `src/engine/assets/ai/` and register in `createAIAssetEngine()`
- **New analytics provider** — Add push function in `src/engine/analytics/provider.ts`
- **New locale** — Add region config in `src/engine/i18n/config.ts`
- **New product data source** — Implement `ProductProvider` interface and swap CMS config
- **Custom page type** — Follow the review/guide page pattern: server component → metadata → client component
