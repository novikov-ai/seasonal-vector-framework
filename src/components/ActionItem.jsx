export default function ActionItem({ action, isFading, onCheck, onUndo, showQuarter }) {
  return (
    <div className="action-item" style={isFading ? { opacity: 0.5 } : undefined}>
      <div
        className={`action-cb${isFading ? ' checked' : ''}`}
        onClick={isFading ? undefined : () => onCheck(action)}
      >
        {isFading ? '✓' : null}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, textDecoration: isFading ? 'line-through' : undefined }}>
          {action.text}
        </div>
        <div style={{ fontSize: 11, color: action.domainColor, marginTop: 1 }}>
          {action.domainName} · {action.vecName}
          {showQuarter && <span style={{ color: 'var(--text3)' }}> · {action.quarter}</span>}
        </div>
      </div>
      {isFading && (
        <button
          className="btn soft"
          style={{ padding: '2px 10px', fontSize: 11, flexShrink: 0 }}
          onClick={() => onUndo(action)}
        >
          Undo
        </button>
      )}
    </div>
  )
}
