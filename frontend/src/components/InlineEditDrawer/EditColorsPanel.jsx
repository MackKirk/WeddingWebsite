import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { getHomeContent, updateHomeContent } from '../../services/content'
import { useEditor } from '../../contexts/EditorContext'
import { useTheme } from '../../contexts/ThemeContext'

const COLOR_DEFAULTS = {
  text_color: '#8B6F6D',
  navbar_color: '#F8F4EC',
  navbar_text_color: '#8B6F6D',
  logo_text_color: '#D4B483',
  accent_color: '#D4B483',
  body_bg_color: '#F8F4EC',
  body_heading_color: '#8B6F6D',
  body_text_color: '#333333',
  footer_bg_color: '#CFA7A4',
  footer_text_color: '#8B6F6D',
}

const CSS_VAR_MAP = {
  text_color: '--theme-hero-text',
  navbar_color: '--theme-navbar-bg',
  navbar_text_color: '--theme-navbar-text',
  logo_text_color: '--theme-logo-text',
  accent_color: '--theme-accent',
  body_bg_color: '--theme-body-bg',
  body_heading_color: '--theme-body-heading',
  body_text_color: '--theme-body-text',
  footer_bg_color: '--theme-footer-bg',
  footer_text_color: '--theme-footer-text',
}

const LABELS = {
  text_color: 'Hero / titles',
  navbar_color: 'Navbar background',
  navbar_text_color: 'Menu links',
  logo_text_color: 'Logo text (menu)',
  accent_color: 'Accent color',
  body_bg_color: 'Page background',
  body_heading_color: 'Section headings',
  body_text_color: 'Body text',
  footer_bg_color: 'Footer background',
  footer_text_color: 'Footer text',
}

const applyPreview = (colors) => {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = CSS_VAR_MAP[key]
    if (cssVar && value) root.style.setProperty(cssVar, value)
  })
}

const EditColorsPanel = () => {
  const { closePanel, refreshAfterSave } = useEditor()
  const { refreshTheme } = useTheme()
  const [colors, setColors] = useState(COLOR_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const updateColor = useCallback((key, value) => {
    setColors((prev) => {
      const next = { ...prev, [key]: value }
      applyPreview(next)
      return next
    })
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHomeContent()
        const d = res.data
        const next = {
          text_color: d.text_color || COLOR_DEFAULTS.text_color,
          navbar_color: d.navbar_color ?? COLOR_DEFAULTS.navbar_color,
          navbar_text_color: d.navbar_text_color ?? COLOR_DEFAULTS.navbar_text_color,
          logo_text_color: d.logo_text_color ?? COLOR_DEFAULTS.logo_text_color,
          accent_color: d.accent_color ?? COLOR_DEFAULTS.accent_color,
          body_bg_color: d.body_bg_color ?? COLOR_DEFAULTS.body_bg_color,
          body_heading_color: d.body_heading_color ?? COLOR_DEFAULTS.body_heading_color,
          body_text_color: d.body_text_color ?? COLOR_DEFAULTS.body_text_color,
          footer_bg_color: d.footer_bg_color ?? COLOR_DEFAULTS.footer_bg_color,
          footer_text_color: d.footer_text_color ?? COLOR_DEFAULTS.footer_text_color,
        }
        setColors(next)
        applyPreview(next)
      } catch (e) {
        console.error('Error loading home content:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Restore theme when closing without save (revert preview)
  useEffect(() => {
    return () => {
      refreshTheme()
    }
  }, [refreshTheme])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateHomeContent(colors)
      refreshAfterSave()
      closePanel()
    } catch (err) {
      console.error('Error saving:', err)
      alert('Error saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center font-body text-dusty-rose/70">
        Loading...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <p className="text-sm text-dusty-rose/70 font-body mb-4">
        Change colors and see live preview on the site.
      </p>
      {Object.entries(LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center gap-3">
          <input
            type="color"
            value={colors[key] || '#000'}
            onChange={(e) => updateColor(key, e.target.value)}
            className="w-12 h-10 rounded-lg border border-gold/40 cursor-pointer flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <label className="block text-dusty-rose font-body text-sm font-medium mb-1 truncate">
              {label}
            </label>
            <input
              type="text"
              value={colors[key] || ''}
              onChange={(e) => updateColor(key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-dusty-rose text-sm"
            />
          </div>
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={closePanel}
          className="flex-1 px-4 py-3 rounded-xl font-body font-medium border-2 border-gold/50 text-dusty-rose hover:bg-champagne/50 transition-colors"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body font-semibold bg-gradient-to-r from-gold/70 to-gold/90 text-white shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save colors'}
        </motion.button>
      </div>
    </form>
  )
}

export default EditColorsPanel
