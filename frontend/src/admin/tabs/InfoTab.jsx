import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getInfoSections,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
} from '../../services/content'
import {
  Plus, Trash2, Edit2, Save, X,
  Calendar, MapPin, Shirt, Car, Hotel, Heart, Rings, Cake, Music, 
  UtensilsCrossed, Clock, Gift, Camera, Users, Home, Navigation,
  Building2, CarFront, ParkingCircle, BedDouble, Wifi, Phone,
  Mail, Globe, Star, Sparkles, Flower2, Leaf, Sun, Moon
} from 'lucide-react'

// Available icons for wedding information
const availableIcons = [
  { name: 'rings', icon: Rings, label: 'Rings' },
  { name: 'heart', icon: Heart, label: 'Heart' },
  { name: 'calendar', icon: Calendar, label: 'Calendar' },
  { name: 'map-pin', icon: MapPin, label: 'Map Pin' },
  { name: 'shirt', icon: Shirt, label: 'Shirt' },
  { name: 'car', icon: Car, label: 'Car' },
  { name: 'hotel', icon: Hotel, label: 'Hotel' },
  { name: 'cake', icon: Cake, label: 'Cake' },
  { name: 'music', icon: Music, label: 'Music' },
  { name: 'utensils-crossed', icon: UtensilsCrossed, label: 'Utensils' },
  { name: 'clock', icon: Clock, label: 'Clock' },
  { name: 'gift', icon: Gift, label: 'Gift' },
  { name: 'camera', icon: Camera, label: 'Camera' },
  { name: 'users', icon: Users, label: 'Users' },
  { name: 'home', icon: Home, label: 'Home' },
  { name: 'navigation', icon: Navigation, label: 'Navigation' },
  { name: 'building-2', icon: Building2, label: 'Building' },
  { name: 'car-front', icon: CarFront, label: 'Car Front' },
  { name: 'parking-circle', icon: ParkingCircle, label: 'Parking' },
  { name: 'bed-double', icon: BedDouble, label: 'Bed' },
  { name: 'wifi', icon: Wifi, label: 'WiFi' },
  { name: 'phone', icon: Phone, label: 'Phone' },
  { name: 'mail', icon: Mail, label: 'Mail' },
  { name: 'globe', icon: Globe, label: 'Globe' },
  { name: 'star', icon: Star, label: 'Star' },
  { name: 'sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'flower-2', icon: Flower2, label: 'Flower' },
  { name: 'leaf', icon: Leaf, label: 'Leaf' },
  { name: 'sun', icon: Sun, label: 'Sun' },
  { name: 'moon', icon: Moon, label: 'Moon' },
]

const InfoTab = () => {
  const [sections, setSections] = useState([])
  const [editingSection, setEditingSection] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteInfoSection(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Wedding Information</h2>
        <button
          onClick={() => {
            setEditingSection(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
        >
          <Plus size={20} />
          Add Section
        </button>
      </div>

      {showForm && (
        <SectionForm
          section={editingSection}
          onClose={() => {
            setShowForm(false)
            setEditingSection(null)
          }}
          onSave={fetchData}
        />
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="p-4 border border-gold/20 rounded-lg bg-champagne/30"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-display text-dusty-rose">{section.title}</h3>
                <span className="text-sm text-dusty-rose/60 font-body">
                  {section.section_type}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingSection(section)
                    setShowForm(true)
                  }}
                  className="text-gold hover:text-gold/80"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {section.description && (
              <p className="text-dusty-rose/70 font-body">{section.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const SectionForm = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    description: section?.description || '',
    icon: section?.icon || '',
    section_type: section?.section_type || 'ceremony',
    map_embed_url: section?.map_embed_url || '',
    image_url: section?.image_url || '',
    additional_info: section?.additional_info || '',
  })
  const [saving, setSaving] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (section) {
        await updateInfoSection(section.id, formData)
      } else {
        await createInfoSection(formData)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving section:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 border border-gold/30 rounded-lg bg-champagne/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <select
            value={formData.section_type}
            onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="ceremony">Ceremony</option>
            <option value="reception">Reception</option>
            <option value="dress_code">Dress Code</option>
            <option value="parking">Parking</option>
            <option value="hotel">Hotel</option>
          </select>
        </div>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.image_url || ''}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Additional Information (optional - shown in modal)
          </label>
          <textarea
            placeholder="Extra details, directions, contact info, etc."
            value={formData.additional_info || ''}
            onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Icon (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Icon name (e.g., rings, heart, calendar)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="flex-1 px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors border border-gold/30"
            >
              {showIconPicker ? 'Hide' : 'Browse Icons'}
            </button>
          </div>
          
          {/* Icon Preview */}
          {formData.icon && (() => {
            const selectedIconData = availableIcons.find(i => i.name === formData.icon)
            const SelectedIcon = selectedIconData?.icon
            return SelectedIcon ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-dusty-rose/70">
                <span>Preview:</span>
                <div className="p-2 bg-white rounded-lg border border-gold/30">
                  <SelectedIcon size={24} className="text-gold" />
                </div>
                <span className="text-dusty-rose/60">({selectedIconData.label})</span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-amber-600">
                Icon "{formData.icon}" not found. Use the icon picker below to select one.
              </div>
            )
          })()}

          {/* Icon Picker Grid */}
          {showIconPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-lg border border-gold/30 max-h-96 overflow-y-auto"
            >
              <p className="text-sm text-dusty-rose/70 mb-3 font-medium">Click an icon to select it:</p>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {availableIcons.map(({ name, icon: Icon, label }) => (
                  <motion.button
                    key={name}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, icon: name })
                      setShowIconPicker(false)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === name
                        ? 'border-gold bg-gold/20'
                        : 'border-gold/20 bg-champagne/30 hover:border-gold/50'
                    }`}
                    title={label}
                  >
                    <Icon 
                      size={24} 
                      className={`${
                        formData.icon === name ? 'text-gold' : 'text-dusty-rose/70'
                      }`} 
                    />
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, icon: '' })
                  setShowIconPicker(false)
                }}
                className="mt-3 text-sm text-dusty-rose/60 hover:text-dusty-rose underline"
              >
                Clear icon selection
              </button>
            </motion.div>
          )}
        </div>
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Google Maps Embed URL (optional)
          </label>
          <input
            type="text"
            placeholder="Paste the full iframe src URL here"
            value={formData.map_embed_url}
            onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <p className="text-xs text-dusty-rose/60 mt-1">
            Tip: In Google Maps, click "Share" → "Embed a map" → Copy the src URL from the iframe
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50"
          >
            <Save size={18} />
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default InfoTab

