import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getStorySections, getStoryImages } from '../services/content'
import { normalizeImageUrl } from '../utils/imageUrl'

const StoryPage = () => {
  const [sections, setSections] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, imagesRes] = await Promise.all([
          getStorySections(),
          getStoryImages(),
        ])
        setSections(sectionsRes.data || [])
        setImages((imagesRes.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      } catch (error) {
        console.error('Error fetching story content:', error)
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
            Our Story
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
          <p className="text-dusty-rose/60 font-body text-lg italic font-light">A tale of love and commitment</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {sections.map((section, index) => {
            const sectionImages = images.filter((img) => img.section_id === section.id)
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}
              >
                <h2 className="text-3xl md:text-4xl font-display mb-6 tracking-wide" style={{ color: 'var(--theme-body-heading)' }}>
                  {section.title}
                </h2>
                <p className="text-lg md:text-xl font-body leading-relaxed flex-1" style={{ color: 'var(--theme-body-heading)', opacity: 0.85 }}>
                  {section.content}
                </p>
                {sectionImages.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {sectionImages.map((image, imgIndex) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: imgIndex * 0.05 }}
                        className="relative rounded-xl overflow-hidden bg-black/5"
                      >
                        <img
                          src={normalizeImageUrl(image.image_url)}
                          alt={image.caption || 'Story image'}
                          className="w-full h-auto block"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                        {image.caption && (
                          <div className="p-3 border-t bg-champagne/80" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                            <p className="font-body text-xs" style={{ color: 'var(--theme-body-heading)' }}>{image.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {(() => {
          const endImages = images.filter((img) => img.section_id == null)
          if (endImages.length === 0) return null
          return (
            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {endImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="relative rounded-xl overflow-hidden bg-black/5"
                  >
                    <img
                      src={normalizeImageUrl(image.image_url)}
                      alt={image.caption || 'Story image'}
                      className="w-full h-auto block"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    {image.caption && (
                      <div className="p-4 bg-champagne/80 border-t" style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
                        <p className="font-body text-sm" style={{ color: 'var(--theme-body-heading)' }}>{image.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default StoryPage

