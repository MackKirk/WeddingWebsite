import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import BlockColorEdit from '../components/BlockColorEdit'
import Lightbox from '../components/Lightbox'
import { getInfoSections } from '../services/content'
import { normalizeImageUrl } from '../utils/imageUrl'
import {
  Calendar, MapPin, Shirt, Car, Hotel, Heart, Cake, Music,
  UtensilsCrossed, Clock, Gift, Camera, Users, Home, Navigation,
  Building2, CarFront, ParkingCircle, BedDouble, Wifi, Phone,
  Mail, Globe, Star, Sparkles, Flower2, Leaf, Sun, Moon
} from 'lucide-react'

// Map icon names to Lucide React icons
const iconNameMap = {
  'rings': Heart, // Using Heart as wedding rings icon (Ring doesn't exist in lucide-react)
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  const openDressCodeLightbox = (galleryUrls, index) => {
    const images = Array.isArray(galleryUrls) ? galleryUrls : []
    setLightboxImages(images.map((url) => ({ image_url: url })))
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

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
            Wedding Information
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg italic font-light">Everything you need to know</p>
        </motion.div>

        <div className="relative">
          <BlockColorEdit blockKey="info" className="absolute top-0 right-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section) => {
            let Icon = MapPin
            if (section.icon && iconNameMap[section.icon]) {
              Icon = iconNameMap[section.icon]
            } else if (sectionTypeIconMap[section.section_type]) {
              Icon = sectionTypeIconMap[section.section_type]
            }
            const galleryUrls = section.gallery_urls && (Array.isArray(section.gallery_urls) ? section.gallery_urls : [])
            const isDressCodeWithGallery = section.section_type === 'dress_code' && galleryUrls.length > 0

            return (
              <InfoCard
                key={section.id}
                icon={Icon}
                title={section.title}
                description={section.description}
              >
                {isDressCodeWithGallery && (
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {galleryUrls.map((url, index) => (
                      <button
                        key={`${url}-${index}`}
                        type="button"
                        onClick={() => openDressCodeLightbox(galleryUrls, index)}
                        className="aspect-square w-full rounded-lg overflow-hidden border-2 border-gold/40 shadow-md hover:shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
                      >
                        <img
                          src={normalizeImageUrl(url)}
                          alt={`${section.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </InfoCard>
            )
          })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && lightboxImages.length > 0 && (
          <Lightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default InfoPage

