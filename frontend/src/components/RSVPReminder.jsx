import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail } from 'lucide-react'

const STORAGE_KEY = 'rsvp_reminder_dismissed'

const RSVPReminder = () => {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    const isRsvpPage = location.pathname === '/rsvp'
    setVisible(!dismissed && !isRsvpPage)
  }, [location.pathname])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  const handleAlreadyDone = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 80, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40 max-w-[320px] rounded-2xl shadow-xl border-2 overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-body-bg, #F8F4EC)',
          borderColor: 'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
        }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0" style={{ color: 'var(--theme-accent)' }}>
              <Mail size={22} />
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ color: 'var(--theme-body-heading)' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <p className="font-body text-sm mt-1 mb-3" style={{ color: 'var(--theme-body-heading)' }}>
            Don&apos;t forget to confirm your attendance!
          </p>
          <Link
            to="/rsvp"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-body font-medium text-sm text-white shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          >
            RSVP now
          </Link>
          <label className="flex items-center gap-2 mt-3 cursor-pointer group">
            <input
              type="checkbox"
              onChange={handleAlreadyDone}
              className="rounded border-2 w-4 h-4 cursor-pointer"
              style={{ borderColor: 'var(--theme-accent)', accentColor: 'var(--theme-accent)' }}
            />
            <span className="text-xs font-body opacity-80 group-hover:opacity-100" style={{ color: 'var(--theme-body-heading)' }}>
              I&apos;ve already RSVP&apos;d
            </span>
          </label>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RSVPReminder
