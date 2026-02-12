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
  const hasDetails = section?.map_embed_url || section?.additional_info || (section?.gallery_urls?.length > 0)
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={hasDetails ? onClick : undefined}
        className={`relative bg-champagne rounded-2xl md:rounded-3xl p-10 md:p-12 border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
          hasDetails ? 'cursor-pointer' : ''
        } ${className}`}
        style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)' }}
      >
        {/* Floral decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ color: 'var(--theme-accent)' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 10 Q60 30 80 30 Q60 50 50 70 Q40 50 20 30 Q40 30 50 10 Z" fill="currentColor" />
          </svg>
        </div>

        {Icon && (
          <div className="mb-8" style={{ color: 'var(--theme-accent)' }}>
            <Icon className="w-14 h-14 md:w-16 md:h-16" strokeWidth={1.2} />
          </div>
        )}
        <h3 className="text-3xl md:text-4xl font-display mb-6 leading-tight tracking-wide" style={{ color: 'var(--theme-body-heading)' }}>
          {title}
        </h3>
        {description && (
          <p className="font-body leading-relaxed text-lg mb-4 opacity-75 whitespace-pre-wrap" style={{ color: 'var(--theme-body-heading)' }}>{description}</p>
        )}
        {hasDetails && (
          <div className="mt-4 text-sm font-body italic flex items-center gap-2 opacity-70" style={{ color: 'var(--theme-accent)' }}>
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
          className="bg-champagne rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl"
          style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)' }}
        >
          {/* Header */}
          <div className="relative p-8 border-b" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              style={{ color: 'var(--theme-body-heading)' }}
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="p-4 rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                  <Icon className="w-12 h-12" strokeWidth={1.2} style={{ color: 'var(--theme-accent)' }} />
                </div>
              )}
              <div>
                <h2 className="text-4xl md:text-5xl font-display mb-2" style={{ color: 'var(--theme-body-heading)' }}>
                  {section.title}
                </h2>
                <span className="text-sm font-body uppercase tracking-wide opacity-60" style={{ color: 'var(--theme-body-heading)' }}>
                  {section.section_type}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Gallery */}
            {section.gallery_urls?.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                  {section.gallery_urls.map((url, index) => (
                    <div key={`${url}-${index}`} className="rounded-xl overflow-hidden bg-black/5">
                      <img
                        src={normalizeImageUrl(url)}
                        alt={`${section.title} ${index + 1}`}
                        className="w-full h-48 md:h-64 object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Description */}
            {section.description && (
              <div className="prose prose-lg max-w-none">
                <p className="font-body leading-relaxed text-lg opacity-80 whitespace-pre-wrap" style={{ color: 'var(--theme-body-heading)' }}>
                  {section.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            {section.additional_info && (
              <div className="bg-white/50 rounded-xl p-6 border" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                <h3 className="text-2xl font-display mb-4" style={{ color: 'var(--theme-body-heading)' }}>Additional Information</h3>
                <p className="font-body leading-relaxed whitespace-pre-wrap opacity-80" style={{ color: 'var(--theme-body-heading)' }}>
                  {section.additional_info}
                </p>
              </div>
            )}

            {/* Map */}
            {section.map_embed_url && (
              <div className="rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)' }}>
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

