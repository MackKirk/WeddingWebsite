import { motion } from 'framer-motion'
import { Clock, Heart, Cake, Music, UtensilsCrossed } from 'lucide-react'
import BlockColorEdit from './BlockColorEdit'

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
  if (!events || events.length === 0) {
    return (
      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <BlockColorEdit blockKey="timeline" className="absolute top-4 right-4" />
        <div className="text-center py-20">
          <p className="font-body opacity-60" style={{ color: 'var(--theme-body-heading)' }}>No timeline events yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-12">
      <BlockColorEdit blockKey="timeline" className="absolute top-4 right-4" />
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
              className="md:w-[45%] rounded-xl md:rounded-2xl p-6 md:p-8 border shadow-lg transition-all duration-300 relative"
              style={{ zIndex: 10, position: 'relative', borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)', backgroundColor: 'var(--theme-card-bg-timeline)' }}
            >
              <div className="flex items-start gap-4">
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default Timeline

