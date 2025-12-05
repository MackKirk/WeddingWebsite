import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  uploadFile,
} from '../../services/content'
import { Plus, Trash2, Upload, Save, X } from 'lucide-react'

const GalleryTab = () => {
  const [images, setImages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getGalleryImages()
      setImages(response.data)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  const handleFileUpload = async (file) => {
    setUploading(true)
    try {
      const response = await uploadFile(file)
      await createGalleryImage({
        image_url: response.data.url,
        caption: '',
        order: images.length,
      })
      fetchData()
      setShowForm(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Gallery Images</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
        >
          <Plus size={20} />
          Add Image
        </button>
      </div>

      {showForm && (
        <ImageForm
          onClose={() => setShowForm(false)}
          onSave={fetchData}
          onUpload={handleFileUpload}
          uploading={uploading}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.image_url}
              alt={image.caption || 'Gallery image'}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleDelete(image.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const ImageForm = ({ onClose, onSave, onUpload, uploading }) => {
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    order: 0,
  })
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (file) {
        await onUpload(file)
      } else {
        await createGalleryImage(formData)
        onSave()
        onClose()
      }
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
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="text-center text-dusty-rose/60 font-body">OR</div>
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
            disabled={saving || uploading}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50"
          >
            <Save size={18} />
            {uploading ? 'Uploading...' : 'Save'}
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

export default GalleryTab

