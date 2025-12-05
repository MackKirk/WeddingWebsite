import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getGiftItems,
  createGiftItem,
  updateGiftItem,
  deleteGiftItem,
} from '../../services/content'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

const GiftsTab = () => {
  const [gifts, setGifts] = useState([])
  const [editingGift, setEditingGift] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getGiftItems()
      setGifts(response.data)
    } catch (error) {
      console.error('Error fetching gift items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this gift item?')) {
      try {
        await deleteGiftItem(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting gift item:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Gift Items</h2>
        <button
          onClick={() => {
            setEditingGift(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
        >
          <Plus size={20} />
          Add Gift
        </button>
      </div>

      {showForm && (
        <GiftForm
          gift={editingGift}
          onClose={() => {
            setShowForm(false)
            setEditingGift(null)
          }}
          onSave={fetchData}
        />
      )}

      <div className="space-y-4">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="p-4 border border-gold/20 rounded-lg bg-champagne/30"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-display text-dusty-rose">{gift.title}</h3>
                <span className="text-sm text-dusty-rose/60 font-body">
                  {gift.item_type}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingGift(gift)
                    setShowForm(true)
                  }}
                  className="text-gold hover:text-gold/80"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(gift.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {gift.description && (
              <p className="text-dusty-rose/70 font-body mb-2">{gift.description}</p>
            )}
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-body text-sm"
            >
              View Link →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

const GiftForm = ({ gift, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: gift?.title || '',
    description: gift?.description || '',
    link: gift?.link || '',
    image_url: gift?.image_url || '',
    item_type: gift?.item_type || 'external',
    order: gift?.order || 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (gift) {
        await updateGiftItem(gift.id, formData)
      } else {
        await createGiftItem(formData)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving gift item:', error)
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
            value={formData.item_type}
            onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="external">External Link</option>
            <option value="card">Custom Card</option>
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
          type="url"
          placeholder="Link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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

export default GiftsTab

