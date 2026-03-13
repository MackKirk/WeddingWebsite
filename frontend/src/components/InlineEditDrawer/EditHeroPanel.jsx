import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { getHomeContent, updateHomeContent } from '../../services/content'
import { useEditor } from '../../contexts/EditorContext'

const DEFAULTS = {
  hero_text: '',
  hero_image_url: '',
  subtitle: '',
  wedding_date: '',
}

const EditHeroPanel = () => {
  const { closePanel, refreshAfterSave } = useEditor()
  const [content, setContent] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHomeContent()
        const d = res.data
        setContent({
          hero_text: d.hero_text || '',
          hero_image_url: d.hero_image_url || '',
          subtitle: d.subtitle || '',
          wedding_date: d.wedding_date || '',
        })
      } catch (e) {
        console.error('Error loading home content:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateHomeContent(content)
      refreshAfterSave()
      closePanel()
    } catch (err) {
      console.error('Error saving:', err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center font-body text-dusty-rose/70">
        Carregando...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label className="block text-dusty-rose font-display font-medium mb-2 text-sm">
          Nomes (Hero)
        </label>
        <input
          type="text"
          value={content.hero_text}
          onChange={(e) => setContent({ ...content, hero_text: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-dusty-rose"
          placeholder="John & Jane"
        />
      </div>
      <div>
        <label className="block text-dusty-rose font-display font-medium mb-2 text-sm">
          Subtítulo
        </label>
        <input
          type="text"
          value={content.subtitle}
          onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-dusty-rose"
          placeholder="June 27th, 2026"
        />
      </div>
      <div>
        <label className="block text-dusty-rose font-display font-medium mb-2 text-sm">
          Data do casamento
        </label>
        <input
          type="date"
          value={content.wedding_date}
          onChange={(e) => setContent({ ...content, wedding_date: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-dusty-rose"
        />
      </div>
      <div>
        <label className="block text-dusty-rose font-display font-medium mb-2 text-sm">
          URL da imagem do Hero
        </label>
        <input
          type="url"
          value={content.hero_image_url}
          onChange={(e) => setContent({ ...content, hero_image_url: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-dusty-rose text-sm"
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={closePanel}
          className="flex-1 px-4 py-3 rounded-xl font-body font-medium border-2 border-gold/50 text-dusty-rose hover:bg-champagne/50 transition-colors"
        >
          Cancelar
        </button>
        <motion.button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body font-semibold bg-gradient-to-r from-gold/70 to-gold/90 text-white shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          {saving ? 'Salvando...' : 'Salvar'}
        </motion.button>
      </div>
    </form>
  )
}

export default EditHeroPanel
