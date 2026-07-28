import { test, expect } from "@playwright/test"

test("home page renders product catalog", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Latest Reviews")).toBeVisible()
})

test("review page generates static HTML", async ({ page }) => {
  const res = await page.request.get("/review/macbook-pro-16-m4")
  expect(res.status()).toBe(200)
})

test("guide page loads", async ({ page }) => {
  const res = await page.request.get("/guide/macbook-pro-16-m4")
  expect(res.status()).toBe(200)
})

test("sitemap is accessible", async ({ page }) => {
  const res = await page.request.get("/sitemap.xml")
  expect(res.status()).toBe(200)
  const text = await res.text()
  expect(text).toContain("macbook-pro")
})

test("robots.txt exists", async ({ page }) => {
  const res = await page.request.get("/robots.txt")
  expect(res.status()).toBe(200)
})

test("404 returns not found", async ({ page }) => {
  const res = await page.request.get("/nonexistent-page")
  expect(res.status()).toBe(404)
})
