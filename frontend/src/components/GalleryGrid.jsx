import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from './Lightbox'

const GalleryGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-dusty-rose/60 font-body">No gallery images yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-6 px-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
            className="mb-5 md:mb-6 break-inside-avoid cursor-pointer group"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src={image.image_url}
                alt={image.caption || 'Gallery image'}
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="font-body text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <Lightbox
            images={images}
            initialIndex={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default GalleryGrid

