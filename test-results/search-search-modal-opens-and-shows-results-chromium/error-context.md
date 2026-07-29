# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search.spec.ts >> search modal opens and shows results
- Location: e2e/search.spec.ts:3:5

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
  3  | test("search modal opens and shows results", async ({ page }) => {
> 4  |   await page.goto("/")
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await page.getByRole("button", { name: /Search/ }).click()
  6  |   await page.waitForSelector('input[placeholder*="Search"]')
  7  |   await page.fill('input[placeholder*="Search"]', "MacBook")
  8  |   await expect(page.getByText("MacBook Pro")).toBeVisible()
  9  | })
  10 | 
  11 | test("keyboard navigation works in search", async ({ page }) => {
  12 |   await page.goto("/")
  13 |   await page.getByRole("button", { name: /Search/ }).click()
  14 |   await page.fill('input[placeholder*="Search"]', "Mac")
  15 |   await page.keyboard.press("ArrowDown")
  16 |   await page.keyboard.press("Enter")
  17 |   await expect(page).toHaveURL(/\/review\//)
  18 | })
  19 | 
```