import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { isAuthenticated } from '../services/auth'
import { useEditor } from '../contexts/EditorContext'
import { useTheme } from '../contexts/ThemeContext'
import { getHomeContent, updateHomeContent } from '../services/content'

const BLOCK_KEYS = {
  timeline: { apiKey: 'card_bg_timeline', themeKey: 'cardBgTimeline', label: 'Cor dos cards (Timeline)' },
  info: { apiKey: 'card_bg_info', themeKey: 'cardBgInfo', label: 'Cor dos cards (Informação)' },
  rsvp: { apiKey: 'card_bg_rsvp', themeKey: 'cardBgRsvp', label: 'Cor do bloco (RSVP)' },
}

const BlockColorEdit = ({ blockKey, className = '' }) => {
  const { editMode } = useEditor()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState('#F5E6D3')
  const [saving, setSaving] = useState(false)
  const popoverRef = useRef(null)

  const config = BLOCK_KEYS[blockKey]
  const currentColor = theme[config.themeKey] || '#F5E6D3'

  useEffect(() => {
    setColor(currentColor)
  }, [currentColor, open])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { [config.apiKey]: color }
      await updateHomeContent(payload)
      theme.refreshTheme()
      setOpen(false)
    } catch (err) {
      console.error('Error saving block color:', err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated() || !editMode) return null

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute top-2 right-2 z-20 p-2 rounded-lg bg-white/95 border border-gold/50 text-dusty-rose shadow-md hover:bg-champagne hover:shadow-lg transition-all"
        aria-label={`Editar cor - ${config.label}`}
      >
        <Pencil size={16} />
      </button>
      {open && (
        <div className="absolute top-12 right-0 z-30 w-56 p-4 bg-champagne border-2 border-gold/50 rounded-xl shadow-xl">
          <p className="text-sm font-display text-dusty-rose mb-3">{config.label}</p>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gold/40 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gold/40 bg-white/80 text-dusty-rose text-sm font-body"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 rounded-lg font-body text-sm font-semibold bg-gradient-to-r from-gold/70 to-gold/90 text-white disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Aplicar'}
          </button>
        </div>
      )}
    </div>
  )
}

export default BlockColorEdit
