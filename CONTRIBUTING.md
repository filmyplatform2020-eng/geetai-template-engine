# Contributing

## Development Setup

```bash
git clone https://github.com/geetai/template-engine.git
cd template-engine
npm install
npm run dev
```

---

## Code Standards

### Architecture Rules

- **No circular imports** — the layered DAG must be maintained. `app/ → components/ → engine/ → cms/ + data/`. Never import from a higher layer.
- **No JSX in `engine/`** — engines are pure logic modules. Keep UI in `components/`.
- **Single type hub** — `Product` type is defined in `engine/product/types.ts`. Do not redefine it elsewhere.
- **Server/client separation** — data fetching and metadata in server components. Interactivity in client components.

### TypeScript

- Strict mode enabled
- `tsc --noEmit` must pass before any PR
- No `any` types. Use `unknown` and type guards when necessary
- No `as` type assertions unless absolutely unavoidable

### Naming Conventions

- **Files**: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- **Components**: PascalCase
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for config values, camelCase for module-level constants

### CSS/Tailwind

- Use Tailwind utility classes for styling
- CSS custom properties from the theme engine for theming (e.g., `var(--primary)`)
- Component-level styles in `globals.css` only for keyframe animations
- No CSS module files

---

## Pull Request Process

1. Create a feature branch from `main`
2. Write or update tests as needed
3. Run the full quality check:
   ```bash
   npm run lint
   npm run typecheck
   npm run test:run
   npm run build
   ```
4. If adding or changing components, verify E2E tests pass:
   ```bash
   npx playwright install --with-deps chromium
   npm run test:e2e
   ```
5. Open a PR against `main` with a descriptive title and summary of changes

---

## Testing

### Unit Tests (Vitest)

```bash
npm run test:run        # Single run
npm test                # Watch mode
npm run test -- --coverage  # With coverage
```

Test files co-locate with source files as `*.test.ts`. Current test areas:

- `engine/seo/` — SEO generation
- `engine/affiliate/` — Buy link sorting and pricing
- `engine/search/` — Product search scoring
- `engine/personalization/` — Related products and trending

### E2E Tests (Playwright)

```bash
npm run test:e2e         # Headless
npm run test:e2e:ui      # UI mode
```

Test files in `e2e/`:
- `navigation.spec.ts` — Page loads, navigation, keyboard shortcuts
- `review-page.spec.ts` — Product review page rendering
- `search.spec.ts` — Search modal functionality
- `a11y.spec.ts` — Accessibility checks

### Adding Tests

- Unit tests should test logic in isolation (mock data, not the CMS)
- E2E tests should test user flows from the browser
- Accessibility tests should check ARIA labels, keyboard navigation, and semantic HTML

---

## Adding a New Product

```bash
npm run new-product
```

Follow the interactive prompts. For manual creation, see [PRODUCT_SCHEMA.md](./PRODUCT_SCHEMA.md).

---

## Adding a New Template

See [TEMPLATE_REGISTRY.md](./TEMPLATE_REGISTRY.md).

---

## Adding a New Theme

See [THEME_ENGINE.md](./THEME_ENGINE.md).

---

## Adding a New CMS Provider

See [CMS.md](./CMS.md).

---

## Code Review Checklist

- [ ] No circular imports introduced
- [ ] `engine/` contains no JSX
- [ ] Product type not redefined
- [ ] Server/client component split is correct
- [ ] Tests pass (`npm run test:run`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No `any` types added
- [ ] No hardcoded theme values — use CSS custom properties from theme engine
- [ ] New components follow existing patterns (animation variants, glass styling, etc.)
