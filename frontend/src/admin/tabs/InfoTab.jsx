import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getInfoSections,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
  uploadFile,
} from '../../services/content'
import {
  Plus, Trash2, Edit2, Save, X, Upload,
  Calendar, MapPin, Shirt, Car, Hotel, Heart, Circle, Cake, Music, 
  UtensilsCrossed, Clock, Gift, Camera, Users, Home, Navigation,
  Building2, CarFront, ParkingCircle, BedDouble, Wifi, Phone,
  Mail, Globe, Star, Sparkles, Flower2, Leaf, Sun, Moon, Image as ImageIcon, CheckCircle2, AlertCircle
} from 'lucide-react'

// Available icons for wedding information
const availableIcons = [
  { name: 'rings', icon: Heart, label: 'Rings (Heart icon)' }, // Using Heart as wedding rings icon (Ring doesn't exist in lucide-react)
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
  const [uploading, setUploading] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
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
        image_url: uploadedImageUrl || null, // Use the uploaded URL directly
        description: formData.description || null,
        icon: formData.icon || null,
        map_embed_url: formData.map_embed_url || null,
        additional_info: formData.additional_info || null,
      }

      console.log('Saving info section with data:', dataToSend) // Debug log

      if (section) {
        const updated = await updateInfoSection(section.id, dataToSend)
        console.log('Updated section:', updated) // Debug log
      } else {
        const created = await createInfoSection(dataToSend)
        console.log('Created section:', created) // Debug log
      }
      
      // Reset form state
      setFile(null)
      setPreview(null)
      setImageInfo(null)
      setUploadProgress(null)
      
      onSave() // This should refresh the data
      onClose()
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Error saving section')
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
            <div className="flex items-center gap-2">
              <Upload size={18} />
              Upload Image to Azure Blob Storage
            </div>
            <span className="text-xs text-dusty-rose/60 font-normal block mt-1">
              Formats: JPG, PNG, GIF, WEBP. Maximum 5MB.
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          
          {/* Preview and image information */}
          {preview && imageInfo && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gold/30">
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
                      {imageInfo.width >= 1920 && imageInfo.height >= 1080 && (
                        <span className="ml-2 text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Ideal
                        </span>
                      )}
                      {(imageInfo.width < 1200 || imageInfo.height < 1200) && (
                        <span className="ml-2 text-amber-600 flex items-center gap-1">
                          <AlertCircle size={12} />
                          May appear pixelated
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Size:</strong> {imageInfo.size} MB
                      {parseFloat(imageInfo.size) > 3 && (
                        <span className="ml-2 text-amber-600 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Large (may take time)
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Aspect Ratio:</strong> {imageInfo.aspectRatio}:1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload status */}
          {uploadProgress && (
            <div className={`mt-3 p-3 rounded-lg ${
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
            disabled={saving || uploading || (!file && !formData.image_url && !section)}
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

export default InfoTab

