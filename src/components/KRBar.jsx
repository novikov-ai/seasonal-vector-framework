export default function KRBar({ kr, color }) {
  const pct = Math.min(100, Math.round((kr.current / Math.max(1, kr.target)) * 100))
  return (
    <div className="kr-row">
      <div style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{kr.label}</div>
      <div className="kr-wrap">
        <div className="kr-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text3)', minWidth: 58, textAlign: 'right' }}>
        {kr.current}/{kr.target}
      </div>
    </div>
  )
}
