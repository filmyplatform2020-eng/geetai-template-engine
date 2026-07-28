# Admin Panel

The admin panel provides a full content management interface at `/admin/`. It includes dashboard analytics, CRUD for products, theme and template management, SEO preview, affiliate link tracking, and build status monitoring.

---

## Access

Navigate to `/admin` on your running instance. The admin panel is structured as a sidebar-navigated SPA-like experience with fixed layout.

---

## Pages

### Dashboard (`/admin`)

8 stat cards showing aggregate metrics:

| Metric | Description |
|--------|-------------|
| Total Products | Count from CMS |
| Categories | Unique category count |
| Brands | Unique brand count |
| Reviews | Sum of all product reviews |
| Avg Rating | Mean rating across all products |
| Affiliate Stores | Unique store count |
| Low Stock | Products with no available buy links |
| Product Count | (duplicated — total products) |

Below the stats: a full data table of all products with search, column sorting, and pagination.

---

### Products (`/admin/products`)

Paginated data table showing all products with columns: Name, Brand, Category, Price, Rating, Reviews, Actions (Edit/Delete).

**New Product** (`/admin/new`): Form with fields:
- Slug (auto-generated from name)
- Product name, Brand, Tagline, Description
- Price, Original price, Currency
- Category, Tags
- Submits POST to `/api/products`

**Edit Product** (`/admin/products/[slug]`): Update form that PUTs to `/api/products/[slug]`

---

### Categories (`/admin/categories`)

Read-only table: Category name, Product count, Average rating.

---

### Brands (`/admin/brands`)

Read-only table: Brand name, Product count, Average rating.

---

### Templates (`/admin/templates`)

Shows which template is auto-selected for each category, with visual badges for hero layout, gallery style, and CTA style per template.

---

### Themes (`/admin/themes`)

Theme picker grid showing the active theme with color swatches for primary, secondary, and accent colors. Clicking a theme sets it as active via the config.

---

### SEO (`/admin/seo`)

Per-product accordion showing auto-generated:
- Title tag (with length check)
- Meta description (with length check)
- Canonical URL
- Robots directive
- Full Schema.org JSON-LD (`@graph` with 7 nodes)

---

### Affiliate (`/admin/affiliate`)

Stats cards:
- Total links, Available, Unavailable, Average price

Data table: Store, Product, Slug, Price, Status (Available/Unavailable via badge), Badge label.

---

### Analytics (`/admin/analytics`)

Stats cards: Products, Categories, Reviews, Avg Rating, Brands, Buy Links, Affiliates, Page Views.

Provider info section showing configured analytics providers (GA4, GTM, Clarity, Meta, Pinterest).

---

### Settings (`/admin/settings`)

Site name, Base URL (from env or config), CMS provider info (read-only — change in `src/cms/config.ts`).

---

### Build Status (`/admin/build`)

Status cards for Build, TypeScript, and Tests with pass/fail indicators. CI pipeline description showing the 3-job workflow.

---

## Services

```typescript
// src/admin/services/analytics.ts
analyticsService.getSummary()  // Computes aggregate analytics from CMS data

// src/admin/services/affiliate.ts
affiliateService.getAllLinks() // Flattens all buyLinks from all products
affiliateService.getStores()   // Unique store names
affiliateService.getStats()    // Total, available, unavailable, average price
```

## Hooks

```typescript
useNotifications()  // Returns { notifications, add, dismiss, markRead, clear }
                    // Auto-removes notifications after 5 seconds
```

## Components

| Component | Description |
|-----------|-------------|
| `Sidebar` | 11 nav items with active state detection, collapsible (60px ↔ 240px) |
| `TopNav` | Title + notification dropdown |
| `DataTable<T>` | Generic sortable/paginated/searchable table with loading state |
| `StatCard` | Label + value metric display with optional change indicator |

---

## Extending the Admin

Add a new admin page:

1. Create `src/app/admin/your-page/page.tsx`
2. Import admin layout (it wraps all sub-routes)
3. Add nav item in `src/components/admin/Sidebar.tsx`
4. Use `DataTable`, `StatCard` components as needed
