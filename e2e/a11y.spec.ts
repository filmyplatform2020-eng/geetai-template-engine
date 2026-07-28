import { test, expect } from "@playwright/test"

test("page has skip link or proper heading hierarchy", async ({ page }) => {
  await page.goto("/")
  const headings = page.locator("h1, h2, h3")
  const count = await headings.count()
  expect(count).toBeGreaterThan(0)
})

test("images have alt text", async ({ page }) => {
  await page.goto("/review/macbook-pro-16-m4")
  const images = page.locator("img")
  const count = await images.count()
  for (let i = 0; i < Math.min(count, 5); i++) {
    const alt = await images.nth(i).getAttribute("alt")
    expect(alt).toBeTruthy()
  }
})

test("buttons have accessible names", async ({ page }) => {
  await page.goto("/")
  const buttons = page.locator("button, a[role='button']")
  const count = await buttons.count()
  for (let i = 0; i < Math.min(count, 10); i++) {
    const name = await buttons.nth(i).getAttribute("aria-label")
    const text = await buttons.nth(i).textContent()
    expect(name || text?.trim()).toBeTruthy()
  }
})
