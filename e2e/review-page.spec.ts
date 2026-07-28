import { test, expect } from "@playwright/test"

test("review page loads with correct metadata", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  await expect(page).toHaveTitle(/MacBook Pro/)
})

test("breadcrumbs are visible", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible()
})

test("buy options section renders", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  await expect(page.getByText(/Buy MacBook Pro/)).toBeVisible()
})

test("FAQ section is interactive", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  const first = page.getByRole("button", { name: /M4 Pro worth/ })
  await first.click()
  await expect(page.getByText(/transformative/)).toBeVisible()
})

test("affiliate links open in new tab", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  const links = page.locator('a[target="_blank"]')
  await expect(links.first()).toBeVisible()
})
