import { useMemo, useState } from 'react'
import { formatMoney } from '../lib/format'
import { formatDateShort } from '../lib/dates'
import { iconFor } from '../lib/categorias'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import DataActions from '../components/DataActions'

export default function Inicio({ mesData, onEditTransaction, onDeleteTransaction }) {
  const [deletingId, setDeletingId] = useState(null)

  const { transacciones, fijos, ahorro } = mesData

  const ingresos = useMemo(
    () => transacciones.filter((t) => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0),
    [transacciones],
  )
  const gastos = useMemo(
    () => transacciones.filter((t) => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0),
    [transacciones],
  )
  const fijosTotal = useMemo(() => fijos.reduce((sum, f) => sum + f.monto, 0), [fijos])
  const balanceLibre = ingresos - gastos - fijosTotal - ahorro

  const gastosPorCategoria = useMemo(() => {
    const map = new Map()
    transacciones
      .filter((t) => t.tipo === 'gasto')
      .forEach((t) => {
        const cat = t.categoria || 'Otros'
        map.set(cat, (map.get(cat) || 0) + t.monto)
      })
    return Array.from(map.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
  }, [transacciones])

  const maxCategoria = gastosPorCategoria[0]?.total || 1

  const movimientosOrdenados = useMemo(
    () => [...transacciones].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0)),
    [transacciones],
  )

  return (
    <div>
      <div className="wallet-card">
        <p className="wallet-card__label">Balance libre</p>
        <p className="wallet-card__balance">{formatMoney(balanceLibre)}</p>
        <div className="wallet-card__grid">
          <div>
            <p className="wallet-card__item-label">Ingresos</p>
            <p className="wallet-card__item-value">{formatMoney(ingresos)}</p>
          </div>
          <div>
            <p className="wallet-card__item-label">Gastos</p>
            <p className="wallet-card__item-value">{formatMoney(gastos)}</p>
          </div>
          <div>
            <p className="wallet-card__item-label">Fijos</p>
            <p className="wallet-card__item-value">{formatMoney(fijosTotal)}</p>
          </div>
          <div>
            <p className="wallet-card__item-label">Ahorro</p>
            <p className="wallet-card__item-value">{formatMoney(ahorro)}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="section-title">Gastos por categoría</p>
        {gastosPorCategoria.length === 0 ? (
          <EmptyState emoji="🧾" text="Todavía no anotaste ningún gasto este mes." />
        ) : (
          <div className="cat-bars">
            {gastosPorCategoria.map(({ categoria, total }) => (
              <div key={categoria}>
                <div className="cat-bar__top">
                  <span className="cat-bar__name">
                    {iconFor(categoria)} {categoria}
                  </span>
                  <span className="cat-bar__value">{formatMoney(total)}</span>
                </div>
                <div className="cat-bar__track">
                  <div
                    className="cat-bar__fill"
                    style={{ width: `${Math.max(4, (total / maxCategoria) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <p className="section-title">Últimos movimientos</p>
        {movimientosOrdenados.length === 0 ? (
          <EmptyState emoji="✍️" text="Tocá el botón + para anotar tu primer movimiento." />
        ) : (
          <div>
            {movimientosOrdenados.map((t) => (
              <div className="movement" key={t.id}>
                <div className="movement__icon">{t.tipo === 'gasto' ? iconFor(t.categoria) : '💰'}</div>
                <button type="button" className="movement__body" onClick={() => onEditTransaction(t)}>
                  <span className="movement__title">
                    {t.tipo === 'gasto' ? t.categoria : t.origen || 'Ingreso'}
                  </span>
                  <span className="movement__meta">
                    {[t.nota, formatDateShort(t.fecha)].filter(Boolean).join(' · ')}
                  </span>
                </button>
                <span className={`movement__amount movement__amount--${t.tipo}`}>
                  {t.tipo === 'ingreso' ? '+' : '−'}
                  {formatMoney(t.monto)}
                </span>
                <button
                  type="button"
                  className="movement__delete"
                  onClick={() => setDeletingId(t.id)}
                  aria-label="Borrar movimiento"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deletingId && (
        <ConfirmDialog
          title="¿Borrar este movimiento?"
          text="Esta acción no se puede deshacer."
          onCancel={() => setDeletingId(null)}
          onConfirm={() => {
            onDeleteTransaction(deletingId)
            setDeletingId(null)
          }}
        />
      )}

      <DataActions />
    </div>
  )
}
