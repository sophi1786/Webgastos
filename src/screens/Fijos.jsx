import { useMemo, useState } from 'react'
import { formatMoney, parseMonto } from '../lib/format'
import { makeId } from '../lib/id'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function Fijos({ mesData, updateMes }) {
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fijos = mesData.fijos
  const total = useMemo(() => fijos.reduce((sum, f) => sum + f.monto, 0), [fijos])

  const isValid = nombre.trim() !== '' && parseMonto(monto) > 0

  function handleAdd() {
    if (!isValid) return
    const nuevo = { id: makeId(), nombre: nombre.trim(), monto: parseMonto(monto), pagado: false }
    updateMes((prev) => ({ ...prev, fijos: [...prev.fijos, nuevo] }))
    setNombre('')
    setMonto('')
  }

  function togglePagado(id) {
    updateMes((prev) => ({
      ...prev,
      fijos: prev.fijos.map((f) => (f.id === id ? { ...f, pagado: !f.pagado } : f)),
    }))
  }

  function handleDelete(id) {
    updateMes((prev) => ({ ...prev, fijos: prev.fijos.filter((f) => f.id !== id) }))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Fijos</h2>
          <p className="page-header__subtitle">Total del mes: {formatMoney(total)}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="section-title">Agregar fijo</p>
        <div className="field">
          <input
            type="text"
            className="text-input"
            placeholder="Nombre (alquiler, pilates...)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="field" style={{ marginBottom: 12 }}>
          <input
            type="number"
            inputMode="decimal"
            className="text-input"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" disabled={!isValid} onClick={handleAdd}>
          Agregar
        </button>
      </div>

      {fijos.length === 0 ? (
        <EmptyState emoji="📌" text="Todavía no cargaste gastos fijos para este mes." />
      ) : (
        fijos.map((f) => (
          <div className="row-card" key={f.id}>
            <button
              type="button"
              className={`checkbox${f.pagado ? ' checkbox--checked' : ''}`}
              onClick={() => togglePagado(f.id)}
              aria-label="Marcar como pagado"
            >
              {f.pagado ? '✓' : ''}
            </button>
            <div className="row-card__body">
              <p className="row-card__title">{f.nombre}</p>
              <p className="row-card__subtitle">{f.pagado ? 'Pagado' : 'Pendiente'}</p>
            </div>
            <span className="row-card__amount">{formatMoney(f.monto)}</span>
            <button
              type="button"
              className="movement__delete"
              onClick={() => setDeletingId(f.id)}
              aria-label="Borrar fijo"
            >
              ✕
            </button>
          </div>
        ))
      )}

      {deletingId && (
        <ConfirmDialog
          title="¿Borrar este gasto fijo?"
          text="Esta acción no se puede deshacer."
          onCancel={() => setDeletingId(null)}
          onConfirm={() => {
            handleDelete(deletingId)
            setDeletingId(null)
          }}
        />
      )}
    </div>
  )
}
