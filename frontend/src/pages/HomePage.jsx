import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import HeroBanner from '../components/HeroBanner'
import { useTheme } from '../contexts/ThemeContext'
import { useEditor } from '../contexts/EditorContext'
import { isAuthenticated } from '../services/auth'

const HomePage = () => {
  const { loading, heroText, heroImageUrl, subtitle, weddingDate, textColor } = useTheme()
  const { editMode, openPanel } = useEditor()
  const showEditButton = isAuthenticated() && editMode

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative">
        <HeroBanner
          heroText={heroText}
          heroImageUrl={heroImageUrl}
          subtitle={subtitle}
          weddingDate={weddingDate}
          textColor={textColor}
        />
        {showEditButton && (
          <button
            type="button"
            onClick={() => openPanel('hero')}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-champagne/95 border-2 border-gold/50 rounded-xl font-body text-sm font-semibold text-dusty-rose shadow-lg hover:bg-champagne hover:shadow-xl transition-all"
            aria-label="Editar Hero"
          >
            <Pencil size={18} />
            Editar
          </button>
        )}
      </div>
    </div>
  )
}

export default HomePage
