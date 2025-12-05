import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

const InfoCard = ({ icon: Icon, title, description, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative bg-champagne rounded-2xl md:rounded-3xl p-10 md:p-12 border border-gold/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}
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
        <p className="text-dusty-rose/75 font-body leading-relaxed text-lg">{description}</p>
      )}
    </motion.div>
  )
}

export default InfoCard

