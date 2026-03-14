import { useState } from 'react'
import { Modal, Field } from '../components/Modal'

export default function NoteModal({ note, onSave, onDelete, onClose }) {
  const [text, setText] = useState(note.text || '')
  const [type, setType] = useState(note.type || 'log')
  const [date, setDate] = useState(note.date || '')

  return (
    <Modal
      title={note.isNew ? 'New note' : 'Edit note'}
      onClose={onClose}
      onDelete={onDelete}
      onSave={() => onSave({ ...note, text, type, date })}
      saveDisabled={!text.trim() || !date}
    >
      <Field label="Date">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </Field>
      <Field label="Type">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="log">Log entry</option>
          <option value="event">Upcoming event</option>
          <option value="reflection">Reflection</option>
        </select>
      </Field>
      <Field label="Note">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What happened, what's planned, or a reflection..."
          autoFocus
        />
      </Field>
    </Modal>
  )
}
