const ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: '🏠' },
  { key: 'fijos', label: 'Fijos', icon: '📌' },
]

const ITEMS_RIGHT = [
  { key: 'cuotas', label: 'Cuotas', icon: '💳' },
  { key: 'ahorro', label: 'Ahorro', icon: '🐷' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavButton key={item.key} item={item} active={active === item.key} onChange={onChange} />
      ))}
      <div className="bottom-nav__fab-slot" aria-hidden="true" />
      {ITEMS_RIGHT.map((item) => (
        <NavButton key={item.key} item={item} active={active === item.key} onChange={onChange} />
      ))}
    </nav>
  )
}

function NavButton({ item, active, onChange }) {
  return (
    <button
      type="button"
      className={`bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`}
      onClick={() => onChange(item.key)}
    >
      <span className="bottom-nav__icon">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  )
}
