export function uid() {
  return Math.random().toString(36).slice(2)
}

export function getCurrentQuarter(date) {
  const m = date.getMonth()
  if (m < 3) return 'Q1'
  if (m < 6) return 'Q2'
  if (m < 9) return 'Q3'
  return 'Q4'
}

export function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - today) / 86400000)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Mon = 0
}

export function getMondayOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return d
}

export function formatWeekRange(date) {
  const mon = getMondayOfWeek(date)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const o = { day: 'numeric', month: 'short' }
  return `${mon.toLocaleDateString('en-GB', o)} – ${sun.toLocaleDateString('en-GB', o)}`
}

export function getWeekKey(date) {
  return getMondayOfWeek(date).toISOString().split('T')[0]
}

export function isSunday(date) {
  return date.getDay() === 0
}

export function applyTheme(theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

export function todayString() {
  return new Date().toISOString().split('T')[0]
}
