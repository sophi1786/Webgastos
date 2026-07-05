import { useEffect, useState } from 'react'
import { getMes, saveMes } from '../lib/storage'

// Carga y persiste los datos (transacciones, fijos, ahorro) del mes activo.
export function useMes(mesKey) {
  const [data, setData] = useState(() => getMes(mesKey))

  useEffect(() => {
    setData(getMes(mesKey))
  }, [mesKey])

  function update(updater) {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveMes(mesKey, next)
      return next
    })
  }

  return [data, update]
}
