import { useState } from 'react'
import AnchorModal from '../modals/AnchorModal'
import NoteModal from '../modals/NoteModal'
import { getCurrentQuarter, daysUntil, formatDate, getDaysInMonth, getFirstDayOfMonth, todayString } from '../data/utils'
import { QUARTERS, MONTH_NAMES, DAY_LABELS, COLORS } from '../data/constants'
import { uid } from '../data/utils'

export default function Calendar({ data, setData }) {
  const today    = new Date()
  const [activeQ, setActiveQ] = useState(getCurrentQuarter(today))
  const [selDay,  setSelDay]  = useState(null)
  const [editAnch, setEditAnch] = useState(null)
  const [editNote, setEditNote] = useState(null)

  const q        = QUARTERS.find(x => x.id === activeQ)
  const year     = today.getFullYear()
  const todayStr = todayString()

  function saveAnchor(a) {
    setData(d => ({
      ...d,
      anchors: a.isNew
        ? [...d.anchors, { ...a, id: 'an' + uid(), isNew: undefined }]
        : d.anchors.map(x => x.id === a.id ? { ...x, ...a, isNew: undefined } : x),
    }))
    setEditAnch(null)
  }
  function deleteAnchor(id) {
    setData(d => ({ ...d, anchors: d.anchors.filter(a => a.id !== id) }))
    setEditAnch(null)
  }
  function saveNote(n) {
    setData(d => ({
      ...d,
      calNotes: n.isNew
        ? [...d.calNotes, { ...n, id: 'cn' + uid(), isNew: undefined }]
        : d.calNotes.map(x => x.id === n.id ? { ...x, ...n, isNew: undefined } : x),
    }))
    setEditNote(null)
  }
  function deleteNote(id) {
    setData(d => ({ ...d, calNotes: d.calNotes.filter(n => n.id !== id) }))
    setEditNote(null)
  }

  const daysColor = days =>
    days < 0   ? 'var(--text3)' :
    days <= 7  ? '#DC2626' :
    days <= 30 ? '#CA8A04' : '#16A34A'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Calendar</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, letterSpacing: '0.06em' }}>
            {data.anchors.length} anchors · {data.calNotes.length} notes
          </div>
        </div>
        <button className="btn" onClick={() => setEditAnch({ name: '', date: '', color: COLORS[0], isNew: true })}>
          + Anchor
        </button>
      </div>

      {/* Quarter strip */}
      <div className="q-strip">
        {QUARTERS.map(qx => (
          <button
            key={qx.id}
            className={`q-btn ${activeQ === qx.id ? 'on' : ''}`}
            onClick={() => setActiveQ(qx.id)}
          >
            {qx.id} · {qx.name}
          </button>
        ))}
      </div>

      {/* Month grids */}
      <div className="cal-months">
        {q.months.map(mIdx => {
          const daysInMonth = getDaysInMonth(year, mIdx)
          const firstDay    = getFirstDayOfMonth(year, mIdx)
          const cells = []
          for (let i = 0; i < firstDay; i++) cells.push(null)
          for (let n = 1; n <= daysInMonth; n++) cells.push(n)

          const ds = n =>
            `${year}-${String(mIdx + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`

          return (
            <div key={mIdx} className="cal-month">
              <div className="cal-month-name">{MONTH_NAMES[mIdx]}</div>
              <div className="cal-grid">
                {DAY_LABELS.map(l => <div key={l} className="cal-dl">{l}</div>)}
                {cells.map((day, i) => {
                  if (!day) return <div key={i} className="cal-day empty" />
                  const s       = ds(day)
                  const hasNote = data.calNotes.some(n => n.date === s)
                  const hasAnch = data.anchors.some(a => a.date === s)
                  const isToday = s === todayStr
                  let cls = 'cal-day'
                  if (isToday)       cls += ' today'
                  else if (hasAnch)  cls += ' has-anchor'
                  else if (hasNote)  cls += ' has-note'
                  return (
                    <div key={i} className={cls} onClick={() => setSelDay(s)}>{day}</div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Day detail panel */}
      {selDay && (
        <div className="day-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{formatDate(selDay)}</div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn soft" onClick={() => setEditNote({ text: '', type: 'log', date: selDay, isNew: true })}>
                + Note
              </button>
              <button className="ib" onClick={() => setSelDay(null)}>✕</button>
            </div>
          </div>
          {data.anchors.filter(a => a.date === selDay).length === 0 &&
           data.calNotes.filter(n => n.date === selDay).length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>No events on this day. Add a note above.</div>
          )}
          {data.anchors.filter(a => a.date === selDay).map(a => (
            <div key={a.id} className="note-chip" style={{ cursor: 'pointer' }} onClick={() => setEditAnch({ ...a })}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 48 }}>anchor</span>
              <span style={{ flex: 1 }}>{a.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>edit</span>
            </div>
          ))}
          {data.calNotes.filter(n => n.date === selDay).map(n => (
            <div key={n.id} className="note-chip" style={{ cursor: 'pointer' }} onClick={() => setEditNote({ ...n })}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0891B2', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 48 }}>{n.type}</span>
              <span style={{ flex: 1 }}>{n.text}</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>edit</span>
            </div>
          ))}
        </div>
      )}

      {/* All anchors list */}
      <div style={{ marginTop: 20 }}>
        <div className="st" style={{ marginBottom: 10 }}>All anchors</div>
        <div className="card" style={{ padding: '12px 16px' }}>
          {data.anchors.length === 0 && (
            <div className="empty" style={{ padding: '14px 0' }}>No anchors set yet.</div>
          )}
          {[...data.anchors].sort((a, b) => a.date.localeCompare(b.date)).map(a => {
            const days = daysUntil(a.date)
            return (
              <div key={a.id} className="anchor-item" style={{ cursor: 'pointer' }} onClick={() => setEditAnch({ ...a })}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <div style={{ fontSize: 10, color: 'var(--text2)', minWidth: 78 }}>{formatDate(a.date)}</div>
                <div style={{ flex: 1, fontSize: 13 }}>{a.name}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: daysColor(days) }}>
                  {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d`}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {editAnch && (
        <AnchorModal
          anchor={editAnch}
          onSave={saveAnchor}
          onDelete={editAnch.id && !editAnch.isNew ? () => deleteAnchor(editAnch.id) : null}
          onClose={() => setEditAnch(null)}
        />
      )}
      {editNote && (
        <NoteModal
          note={editNote}
          onSave={saveNote}
          onDelete={editNote.id && !editNote.isNew ? () => deleteNote(editNote.id) : null}
          onClose={() => setEditNote(null)}
        />
      )}
    </div>
  )
}
