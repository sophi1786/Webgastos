import { useMemo, useState } from 'react'
import { formatMoney, parseMonto } from '../lib/format'
import { makeId } from '../lib/id'
import { MONTH_KEYS, addMonths, formatMonthLabelShort } from '../lib/dates'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

const MEDIOS_PAGO = ['Mastercard', 'Naranja', 'Cabal', 'Mercado Pago', 'Visa', 'Otro']

function mesFinDe(cuota) {
  return addMonths(cuota.mesInicio, cuota.cantidadCuotas - 1)
}

function estaSaldada(cuota) {
  return cuota.cuotasPagadas >= cuota.cantidadCuotas
}

export default function Cuotas({ cuotas, updateCuotas, currentMonthKey }) {
  const [formOpen, setFormOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [medioPago, setMedioPago] = useState(MEDIOS_PAGO[0])
  const [montoCuota, setMontoCuota] = useState('')
  const [cantidadCuotas, setCantidadCuotas] = useState('')
  const [mesInicio, setMesInicio] = useState(currentMonthKey)
  const [deletingId, setDeletingId] = useState(null)

  const enCurso = useMemo(() => cuotas.filter((c) => !estaSaldada(c)), [cuotas])
  const saldadas = useMemo(() => cuotas.filter((c) => estaSaldada(c)), [cuotas])

  const comprometidoEsteMes = useMemo(
    () =>
      enCurso
        .filter((c) => currentMonthKey >= c.mesInicio && currentMonthKey <= mesFinDe(c))
        .reduce((sum, c) => sum + c.montoCuota, 0),
    [enCurso, currentMonthKey],
  )

  const deudaRestante = useMemo(
    () => enCurso.reduce((sum, c) => sum + (c.cantidadCuotas - c.cuotasPagadas) * c.montoCuota, 0),
    [enCurso],
  )

  const isValid = nombre.trim() !== '' && parseMonto(montoCuota) > 0 && parseInt(cantidadCuotas, 10) > 0

  function resetForm() {
    setNombre('')
    setMedioPago(MEDIOS_PAGO[0])
    setMontoCuota('')
    setCantidadCuotas('')
    setMesInicio(currentMonthKey)
    setFormOpen(false)
  }

  function handleAdd() {
    if (!isValid) return
    const nueva = {
      id: makeId(),
      nombre: nombre.trim(),
      medioPago,
      montoCuota: parseMonto(montoCuota),
      cantidadCuotas: parseInt(cantidadCuotas, 10),
      mesInicio,
      cuotasPagadas: 0,
    }
    updateCuotas((prev) => [nueva, ...prev])
    resetForm()
  }

  function ajustarPagadas(id, delta) {
    updateCuotas((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const next = Math.min(c.cantidadCuotas, Math.max(0, c.cuotasPagadas + delta))
        return { ...c, cuotasPagadas: next }
      }),
    )
  }

  function handleDelete(id) {
    updateCuotas((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header__title">Cuotas</h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-card__value">{enCurso.length}</p>
          <p className="stat-card__label">Activas</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__value">{formatMoney(comprometidoEsteMes)}</p>
          <p className="stat-card__label">Este mes</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__value">{formatMoney(deudaRestante)}</p>
          <p className="stat-card__label">Deuda restante</p>
        </div>
      </div>

      {!formOpen ? (
        <button type="button" className="btn btn-secondary" style={{ marginBottom: 20 }} onClick={() => setFormOpen(true)}>
          + Nueva compra en cuotas
        </button>
      ) : (
        <div className="card" style={{ marginBottom: 20 }}>
          <p className="section-title">Nueva compra en cuotas</p>
          <div className="field">
            <input
              type="text"
              className="text-input"
              placeholder="Nombre de la compra"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="field">
            <select className="text-input" value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
              {MEDIOS_PAGO.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-row" style={{ marginBottom: 18 }}>
            <input
              type="number"
              inputMode="decimal"
              className="text-input"
              placeholder="Monto por cuota"
              value={montoCuota}
              onChange={(e) => setMontoCuota(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              className="text-input"
              placeholder="Cant. cuotas"
              value={cantidadCuotas}
              onChange={(e) => setCantidadCuotas(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field__label">Mes de inicio</label>
            <select className="text-input" value={mesInicio} onChange={(e) => setMesInicio(e.target.value)}>
              {MONTH_KEYS.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabelShort(m)}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" disabled={!isValid} onClick={handleAdd}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {cuotas.length === 0 ? (
        <EmptyState emoji="💳" text="Todavía no cargaste compras en cuotas." />
      ) : (
        <>
          <p className="section-title">En curso</p>
          {enCurso.length === 0 ? (
            <EmptyState emoji="🎉" text="No tenés cuotas en curso." />
          ) : (
            enCurso.map((c) => (
              <CuotaCard
                key={c.id}
                cuota={c}
                onAjustar={ajustarPagadas}
                onDelete={() => setDeletingId(c.id)}
              />
            ))
          )}

          {saldadas.length > 0 && (
            <>
              <p className="section-title" style={{ marginTop: 20 }}>
                Saldadas
              </p>
              {saldadas.map((c) => (
                <CuotaCard
                  key={c.id}
                  cuota={c}
                  onAjustar={ajustarPagadas}
                  onDelete={() => setDeletingId(c.id)}
                />
              ))}
            </>
          )}
        </>
      )}

      {deletingId && (
        <ConfirmDialog
          title="¿Borrar esta compra en cuotas?"
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

function CuotaCard({ cuota, onAjustar, onDelete }) {
  const saldada = estaSaldada(cuota)
  const progreso = Math.min(100, (cuota.cuotasPagadas / cuota.cantidadCuotas) * 100)
  const mesFin = mesFinDe(cuota)

  return (
    <div className="cuota-card">
      <div className="cuota-card__top">
        <div>
          <p className="cuota-card__name">{cuota.nombre}</p>
          <p className="cuota-card__meta">
            {cuota.medioPago} · termina {formatMonthLabelShort(mesFin)}
          </p>
        </div>
        <span className="cuota-card__amount">{formatMoney(cuota.montoCuota)}</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill${saldada ? ' progress-fill--done' : ''}`}
          style={{ width: `${progreso}%` }}
        />
      </div>
      <div className="cuota-card__bottom">
        <span className="cuota-card__progress-label">
          {cuota.cuotasPagadas} / {cuota.cantidadCuotas} cuotas
        </span>
        <div className="stepper">
          <button
            type="button"
            className="stepper__btn"
            onClick={() => onAjustar(cuota.id, -1)}
            disabled={cuota.cuotasPagadas <= 0}
            aria-label="Restar cuota pagada"
          >
            −
          </button>
          <button
            type="button"
            className="stepper__btn"
            onClick={() => onAjustar(cuota.id, 1)}
            disabled={cuota.cuotasPagadas >= cuota.cantidadCuotas}
            aria-label="Sumar cuota pagada"
          >
            +
          </button>
        </div>
      </div>
      <button type="button" className="cuota-card__delete" onClick={onDelete}>
        Borrar
      </button>
    </div>
  )
}
