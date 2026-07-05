export const MONTH_KEYS = [
  '2026-07',
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12',
]

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// Suma (o resta, con delta negativo) meses a una key "YYYY-MM" de forma segura
// en ambas direcciones, sin depender de Date (evita corrimientos por timezone).
export function addMonths(monthKey, delta) {
  const [y, m] = monthKey.split('-').map(Number)
  const totalMonths = y * 12 + (m - 1) + delta
  const newYear = Math.floor(totalMonths / 12)
  const newMonth = ((totalMonths % 12) + 12) % 12
  return `${newYear}-${String(newMonth + 1).padStart(2, '0')}`
}

export function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number)
  return `${MONTH_NAMES_ES[m - 1]} ${y}`
}

export function formatMonthLabelShort(monthKey) {
  const [y, m] = monthKey.split('-').map(Number)
  return `${MONTH_NAMES_ES[m - 1].slice(0, 3)} ${String(y).slice(2)}`
}

export function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateShort(iso) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}
