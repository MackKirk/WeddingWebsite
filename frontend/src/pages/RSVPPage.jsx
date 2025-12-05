import { motion } from 'framer-motion'
import RSVPForm from '../components/RSVPForm'

const RSVPPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display text-dusty-rose mb-6 tracking-wider">
            RSVP
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg md:text-xl italic font-light max-w-2xl mx-auto">
            Please let us know if you'll be joining us for our special day
          </p>
        </motion.div>

        <RSVPForm />
        </div>
      </div>
    </div>
  )
}

export default RSVPPage

