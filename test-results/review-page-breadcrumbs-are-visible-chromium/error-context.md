# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: review-page.spec.ts >> breadcrumbs are visible
- Location: e2e/review-page.spec.ts:8:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/review/macbook-pro-16-m4
Call log:
  - navigating to "http://localhost:3000/review/macbook-pro-16-m4", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test"
  2  | 
  3  | test("review page loads with correct metadata", async ({ page }) => {
  4  |   await page.goto("/review/macbook-pro-16-m4")
  5  |   await expect(page).toHaveTitle(/MacBook Pro/)
  6  | })
  7  | 
  8  | test("breadcrumbs are visible", async ({ page }) => {
> 9  |   await page.goto("/review/macbook-pro-16-m4")
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/review/macbook-pro-16-m4
  10 |   await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible()
  11 | })
  12 | 
  13 | test("buy options section renders", async ({ page }) => {
  14 |   await page.goto("/review/macbook-pro-16-m4")
  15 |   await expect(page.getByText(/Buy MacBook Pro/)).toBeVisible()
  16 | })
  17 | 
  18 | test("FAQ section is interactive", async ({ page }) => {
  19 |   await page.goto("/review/macbook-pro-16-m4")
  20 |   const first = page.getByRole("button", { name: /M4 Pro worth/ })
  21 |   await first.click()
  22 |   await expect(page.getByText(/transformative/)).toBeVisible()
  23 | })
  24 | 
  25 | test("affiliate links open in new tab", async ({ page }) => {
  26 |   await page.goto("/review/macbook-pro-16-m4")
  27 |   const links = page.locator('a[target="_blank"]')
  28 |   await expect(links.first()).toBeVisible()
  29 | })
  30 | 
```