import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '../components/HeroBanner'
import { getHomeContent } from '../services/content'

const HomePage = () => {
  const [homeContent, setHomeContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getHomeContent()
        setHomeContent(response.data)
      } catch (error) {
        console.error('Error fetching home content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <HeroBanner
        heroText={homeContent?.hero_text}
        heroImageUrl={homeContent?.hero_image_url}
        subtitle={homeContent?.subtitle}
        weddingDate={homeContent?.wedding_date}
      />
    </div>
  )
}

export default HomePage

