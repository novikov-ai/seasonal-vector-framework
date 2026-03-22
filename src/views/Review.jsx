import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import { marked } from 'marked'
import { isSunday, formatWeekRange, getWeekKey, todayString } from '../data/utils'
import { ICEBREAKERS, FREE_PROMPTS, RATING_LABELS, RATING_COLORS, RATING_EMOJIS } from '../data/constants'
import { loadReviews, saveReviews } from '../data/storage'
import { uid } from '../data/utils'

// ── Markdown textarea with keyboard shortcuts ─────────────────────────────
function MdTextarea({ value, onChange, rows = 4, placeholder, hideTips = false }) {
  function handleKeyDown(e) {
    const el = e.target
    const { selectionStart: s, selectionEnd: end } = el
    const sel = value.slice(s, end)
    const wrap = (marker) => {
      e.preventDefault()
      const newVal = value.slice(0, s) + marker + sel + marker + value.slice(end)
      onChange(newVal)
      setTimeout(() => {
        el.selectionStart = s + marker.length
        el.selectionEnd = end + marker.length
      }, 0)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') wrap('**')
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') wrap('*')
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') wrap('`')
  }
  return (
    <div>
      <textarea rows={rows} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown} />
      {!hideTips && (
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span><kbd>Ctrl+B</kbd> bold</span>
          <span><kbd>Ctrl+I</kbd> italic</span>
          <span><kbd>Ctrl+E</kbd> code</span>
          <span style={{ color: '#16A34A' }}>markdown supported</span>
        </div>
      )}
    </div>
  )
}

// ── Review flow (4 steps) ────────────────────────────────────────────────
function ReviewFlow({ onComplete, onCancel, domains }) {
  const [step,     setStep]     = useState(0)
  const [iceA,     setIceA]     = useState({})
  const [ratings,  setRatings]  = useState({})
  const [krU,      setKrU]      = useState({})
  const [freeText, setFreeText] = useState('')
  const [icePreview, setIcePreview] = useState(false)
  const [preview,    setPreview]    = useState(false)
  const [done,     setDone]     = useState(false)
  const firedRef = useRef(new Set())

  const steps = ['Check in', 'Vectors', 'Metrics', 'Free write']

  const activeVecs = domains.flatMap(d =>
    d.vectors
      .filter(v => ['on track', 'attention'].includes(v.status))
      .map(v => ({ ...v, domainName: d.name, domainColor: d.color }))
  )
  const allKRs = []
  domains.forEach(d =>
    d.vectors.forEach(v =>
      (v.krs || []).forEach(kr =>
        allKRs.push({ ...kr, vecName: v.name, domainColor: d.color })
      )
    )
  )

  function finish() {
    const review = {
      id: 'r' + uid(),
      weekKey: getWeekKey(new Date()),
      date: todayString(),
      weekRange: formatWeekRange(new Date()),
      iceAnswers: iceA,
      ratings,
      krUpdates: krU,
      freeText,
      createdAt: new Date().toISOString(),
    }
    onComplete(review, krU)
    setDone(true)
  }

  if (done) return (
    <div style={{ textAlign: 'center', padding: '44px 20px' }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Review complete</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 22 }}>
        Saved to your review log and calendar. Metrics updated.
      </div>
      <button className="btn pri" onClick={onCancel}>Back to overview</button>
    </div>
  )

  return (
    <div>
      {/* Stepper */}
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={i} className="step-item">
            <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`step-label ${i === step ? 'active' : ''}`}>{s}</span>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* Step 1: Check in */}
      {step === 0 && (
        <div className="review-wrap">
          <div className="st" style={{ marginBottom: 5 }}>Step 1 of 4</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Check in</div>
            <div style={{ display: 'flex', gap: 2, background: 'var(--bg3)', borderRadius: 'var(--r)', padding: 3 }}>
              <button className={`btn${!icePreview ? ' pri' : ' ghost'}`} style={{ padding: '3px 10px', fontSize: 11 }} onClick={() => setIcePreview(false)}>Write</button>
              <button className={`btn${icePreview ? ' pri' : ' ghost'}`} style={{ padding: '3px 10px', fontSize: 11 }} onClick={() => setIcePreview(true)}>Preview</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.55 }}>
            Three quick questions to orient yourself. No right answers.
          </div>
          {ICEBREAKERS.map((ib, i) => (
            <div key={ib.id} className="ice-card">
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, lineHeight: 1.5 }}>
                <strong>{i + 1}. </strong>{ib.q}
              </div>
              {icePreview
                ? <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked(iceA[ib.id] || '*Not answered yet.*') }} />
                : <MdTextarea rows={3} placeholder="..." value={iceA[ib.id] || ''} onChange={v => setIceA(a => ({ ...a, [ib.id]: v }))} hideTips />
              }
            </div>
          ))}
          {!icePreview && (
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span><kbd>Ctrl+B</kbd> bold</span>
              <span><kbd>Ctrl+I</kbd> italic</span>
              <span><kbd>Ctrl+E</kbd> code</span>
              <span style={{ color: '#16A34A' }}>markdown supported</span>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Vector pulse */}
      {step === 1 && (
        <div className="review-wrap">
          <div className="st" style={{ marginBottom: 5 }}>Step 2 of 4</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Vector pulse</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.55 }}>
            Rate each active vector this week.
          </div>
          <div className="card" style={{ padding: '4px 16px' }}>
            {activeVecs.length === 0 && (
              <div className="empty" style={{ padding: '18px 0' }}>No active vectors found.</div>
            )}
            {activeVecs.map(vec => (
              <div key={vec.id} className="vec-rating-row">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: vec.domainColor, flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{vec.domainName} · {vec.name}</div>
                  {vec.goal && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>→ {vec.goal}</div>}
                  {ratings[vec.id] !== undefined && (
                    <div style={{ fontSize: 10, color: RATING_COLORS[ratings[vec.id] - 1], marginTop: 2 }}>
                      {RATING_LABELS[ratings[vec.id] - 1]}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div
                      key={n}
                      className={`star ${ratings[vec.id] === n ? 'on' : ''}`}
                      onClick={() => setRatings(r => ({ ...r, [vec.id]: n }))}
                      style={ratings[vec.id] === n ? { borderColor: RATING_COLORS[n - 1], background: RATING_COLORS[n - 1] + '18' } : {}}
                    >
                      {RATING_EMOJIS[n - 1]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Update metrics */}
      {step === 2 && (
        <div className="review-wrap">
          <div className="st" style={{ marginBottom: 5 }}>Step 3 of 4</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Update metrics</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.55 }}>
            Bring your key results current. Skip any that haven't changed.
          </div>
          <div className="card" style={{ padding: '4px 16px' }}>
            {allKRs.length === 0 && (
              <div className="empty" style={{ padding: '18px 0' }}>No key results defined yet.</div>
            )}
            {allKRs.map(kr => {
              const val = krU[kr.id] !== undefined ? krU[kr.id] : kr.current
              const pct = Math.round(Math.min(100, (val / Math.max(1, kr.target)) * 100))
              const prevPct = Math.round(Math.min(100, (kr.current / Math.max(1, kr.target)) * 100))
              const deltaPct = pct - prevPct
              const chg = krU[kr.id] !== undefined && krU[kr.id] !== kr.current
              const set = v => {
                const next = Math.round(Math.max(0, Math.min(kr.target, v)) * 100) / 100
                const nextPct = Math.round(Math.min(100, (next / Math.max(1, kr.target)) * 100))
                if (next === 0) firedRef.current.delete(kr.id)
                if (nextPct === 100 && !firedRef.current.has(kr.id)) {
                  firedRef.current.add(kr.id)
                  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
                }
                setKrU(u => ({ ...u, [kr.id]: next }))
              }
              return (
                <div key={kr.id} className={`kr-update-row${chg ? ' changed' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: kr.domainColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{kr.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{kr.vecName}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: chg ? 600 : 400, color: 'var(--text)' }}>
                      {chg ? `${kr.current} → ${val}` : `${val}`}
                      {chg && deltaPct !== 0 && (
                        <span style={{
                          fontWeight: 400, marginLeft: 4,
                          color: deltaPct > 0 ? '#16A34A' : '#DC2626'
                        }}>{deltaPct > 0 ? `+${deltaPct}%` : `${deltaPct}%`}</span>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0} max={kr.target} step={Number.isInteger(kr.target) ? 1 : 0.1}
                    value={val}
                    onChange={e => set(parseFloat(e.target.value))}
                    style={{ width: '100%', marginTop: 8, accentColor: kr.domainColor }}
                  />
                  <div className="kr-stepper">
                    <button className="kr-stepper-btn" onClick={() => set(val - 1)}>−</button>
                    <input
                      type="number"
                      value={val}
                      onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) set(v) }}
                    />
                    <button className="kr-stepper-btn" onClick={() => set(val + 1)}>+</button>
                    <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 2 }}>/ {kr.target}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 4: Free write */}
      {step === 3 && (
        <div className="review-wrap">
          <div className="st" style={{ marginBottom: 5 }}>Step 4 of 4</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Free write</div>
            <div style={{ display: 'flex', gap: 2, background: 'var(--bg3)', borderRadius: 'var(--r)', padding: 3 }}>
              <button className={`btn${!preview ? ' pri' : ' ghost'}`} style={{ padding: '3px 10px', fontSize: 11 }} onClick={() => setPreview(false)}>Write</button>
              <button className={`btn${preview ? ' pri' : ' ghost'}`} style={{ padding: '3px 10px', fontSize: 11 }} onClick={() => setPreview(true)}>Preview</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.55 }}>
            Open space. Use the prompts as nudges or ignore them entirely.
          </div>
          {!preview && (
            <>
              <div className="prompts-row">
                {FREE_PROMPTS.map(p => (
                  <button key={p} className="prompt-chip" onClick={() => setFreeText(t => (t ? t + '\n\n' : '') + p + ': ')}>
                    + {p}
                  </button>
                ))}
              </div>
              <MdTextarea
                rows={9}
                placeholder="Write freely about this week..."
                value={freeText}
                onChange={setFreeText}
              />
            </>
          )}
          {preview && (
            <div
              className="md-preview"
              dangerouslySetInnerHTML={{ __html: marked(freeText || '*Nothing written yet.*') }}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="step-nav">
        <button className="btn ghost" onClick={() => step === 0 ? onCancel() : setStep(s => s - 1)}>
          {step === 0 ? 'Cancel' : '← Back'}
        </button>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>{step + 1} / {steps.length}</span>
        {step < steps.length - 1
          ? <button className="btn pri" onClick={() => setStep(s => s + 1)}>Continue →</button>
          : <button className="btn pri" onClick={finish}>Complete review</button>
        }
      </div>
    </div>
  )
}

