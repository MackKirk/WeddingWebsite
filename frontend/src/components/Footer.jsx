import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Footer = () => {
  const { footerBgColor, footerTextColor, accentColor } = useTheme()
  const bg = footerBgColor || '#CFA7A4'
  const text = footerTextColor || '#8B6F6D'
  const accent = accentColor || '#D4B483'

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 mt-20"
      style={{ backgroundColor: `${bg}33` }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-body text-sm flex items-center justify-center gap-2" style={{ color: text }}>
            Made with <Heart size={16} style={{ color: accent }} className="fill-current" /> for our special day
          </p>
          <p className="font-body text-xs mt-4 opacity-70" style={{ color: text }}>
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

