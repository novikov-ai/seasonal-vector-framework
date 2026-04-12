import { useState, useRef } from 'react'
import { getCurrentQuarter, daysUntil, formatDate, todayString } from '../data/utils'
import { QUARTERS } from '../data/constants'

export default function Today({ data, onToggleAction }) {
  const today   = new Date()
  const todayStr = todayString()
  const qId     = getCurrentQuarter(today)
  const q       = QUARTERS.find(x => x.id === qId)

  const [fadingOut, setFadingOut] = useState({})
  const timersRef = useRef({})

  // Gather all actions for this quarter across all vectors
  const allActions = []
  data.domains.forEach(dom =>
    dom.vectors.forEach(vec =>
      vec.actions
        .filter(a => a.quarter === qId || !a.quarter)
        .forEach(a => allActions.push({
          ...a,
          domainName:  dom.name,
          domainColor: dom.color,
          vecName:     vec.name,
        }))
    )
  )

  const visible  = allActions.filter(a => !data.checkedActions.includes(a.id) || fadingOut[a.id])
  const done     = allActions.filter(a =>  data.checkedActions.includes(a.id) && !fadingOut[a.id])
  const upcoming = data.anchors
    .map(a => ({ ...a, days: daysUntil(a.date) }))
    .sort((a, b) => a.days - b.days)
    .filter(a => a.days >= -3)
    .slice(0, 6)

  const todayNotes = data.calNotes.filter(n => n.date === todayStr)
  const todayAnch  = data.anchors.find(a => a.date === todayStr)

  const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  function handleCheck(action) {
    onToggleAction(action.id)
    const tid = setTimeout(() => {
      setFadingOut(prev => { const n = { ...prev }; delete n[action.id]; return n })
      delete timersRef.current[action.id]
    }, 5000)
    timersRef.current[action.id] = tid
    setFadingOut(prev => ({ ...prev, [action.id]: tid }))
  }

  function handleUndo(action) {
    clearTimeout(timersRef.current[action.id])
    delete timersRef.current[action.id]
    setFadingOut(prev => { const n = { ...prev }; delete n[action.id]; return n })
    onToggleAction(action.id)
  }

  const daysColor = days =>
    days < 0   ? 'var(--text3)' :
    days <= 7  ? '#DC2626' :
    days <= 30 ? '#CA8A04' : '#16A34A'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div className="today-date">{dayName}, {dateStr}</div>
        <div style={{
          display: 'inline-block', fontSize: 10, padding: '2px 10px',
          borderRadius: 100, background: 'var(--bg3)', color: 'var(--text3)',
          marginTop: 7, border: '1px solid var(--border)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {q.id} · {q.name}
        </div>
      </div>

      <div className="today-grid">
        {/* Actions column */}
        <div>
          <div className="st" style={{ marginBottom: 10 }}>Active actions · {qId}</div>
          <div className="card" style={{ padding: '12px 16px' }}>
            {visible.length === 0 && (
              <div className="empty" style={{ padding: '18px 0' }}>All actions done. 🎯</div>
            )}
            {visible.map(a => {
              const isFading = !!fadingOut[a.id]
              return (
                <div key={a.id} className="action-item" style={isFading ? { opacity: 0.5 } : undefined}>
                  <div className={`action-cb${isFading ? ' checked' : ''}`} onClick={isFading ? undefined : () => handleCheck(a)}>
                    {isFading ? '✓' : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, textDecoration: isFading ? 'line-through' : undefined }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: a.domainColor, marginTop: 1 }}>
                      {a.domainName} · {a.vecName}
                    </div>
                  </div>
                  {isFading && (
                    <button
                      className="btn soft"
                      style={{ padding: '2px 10px', fontSize: 11, flexShrink: 0 }}
                      onClick={() => handleUndo(a)}
                    >
                      Undo
                    </button>
                  )}
                </div>
              )
            })}
            {done.length > 0 && (
              <div style={{
                fontSize: 10, color: 'var(--text3)',
                marginTop: 8, paddingTop: 8,
                borderTop: '1px solid var(--border)',
              }}>
                {done.length} completed this quarter
              </div>
            )}
          </div>
        </div>

        {/* Anchors column */}
        <div>
          <div className="st" style={{ marginBottom: 10 }}>Upcoming anchors</div>
          <div className="card" style={{ padding: '12px 16px' }}>
            {upcoming.length === 0 && (
              <div className="empty" style={{ padding: '18px 0' }}>No anchors set.</div>
            )}
            {upcoming.map(a => (
              <div key={a.id} className="anchor-item">
                <div style={{ fontSize: 10, color: 'var(--text2)', minWidth: 76 }}>{formatDate(a.date)}</div>
                <div style={{ flex: 1, borderLeft: `2px solid ${a.color}`, paddingLeft: 8, fontSize: 13 }}>{a.name}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: daysColor(a.days) }}>
                  {a.days < 0 ? `${Math.abs(a.days)}d ago` : a.days === 0 ? 'Today' : `${a.days}d`}
                </div>
              </div>
            ))}
          </div>

          {(todayNotes.length > 0 || todayAnch) && (
            <div style={{ marginTop: 12 }}>
              <div className="st" style={{ marginBottom: 10 }}>Today</div>
              <div className="card" style={{ padding: '12px 16px' }}>
                {todayAnch && (
                  <div className="note-chip">
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: todayAnch.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 50 }}>anchor</span>
                    {todayAnch.name}
                  </div>
                )}
                {todayNotes.map(n => (
                  <div key={n.id} className="note-chip">
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0891B2', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 50 }}>{n.type}</span>
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
