import { useEffect, useMemo, useState } from 'react'
import { formatMoney, parseMonto } from '../lib/format'
import { MONTH_KEYS, formatMonthLabelShort } from '../lib/dates'
import { getMes } from '../lib/storage'

export default function Ahorro({ monthKey, mesData, updateMes }) {
  const [monto, setMonto] = useState(String(mesData.ahorro || ''))

  useEffect(() => {
    setMonto(mesData.ahorro ? String(mesData.ahorro) : '')
  }, [monthKey, mesData.ahorro])

  const historial = useMemo(
    () =>
      MONTH_KEYS.map((m) => ({
        mes: m,
        ahorro: m === monthKey ? mesData.ahorro : getMes(m).ahorro,
      })),
    [monthKey, mesData.ahorro],
  )

  const totalAcumulado = useMemo(() => historial.reduce((sum, h) => sum + h.ahorro, 0), [historial])
  const maxAhorro = Math.max(1, ...historial.map((h) => h.ahorro))

  function handleGuardar() {
    const value = parseMonto(monto)
    updateMes((prev) => ({ ...prev, ahorro: value }))
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header__title">Ahorro</h2>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="section-title">Ahorro de {formatMonthLabelShort(monthKey)}</p>
        <div className="field">
          <input
            type="number"
            inputMode="decimal"
            className="text-input"
            placeholder="Monto a apartar este mes"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleGuardar}>
          Guardar
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="section-title">Historial</p>
        <div className="ahorro-bars">
          {historial.map((h) => (
            <div className="ahorro-bar" key={h.mes}>
              <div
                className={`ahorro-bar__col${h.ahorro > 0 ? ' ahorro-bar__col--filled' : ''}`}
                style={{ height: `${Math.max(4, (h.ahorro / maxAhorro) * 100)}%` }}
              />
              <span className="ahorro-bar__label">{formatMonthLabelShort(h.mes).split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="wallet-card__item-label" style={{ color: 'var(--text-secondary)' }}>
          Total acumulado
        </p>
        <p className="wallet-card__balance" style={{ color: 'var(--text)' }}>
          {formatMoney(totalAcumulado)}
        </p>
      </div>
    </div>
  )
}
