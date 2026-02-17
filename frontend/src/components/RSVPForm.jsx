import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createRSVP } from '../services/content'
import { Heart } from 'lucide-react'

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    num_attendees: 1,
    dietary_restrictions: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Clean up form data - convert empty strings to null and ensure num_attendees is a number
      const cleanedData = {
        guest_name: formData.guest_name.trim(),
        email: formData.email.trim(),
        num_attendees: parseInt(formData.num_attendees) || 1,
        dietary_restrictions: formData.dietary_restrictions?.trim() || null,
        message: formData.message?.trim() || null,
      }
      await createRSVP(cleanedData)
      localStorage.setItem('rsvp_reminder_dismissed', 'true')
      setShowSuccess(true)
      setFormData({
        guest_name: '',
        email: '',
        num_attendees: 1,
        dietary_restrictions: '',
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
        className="bg-champagne rounded-2xl md:rounded-3xl p-10 md:p-14 border border-gold/40 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-dusty-rose font-display italic text-lg mb-2">
              Guest Name *
            </label>
            <input
              type="text"
              required
              value={formData.guest_name}
              onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
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
              Number of Attendees *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.num_attendees}
              onChange={(e) => setFormData({ ...formData, num_attendees: parseInt(e.target.value) })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-display italic text-lg mb-2">
              Dietary Restrictions
            </label>
            <input
              type="text"
              value={formData.dietary_restrictions}
              onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
              placeholder="e.g., Vegetarian, Gluten-free"
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

      {/* Success Modal */}
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

