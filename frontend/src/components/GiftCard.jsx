import { motion } from 'framer-motion'
import { ExternalLink, Gift } from 'lucide-react'

const GiftCard = ({ gift }) => {
  const isExternal = gift.item_type === 'external'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group rounded-2xl md:rounded-3xl overflow-hidden border-2 border-gold/40 shadow-xl hover:shadow-2xl transition-all duration-500 ${
        isExternal ? 'bg-champagne' : 'bg-gradient-to-br from-champagne via-blush-pink/20 to-champagne'
      }`}
    >
      {isExternal ? (
        <>
          {gift.image_url && (
            <div className="relative h-56 overflow-hidden">
              <img
                src={gift.image_url}
                alt={gift.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
          )}
          <div className="p-8">
            <h3 className="text-2xl md:text-3xl font-display text-dusty-rose mb-4 tracking-wide">{gift.title}</h3>
            {gift.description && (
              <p className="text-dusty-rose/70 font-body mb-6 leading-relaxed">{gift.description}</p>
            )}
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-full font-body font-semibold hover:from-gold/80 hover:to-gold transition-all duration-500 shadow-lg hover:shadow-xl"
            >
              View Gift <ExternalLink size={18} />
            </a>
          </div>
        </>
      ) : (
        <div className="p-8 md:p-10 relative overflow-hidden" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4B483' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
          <div className="absolute top-6 right-6 text-gold opacity-20">
            <Gift size={40} strokeWidth={1.2} />
          </div>
          <h3 className="text-2xl md:text-3xl font-display text-dusty-rose mb-4 tracking-wide relative z-10">{gift.title}</h3>
          {gift.description && (
            <p className="text-dusty-rose/70 font-body mb-6 leading-relaxed relative z-10">
              {gift.description}
            </p>
          )}
          <a
            href={gift.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold font-body font-semibold hover:underline relative z-10 transition-all duration-300"
          >
            Learn More <ExternalLink size={18} />
          </a>
        </div>
      )}
    </motion.div>
  )
}

export default GiftCard

