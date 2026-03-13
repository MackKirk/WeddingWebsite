import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Palette, Image } from 'lucide-react'
import { isAuthenticated } from '../services/auth'
import { useEditor } from '../contexts/EditorContext'

const EditSiteFloatingButton = () => {
  const { editMode, toggleEditMode, openPanel } = useEditor()

  if (!isAuthenticated()) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col gap-2"
          >
            <button
              type="button"
              onClick={() => openPanel('hero')}
              className="flex items-center gap-2 px-4 py-2.5 bg-champagne border-2 rounded-xl font-body text-sm font-medium shadow-lg hover:shadow-xl transition-all border-gold/50 text-dusty-rose hover:bg-champagne/90"
            >
              <Image size={18} />
              Edit Hero
            </button>
            <button
              type="button"
              onClick={() => openPanel('colors')}
              className="flex items-center gap-2 px-4 py-2.5 bg-champagne border-2 rounded-xl font-body text-sm font-medium shadow-lg hover:shadow-xl transition-all border-gold/50 text-dusty-rose hover:bg-champagne/90"
            >
              <Palette size={18} />
              Edit colors
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={toggleEditMode}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-semibold shadow-xl transition-all ${
          editMode
            ? 'bg-dusty-rose/90 text-white border-2 border-dusty-rose'
            : 'bg-champagne border-2 border-gold/50 text-dusty-rose hover:bg-champagne/90'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {editMode ? (
          <>
            <X size={18} />
            Exit edit mode
          </>
        ) : (
          <>
            <Pencil size={18} />
            Edit site
          </>
        )}
      </motion.button>
    </div>
  )
}

export default EditSiteFloatingButton
