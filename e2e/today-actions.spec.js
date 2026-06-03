import { test, expect } from '@playwright/test'

const SEED = {
  domains: [
    {
      id: 'd1', name: 'Build', color: '#E8630A',
      vectors: [
        {
          id: 'v1', name: 'Ship the Product',
          goal: 'Launch MVP',
          status: 'on track',
          actions: [
            { id: 'a1', text: 'Finalize core feature set', quarter: 'Q2' },
            { id: 'a2', text: 'Build auth + billing', quarter: 'Q2' },
          ],
          krs: [],
        },
      ],
    },
  ],
  anchors: [],
  calNotes: [],
  checkedActions: [],
  lastUpdated: new Date().toISOString().split('T')[0],
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript((data) => {
    localStorage.setItem('svf_data_v2', JSON.stringify(data))
  }, SEED)
  await page.goto('/')
})

test('shows active Q2 actions', async ({ page }) => {
  await expect(page.getByText('Finalize core feature set')).toBeVisible()
  await expect(page.getByText('Build auth + billing')).toBeVisible()
})

test('check action → undo button appears → undo restores it', async ({ page }) => {
  const action = page.getByText('Finalize core feature set')
  await expect(action).toBeVisible()

  const row = page.locator('.action-item').first()
  await row.locator('.action-cb').click()

  await expect(row.getByText('Undo')).toBeVisible()

  await row.getByText('Undo').click()

  await expect(action).toBeVisible()
  await expect(row.getByText('Undo')).not.toBeVisible()
})

test('checked action disappears after 5s fade', async ({ page }) => {
  const action = page.getByText('Finalize core feature set')
  const row = page.locator('.action-item').first()
  await row.locator('.action-cb').click()

  await expect(row.getByText('Undo')).toBeVisible()
  await expect(action).not.toBeVisible({ timeout: 7000 })
})
