import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import KRBar from '../components/KRBar'
import DomainModal from '../modals/DomainModal'
import VectorModal from '../modals/VectorModal'
import ActionModal from '../modals/ActionModal'
import KRModal from '../modals/KRModal'
import { uid } from '../data/utils'
import { COLORS } from '../data/constants'

function VecRow({ vec, dom, onEditVec, onAddAction, onEditAction, onDelAction, onAddKR, onEditKR, onDelKR }) {
  const [open, setOpen] = useState(false)

  const hint = open
    ? '↑ collapse'
    : [
        vec.actions.length > 0 && `${vec.actions.length} action${vec.actions.length > 1 ? 's' : ''}`,
        (vec.krs || []).length > 0 && `${vec.krs.length} KR${vec.krs.length > 1 ? 's' : ''}`,
      ].filter(Boolean).join(' · ') + ((vec.actions.length || (vec.krs || []).length) ? '  ↓ expand' : '  ↓ tap to add actions & KRs')

  return (
    <div className="vec-row">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
            {vec.name}
          </div>
          <StatusBadge status={vec.status} />
          <button className="ib" style={{ width: 22, height: 22, fontSize: 11, marginLeft: 'auto' }} onClick={onEditVec}>✎</button>
        </div>

        {vec.goal && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>→ {vec.goal}</div>}
        {(vec.krs || []).map(kr => <KRBar key={kr.id} kr={kr} color={dom.color} />)}

        {open && (
          <div className="vec-expand">
            {/* Key results section */}
            <div style={{ marginBottom: 10 }}>
              <div className="vec-expand-title">Key results</div>
              {(vec.krs || []).length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>
                  No key results yet — add one to track progress.
                </div>
              )}
              {(vec.krs || []).map(kr => (
                <div key={kr.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, flex: 1 }}>
                    {kr.label} — <strong style={{ fontWeight: 600 }}>{kr.current}</strong>
                    <span style={{ color: 'var(--text3)' }}>/{kr.target}</span>
                  </span>
                  <button className="ib" style={{ width: 20, height: 20, fontSize: 10 }} onClick={() => onEditKR(kr)}>✎</button>
                  <button className="ib" style={{ width: 20, height: 20, fontSize: 10, color: '#DC2626' }} onClick={() => onDelKR(kr.id)}>✕</button>
                </div>
              ))}
              <button className="add-btn" onClick={onAddKR}>+ Key result</button>
            </div>

            {/* Actions section */}
            <div>
              <div className="vec-expand-title">Actions</div>
              {vec.actions.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>
                  No actions yet — add what you'll do each quarter.
                </div>
              )}
              {vec.actions.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span className="tag">{a.quarter}</span>
                  <span style={{ fontSize: 12, flex: 1 }}>{a.text}</span>
                  <button className="ib" style={{ width: 20, height: 20, fontSize: 10 }} onClick={() => onEditAction(a)}>✎</button>
                  <button className="ib" style={{ width: 20, height: 20, fontSize: 10, color: '#DC2626' }} onClick={() => onDelAction(a.id)}>✕</button>
                </div>
              ))}
              <button className="add-btn" onClick={onAddAction}>+ Action</button>
            </div>
          </div>
        )}

        {!open && (
          <div
            style={{ fontSize: 11, color: 'var(--text3)', cursor: 'pointer', marginTop: 3 }}
            onClick={() => setOpen(true)}
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Map({ data, setData }) {
  const [exp, setExp] = useState(() => {
    const init = {}
    data.domains.forEach(d => { init[d.id] = true })
    return init
  })
  const [editDom, setEditDom] = useState(null)
  const [editVec, setEditVec] = useState(null)
  const [editAct, setEditAct] = useState(null)
  const [editKR,  setEditKR]  = useState(null)

  const toggle = id => setExp(e => ({ ...e, [id]: !e[id] }))

  // ── Domain CRUD ──────────────────────────────────────────
  function saveDomain(dom) {
    const newId = 'd' + uid()
    setData(d => ({
      ...d,
      domains: dom._new
        ? [...d.domains, { ...dom, id: newId, vectors: [], _new: undefined }]
        : d.domains.map(x => x.id === dom.id ? { ...x, ...dom, _new: undefined } : x),
    }))
    if (dom._new) setExp(e => ({ ...e, [newId]: true }))
    setEditDom(null)
  }
  function deleteDomain(id) {
    setData(d => ({ ...d, domains: d.domains.filter(x => x.id !== id) }))
    setEditDom(null)
  }

  // ── Vector CRUD ──────────────────────────────────────────
  function saveVec(dId, vec) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom => {
        if (dom.id !== dId) return dom
        const vectors = vec.isNew
          ? [...dom.vectors, { ...vec, id: 'v' + uid(), actions: [], krs: [], isNew: undefined }]
          : dom.vectors.map(v => v.id === vec.id ? { ...v, ...vec, isNew: undefined } : v)
        return { ...dom, vectors }
      }),
    }))
    setEditVec(null)
  }
  function deleteVec(dId, vId) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom =>
        dom.id === dId ? { ...dom, vectors: dom.vectors.filter(v => v.id !== vId) } : dom
      ),
    }))
    setEditVec(null)
  }

  // ── Action CRUD ──────────────────────────────────────────
  function saveAction(dId, vId, action) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom => {
        if (dom.id !== dId) return dom
        return {
          ...dom,
          vectors: dom.vectors.map(vec => {
            if (vec.id !== vId) return vec
            const actions = action.isNew
              ? [...vec.actions, { ...action, id: 'a' + uid(), isNew: undefined }]
              : vec.actions.map(a => a.id === action.id ? { ...a, ...action, isNew: undefined } : a)
            return { ...vec, actions }
          }),
        }
      }),
    }))
    setExp(e => ({ ...e, [dId]: true }))
    setEditAct(null)
  }
  function deleteAction(dId, vId, aId) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom =>
        dom.id !== dId ? dom : {
          ...dom,
          vectors: dom.vectors.map(vec =>
            vec.id !== vId ? vec : { ...vec, actions: vec.actions.filter(a => a.id !== aId) }
          ),
        }
      ),
    }))
    setEditAct(null)
  }

  // ── KR CRUD ──────────────────────────────────────────────
  function saveKR(dId, vId, kr) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom => {
        if (dom.id !== dId) return dom
        return {
          ...dom,
          vectors: dom.vectors.map(vec => {
            if (vec.id !== vId) return vec
            const krs = kr.isNew
              ? [...(vec.krs || []), { ...kr, id: 'k' + uid(), isNew: undefined }]
              : (vec.krs || []).map(k => k.id === kr.id ? { ...k, ...kr, isNew: undefined } : k)
            return { ...vec, krs }
          }),
        }
      }),
    }))
    setEditKR(null)
  }
  function deleteKR(dId, vId, kId) {
    setData(d => ({
      ...d,
      domains: d.domains.map(dom =>
        dom.id !== dId ? dom : {
          ...dom,
          vectors: dom.vectors.map(vec =>
            vec.id !== vId ? vec : { ...vec, krs: (vec.krs || []).filter(k => k.id !== kId) }
          ),
        }
      ),
    }))
    setEditKR(null)
  }

  const totalVectors = data.domains.reduce((s, d) => s + d.vectors.length, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Domain Map</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, letterSpacing: '0.06em' }}>
            {data.domains.length} domains · {totalVectors} vectors
          </div>
        </div>
        <button className="btn pri" onClick={() => setEditDom({ name: '', color: COLORS[0], _new: true })}>
          + Domain
        </button>
      </div>

      {data.domains.length === 0 && (
        <div className="empty">
          <div style={{ fontSize: 28, marginBottom: 10 }}>◻</div>
          No domains yet. Add your first life area to begin.
        </div>
      )}

      {data.domains.map(dom => (
        <div key={dom.id} className="domain-card">
          <div className="domain-header" onClick={() => toggle(dom.id)}>
            <div className="domain-dot" style={{ background: dom.color }} />
            <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{dom.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              {dom.vectors.length} vector{dom.vectors.length !== 1 ? 's' : ''}
            </div>
            <button
              className="ib"
              style={{ width: 26, height: 26, fontSize: 11, marginRight: 4, marginLeft: 8 }}
              onClick={e => { e.stopPropagation(); setEditDom({ ...dom }) }}
            >
              ✎
            </button>
            <div className={`domain-chevron ${exp[dom.id] ? 'open' : ''}`}>▶</div>
          </div>

          {exp[dom.id] && (
            <div className="domain-body">
              {dom.vectors.length === 0 && (
                <div style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>
                  No vectors yet. Add a direction for this domain.
                </div>
              )}
              {dom.vectors.map(vec => (
                <VecRow
                  key={vec.id}
                  vec={vec}
                  dom={dom}
                  onEditVec={() => setEditVec({ dId: dom.id, vec: { ...vec } })}
                  onAddAction={() => setEditAct({ dId: dom.id, vId: vec.id, action: { text: '', quarter: 'Q1', isNew: true } })}
                  onEditAction={a => setEditAct({ dId: dom.id, vId: vec.id, action: { ...a } })}
                  onDelAction={aId => deleteAction(dom.id, vec.id, aId)}
                  onAddKR={() => setEditKR({ dId: dom.id, vId: vec.id, kr: { label: '', current: 0, target: 100, isNew: true } })}
                  onEditKR={kr => setEditKR({ dId: dom.id, vId: vec.id, kr: { ...kr } })}
                  onDelKR={kId => deleteKR(dom.id, vec.id, kId)}
                />
              ))}
              <button
                className="add-btn"
                onClick={() => setEditVec({ dId: dom.id, vec: { name: '', goal: '', status: 'not started', actions: [], krs: [], isNew: true } })}
              >
                + Vector
              </button>
            </div>
          )}
        </div>
      ))}

      {editDom && (
        <DomainModal
          domain={editDom}
          onSave={saveDomain}
          onDelete={editDom.id && !editDom._new ? () => deleteDomain(editDom.id) : null}
          onClose={() => setEditDom(null)}
        />
      )}
      {editVec && (
        <VectorModal
          vec={editVec.vec}
          onSave={v => saveVec(editVec.dId, v)}
          onDelete={editVec.vec.id && !editVec.vec.isNew ? () => deleteVec(editVec.dId, editVec.vec.id) : null}
          onClose={() => setEditVec(null)}
        />
      )}
      {editAct && (
        <ActionModal
          action={editAct.action}
          onSave={a => saveAction(editAct.dId, editAct.vId, a)}
          onDelete={editAct.action.id && !editAct.action.isNew ? () => deleteAction(editAct.dId, editAct.vId, editAct.action.id) : null}
          onClose={() => setEditAct(null)}
        />
      )}
      {editKR && (
        <KRModal
          kr={editKR.kr}
          onSave={k => saveKR(editKR.dId, editKR.vId, k)}
          onDelete={editKR.kr.id && !editKR.kr.isNew ? () => deleteKR(editKR.dId, editKR.vId, editKR.kr.id) : null}
          onClose={() => setEditKR(null)}
        />
      )}
    </div>
  )
}
