import { useState, useEffect } from 'react'
import { Modal, Field } from '../components/Modal'

function NumericInput({ value, onChange }) {
  const [str, setStr] = useState(String(value))
  useEffect(() => { setStr(String(value)) }, [value])
  return (
    <input
      type="text"
      inputMode="decimal"
      value={str}
      onChange={e => {
        const raw = e.target.value
        setStr(raw)
        const v = parseFloat(raw)
        if (!isNaN(v)) onChange(v)
      }}
      onBlur={() => {
        const v = parseFloat(str)
        if (isNaN(v)) setStr(String(value))
      }}
    />
  )
}

const TYPES = [
  { id: 'number',  label: 'Numeric',    desc: 'current + target',     icon: '123' },
  { id: 'binary',  label: 'Binary',     desc: 'done / not done',      icon: '✓' },
  { id: 'percent', label: 'Percentage', desc: '0 – 100%',             icon: '%' },
  { id: 'rating',  label: 'Rating',     desc: 'half steps, custom max', icon: '★' },
]

export default function KRModal({ kr, onSave, onDelete, onClose }) {
  const [type,    setType]    = useState(kr.type    || 'number')
  const [label,   setLabel]   = useState(kr.label   || '')
  const [current, setCurrent] = useState(kr.current ?? 0)
  const [target,  setTarget]  = useState(kr.target  ?? (kr.type === 'rating' ? 5 : kr.type === 'percent' ? 100 : 100))

  function handleTypeChange(t) {
    setType(t)
    setCurrent(0)
    if (t === 'binary')  setTarget(1)
    if (t === 'percent') setTarget(100)
    if (t === 'rating')  setTarget(5)
    if (t === 'number')  setTarget(100)
  }

  const pct = type === 'binary'
    ? (current >= 1 ? 100 : 0)
    : Math.round(Math.min(100, (current / Math.max(1, target)) * 100))

  return (
    <Modal
      title={kr.isNew ? 'New key result' : 'Edit key result'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...kr, type, label, current, target })}
      saveDisabled={!label.trim()}
    >
      {/* Type picker */}
      <Field label="Measurement type">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 'var(--r)', cursor: 'pointer',
                border: `1px solid ${type === t.id ? 'var(--accent)' : 'var(--border2)'}`,
                background: type === t.id ? 'rgba(22,163,74,0.08)' : 'var(--bg2)',
                color: type === t.id ? 'var(--accent)' : 'var(--text2)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Field>

      <Field label="What are you measuring?">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Weekly km, Subscribers, Sleep quality..."
          autoFocus
        />
      </Field>

      {type === 'number' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Current value">
            <NumericInput value={current} onChange={setCurrent} />
          </Field>
          <Field label="Target value">
            <NumericInput value={target} onChange={v => setTarget(v || 100)} />
          </Field>
        </div>
      )}

      {type === 'percent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Current %">
            <NumericInput value={current} onChange={setCurrent} />
          </Field>
          <Field label="Target %">
            <NumericInput value={target} onChange={v => setTarget(v || 100)} />
          </Field>
        </div>
      )}

      {type === 'rating' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Current value">
            <NumericInput value={current} onChange={setCurrent} />
          </Field>
          <Field label="Target">
            <NumericInput value={target} onChange={v => setTarget(v || 5)} />
          </Field>
        </div>
      )}

      {type === 'binary' && (
        <Field label="Current state">
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ l: 'Not done', color: '#F87171' }, { l: 'Done', color: '#16A34A' }].map(({ l, color }, i) => (
              <button
                key={l}
                onClick={() => setCurrent(i)}
                style={{
                  flex: 1, padding: '7px', borderRadius: 'var(--r)', cursor: 'pointer',
                  border: `1px solid ${current === i ? color : 'var(--border2)'}`,
                  background: current === i ? color + '18' : 'var(--bg2)',
                  color: current === i ? color : 'var(--text2)',
                  fontSize: 13, fontWeight: current === i ? 600 : 400,
                }}
              >{l}</button>
            ))}
          </div>
        </Field>
      )}

      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
        {type === 'binary'
          ? (current >= 1 ? '✓ Done' : '○ Not done yet')
          : type === 'rating'
          ? `${current} / ${target} — ${pct}% of scale`
          : type === 'percent'
          ? `${current}% complete`
          : `Progress: ${pct}% toward target`
        }
      </div>
    </Modal>
  )
}
