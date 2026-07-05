import { useRef, useState } from 'react'
import { exportAllData, importAllData } from '../lib/storage'

export default function DataActions() {
  const fileInputRef = useRef(null)
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function handleExport() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mi-libreta-backup-${data.exportadoEl.slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Datos exportados')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        importAllData(data)
        showToast('Datos importados')
        setTimeout(() => window.location.reload(), 600)
      } catch {
        showToast('No se pudo importar el archivo')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div>
      <div className="data-actions">
        <button type="button" className="btn-text" onClick={handleExport}>
          ⬆ Exportar datos
        </button>
        <button type="button" className="btn-text" onClick={handleImportClick}>
          ⬇ Importar datos
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
