import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { normalizeImageUrl } from '../utils/imageUrl'

const Lightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Blurred Background */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 max-w-7xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={normalizeImageUrl(currentImage.image_url)}
            alt={currentImage.caption || 'Gallery image'}
            className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
            onError={(e) => {
              console.error('Image failed to load:', currentImage.image_url)
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors bg-black/50 rounded-full p-2"
          >
            <X size={24} />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                onClick={handlePrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gold hover:text-gold/80 transition-colors bg-black/60 backdrop-blur-sm rounded-full p-4 border border-gold/30 shadow-xl"
              >
                <ChevronLeft size={28} strokeWidth={2} />
              </motion.button>
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gold hover:text-gold/80 transition-colors bg-black/60 backdrop-blur-sm rounded-full p-4 border border-gold/30 shadow-xl"
              >
                <ChevronRight size={28} strokeWidth={2} />
              </motion.button>
            </>
          )}

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black/50 rounded-lg p-4">
              <p className="font-body">{currentImage.caption}</p>
            </div>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 text-white bg-black/50 rounded-full px-4 py-2 text-sm font-body">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Lightbox

