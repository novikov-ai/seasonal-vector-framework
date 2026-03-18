export default function StatusBadge({ status }) {
  const map = {
    'on track':    'p-on-track',
    'not started': 'p-not-started',
    'attention':   'p-attention',
    'paused':      'p-paused',
  }
  const labels = {
    'on track':    '● on track',
    'not started': '○ not started',
    'attention':   '▲ attention',
    'paused':      '◐ paused',
  }
  return (
    <span className={`pill ${map[status] || 'p-not-started'}`}>
      {labels[status] || status}
    </span>
  )
}
