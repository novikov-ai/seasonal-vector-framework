import { useState } from 'react'
import { Modal, Field } from '../components/Modal'

export default function ActionModal({ action, onSave, onDelete, onClose }) {
  const [text, setText]       = useState(action.text    || '')
  const [quarter, setQuarter] = useState(action.quarter || 'Q1')

  return (
    <Modal
      title={action.isNew ? 'New action' : 'Edit action'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...action, text, quarter })}
      saveDisabled={!text.trim()}
    >
      <Field label="Action">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="A concrete step toward the goal this quarter..."
          autoFocus
        />
      </Field>
      <Field label="Quarter">
        <select value={quarter} onChange={e => setQuarter(e.target.value)}>
          {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </Field>
    </Modal>
  )
}
