import { test, expect } from "@playwright/test"

test("search modal opens and shows results", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: /Search/ }).click()
  await page.waitForSelector('input[placeholder*="Search"]')
  await page.fill('input[placeholder*="Search"]', "MacBook")
  await expect(page.getByText("MacBook Pro")).toBeVisible()
})

test("keyboard navigation works in search", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: /Search/ }).click()
  await page.fill('input[placeholder*="Search"]', "Mac")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/review\//)
})
