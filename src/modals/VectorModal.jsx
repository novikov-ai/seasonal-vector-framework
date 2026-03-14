import { useState } from 'react'
import { Modal, Field } from '../components/Modal'
import { STATUS_OPTIONS } from '../data/constants'

export default function VectorModal({ vec, onSave, onDelete, onClose }) {
  const [f, setF] = useState({
    letter: vec.letter || '',
    name:   vec.name   || '',
    goal:   vec.goal   || '',
    status: vec.status || 'planned',
  })
  const up = k => e => setF(x => ({ ...x, [k]: e.target.value }))

  return (
    <Modal
      title={vec.isNew ? 'New vector' : 'Edit vector'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...vec, ...f })}
      saveDisabled={!f.name.trim()}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
        <Field label="Letter">
          <input value={f.letter} onChange={up('letter')} maxLength={2} placeholder="A" autoFocus />
        </Field>
        <Field label="Name">
          <input value={f.name} onChange={up('name')} placeholder="e.g. Race Training, Career Path..." />
        </Field>
      </div>
      <Field label="Year goal">
        <textarea
          value={f.goal}
          onChange={up('goal')}
          placeholder="What does success look like by year end?"
        />
      </Field>
      <Field label="Status">
        <select value={f.status} onChange={up('status')}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
    </Modal>
  )
}
