import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import InfoCard, { InfoModal } from '../components/InfoCard'
import { getInfoSections } from '../services/content'
import {
  Calendar, MapPin, Shirt, Car, Hotel, Heart, Rings, Cake, Music,
  UtensilsCrossed, Clock, Gift, Camera, Users, Home, Navigation,
  Building2, CarFront, ParkingCircle, BedDouble, Wifi, Phone,
  Mail, Globe, Star, Sparkles, Flower2, Leaf, Sun, Moon, X
} from 'lucide-react'

// Map icon names to Lucide React icons
const iconNameMap = {
  'rings': Rings,
  'heart': Heart,
  'calendar': Calendar,
  'map-pin': MapPin,
  'shirt': Shirt,
  'car': Car,
  'hotel': Hotel,
  'cake': Cake,
  'music': Music,
  'utensils-crossed': UtensilsCrossed,
  'clock': Clock,
  'gift': Gift,
  'camera': Camera,
  'users': Users,
  'home': Home,
  'navigation': Navigation,
  'building-2': Building2,
  'car-front': CarFront,
  'parking-circle': ParkingCircle,
  'bed-double': BedDouble,
  'wifi': Wifi,
  'phone': Phone,
  'mail': Mail,
  'globe': Globe,
  'star': Star,
  'sparkles': Sparkles,
  'flower-2': Flower2,
  'leaf': Leaf,
  'sun': Sun,
  'moon': Moon,
}

// Fallback icon map based on section type
const sectionTypeIconMap = {
  ceremony: Calendar,
  reception: Calendar,
  dress_code: Shirt,
  parking: Car,
  hotel: Hotel,
}

const InfoPage = () => {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState(null)

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

  const handleCardClick = (section) => {
    const hasDetails = section.map_embed_url || section.image_url || section.additional_info
    if (hasDetails) {
      setSelectedSection(section)
    }
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
            Wedding Information
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg italic font-light">Everything you need to know</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section) => {
            // Use custom icon if provided, otherwise fallback to section type icon
            let Icon = MapPin
            if (section.icon && iconNameMap[section.icon]) {
              Icon = iconNameMap[section.icon]
            } else if (sectionTypeIconMap[section.section_type]) {
              Icon = sectionTypeIconMap[section.section_type]
            }
            return (
              <InfoCard
                key={section.id}
                icon={Icon}
                title={section.title}
                description={section.description}
                section={section}
                onClick={() => handleCardClick(section)}
              />
            )
          })}
        </div>
      </div>

      {/* Info Modal */}
      {selectedSection && (() => {
        let Icon = MapPin
        if (selectedSection.icon && iconNameMap[selectedSection.icon]) {
          Icon = iconNameMap[selectedSection.icon]
        } else if (sectionTypeIconMap[selectedSection.section_type]) {
          Icon = sectionTypeIconMap[selectedSection.section_type]
        }
        return (
          <InfoModal
            section={selectedSection}
            icon={Icon}
            isOpen={!!selectedSection}
            onClose={() => setSelectedSection(null)}
          />
        )
      })()}
    </div>
  )
}

export default InfoPage

