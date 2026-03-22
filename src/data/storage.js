const KEYS = {
  DATA: 'svf_data_v2',
  REVIEWS: 'svf_reviews_v1',
  THEME: 'svf_theme',
}

const STATUS_MIGRATION = {
  'active':   'on track',
  'building': 'paused',
  'planned':  'not started',
}

function migrateData(data) {
  if (!data?.domains) return data
  data.domains.forEach(domain => {
    domain.vectors?.forEach(vec => {
      if (STATUS_MIGRATION[vec.status]) {
        vec.status = STATUS_MIGRATION[vec.status]
      }
    })
  })
  return data
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEYS.DATA)
    if (!raw) return null
    const data = JSON.parse(raw)
    const migrated = migrateData(data)
    saveData(migrated)
    return migrated
  } catch (e) {
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEYS.DATA, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save data:', e)
  }
}

export function loadReviews() {
  try {
    const raw = localStorage.getItem(KEYS.REVIEWS)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveReviews(reviews) {
  try {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews))
  } catch (e) {
    console.warn('Failed to save reviews:', e)
  }
}

export function loadTheme() {
  return localStorage.getItem(KEYS.THEME) || 'system'
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme)
}

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

export function isOnboarded() {
  return !!loadData()
}
