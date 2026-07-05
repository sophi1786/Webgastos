export function formatMoney(n) {
  const value = Number(n) || 0
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString('es-AR')}`
}

export function parseMonto(raw) {
  const n = parseFloat(String(raw).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
