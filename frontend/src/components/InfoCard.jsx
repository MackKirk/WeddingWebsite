import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, X, MapPin } from 'lucide-react'
import { normalizeImageUrl } from '../utils/imageUrl'

const InfoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  section,
  className = '',
  onClick 
}) => {
  const hasDetails = section?.map_embed_url || section?.image_url || section?.additional_info
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={hasDetails ? onClick : undefined}
        className={`relative bg-champagne rounded-2xl md:rounded-3xl p-10 md:p-12 border border-gold/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
          hasDetails ? 'cursor-pointer' : ''
        } ${className}`}
      >
        {/* Floral decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
            <path d="M50 10 Q60 30 80 30 Q60 50 50 70 Q40 50 20 30 Q40 30 50 10 Z" fill="currentColor" />
          </svg>
        </div>

        {Icon && (
          <div className="mb-8">
            <Icon className="w-14 h-14 md:w-16 md:h-16 text-gold" strokeWidth={1.2} />
          </div>
        )}
        <h3 className="text-3xl md:text-4xl font-display text-dusty-rose mb-6 leading-tight tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-dusty-rose/75 font-body leading-relaxed text-lg mb-4">{description}</p>
        )}
        {hasDetails && (
          <div className="mt-4 text-sm text-gold/70 font-body italic flex items-center gap-2">
            <MapPin size={16} />
            <span>Click for more details</span>
          </div>
        )}
      </motion.div>
    </>
  )
}

export const InfoModal = ({ section, isOpen, onClose, icon: Icon }) => {
  if (!isOpen || !section) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-champagne rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gold/40 shadow-2xl"
        >
          {/* Header */}
          <div className="relative p-8 border-b border-gold/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-dusty-rose transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="p-4 bg-gold/20 rounded-2xl">
                  <Icon className="w-12 h-12 text-gold" strokeWidth={1.2} />
                </div>
              )}
              <div>
                <h2 className="text-4xl md:text-5xl font-display text-dusty-rose mb-2">
                  {section.title}
                </h2>
                <span className="text-sm text-dusty-rose/60 font-body uppercase tracking-wide">
                  {section.section_type}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Image */}
            {section.image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border border-gold/30"
              >
                <img
                  src={normalizeImageUrl(section.image_url)}
                  alt={section.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', section.image_url)
                  }}
                />
              </motion.div>
            )}

            {/* Description */}
            {section.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-dusty-rose/80 font-body leading-relaxed text-lg">
                  {section.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            {section.additional_info && (
              <div className="bg-white/50 rounded-xl p-6 border border-gold/20">
                <h3 className="text-2xl font-display text-dusty-rose mb-4">Additional Information</h3>
                <p className="text-dusty-rose/80 font-body leading-relaxed whitespace-pre-line">
                  {section.additional_info}
                </p>
              </div>
            )}

            {/* Map */}
            {section.map_embed_url && (
              <div className="rounded-2xl overflow-hidden border border-gold/30 shadow-lg">
                <iframe
                  src={section.map_embed_url}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InfoCard

