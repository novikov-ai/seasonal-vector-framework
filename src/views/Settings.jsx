import { useState } from 'react'

export default function Settings({ data, setData, theme, setTheme, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false)

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `svf_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        setData(JSON.parse(ev.target.result))
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const totalVectors = data.domains.reduce((s, d) => s + d.vectors.length, 0)
  const totalActions = data.domains.reduce((s, d) => s + d.vectors.reduce((ss, v) => ss + v.actions.length, 0), 0)
  const totalKRs     = data.domains.reduce((s, d) => s + d.vectors.reduce((ss, v) => ss + (v.krs || []).length, 0), 0)

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 22 }}>Settings</div>

      {/* Overview */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="st" style={{ marginBottom: 14 }}>System overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[['Domains', data.domains.length], ['Vectors', totalVectors], ['Actions', totalActions], ['KRs', totalKRs]].map(([l, v]) => (
            <div key={l} style={{ background: 'var(--bg3)', borderRadius: 'var(--r)', padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="st" style={{ marginBottom: 12 }}>Appearance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13 }}>Theme</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['light', 'dark', 'system'].map(t => (
              <button key={t} className={`btn ${theme === t ? 'pri' : 'soft'}`} style={{ padding: '5px 14px' }} onClick={() => setTheme(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="st" style={{ marginBottom: 12 }}>Data</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button className="btn" onClick={exportData}>Export JSON</button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            Import JSON
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </label>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: 10 }}>DANGER ZONE</div>
          {!confirmReset
            ? <button className="btn danger" onClick={() => setConfirmReset(true)}>Reset all data</button>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  This will clear all data and return you to the onboarding screen. Cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn danger" onClick={onReset}>Yes, reset everything</button>
                  <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
                </div>
              </div>
            )
          }
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="st" style={{ marginBottom: 8 }}>About</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
          Seasonal Vector Framework — local-first year planning.<br />
          Data stored in localStorage. No accounts, no cloud, no tracking.<br />
          Export JSON regularly as a backup. Safe to deploy on GitHub Pages.
        </div>
      </div>
    </div>
  )
}
