import { useState } from 'react'
import { getCategorias, saveCategorias } from '../lib/storage'

export function useCategorias() {
  const [categorias, setCategorias] = useState(() => getCategorias())

  function addCategoria(nombre) {
    const limpio = nombre.trim()
    if (!limpio) return
    setCategorias((prev) => {
      if (prev.includes(limpio)) return prev
      const next = [...prev, limpio]
      saveCategorias(next)
      return next
    })
  }

  return [categorias, addCategoria]
}
