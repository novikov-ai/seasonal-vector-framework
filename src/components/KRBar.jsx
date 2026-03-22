export default function KRBar({ kr, color }) {
  const type = kr.type || 'number'
  const pct = type === 'binary'
    ? (kr.current >= 1 ? 100 : 0)
    : Math.min(100, Math.round((kr.current / Math.max(1, kr.target)) * 100))

  const valueLabel = type === 'binary'
    ? (kr.current >= 1 ? '✓ done' : '○ not done')
    : type === 'percent'
    ? `${kr.current}%`
    : type === 'rating'
    ? `${kr.current} / ${kr.target}`
    : `${kr.current}/${kr.target}`

  return (
    <div className="kr-row">
      <div style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{kr.label}</div>
      <div className="kr-wrap">
        <div className="kr-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text3)', minWidth: 58, textAlign: 'right' }}>
        {valueLabel}
      </div>
    </div>
  )
}
