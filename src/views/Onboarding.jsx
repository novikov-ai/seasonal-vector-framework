export default function Onboarding({ onStart }) {
  return (
    <div className="onboard">
      <div className="onboard-inner">
        <div className="onboard-logo">Seasonal Vector Framework</div>
        <div className="onboard-tag">Set. Track. Achieve.</div>
        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 26 }}>
          Most goal systems fail because they're static. Life isn't. Seasonal Vector Framework
          gives you stable year-long directions with quarterly execution that adapts every 90 days.
        </p>
        <div className="onboard-concepts">
          {[
            ['Domain',      "A life area you're actively developing — career, health, sport, finances."],
            ['Vector',      'A year-long direction within a domain. Stays constant. Guides decisions.'],
            ['Goal + KRs',  'What "done" looks like. Key results tell you if you\'re getting there.'],
            ['Actions',     'Quarterly concrete steps. These change every 90 days as context shifts.'],
            ['Anchors',     'Fixed dates on the timeline. Hard deadlines that shape planning.'],
          ].map(([k, v]) => (
            <div key={k} className="onboard-concept">
              <span className="onboard-concept-key">{k}</span>
              <span style={{ color: 'var(--text2)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="choice-grid">
          <div className="choice-card" onClick={() => onStart('example')}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>⚡</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Load example year</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>
              See the system in action with a realistic pre-filled year. Edit or reset anytime.
            </div>
          </div>
          <div className="choice-card" onClick={() => onStart('blank')}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>◻</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Start from scratch</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>
              Build your own domains and vectors. Your year, your structure.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
