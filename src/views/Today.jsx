import { useState, useRef } from 'react'
import { getCurrentQuarter, daysUntil, formatDate, todayString } from '../data/utils'
import { QUARTERS } from '../data/constants'
import ActionItem from '../components/ActionItem'

export default function Today({ data, onToggleAction }) {
  const today   = new Date()
  const todayStr = todayString()
  const qId     = getCurrentQuarter(today)
  const q       = QUARTERS.find(x => x.id === qId)

  const [fadingOut, setFadingOut] = useState({})
  const timersRef = useRef({})
  const [openQ, setOpenQ] = useState({})

  // All actions across all quarters
  const allActionsAllQ = []
  data.domains.forEach(dom =>
    dom.vectors.forEach(vec =>
      vec.actions.forEach(a => allActionsAllQ.push({
        ...a,
        domainName:  dom.name,
        domainColor: dom.color,
        vecName:     vec.name,
      }))
    )
  )

  const currentQIdx = QUARTERS.findIndex(x => x.id === qId)
  const pastQIds    = QUARTERS.slice(0, currentQIdx).map(x => x.id)

  const isChecked = id => data.checkedActions.includes(id)
  const visible = allActionsAllQ.filter(a =>
    (a.quarter === qId || !a.quarter) && (!isChecked(a.id) || fadingOut[a.id])
  )

  const overdue = allActionsAllQ.filter(a =>
    pastQIds.includes(a.quarter) && (!isChecked(a.id) || fadingOut[a.id])
  )

  const completedByQ = {}
  QUARTERS.forEach(q => { completedByQ[q.id] = [] })
  allActionsAllQ
    .filter(a => isChecked(a.id) && !fadingOut[a.id])
    .forEach(a => { const k = a.quarter || qId; if (completedByQ[k]) completedByQ[k].push(a) })
  const totalCompleted = Object.values(completedByQ).reduce((s, arr) => s + arr.length, 0)

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
          <div className="st" style={{ marginBottom: 10, color: '#16A34A' }}>Active actions · {qId}</div>
          <div className="card" style={{ padding: '12px 16px' }}>
            {visible.length === 0 && (
              <div className="empty" style={{ padding: '18px 0' }}>All actions done. 🎯</div>
            )}
            {visible.map(a => (
              <ActionItem
                key={a.id}
                action={a}
                isFading={!!fadingOut[a.id]}
                onCheck={handleCheck}
                onUndo={handleUndo}
              />
            ))}
          </div>

          {overdue.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="st" style={{ marginBottom: 8, color: '#DC2626' }}>
                Overdue · {overdue.length}
              </div>
              {pastQIds.map(qxId => {
                const items = overdue.filter(a => a.quarter === qxId)
                if (items.length === 0) return null
                const qx = QUARTERS.find(x => x.id === qxId)
                return (
                  <div key={qxId} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, letterSpacing: '0.06em' }}>
                      {qx.id} · {qx.name}
                    </div>
                    <div className="card" style={{ padding: '12px 16px', borderColor: '#DC262620' }}>
                      {items.map(a => (
                        <ActionItem
                          key={a.id}
                          action={a}
                          isFading={!!fadingOut[a.id]}
                          onCheck={handleCheck}
                          onUndo={handleUndo}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {totalCompleted > 0 && (
            <div style={{ marginTop: 12 }}>
              {QUARTERS.map(qx => {
                const items = completedByQ[qx.id]
                if (items.length === 0) return null
                const isOpen = !!openQ[qx.id]
                return (
                  <div key={qx.id} style={{ marginBottom: 4 }}>
                    <button
                      onClick={() => setOpenQ(prev => ({ ...prev, [qx.id]: !prev[qx.id] }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                      }}
                    >
                      <span className="st" style={{ margin: 0 }}>{qx.id} · {qx.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{items.length} done</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div className="card" style={{ padding: '8px 16px', opacity: 0.6 }}>
                        {items.map(a => (
                          <ActionItem
                            key={a.id}
                            action={a}
                            isFading={false}
                            onCheck={() => {}}
                            onUndo={() => {}}
                            showQuarter={qx.id !== qId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Anchors column */}
        <div>
          <div className="st" style={{ marginBottom: 10, color: '#CA8A04' }}>Upcoming anchors</div>
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
