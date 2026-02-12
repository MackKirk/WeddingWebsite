import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { navbarColor, navbarTextColor, accentColor } = useTheme()
  const navBg = navbarColor || '#F8F4EC'
  const navText = navbarTextColor || '#8B6F6D'
  const accent = accentColor || '#D4B483'

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/story', label: 'Our Story' },
    { path: '/info', label: 'Information' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/gifts', label: 'Gifts' },
    { path: '/rsvp', label: 'RSVP' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-lg"
        style={{ backgroundColor: navBg }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl font-display font-semibold" style={{ color: accent }}>
              Bianca & Joel Wedding
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-16">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-sm font-body font-medium tracking-wide transition-colors duration-500"
                  style={{
                    color: location.pathname === link.path ? accent : navText,
                  }}
                  onMouseEnter={(e) => { if (location.pathname !== link.path) e.currentTarget.style.color = accent }}
                  onMouseLeave={(e) => { if (location.pathname !== link.path) e.currentTarget.style.color = navText }}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent to-transparent"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.4 }}
                    />
                  )}
                  {location.pathname !== link.path && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left"
                      style={{ backgroundColor: accent }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden transition-colors"
              style={{ color: navText }}
              onMouseEnter={(e) => { e.currentTarget.style.color = accent }}
              onMouseLeave={(e) => { e.currentTarget.style.color = navText }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, duration: 0.5 }}
              className="fixed top-0 right-0 bottom-0 w-72 backdrop-blur-xl shadow-2xl z-50 md:hidden"
              style={{ backgroundColor: `${navBg}F8` }}
            >
              <div className="flex flex-col pt-24 px-6 space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-body font-medium transition-colors"
                    style={{ color: location.pathname === link.path ? accent : navText }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

