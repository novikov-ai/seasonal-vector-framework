import { useState } from 'react'
import { Modal, Field } from '../components/Modal'

export default function KRModal({ kr, onSave, onDelete, onClose }) {
  const [label,   setLabel]   = useState(kr.label   || '')
  const [current, setCurrent] = useState(kr.current || 0)
  const [target,  setTarget]  = useState(kr.target  || 100)

  const pct = Math.round(Math.min(100, (current / Math.max(1, target)) * 100))

  return (
    <Modal
      title={kr.isNew ? 'New key result' : 'Edit key result'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...kr, label, current, target })}
      saveDisabled={!label.trim()}
    >
      <Field label="What are you measuring?">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Weekly km, Subscribers, Rating..."
          autoFocus
        />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Current value">
          <input
            type="number"
            value={current}
            onChange={e => setCurrent(parseFloat(e.target.value) || 0)}
          />
        </Field>
        <Field label="Target value">
          <input
            type="number"
            value={target}
            onChange={e => setTarget(parseFloat(e.target.value) || 100)}
          />
        </Field>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
        Progress: {pct}% toward target
      </div>
    </Modal>
  )
}
