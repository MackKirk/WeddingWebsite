import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import { getInfoSections } from '../services/content'
import { Calendar, MapPin, Shirt, Car, Hotel } from 'lucide-react'

const iconMap = {
  ceremony: Calendar,
  reception: Calendar,
  dress_code: Shirt,
  parking: Car,
  hotel: Hotel,
}

const InfoPage = () => {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInfoSections()
        setSections(response.data)
      } catch (error) {
        console.error('Error fetching info sections:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const mapSection = sections.find((s) => s.section_type === 'ceremony' && s.map_embed_url)

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
            Wedding Information
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg italic font-light">Everything you need to know</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section) => {
            const Icon = iconMap[section.section_type] || MapPin
            return (
              <InfoCard
                key={section.id}
                icon={Icon}
                title={section.title}
                description={section.description}
              />
            )
          })}
        </div>

        {mapSection && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 rounded-2xl overflow-hidden border border-gold/30 shadow-lg"
          >
            <div
              className="w-full h-96"
              dangerouslySetInnerHTML={{ __html: mapSection.map_embed_url }}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InfoPage

