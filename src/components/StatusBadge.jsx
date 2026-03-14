export default function StatusBadge({ status }) {
  const map = {
    active:    'p-active',
    building:  'p-building',
    planned:   'p-planned',
    attention: 'p-attention',
  }
  const labels = {
    active:    '● active',
    building:  '◐ building',
    planned:   '○ planned',
    attention: '▲ attention',
  }
  return (
    <span className={`pill ${map[status] || 'p-planned'}`}>
      {labels[status] || status}
    </span>
  )
}
