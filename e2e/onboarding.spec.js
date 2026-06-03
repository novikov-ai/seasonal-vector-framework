import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
})

test('shows onboarding on first load', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.onboard-logo')).toBeVisible()
  await expect(page.getByText('Load example year')).toBeVisible()
  await expect(page.getByText('Start from scratch')).toBeVisible()
})

test('loads example data and lands on Today view', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Load example year').click()
  await expect(page.locator('.today-date')).toBeVisible()
  await expect(page.getByText(/Active actions/)).toBeVisible()
})

test('persists onboarding across reload', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Load example year').click()
  await expect(page.locator('.today-date')).toBeVisible()

  // Open a second page in the same context (shares localStorage, no initScript)
  const page2 = await page.context().newPage()
  await page2.goto('http://localhost:5173/')
  await expect(page2.locator('.today-date')).toBeVisible()
  await expect(page2.locator('.onboard-logo')).not.toBeVisible()
  await page2.close()
})
