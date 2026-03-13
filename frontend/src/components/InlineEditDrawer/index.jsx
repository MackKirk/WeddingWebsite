import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEditor } from '../../contexts/EditorContext'
import { isAuthenticated } from '../../services/auth'
import EditHeroPanel from './EditHeroPanel'
import EditColorsPanel from './EditColorsPanel'

const PANEL_TITLES = {
  hero: 'Edit Hero',
  colors: 'Site colors',
}

const InlineEditDrawer = () => {
  const { panelOpen, panelType, closePanel } = useEditor()

  if (!isAuthenticated()) return null

  const title = panelType ? PANEL_TITLES[panelType] : ''

  return (
    <AnimatePresence>
      {panelOpen && panelType && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closePanel}
            aria-hidden
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-champagne border-l-2 border-gold/40 shadow-2xl z-50 flex flex-col"
            style={{ zIndex: 51 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gold/30 flex-shrink-0">
              <h2 className="text-xl font-display text-dusty-rose tracking-wide">
                {title}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="p-2 rounded-full hover:bg-white/60 transition-colors text-dusty-rose"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {panelType === 'hero' && <EditHeroPanel />}
              {panelType === 'colors' && <EditColorsPanel />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default InlineEditDrawer
