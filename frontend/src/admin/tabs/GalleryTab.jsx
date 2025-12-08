import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  uploadFile,
} from '../../services/content'
import { Plus, Trash2, Upload, Save, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'

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
        <div>
          <h2 className="text-4xl font-display text-dusty-rose tracking-wide mb-2">Gallery Images</h2>
          <p className="text-sm text-dusty-rose/70 font-body">
            <span className="font-semibold">Recommended size:</span> 1920x1080px (16:9) or 1200x1200px (square). 
            Maximum 5MB per image. Images will be uploaded to Azure Blob Storage.
          </p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="relative group bg-white rounded-lg border border-gold/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={image.image_url}
                alt={image.caption || 'Gallery image'}
                className="w-full h-48 object-cover"
                onLoad={(e) => {
                  // Armazenar dimensões quando a imagem carregar
                  const img = e.target
                  if (!img.dataset.loaded) {
                    img.dataset.loaded = 'true'
                    img.dataset.width = img.naturalWidth
                    img.dataset.height = img.naturalHeight
                  }
                }}
              />
              <button
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Delete image"
              >
                <Trash2 size={16} />
              </button>
              {image.image_url.includes('blob.core.windows.net') && (
                <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Azure
                </div>
              )}
            </div>
            <div className="p-3">
              {image.caption && (
                <p className="text-sm text-dusty-rose font-medium mb-1 line-clamp-2">
                  {image.caption}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-dusty-rose/60">
                <span className="truncate flex-1">
                  {image.image_url.includes('blob.core.windows.net') 
                    ? 'Azure Blob Storage' 
                    : image.image_url.startsWith('/static') 
                    ? 'Local Storage' 
                    : 'URL Externa'}
                </span>
                <span className="ml-2">#{image.order || 0}</span>
              </div>
            </div>
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
  const [imageInfo, setImageInfo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      alert('The image is too large. Please use an image smaller than 5MB.')
      return
    }

    setFile(selectedFile)

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(selectedFile)

    // Obter informações da imagem
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
    setUploadProgress('Starting upload to Azure Blob Storage...')
    try {
      if (file) {
        await onUpload(file)
        setUploadProgress('Upload completed successfully!')
      } else {
        await createGalleryImage(formData)
        onSave()
        onClose()
      }
    } catch (error) {
      console.error('Error saving image:', error)
      setUploadProgress('Error uploading. Please try again.')
      alert('Error uploading image')
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
          
          {/* Preview e informações da imagem */}
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
                      {Math.abs(parseFloat(imageInfo.aspectRatio) - 1.78) < 0.1 && (
                        <span className="ml-2 text-green-600">(16:9 - Recommended)</span>
                      )}
                      {Math.abs(parseFloat(imageInfo.aspectRatio) - 1) < 0.1 && (
                        <span className="ml-2 text-green-600">(Square - Recommended)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status do upload */}
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
        </div>

        <div className="text-center text-dusty-rose/60 font-body">OU</div>

        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Image URL (if already hosted)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <div>
          <label className="block text-dusty-rose font-body font-medium mb-2">
            Caption (optional)
          </label>
          <input
            type="text"
            placeholder="Image description..."
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gold/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || uploading || (!file && !formData.image_url)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Upload size={18} className="animate-pulse" />
                Uploading to Azure...
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
              setFormData({ image_url: '', caption: '', order: 0 })
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

export default GalleryTab

