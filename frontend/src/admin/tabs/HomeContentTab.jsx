import { useState, useEffect } from 'react'
import { getHomeContent, updateHomeContent } from '../../services/content'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'

const HomeContentTab = () => {
  const [content, setContent] = useState({
    hero_text: '',
    hero_image_url: '',
    wedding_date: '',
    subtitle: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getHomeContent()
        const data = response.data
        setContent({
          hero_text: data.hero_text || '',
          hero_image_url: data.hero_image_url || '',
          wedding_date: data.wedding_date || '',
          subtitle: data.subtitle || '',
        })
      } catch (error) {
        console.error('Error fetching home content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateHomeContent(content)
      alert('Home content updated successfully!')
    } catch (error) {
      console.error('Error updating home content:', error)
      alert('Error updating home content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <h2 className="text-4xl font-display text-dusty-rose mb-10 tracking-wide">Home Content</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Hero Text (Couple Names)
            </label>
            <input
              type="text"
              value={content.hero_text}
              onChange={(e) => setContent({ ...content, hero_text: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              value={content.hero_image_url}
              onChange={(e) => setContent({ ...content, hero_image_url: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Wedding Date
            </label>
            <input
              type="date"
              value={content.wedding_date}
              onChange={(e) => setContent({ ...content, wedding_date: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-500 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </div>
  )
}

export default HomeContentTab

