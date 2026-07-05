import { useState } from 'react'
import MonthHeader from './components/MonthHeader'
import BottomNav from './components/BottomNav'
import Fab from './components/Fab'
import AddSheet from './components/AddSheet'
import Inicio from './screens/Inicio'
import Fijos from './screens/Fijos'
import Cuotas from './screens/Cuotas'
import Ahorro from './screens/Ahorro'
import { useMes } from './hooks/useMes'
import { useCategorias } from './hooks/useCategorias'
import { useCuotas } from './hooks/useCuotas'
import { MONTH_KEYS } from './lib/dates'

export default function App() {
  const [monthIndex, setMonthIndex] = useState(0)
  const [screen, setScreen] = useState('inicio')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const monthKey = MONTH_KEYS[monthIndex]
  const [mesData, updateMes] = useMes(monthKey)
  const [categorias, addCategoria] = useCategorias()
  const [cuotas, updateCuotas] = useCuotas()

  function goPrevMonth() {
    setMonthIndex((i) => Math.max(0, i - 1))
  }

  function goNextMonth() {
    setMonthIndex((i) => Math.min(MONTH_KEYS.length - 1, i + 1))
  }

  function openAddSheet(transaction = null) {
    setEditingTransaction(transaction)
    setSheetOpen(true)
  }

  function closeSheet() {
    setSheetOpen(false)
    setEditingTransaction(null)
  }

  function handleSaveTransaction(transaccion, isEdit) {
    updateMes((prev) => {
      const transacciones = isEdit
        ? prev.transacciones.map((t) => (t.id === transaccion.id ? transaccion : t))
        : [transaccion, ...prev.transacciones]
      return { ...prev, transacciones }
    })
  }

  function handleDeleteTransaction(id) {
    updateMes((prev) => ({
      ...prev,
      transacciones: prev.transacciones.filter((t) => t.id !== id),
    }))
  }

  return (
    <div className="app">
      <MonthHeader
        monthKey={monthKey}
        onPrev={goPrevMonth}
        onNext={goNextMonth}
        canPrev={monthIndex > 0}
        canNext={monthIndex < MONTH_KEYS.length - 1}
      />

      <div className="app__content">
        {screen === 'inicio' && (
          <Inicio
            mesData={mesData}
            onEditTransaction={openAddSheet}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
        {screen === 'fijos' && <Fijos mesData={mesData} updateMes={updateMes} />}
        {screen === 'cuotas' && (
          <Cuotas cuotas={cuotas} updateCuotas={updateCuotas} currentMonthKey={monthKey} />
        )}
        {screen === 'ahorro' && <Ahorro monthKey={monthKey} mesData={mesData} updateMes={updateMes} />}
      </div>

      <Fab onClick={() => openAddSheet(null)} />
      <BottomNav active={screen} onChange={setScreen} />

      <AddSheet
        open={sheetOpen}
        onClose={closeSheet}
        onSave={handleSaveTransaction}
        categorias={categorias}
        onAddCategoria={addCategoria}
        editing={editingTransaction}
      />
    </div>
  )
}
