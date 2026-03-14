export function Modal({ title, onClose, onDelete, onSave, saveDisabled, children }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
        <div className="btn-row">
          {onDelete && <button className="btn danger" onClick={onDelete}>Delete</button>}
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn pri" disabled={!!saveDisabled} onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  )
}
