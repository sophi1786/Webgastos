export default function EmptyState({ emoji = '📭', text }) {
  return (
    <div className="empty-state">
      <span className="empty-state__emoji">{emoji}</span>
      <p>{text}</p>
    </div>
  )
}
