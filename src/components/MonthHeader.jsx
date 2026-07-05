import { formatMonthLabel } from '../lib/dates'

export default function MonthHeader({ monthKey, onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="month-header">
      <button
        type="button"
        className="month-header__arrow"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Mes anterior"
      >
        ←
      </button>
      <h1 className="month-header__label">{formatMonthLabel(monthKey)}</h1>
      <button
        type="button"
        className="month-header__arrow"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Mes siguiente"
      >
        →
      </button>
    </div>
  )
}
