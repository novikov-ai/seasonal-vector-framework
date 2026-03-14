import { useState } from 'react'
import { Modal, Field } from '../components/Modal'
import ColorSwatches from '../components/ColorSwatches'
import { COLORS } from '../data/constants'

export default function AnchorModal({ anchor, onSave, onDelete, onClose }) {
  const [name,  setName]  = useState(anchor.name  || '')
  const [date,  setDate]  = useState(anchor.date  || '')
  const [color, setColor] = useState(anchor.color || COLORS[0])

  return (
    <Modal
      title={anchor.isNew ? 'New anchor' : 'Edit anchor'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...anchor, name, date, color })}
      saveDisabled={!name.trim() || !date}
    >
      <Field label="Name">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Race Day, Deadline, Launch..."
          autoFocus
        />
      </Field>
      <Field label="Date">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </Field>
      <Field label="Color">
        <ColorSwatches color={color} onChange={setColor} />
      </Field>
    </Modal>
  )
}
