import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getStorySections,
  createStorySection,
  updateStorySection,
  deleteStorySection,
  getStoryImages,
  createStoryImage,
  deleteStoryImage,
} from '../../services/content'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

const StoryContentTab = () => {
  const [sections, setSections] = useState([])
  const [images, setImages] = useState([])
  const [editingSection, setEditingSection] = useState(null)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleDeleteSection = async (id) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteStorySection(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
  }

  const handleDeleteImage = async (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteStoryImage(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      {/* Sections */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Story Sections</h2>
          <button
            onClick={() => {
              setEditingSection(null)
              setShowSectionForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        {showSectionForm && (
          <SectionForm
            section={editingSection}
            onClose={() => {
              setShowSectionForm(false)
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
                <h3 className="text-xl font-display text-dusty-rose">{section.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSection(section)
                      setShowSectionForm(true)
                    }}
                    className="text-gold hover:text-gold/80"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-dusty-rose/70 font-body">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Story Images</h2>
          <button
            onClick={() => setShowImageForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
          >
            <Plus size={20} />
            Add Image
          </button>
        </div>

        {showImageForm && (
          <ImageForm
            onClose={() => setShowImageForm(false)}
            onSave={fetchData}
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt={image.caption || 'Story image'}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SectionForm = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    content: section?.content || '',
    order: section?.order || 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (section) {
        await updateStorySection(section.id, formData)
      } else {
        await createStorySection(formData)
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
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows="4"
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

const ImageForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    order: 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createStoryImage(formData)
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving image:', error)
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
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
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

export default StoryContentTab

