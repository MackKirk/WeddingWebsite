import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-dusty-rose/60 font-body">No timeline events yet.</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-12">
      {/* Vertical Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gold/50 via-gold to-gold/50 hidden md:block" />

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
          >
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-champagne shadow-lg z-10 hidden md:block" />

            {/* Event Card */}
            <div
              className={`md:w-[45%] rounded-xl md:rounded-2xl p-6 md:p-8 border border-gold/30 shadow-lg ${
                index % 4 === 0
                  ? 'bg-champagne'
                  : index % 4 === 1
                  ? 'bg-blush-pink/30'
                  : index % 4 === 2
                  ? 'bg-dusty-rose/20'
                  : 'bg-olive-green/10'
              }`}
            >
              <div className="flex items-start gap-4">
                {event.icon && (
                  <div className="text-gold flex-shrink-0">
                    {/* Icon placeholder - you can map icon strings to actual icons */}
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-lg">⏰</span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-gold font-body text-sm mb-3 font-semibold tracking-wide">{timeStr}</div>
                  <h3 className="text-2xl md:text-3xl font-display text-dusty-rose mb-4 tracking-wide">{event.title}</h3>
                  {event.description && (
                    <p className="text-dusty-rose/70 font-body leading-relaxed text-lg">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default Timeline

