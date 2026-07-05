export const DEFAULT_CATEGORIAS = [
  'Comida',
  'Viaje',
  'Nafta',
  'Regalos',
  'Fútbol',
  'Salidas',
  'Meriendas',
  'Ropa',
  'Otros',
]

const ICONS = {
  Comida: '🍔',
  Viaje: '✈️',
  Nafta: '⛽',
  Regalos: '🎁',
  Fútbol: '⚽',
  Salidas: '🌆',
  Meriendas: '🥐',
  Ropa: '👕',
  Otros: '📦',
}

export function iconFor(categoria) {
  return ICONS[categoria] || '🏷️'
}
