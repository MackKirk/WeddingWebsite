import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  uploadFile,
} from '../../services/content'
import { Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'

const TimelineTab = () => {
  const [events, setEvents] = useState([])
  const [editingEvent, setEditingEvent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getTimelineEvents()
      setEvents(response.data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching timeline events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteTimelineEvent(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display text-dusty-rose tracking-wide">Timeline Events</h2>
        <button
          onClick={() => {
            setEditingEvent(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false)
            setEditingEvent(null)
          }}
          onSave={fetchData}
        />
      )}

      <div className="space-y-4">
        {events.map((event) => {
          const timeStr = event.time
            ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            : ''
          return (
            <div
              key={event.id}
              className="p-4 border border-gold/20 rounded-lg bg-champagne/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-gold font-body font-medium mb-1">{timeStr}</div>
                  <h3 className="text-xl font-display text-dusty-rose">{event.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event)
                      setShowForm(true)
                    }}
                    className="text-gold hover:text-gold/80"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {event.description && (
                <p className="text-dusty-rose/70 font-body">{event.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EventForm = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    time: event?.time || '',
    title: event?.title || '',
    description: event?.description || '',
    icon: event?.icon || '',
    order: event?.order || 0,
    image_url: event?.image_url || '',
    additional_info: event?.additional_info || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      alert('The image is too large. Please use an image smaller than 5MB.')
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(selectedFile)

    // Get image information
    const img = new Image()
    img.onload = () => {
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      setImageInfo({
        width: img.width,
        height: img.height,
        size: fileSizeMB,
        aspectRatio: (img.width / img.height).toFixed(2),
        fileName: selectedFile.name,
      })
    }
    img.src = URL.createObjectURL(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setUploadProgress('Starting upload...')
    
    try {
      let uploadedImageUrl = formData.image_url
      
      // If file is selected, upload it first
      if (file) {
        setUploading(true)
        try {
          const response = await uploadFile(file)
          uploadedImageUrl = response.data.url
          setFormData({ ...formData, image_url: uploadedImageUrl })
          setUploadProgress('Upload completed successfully!')
        } catch (error) {
          console.error('Error uploading image:', error)
          setUploadProgress('Error uploading image. Please try again.')
          alert('Error uploading image')
          setSaving(false)
          setUploading(false)
          return
        } finally {
          setUploading(false)
        }
      }

      // Convert empty strings to null for optional fields
      const dataToSend = {
        ...formData,
        image_url: uploadedImageUrl || null,
        description: formData.description || null,
        icon: formData.icon || null,
        additional_info: formData.additional_info || null,
      }

      if (event) {
        await updateTimelineEvent(event.id, dataToSend)
      } else {
        await createTimelineEvent(dataToSend)
      }
      
      // Reset form state
      setFile(null)
      setPreview(null)
      setImageInfo(null)
      setUploadProgress(null)
      
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event')
    } finally {
      setSaving(false)
      setTimeout(() => setUploadProgress(null), 3000)
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
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <input
          type="text"
          placeholder="Icon (optional: rings, heart, clock, cake, music, cocktail, dinner)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        
        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            <div className="flex items-center gap-2">
              <Upload size={18} />
              Upload Image to Azure Blob Storage (optional - shown in modal)
            </div>
            <span className="text-xs text-dusty-rose/60 font-normal block mt-1">
              Formats: JPG, PNG, GIF, WEBP. Maximum 5MB.
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 mb-4"
          />
          
          {/* Preview and image information */}
          {preview && imageInfo && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gold/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gold/20"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dusty-rose mb-2">Image Information</h4>
                  <div className="space-y-1 text-sm text-dusty-rose/80">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} />
                      <span><strong>Name:</strong> {imageInfo.fileName}</span>
                    </div>
                    <div>
                      <strong>Dimensions:</strong> {imageInfo.width} × {imageInfo.height}px
                    </div>
                    <div>
                      <strong>Size:</strong> {imageInfo.size} MB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload status */}
          {uploadProgress && (
            <div className={`mb-4 p-3 rounded-lg ${
              uploadProgress.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              <div className="flex items-center gap-2">
                {uploadProgress.includes('Error') ? (
                  <AlertCircle size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                <span className="text-sm font-medium">{uploadProgress}</span>
              </div>
            </div>
          )}

          <div className="text-center text-dusty-rose/60 font-body my-4">OR</div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Image URL (if already hosted)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Additional Information (optional - shown in modal)
          </label>
          <textarea
            placeholder="Extra details, special notes, what to expect, etc."
            value={formData.additional_info || ''}
            onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Upload size={18} className="animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Save size={18} />
                Save
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFile(null)
              setPreview(null)
              setImageInfo(null)
              setUploadProgress(null)
              onClose()
            }}
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

export default TimelineTab

