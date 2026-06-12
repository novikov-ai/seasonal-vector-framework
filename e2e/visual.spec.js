import { test, expect } from '@playwright/test'

const FIXED_DATE = new Date('2026-06-12T10:00:00')

// Rich seed covering all views: active Q2 actions, an overdue Q1 action,
// a checked action, two domains, an anchor, and a calendar note.
const SEED = {
  domains: [
    {
      id: 'd1',
      name: 'Build',
      color: '#E8630A',
      vectors: [
        {
          id: 'v1',
          letter: 'A',
          name: 'Ship the Product',
          goal: 'Launch MVP to first 100 users by end of year',
          status: 'active',
          actions: [
            { id: 'a1', text: 'Finalize core feature set', quarter: 'Q2' },
            { id: 'a2', text: 'Build auth + billing', quarter: 'Q2' },
            { id: 'a3', text: 'Write onboarding docs', quarter: 'Q1' },
          ],
          krs: [
            { id: 'k1', label: 'Signed-up users', current: 42, target: 100 },
          ],
        },
      ],
    },
    {
      id: 'd2',
      name: 'Health',
      color: '#16A34A',
      vectors: [
        {
          id: 'v2',
          letter: 'A',
          name: 'Run consistently',
          goal: 'Complete a half-marathon in under 2 hours',
          status: 'building',
          actions: [
            { id: 'a4', text: 'Run 3× per week', quarter: 'Q2' },
          ],
          krs: [
            { id: 'k2', label: 'Weekly km', current: 18, target: 25 },
          ],
        },
      ],
    },
  ],
  anchors: [
    { id: 'an1', name: 'Conference Talk', date: '2026-07-20', color: '#E8630A' },
    { id: 'an2', name: 'Team Offsite', date: '2026-03-15', color: '#16A34A' },
  ],
  calNotes: [
    { id: 'cn1', date: '2026-06-12', text: 'Kick off Q3 planning session', type: 'event' },
  ],
  checkedActions: ['a2'],
  lastUpdated: '2026-06-12',
}

const REVIEWS = [
  {
    id: 'r1',
    weekKey: '2026-06-08',
    date: '2026-06-08',
    weekRange: '08 Jun – 14 Jun',
    iceAnswers: {
      ib1: 'Shipped the billing module.',
      ib2: 'Context switching between tasks.',
      ib3: 'Block 9–11am for deep work.',
    },
    ratings: { v1: 4, v2: 3 },
    krUpdates: { k1: 42, k2: 18 },
    freeText: 'Good week overall. Need to improve consistency on health vector.',
    createdAt: '2026-06-08T18:00:00.000Z',
  },
]

// ── Onboarding (no seed data) ─────────────────────────────────────────────
test.describe('visual — onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: FIXED_DATE })
    await page.addInitScript(() => localStorage.clear())
    await page.goto('/')
  })

  test('onboarding screen', async ({ page }) => {
    await expect(page.locator('.onboard-logo')).toBeVisible()
    await expect(page).toHaveScreenshot('onboarding.png')
  })
})

// ── Seeded views ──────────────────────────────────────────────────────────
test.describe('visual — seeded views', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: FIXED_DATE })
    await page.addInitScript(({ data, reviews }) => {
      localStorage.setItem('svf_data_v2', JSON.stringify(data))
      localStorage.setItem('svf_reviews_v1', JSON.stringify(reviews))
    }, { data: SEED, reviews: REVIEWS })
    await page.goto('/')
  })

  test('today view — active and overdue actions', async ({ page }) => {
    await expect(page.locator('.today-date')).toBeVisible()
    await expect(page.getByText('Finalize core feature set')).toBeVisible()
    await expect(page).toHaveScreenshot('today.png')
  })

  test('map view — domains and vectors', async ({ page }) => {
    await page.getByRole('button', { name: 'Map' }).click()
    await expect(page.getByText('Domain Map')).toBeVisible()
    await expect(page.locator('.domain-header').first()).toBeVisible()
    await expect(page).toHaveScreenshot('map.png')
  })

  test('calendar view', async ({ page }) => {
    await page.getByRole('button', { name: 'Calendar' }).click()
    await expect(page.locator('.cal-months')).toBeVisible()
    await expect(page).toHaveScreenshot('calendar.png')
  })

  test('review view', async ({ page }) => {
    await page.getByRole('button', { name: 'Review' }).click()
    await expect(page.locator('.inner-tabs')).toBeVisible()
    await expect(page).toHaveScreenshot('review.png')
  })
})
