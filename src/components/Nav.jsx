import { isSunday } from '../data/utils'

const TABS = [
  { id: 'today',    label: 'Today' },
  { id: 'map',      label: 'Map' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'review',   label: 'Review', showPip: true },
  { id: 'settings', label: 'Settings' },
]

export default function Nav({ view, setView, theme, toggleTheme }) {
  const sunday = isSunday(new Date())

  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="nav-logo-mark">SVF</span>
      </div>
      <div className="nav-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-tab ${view === t.id ? 'on' : ''}`}
            onClick={() => setView(t.id)}
          >
            {t.label}
            {t.showPip && sunday && <span className="pip" />}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
        <button className="ib" title="Toggle theme" onClick={toggleTheme}>
          {theme === 'dark' ? '☀' : '◑'}
        </button>
      </div>
    </nav>
  )
}
