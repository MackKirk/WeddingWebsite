import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-dusty-rose/20 py-12 mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-dusty-rose font-body text-sm flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-gold fill-gold" /> for our special day
          </p>
          <p className="text-dusty-rose/70 font-body text-xs mt-4">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

