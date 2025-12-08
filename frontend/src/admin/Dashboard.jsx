import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../services/auth'
import { seedDemoData, clearDemoData } from '../services/content'
import {
  Home,
  BookOpen,
  Info,
  Clock,
  Image,
  Gift,
  Mail,
  LogOut,
  Settings,
  Sparkles,
  Trash2,
} from 'lucide-react'
import HomeContentTab from './tabs/HomeContentTab'
import StoryContentTab from './tabs/StoryContentTab'
import InfoTab from './tabs/InfoTab'
import TimelineTab from './tabs/TimelineTab'
import GalleryTab from './tabs/GalleryTab'
import GiftsTab from './tabs/GiftsTab'
import RSVPTab from './tabs/RSVPTab'

const tabs = [
  { id: 'home', label: 'Home Content', icon: Home, component: HomeContentTab },
  { id: 'story', label: 'Story', icon: BookOpen, component: StoryContentTab },
  { id: 'info', label: 'Information', icon: Info, component: InfoTab },
  { id: 'timeline', label: 'Timeline', icon: Clock, component: TimelineTab },
  { id: 'gallery', label: 'Gallery', icon: Image, component: GalleryTab },
  { id: 'gifts', label: 'Gifts', icon: Gift, component: GiftsTab },
  { id: 'rsvp', label: 'RSVPs', icon: Mail, component: RSVPTab },
]

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home')
  const navigate = useNavigate()
  const [seedLoading, setSeedLoading] = useState(false)
  const [clearLoading, setClearLoading] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleSeedDemo = async () => {
    if (!confirm('Would you like to add demo content? This will add demonstration data to all sections.')) {
      return
    }
    setSeedLoading(true)
    try {
      const response = await seedDemoData()
      alert('Demo content added successfully!')
      window.location.reload() // Reload to see changes
    } catch (error) {
      console.error('Error seeding demo data:', error)
      alert('Error adding demo content')
    } finally {
      setSeedLoading(false)
    }
  }

  const handleClearDemo = async () => {
    if (!confirm('WARNING: This will remove ALL content (except admin users). Are you sure?')) {
      return
    }
    if (!confirm('This action cannot be undone. Continue?')) {
      return
    }
    setClearLoading(true)
    try {
      const response = await clearDemoData()
      alert('Content removed successfully!')
      window.location.reload() // Reload to see changes
    } catch (error) {
      console.error('Error clearing demo data:', error)
      alert('Error removing content')
    } finally {
      setClearLoading(false)
    }
  }

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-champagne flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-72 bg-white/95 backdrop-blur-sm border-r border-gold/10 flex flex-col shadow-lg"
      >
        <div className="p-8 border-b border-gold/10">
          <h1 className="text-2xl font-display text-dusty-rose tracking-wide">Admin Panel</h1>
          <p className="text-dusty-rose/50 font-body text-sm mt-1">Content Management</p>
        </div>

        {/* Seed Data Buttons */}
        <div className="p-4 border-b border-gold/10 space-y-2">
          <motion.button
            onClick={handleSeedDemo}
            disabled={seedLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Sparkles size={16} />
            <span>Add Demo Content</span>
          </motion.button>
          <motion.button
            onClick={handleClearDemo}
            disabled={clearLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-700 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Trash2 size={16} />
            <span>Clear All Content</span>
          </motion.button>
          <p className="text-xs text-dusty-rose/50 text-center mt-2">
            Use to preview how the site will look
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold/15 text-gold border border-gold/20 shadow-sm'
                    : 'text-dusty-rose/70 hover:bg-champagne/50 hover:text-dusty-rose'
                }`}
              >
                <Icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="font-body font-medium">{tab.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gold/10">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dusty-rose/70 hover:bg-champagne/50 hover:text-dusty-rose transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-body font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-champagne/30">
        <div className="max-w-[1440px] mx-auto p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

