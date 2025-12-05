import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GiftCard from '../components/GiftCard'
import { getGiftItems } from '../services/content'

const GiftsPage = () => {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGiftItems()
        setGifts(response.data)
      } catch (error) {
        console.error('Error fetching gift items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display text-dusty-rose mb-6 tracking-wider">
            Gift Registry
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg md:text-xl italic font-light max-w-3xl mx-auto">
            Your presence is the greatest gift, but if you'd like to celebrate with us in another way, here are some ideas
          </p>
        </motion.div>

        {gifts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dusty-rose/60 font-body">No gift items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftsPage

