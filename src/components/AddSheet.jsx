import { useEffect, useRef, useState } from 'react'
import { iconFor } from '../lib/categorias'
import { parseMonto } from '../lib/format'
import { makeId } from '../lib/id'
import { todayISO } from '../lib/dates'

function buildInitialState(editing) {
  if (editing) {
    return {
      tipo: editing.tipo,
      monto: String(editing.monto ?? ''),
      categoria: editing.categoria || '',
      origen: editing.origen || '',
      nota: editing.nota || '',
    }
  }
  return { tipo: 'gasto', monto: '', categoria: '', origen: '', nota: '' }
}

export default function AddSheet({ open, onClose, onSave, categorias, onAddCategoria, editing }) {
  const [tipo, setTipo] = useState('gasto')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [origen, setOrigen] = useState('')
  const [nota, setNota] = useState('')
  const [addingCategoria, setAddingCategoria] = useState(false)
  const [newCategoriaName, setNewCategoriaName] = useState('')
  const montoRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const initial = buildInitialState(editing)
    setTipo(initial.tipo)
    setMonto(initial.monto)
    setCategoria(initial.categoria)
    setOrigen(initial.origen)
    setNota(initial.nota)
    setAddingCategoria(false)
    setNewCategoriaName('')
    if (montoRef.current) {
      montoRef.current.focus()
    }
  }, [open, editing])

  if (!open) return null

  const montoNum = parseMonto(monto)
  const isValid = montoNum > 0 && (tipo === 'ingreso' || categoria !== '')

  function handleSave() {
    if (!isValid) return
    const transaccion = {
      id: editing ? editing.id : makeId(),
      tipo,
      monto: montoNum,
      categoria: tipo === 'gasto' ? categoria : '',
      origen: tipo === 'ingreso' ? origen.trim() : '',
      nota: nota.trim(),
      fecha: editing ? editing.fecha : todayISO(),
    }
    onSave(transaccion, Boolean(editing))
    onClose()
  }

  function handleConfirmNewCategoria() {
    const nombre = newCategoriaName.trim()
    if (!nombre) return
    onAddCategoria(nombre)
    setCategoria(nombre)
    setAddingCategoria(false)
    setNewCategoriaName('')
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__handle" />
        <h2 className="sheet__title">{editing ? 'Editar movimiento' : 'Anotar movimiento'}</h2>

        <div className="segmented">
          <button
            type="button"
            className={`segmented__option segmented__option--gasto${tipo === 'gasto' ? ' segmented__option--active' : ''}`}
            onClick={() => setTipo('gasto')}
          >
            Gasto
          </button>
          <button
            type="button"
            className={`segmented__option segmented__option--ingreso${tipo === 'ingreso' ? ' segmented__option--active' : ''}`}
            onClick={() => setTipo('ingreso')}
          >
            Ingreso
          </button>
        </div>

        <div className="amount-field">
          <span className="amount-field__sign">$</span>
          <input
            ref={montoRef}
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        {tipo === 'gasto' ? (
          <div className="field">
            <label className="field__label">Categoría</label>
            <div className="cat-grid">
              {categorias.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`cat-chip${categoria === cat ? ' cat-chip--active' : ''}`}
                  onClick={() => setCategoria(cat)}
                >
                  <span className="cat-chip__emoji">{iconFor(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
              {!addingCategoria && (
                <button
                  type="button"
                  className="cat-chip cat-chip--add"
                  onClick={() => setAddingCategoria(true)}
                >
                  <span className="cat-chip__emoji">＋</span>
                  <span>Nueva</span>
                </button>
              )}
            </div>
            {addingCategoria && (
              <div className="btn-row" style={{ marginTop: 10 }}>
                <input
                  type="text"
                  className="text-input"
                  placeholder="Nombre de la categoría"
                  value={newCategoriaName}
                  onChange={(e) => setNewCategoriaName(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '0 18px' }}
                  onClick={handleConfirmNewCategoria}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="field">
            <label className="field__label">De dónde</label>
            <input
              type="text"
              className="text-input"
              placeholder="Sueldo, freelance, etc."
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
            />
          </div>
        )}

        <div className="field">
          <label className="field__label">Nota (opcional)</label>
          <input
            type="text"
            className="text-input"
            placeholder="Agregá una nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>

        <button type="button" className="btn btn-primary" disabled={!isValid} onClick={handleSave}>
          Anotar
        </button>
      </div>
    </div>
  )
}
