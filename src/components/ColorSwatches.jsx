import { COLORS } from '../data/constants'

export default function ColorSwatches({ color, onChange }) {
  return (
    <div className="swatches">
      {COLORS.map(c => (
        <div
          key={c}
          className={`swatch ${color === c ? 'on' : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
