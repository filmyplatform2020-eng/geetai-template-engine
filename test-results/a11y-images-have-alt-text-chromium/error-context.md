# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> images have alt text
- Location: e2e/a11y.spec.ts:10:5

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
  3  | test("page has skip link or proper heading hierarchy", async ({ page }) => {
  4  |   await page.goto("/")
  5  |   const headings = page.locator("h1, h2, h3")
  6  |   const count = await headings.count()
  7  |   expect(count).toBeGreaterThan(0)
  8  | })
  9  | 
  10 | test("images have alt text", async ({ page }) => {
> 11 |   await page.goto("/review/macbook-pro-16-m4")
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/review/macbook-pro-16-m4
  12 |   const images = page.locator("img")
  13 |   const count = await images.count()
  14 |   for (let i = 0; i < Math.min(count, 5); i++) {
  15 |     const alt = await images.nth(i).getAttribute("alt")
  16 |     expect(alt).toBeTruthy()
  17 |   }
  18 | })
  19 | 
  20 | test("buttons have accessible names", async ({ page }) => {
  21 |   await page.goto("/")
  22 |   const buttons = page.locator("button, a[role='button']")
  23 |   const count = await buttons.count()
  24 |   for (let i = 0; i < Math.min(count, 10); i++) {
  25 |     const name = await buttons.nth(i).getAttribute("aria-label")
  26 |     const text = await buttons.nth(i).textContent()
  27 |     expect(name || text?.trim()).toBeTruthy()
  28 |   }
  29 | })
  30 | 
```