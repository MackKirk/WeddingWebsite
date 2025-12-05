import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getStorySections, getStoryImages } from '../services/content'

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
        setSections(sectionsRes.data)
        setImages(imagesRes.data)
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
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}
            >
              <h2 className="text-3xl md:text-4xl font-display text-dusty-rose mb-6 tracking-wide">
                {section.title}
              </h2>
              <p className="text-dusty-rose/75 font-body leading-relaxed text-lg md:text-xl">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {images.length > 0 && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl"
              >
                <img
                  src={image.image_url}
                  alt={image.caption || 'Story image'}
                  className="w-full h-64 object-cover"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-body text-sm">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryPage

