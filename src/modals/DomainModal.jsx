import { useState } from 'react'
import { Modal, Field } from '../components/Modal'
import ColorSwatches from '../components/ColorSwatches'
import { COLORS } from '../data/constants'

export default function DomainModal({ domain, onSave, onDelete, onClose }) {
  const [name, setName] = useState(domain.name || '')
  const [color, setColor] = useState(domain.color || COLORS[0])

  return (
    <Modal
      title={domain._new ? 'New domain' : 'Edit domain'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...domain, name, color })}
      saveDisabled={!name.trim()}
    >
      <Field label="Domain name">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Career, Health, Sport..."
          autoFocus
        />
      </Field>
      <Field label="Color">
        <ColorSwatches color={color} onChange={setColor} />
      </Field>
    </Modal>
  )
}
