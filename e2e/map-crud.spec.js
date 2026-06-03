import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
})

test('create domain → vector → Q2 action → appears in Today', async ({ page }) => {
  await page.goto('/')

  // Onboarding: start from scratch
  await page.getByText('Start from scratch').click()
  await expect(page.locator('.today-date')).toBeVisible()

  // Navigate to Map
  await page.getByRole('button', { name: 'Map' }).click()
  await expect(page.getByText('Domain Map')).toBeVisible()

  // Add domain
  await page.getByRole('button', { name: '+ Domain' }).click()
  await expect(page.getByText('New domain')).toBeVisible()
  await page.locator('.modal input').fill('Work')
  await page.locator('.modal .btn.pri').click()
  await expect(page.locator('.domain-header').getByText('Work')).toBeVisible()

  // Add vector inside the domain
  await page.getByRole('button', { name: '+ Vector' }).click()
  await expect(page.getByText('New vector')).toBeVisible()
  await page.locator('.modal input').first().fill('Ship the Product')
  await page.locator('.modal .btn.pri').click()
  await expect(page.locator('.vec-row').getByText('Ship the Product')).toBeVisible()

  // Expand vector to access actions
  await page.getByText(/tap to add actions/).click()

  // Add action for Q2
  await page.locator('.add-btn-section.actions').click()
  await expect(page.getByText('New action')).toBeVisible()
  await page.locator('.modal textarea').fill('Launch beta to first users')
  await page.locator('.modal select').selectOption('Q2')
  await page.locator('.modal .btn.pri').click()
  await expect(page.locator('.vec-expand').getByText('Launch beta to first users')).toBeVisible()

  // Navigate to Today — action should appear in Active actions
  await page.getByRole('button', { name: 'Today' }).click()
  await expect(page.getByText('Launch beta to first users')).toBeVisible()
})
