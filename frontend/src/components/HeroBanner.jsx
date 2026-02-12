import { motion } from 'framer-motion'
import Countdown from './Countdown'
import { normalizeImageUrl } from '../utils/imageUrl'
import { useTheme } from '../contexts/ThemeContext'

const HeroBanner = ({ heroText, heroImageUrl, subtitle, weddingDate, textColor }) => {
  const { accentColor } = useTheme()
  const accent = accentColor || '#D4B483'
  const defaultImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
  const imageUrl = normalizeImageUrl(heroImageUrl) || defaultImage

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />
      </div>

      {/* Floating Floral Elements */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-24 left-12 w-20 h-20 opacity-15 hidden md:block"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: accent }}>
          <path d="M50 10 Q60 30 80 30 Q60 50 50 70 Q40 50 20 30 Q40 30 50 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -8, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-24 right-12 w-16 h-16 opacity-12 hidden md:block"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: accent }}>
          <path d="M50 10 Q60 30 80 30 Q60 50 50 70 Q40 50 20 30 Q40 30 50 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 right-1/4 w-14 h-14 opacity-10 hidden lg:block"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: accent }}>
          <path d="M50 10 Q60 30 80 30 Q60 50 50 70 Q40 50 20 30 Q40 30 50 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-[96px] font-display text-white mb-8 tracking-[0.1em] drop-shadow-lg"
        >
          {heroText || 'John & Jane'}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-32 h-0.5 mx-auto mb-8"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-xl md:text-2xl lg:text-3xl font-body text-white/95 italic font-light mb-16 tracking-wide"
        >
          {subtitle || 'Join us for our special day'}
        </motion.p>

        {weddingDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 md:mt-24"
          >
            <Countdown weddingDate={weddingDate} textColor={textColor} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default HeroBanner

