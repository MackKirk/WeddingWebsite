import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, X, Clock, Heart, Cake, Music, UtensilsCrossed } from 'lucide-react'
import { normalizeImageUrl } from '../utils/imageUrl'

// Icon mapping for timeline events
const iconMap = {
  'rings': Heart, // Using Heart as wedding rings icon (Ring doesn't exist in lucide-react)
  'heart': Heart,
  'clock': Clock,
  'cake': Cake,
  'music': Music,
  'cocktail': UtensilsCrossed,
  'dinner': UtensilsCrossed,
}

const Timeline = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body opacity-60" style={{ color: 'var(--theme-body-heading)' }}>No timeline events yet.</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-12">
      {/* Vertical Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full hidden md:block" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--theme-accent) 50%, transparent), var(--theme-accent), color-mix(in srgb, var(--theme-accent) 50%, transparent))' }} />

      {events.map((event, index) => {
        const isEven = index % 2 === 0
        const timeStr = event.time ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }) : ''

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            className={`relative mb-12 md:mb-16 ${
              isEven ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
            }`}
            style={{ zIndex: 1 }}
          >
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 shadow-lg z-20 hidden md:block pointer-events-none" style={{ backgroundColor: 'var(--theme-accent)', borderColor: 'var(--theme-body-bg)' }} />

            {/* Event Card */}
            <motion.div
              onClick={(e) => {
                e.stopPropagation()
                const hasDetails = event.image_url || event.additional_info
                console.log('Timeline card clicked:', event.title, 'Has details:', hasDetails, 'Image:', event.image_url, 'Additional:', event.additional_info)
                if (hasDetails) {
                  setSelectedEvent(event)
                }
              }}
              className={`md:w-[45%] rounded-xl md:rounded-2xl p-6 md:p-8 border shadow-lg transition-all duration-300 relative ${
                index % 4 === 0
                  ? 'bg-champagne'
                  : index % 4 === 1
                  ? 'bg-blush-pink/30'
                  : index % 4 === 2
                  ? 'bg-dusty-rose/20'
                  : 'bg-olive-green/10'
              } ${(event.image_url || event.additional_info) ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : ''}`}
              style={{ zIndex: 10, position: 'relative', borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)' }}
              whileHover={(event.image_url || event.additional_info) ? { scale: 1.02 } : {}}
            >
              <div className="flex items-start gap-4" onClick={(e) => e.stopPropagation()}>
                {event.icon && (() => {
                  const IconComponent = iconMap[event.icon] || Clock
                  return (
                    <div className="flex-shrink-0" style={{ color: 'var(--theme-accent)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                        <IconComponent size={20} strokeWidth={1.5} />
                      </div>
                    </div>
                  )
                })()}
                <div className="flex-1">
                  <div className="font-body text-sm mb-3 font-semibold tracking-wide" style={{ color: 'var(--theme-accent)' }}>{timeStr}</div>
                  <h3 className="text-2xl md:text-3xl font-display mb-4 tracking-wide" style={{ color: 'var(--theme-body-heading)' }}>{event.title}</h3>
                  {event.description && (
                    <p className="font-body leading-relaxed text-lg opacity-80" style={{ color: 'var(--theme-body-heading)' }}>
                      {event.description}
                    </p>
                  )}
                  {(event.image_url || event.additional_info) && (
                    <div className="mt-4 text-sm font-body italic flex items-center gap-2 opacity-70" style={{ color: 'var(--theme-accent)' }}>
                      <Clock size={16} />
                      <span>Click for more details</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Timeline Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <TimelineEventModal
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const TimelineEventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null

  const timeStr = event.time ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) : ''

  const IconComponent = event.icon ? (iconMap[event.icon] || Clock) : Clock

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
              <div className="p-4 rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                <IconComponent className="w-12 h-12" strokeWidth={1.2} style={{ color: 'var(--theme-accent)' }} />
              </div>
              <div>
                <div className="font-body text-sm mb-2 font-semibold tracking-wide" style={{ color: 'var(--theme-accent)' }}>{timeStr}</div>
                <h2 className="text-4xl md:text-5xl font-display mb-2" style={{ color: 'var(--theme-body-heading)' }}>
                  {event.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Image */}
            {event.image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)' }}
              >
                <img
                  src={normalizeImageUrl(event.image_url)}
                  alt={event.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', event.image_url)
                    e.target.style.display = 'none'
                  }}
                />
              </motion.div>
            )}

            {/* Description */}
            {event.description && (
              <div className="prose prose-lg max-w-none">
                <p className="font-body leading-relaxed text-lg opacity-80" style={{ color: 'var(--theme-body-heading)' }}>
                  {event.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            {event.additional_info && (
              <div className="bg-white/50 rounded-xl p-6 border" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                <h3 className="text-2xl font-display mb-4" style={{ color: 'var(--theme-body-heading)' }}>Additional Information</h3>
                <p className="font-body leading-relaxed whitespace-pre-line opacity-80" style={{ color: 'var(--theme-body-heading)' }}>
                  {event.additional_info}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Timeline

