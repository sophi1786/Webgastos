import { useState } from 'react'
import { getCuotas, saveCuotas } from '../lib/storage'

export function useCuotas() {
  const [cuotas, setCuotas] = useState(() => getCuotas())

  function update(updater) {
    setCuotas((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveCuotas(next)
      return next
    })
  }

  return [cuotas, update]
}
