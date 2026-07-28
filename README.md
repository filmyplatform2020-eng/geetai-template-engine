# GeetAI Template Engine

> A production-grade Next.js template engine for building AI-powered product review, comparison, and buying guide pages. Ships with a complete admin panel, theme system, CMS abstraction, affiliate engine, and SEO infrastructure.

[![CI](https://github.com/geetai/template-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/geetai/template-engine/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## Features

- **Template Engine** — 8 product templates auto-selected by category (laptop, phone, watch, camera, perfume, audio, health, finance)
- **Theme System** — 8 complete themes (Apple, Luxury Dark, Minimal White, Gaming, Tech, Fashion, Health, Finance) with 21 color slots each
- **CMS Abstraction** — Provider-based data layer with support for local, JSON, Markdown, MDX, YAML, headless CMS, REST, GraphQL, Supabase, PostgreSQL
- **Affiliate Engine** — Multi-merchant buy link sorting, lowest-price detection, regional pricing with 6 locales (US, GB, IN, DE, AU, JP)
- **SEO Infrastructure** — Auto-generated Schema.org `@graph` (7 node types), Open Graph, Twitter Cards, sitemap, robots.txt, RSS feed
- **Admin Panel** — Full dashboard with CRUD, analytics, SEO preview, theme picker, affiliate management
- **Animation System** — Framer Motion animations (7 types), GSAP ScrollTrigger, CSS aurora effects, Lenis smooth scroll
- **AI Asset Generation** — Pluggable AI engine for generating product images via OpenAI, Replicate, Stability AI
- **Image Optimization** — AVIF/WebP, blur placeholders, responsive srcset, lazy loading
- **Internationalization** — 6-region i18n with currency conversion, tax handling, locale-aware affiliate URLs
- **Personalization** — Recently viewed, trending products, related products, recommended accessories
- **Analytics** — Multi-provider analytics (GA4, GTM, Clarity, Meta Pixel, Pinterest) with scroll depth and event tracking
- **Error Tracking** — Sentry integration with structured error capture
- **Zero TypeScript Errors** — Strict mode, 146+ files, `tsc --noEmit` clean
- **Zero Circular Dependencies** — Strict layered DAG architecture

---

## Quick Start

```bash
git clone https://github.com/geetai/template-engine.git
cd template-engine
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run tests (Vitest, watch mode) |
| `npm run test:run` | Run tests (single run) |
| `npm run test:e2e` | Run Playwright E2E tests (headless) |
| `npm run test:e2e:ui` | Run Playwright E2E tests (UI mode) |
| `npm run new-product` | Interactive CLI to scaffold a new product |

---

## Project Structure

```
src/
  app/          # Next.js App Router pages and API routes
  components/   # React components (UI, layout, animation, SEO)
  engine/       # Pure logic modules (no JSX)
  cms/          # CMS abstraction layer (providers, cache, adapters)
  data/         # Product data (registry + individual product files)
  hooks/        # React hooks (useReducedMotion, useMousePosition)
  lib/          # Shared utilities (types, test setup)
```

---

## Architecture

```
app/ (pages) → components/ (UI) → engine/ (logic) → cms/ + data/ (data)
```

Data flows unidirectionally. Server components fetch data via the CMS adapter and pass it to client components. Engines are pure logic with zero UI dependencies.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams and explanations.

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Complete architecture, data flow, rendering flow |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Full folder tree with explanations |
| [THEME_ENGINE.md](./THEME_ENGINE.md) | Theme system, how to create a theme |
| [CMS.md](./CMS.md) | CMS abstraction, providers, how to add one |
| [ADMIN.md](./ADMIN.md) | Admin panel features and usage |
| [SEO.md](./SEO.md) | SEO engine, schema, metadata, sitemap, RSS |
| [AFFILIATE.md](./AFFILIATE.md) | Affiliate engine, merchant ranking, regional pricing |
| [IMAGE_ENGINE.md](./IMAGE_ENGINE.md) | Image optimization and the OptimizedImage component |
| [ANIMATION.md](./ANIMATION.md) | Animation system: Framer Motion, GSAP, CSS, Lenis |
| [TEMPLATE_REGISTRY.md](./TEMPLATE_REGISTRY.md) | Template engine, how to create a template |
| [PRODUCT_SCHEMA.md](./PRODUCT_SCHEMA.md) | Product type schema with all fields documented |
| [API_REFERENCE.md](./API_REFERENCE.md) | All API endpoints |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Build process, CI/CD, deployment guides |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributing guidelines |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## License

Private — internal use.
