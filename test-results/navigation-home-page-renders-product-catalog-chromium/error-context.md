# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> home page renders product catalog
- Location: e2e/navigation.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test"
  2  | 
  3  | test("home page renders product catalog", async ({ page }) => {
> 4  |   await page.goto("/")
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await expect(page.getByText("Latest Reviews")).toBeVisible()
  6  | })
  7  | 
  8  | test("review page generates static HTML", async ({ page }) => {
  9  |   const res = await page.request.get("/review/macbook-pro-16-m4")
  10 |   expect(res.status()).toBe(200)
  11 | })
  12 | 
  13 | test("guide page loads", async ({ page }) => {
  14 |   const res = await page.request.get("/guide/macbook-pro-16-m4")
  15 |   expect(res.status()).toBe(200)
  16 | })
  17 | 
  18 | test("sitemap is accessible", async ({ page }) => {
  19 |   const res = await page.request.get("/sitemap.xml")
  20 |   expect(res.status()).toBe(200)
  21 |   const text = await res.text()
  22 |   expect(text).toContain("macbook-pro")
  23 | })
  24 | 
  25 | test("robots.txt exists", async ({ page }) => {
  26 |   const res = await page.request.get("/robots.txt")
  27 |   expect(res.status()).toBe(200)
  28 | })
  29 | 
  30 | test("404 returns not found", async ({ page }) => {
  31 |   const res = await page.request.get("/nonexistent-page")
  32 |   expect(res.status()).toBe(404)
  33 | })
  34 | 
```