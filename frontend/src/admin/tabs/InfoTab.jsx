import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getInfoSections,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
} from '../../services/content'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

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
  })
  const [saving, setSaving] = useState(false)

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
        <input
          type="text"
          placeholder="Icon name (optional)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <input
          type="text"
          placeholder="Google Maps embed URL (optional)"
          value={formData.map_embed_url}
          onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
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

