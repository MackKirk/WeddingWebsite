import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createRSVP, searchGuestInvitations } from '../services/content'
import { Heart } from 'lucide-react'

const DEBOUNCE_MS = 300

const RSVPForm = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState(null)
  /** @type {Record<string, boolean | undefined>} */
  const [attendance, setAttendance] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    dietary_restrictions: '',
    song_request: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const searchWrapRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = searchQuery.trim()
    if (q.length < 1) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }
    setSearchLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchGuestInvitations(q)
        setSearchResults(res.data || [])
        setSearchOpen(true)
      } catch (e) {
        console.error(e)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const selectInvitation = useCallback((inv) => {
    setSelectedInvitation(inv)
    const next = {}
    inv.participants.forEach((name) => {
      next[name] = undefined
    })
    setAttendance(next)
    setSearchQuery(inv.display_label)
    setSearchOpen(false)
  }, [])

  const clearInvitation = () => {
    setSelectedInvitation(null)
    setAttendance({})
    setSearchQuery('')
    setSearchResults([])
  }

  const setPersonAttending = (name, value) => {
    setAttendance((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedInvitation) {
      alert('Please find and select your name from the list.')
      return
    }
    const attendanceList = selectedInvitation.participants.map((name) => ({
      name,
      attending: attendance[name],
    }))
    if (attendanceList.some((a) => a.attending === undefined)) {
      alert('Please answer Yes or No for each guest.')
      return
    }

    setIsSubmitting(true)
    try {
      await createRSVP({
        guest_invitation_id: selectedInvitation.id,
        attendance: attendanceList,
        email: formData.email.trim(),
        dietary_restrictions: formData.dietary_restrictions?.trim() || null,
        song_request: formData.song_request?.trim() || null,
        message: formData.message?.trim() || null,
      })
      localStorage.setItem('rsvp_reminder_dismissed', 'true')
      setShowSuccess(true)
      clearInvitation()
      setFormData({
        email: '',
        dietary_restrictions: '',
        song_request: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('There was an error submitting your RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="rounded-2xl md:rounded-3xl p-10 md:p-14 border border-gold/40 shadow-xl"
        style={{ backgroundColor: 'var(--theme-card-bg-rsvp)' }}
      >
        <div className="mb-8" ref={searchWrapRef}>
          <label className="block text-dusty-rose font-display italic text-lg mb-2">
            Find your invitation *
          </label>
          <p className="text-sm text-dusty-rose/70 font-body mb-3">
            Start typing your name as it appears on the invitation.
          </p>
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (selectedInvitation && e.target.value !== selectedInvitation.display_label) {
                  setSelectedInvitation(null)
                  setAttendance({})
                }
              }}
              onFocus={() => searchQuery.trim().length >= 1 && setSearchOpen(true)}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
              placeholder="e.g. Sarah Johnson"
            />
            {selectedInvitation && (
              <button
                type="button"
                onClick={clearInvitation}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dusty-rose/70 hover:text-dusty-rose"
              >
                Clear
              </button>
            )}
            {searchOpen && searchResults.length > 0 && !selectedInvitation && (
              <ul
                className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-gold/40 bg-white shadow-xl"
                role="listbox"
              >
                {searchResults.map((inv) => (
                  <li key={inv.id} role="option">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 font-body text-dusty-rose hover:bg-champagne/50 border-b border-gold/10 last:border-0"
                      onClick={() => selectInvitation(inv)}
                    >
                      {inv.display_label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchLoading && (
              <p className="text-sm text-dusty-rose/60 mt-2 font-body">Searching…</p>
            )}
            {searchQuery.trim().length >= 1 && !searchLoading && searchResults.length === 0 && !selectedInvitation && (
              <p className="text-sm text-dusty-rose/60 mt-2 font-body">No matches. Try another spelling.</p>
            )}
          </div>
        </div>

        {selectedInvitation && (
          <div className="mb-8 space-y-6 border border-gold/30 rounded-2xl p-6 bg-white/40">
            <p className="font-display text-dusty-rose text-lg">Attendance</p>
            {selectedInvitation.participants.map((name) => (
              <div key={name} className="font-body">
                <p className="text-dusty-rose mb-2">
                  Will <span className="font-semibold">{name}</span> attend?
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`attend-${name}`}
                      checked={attendance[name] === true}
                      onChange={() => setPersonAttending(name, true)}
                      className="accent-gold"
                    />
                    <span className="text-dusty-rose">Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`attend-${name}`}
                      checked={attendance[name] === false}
                      onChange={() => setPersonAttending(name, false)}
                      className="accent-gold"
                    />
                    <span className="text-dusty-rose">No</span>
                  </label>
                </div>
              </div>
            ))}
            <p className="text-xs text-dusty-rose/60 italic">You cannot add guests who are not on this invitation.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-dusty-rose font-display italic text-lg mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-display italic text-lg mb-2">
              Food allergies / dietary requirements
            </label>
            <input
              type="text"
              value={formData.dietary_restrictions}
              onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
              placeholder="e.g., Nuts, Gluten-free"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-display italic text-lg mb-2">
              Request a song
            </label>
            <input
              type="text"
              value={formData.song_request}
              onChange={(e) => setFormData({ ...formData, song_request: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
              placeholder="A song you'd love to hear at the reception..."
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-dusty-rose font-display italic text-lg mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows="4"
            className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            placeholder="Share your thoughts or special requests..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto px-14 py-5 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-full font-body font-semibold text-lg shadow-xl hover:shadow-2xl hover:brightness-110 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-champagne to-blush-pink/30 rounded-3xl p-14 max-w-md mx-4 text-center border-2 border-gold/40 shadow-2xl backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex justify-center"
              >
                <Heart className="w-16 h-16 text-gold fill-gold" />
              </motion.div>
              <h3 className="text-3xl font-display text-dusty-rose mb-4">
                Thank You!
              </h3>
              <p className="text-dusty-rose/80 font-body mb-6">
                We've received your RSVP and can't wait to celebrate with you!
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-full font-body font-medium hover:shadow-lg transition-all duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default RSVPForm
