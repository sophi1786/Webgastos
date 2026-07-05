import { DEFAULT_CATEGORIAS } from './categorias'
import { MONTH_KEYS } from './dates'

const CATEGORIAS_KEY = 'miLibreta_categorias'
const CUOTAS_KEY = 'miLibreta_cuotas'
const mesStorageKey = (mes) => `miLibreta_mes_${mes}`

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCategorias() {
  return read(CATEGORIAS_KEY, DEFAULT_CATEGORIAS)
}

export function saveCategorias(categorias) {
  write(CATEGORIAS_KEY, categorias)
}

function emptyMes() {
  return { transacciones: [], fijos: [], ahorro: 0 }
}

export function getMes(mesKey) {
  const data = read(mesStorageKey(mesKey), emptyMes())
  return {
    transacciones: data.transacciones || [],
    fijos: data.fijos || [],
    ahorro: data.ahorro || 0,
  }
}

export function saveMes(mesKey, data) {
  write(mesStorageKey(mesKey), data)
}

export function getCuotas() {
  return read(CUOTAS_KEY, [])
}

export function saveCuotas(cuotas) {
  write(CUOTAS_KEY, cuotas)
}

export function exportAllData() {
  const meses = {}
  MONTH_KEYS.forEach((mes) => {
    meses[mes] = getMes(mes)
  })
  return {
    version: 1,
    exportadoEl: new Date().toISOString(),
    categorias: getCategorias(),
    cuotas: getCuotas(),
    meses,
  }
}

export function importAllData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Archivo inválido')
  }
  if (Array.isArray(data.categorias)) {
    saveCategorias(data.categorias)
  }
  if (Array.isArray(data.cuotas)) {
    saveCuotas(data.cuotas)
  }
  if (data.meses && typeof data.meses === 'object') {
    MONTH_KEYS.forEach((mes) => {
      if (data.meses[mes]) {
        saveMes(mes, {
          transacciones: data.meses[mes].transacciones || [],
          fijos: data.meses[mes].fijos || [],
          ahorro: data.meses[mes].ahorro || 0,
        })
      }
    })
  }
}