// ── Review detail modal ──────────────────────────────────────────────────
function ReviewDetail({ review, domains, onClose }) {
  const allVecs = domains.flatMap(d => d.vectors.map(v => ({ ...v, domainName: d.name, domainColor: d.color })))
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 540 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>{review.weekRange}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 20 }}>{review.date}</div>

        {Object.keys(review.iceAnswers || {}).filter(k => review.iceAnswers[k]).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="st" style={{ marginBottom: 8 }}>Check in</div>
            {ICEBREAKERS.map(ib => review.iceAnswers[ib.id] && (
              <div key={ib.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 3 }}>{ib.q}</div>
                <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked(review.iceAnswers[ib.id]) }} />
              </div>
            ))}
          </div>
        )}

        {Object.keys(review.ratings || {}).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="st" style={{ marginBottom: 8 }}>Vector pulse</div>
            {Object.entries(review.ratings).map(([vId, rating]) => {
              const vec = allVecs.find(v => v.id === vId)
              if (!vec) return null
              return (
                <div key={vId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: vec.domainColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{vec.domainName} · {vec.name}</span>
                  <span style={{ fontSize: 11, color: RATING_COLORS[rating - 1], fontWeight: 500 }}>
                    {rating}/5 — {RATING_LABELS[rating - 1]}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {review.freeText && (
          <div style={{ marginBottom: 16 }}>
            <div className="st" style={{ marginBottom: 8 }}>Free write</div>
            <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked(review.freeText) }} />
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Review view ──────────────────────────────────────────────────────────
export default function Review({ data, setData }) {
  const [reviews, setReviews] = useState(() => loadReviews())
  const [mode,    setMode]    = useState('overview')
  const [tab,     setTab]     = useState('overview')
  const [detail,  setDetail]  = useState(null)

  const today      = new Date()
  const sunday     = isSunday(today)
  const cwk        = getWeekKey(today)
  const alreadyDone = reviews.some(r => r.weekKey === cwk)

  function handleComplete(review, krU) {
    const updated = [review, ...reviews]
    setReviews(updated)
    saveReviews(updated)
    setData(d => ({
      ...d,
      domains: d.domains.map(dom => ({
        ...dom,
        vectors: dom.vectors.map(vec => ({
          ...vec,
          krs: (vec.krs || []).map(kr =>
            krU[kr.id] !== undefined ? { ...kr, current: krU[kr.id] } : kr
          ),
        })),
      })),
      calNotes: [
        ...d.calNotes,
        { id: 'cn_r_' + review.id, date: review.date, text: 'Weekly review — ' + review.weekRange, type: 'reflection' },
      ],
      lastUpdated: review.date,
    }))
    setMode('overview')
    setTab('history')
  }

  if (mode === 'review') return (
    <div>
      <div style={{
        fontSize: 11, color: 'var(--text2)', marginBottom: 20,
        paddingBottom: 16, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>Weekly Review · {formatWeekRange(today)}</span>
        <button className="btn ghost" onClick={() => setMode('overview')}>✕ Cancel</button>
      </div>
      <ReviewFlow onComplete={handleComplete} onCancel={() => setMode('overview')} domains={data.domains} />
    </div>
  )

  return (
    <div>
      {sunday && !alreadyDone && (
        <div className="rev-banner">
          <div className="rev-dot" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>It's Sunday — time for your weekly review</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {formatWeekRange(today)} · ~10 minutes
            </div>
          </div>
          <button className="btn pri" onClick={() => setMode('review')}>Start →</button>
        </div>
      )}
      {sunday && alreadyDone && (
        <div className="rev-banner" style={{ borderColor: 'rgba(22,163,74,.25)' }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>This week's review is complete</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{formatWeekRange(today)}</div>
          </div>
        </div>
      )}

      <div className="inner-tabs">
        <button className={`inner-tab ${tab === 'overview' ? 'on' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`inner-tab ${tab === 'history' ? 'on' : ''}`} onClick={() => setTab('history')}>
          History{reviews.length > 0 ? ` · ${reviews.length}` : ''}
        </button>
      </div>

      {tab === 'overview' && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="st" style={{ marginBottom: 12 }}>How the review works</div>
            {[
              ['1', 'Check in',       'Three icebreaker questions to orient your mind'],
              ['2', 'Vector pulse',   'Rate each active direction 1–5 this week'],
              ['3', 'Update metrics', 'Bring your key results current'],
              ['4', 'Free write',     'Open space with optional prompt nudges'],
            ].map(([n, t, desc]) => (
              <div key={n} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 500, flexShrink: 0, color: 'var(--text2)',
                }}>
                  {n}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>~10 minutes · every Sunday</span>
              <button className="btn pri" onClick={() => setMode('review')}>
                {alreadyDone ? 'Review again' : 'Start review →'}
              </button>
            </div>
          </div>

          <div className="st" style={{ marginBottom: 10 }}>Active vectors</div>
          <div className="card" style={{ padding: '4px 16px' }}>
            {data.domains.flatMap(d =>
              d.vectors
                .filter(v => ['on track', 'attention'].includes(v.status))
                .map(v => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name} · {v.name}</div>
                      {(v.krs || []).map(kr => (
                        <div key={kr.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <span style={{ fontSize: 11, color: 'var(--text3)', flex: 1 }}>{kr.label}</span>
                          <div style={{ width: 56, height: 3, background: 'var(--bg3)', borderRadius: 2 }}>
                            <div style={{ width: Math.min(100, Math.round(kr.current / Math.max(1, kr.target) * 100)) + '%', height: '100%', background: d.color, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 48, textAlign: 'right' }}>{kr.current}/{kr.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {reviews.length === 0 && (
            <div className="empty">
              <div style={{ fontSize: 24, marginBottom: 10 }}>◻</div>
              No reviews yet. Complete your first one above.
            </div>
          )}
          {reviews.map(r => {
            const rv = Object.entries(r.ratings || {})
            return (
              <div key={r.id} className="history-item" onClick={() => setDetail(r)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.weekRange}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{r.date}</div>
                  </div>
                  {rv.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                      avg {(rv.reduce((s, [, v]) => s + v, 0) / rv.length).toFixed(1)}/5
                    </div>
                  )}
                </div>
                {r.freeText && (
                  <div style={{
                    fontSize: 12, color: 'var(--text2)', lineHeight: 1.6,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {r.freeText}
                  </div>
                )}
                {rv.length > 0 && (
                  <div style={{ marginTop: 7 }}>
                    {rv.map(([vId, rating]) => {
                      const vec = data.domains.flatMap(d => d.vectors.map(v => ({ ...v, domainColor: d.color }))).find(v => v.id === vId)
                      if (!vec) return null
                      return (
                        <span key={vId} className="vec-chip">
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: RATING_COLORS[rating - 1] }} />
                          {vec.name} <span style={{ color: 'var(--text3)' }}>{rating}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {detail && <ReviewDetail review={detail} domains={data.domains} onClose={() => setDetail(null)} />}
    </div>
  )
}
