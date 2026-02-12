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
  uploadFile,
  reorderStoryImages,
} from '../../services/content'
import { normalizeImageUrl } from '../../utils/imageUrl'
import { Plus, Trash2, Edit2, Save, X, Upload, GripVertical } from 'lucide-react'

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
      setImages((imagesRes.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch (error) {
      console.error('Error fetching story content:', error)
    } finally {
      setLoading(false)
    }
  }

  const [draggedId, setDraggedId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const applyReorder = async (orderedIds) => {
    try {
      const res = await reorderStoryImages(orderedIds)
      setImages((res.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch (error) {
      console.error('Error reordering story images:', error)
    }
  }

  const handleDragStart = (e, imageId) => {
    setDraggedId(imageId)
    e.dataTransfer.setData('text/plain', String(imageId))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, imageId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedId !== imageId) setDragOverId(imageId)
  }

  const handleDragLeave = () => setDragOverId(null)

  const handleDrop = (e, dropId) => {
    e.preventDefault()
    setDragOverId(null)
    setDraggedId(null)
    if (!draggedId || draggedId === dropId) return
    const orderedIds = images.map((img) => img.id)
    const fromIdx = orderedIds.indexOf(draggedId)
    const toIdx = orderedIds.indexOf(dropId)
    if (fromIdx < 0 || toIdx < 0) return
    const newIds = [...orderedIds]
    newIds.splice(fromIdx, 1)
    newIds.splice(toIdx, 0, draggedId)
    applyReorder(newIds)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
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

        <p className="text-sm text-dusty-rose/70 mb-4">Drag by the ⋮⋮ icon to reorder.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              draggable={false}
              onDragOver={(e) => handleDragOver(e, image.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, image.id)}
              className={`relative group rounded-lg border-2 transition-colors ${
                dragOverId === image.id ? 'border-gold ring-2 ring-gold/30' : 'border-transparent'
              } ${draggedId === image.id ? 'opacity-60' : ''}`}
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragEnd={handleDragEnd}
                className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-white/95 hover:bg-gold/20 text-dusty-rose rounded p-1.5 shadow touch-none"
                title="Drag to reorder"
              >
                <GripVertical size={18} />
              </div>
              <img
                src={normalizeImageUrl(image.image_url)}
                alt={image.caption || 'Story image'}
                className="w-full h-32 object-cover rounded-lg pointer-events-none"
                onError={(e) => {
                  console.error('Image failed to load:', image.image_url)
                }}
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Delete"
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
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  const fileInputId = 'story-image-upload'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      alert('The image is too large. Please use an image smaller than 5MB.')
      return
    }
    setFile(selectedFile)
    setFormData((prev) => ({ ...prev, image_url: '' }))
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setUploadProgress(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = formData.image_url
    if (file) {
      setUploading(true)
      setUploadProgress('Uploading image...')
      try {
        const response = await uploadFile(file)
        imageUrl = response.data.url
        setUploadProgress('Upload complete.')
      } catch (error) {
        console.error('Error uploading image:', error)
        setUploadProgress('Error uploading image. Please try again.')
        alert('Error uploading image')
        setUploading(false)
        return
      } finally {
        setUploading(false)
      }
    }
    if (!imageUrl?.trim()) {
      alert('Please add an image: upload a file or enter an image URL.')
      return
    }
    setSaving(true)
    try {
      await createStoryImage({ ...formData, image_url: imageUrl })
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving image:', error)
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = (file || formData.image_url?.trim()) && !uploading

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 border border-gold/30 rounded-lg bg-champagne/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload or URL */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-dusty-rose">Image</label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id={fileInputId}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor={fileInputId}
              className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors cursor-pointer"
            >
              <Upload size={18} />
              Choose image to upload
            </label>
            <span className="text-sm text-dusty-rose/70">or use URL below</span>
          </div>
          {file && (
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gold/30">
              {preview && (
                <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded" />
              )}
              <span className="text-sm text-dusty-rose truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={clearFile}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {uploadProgress && (
            <p className={`text-sm ${uploadProgress.includes('Error') ? 'text-red-600' : 'text-dusty-rose/80'}`}>
              {uploadProgress}
            </p>
          )}
          <input
            type="url"
            placeholder="Or paste image URL"
            value={formData.image_url}
            onChange={(e) => {
              setFormData({ ...formData, image_url: e.target.value })
              if (e.target.value) clearFile()
            }}
            disabled={!!file}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60 disabled:bg-gray-100"
          />
        </div>

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
            disabled={saving || !canSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50"
          >
            <Save size={18} />
            {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save'}
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

