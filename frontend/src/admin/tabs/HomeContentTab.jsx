import { useState, useEffect } from 'react'
import { getHomeContent, updateHomeContent, uploadFile } from '../../services/content'
import { motion } from 'framer-motion'
import { Save, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { normalizeImageUrl } from '../../utils/imageUrl'

const HomeContentTab = () => {
  const [content, setContent] = useState({
    hero_text: '',
    hero_image_url: '',
    wedding_date: '',
    subtitle: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getHomeContent()
        const data = response.data
        setContent({
          hero_text: data.hero_text || '',
          hero_image_url: data.hero_image_url || '',
          wedding_date: data.wedding_date || '',
          subtitle: data.subtitle || '',
        })
      } catch (error) {
        console.error('Error fetching home content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

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
      let uploadedImageUrl = content.hero_image_url
      
      // If file is selected, upload it first
      if (file) {
        setUploading(true)
        try {
          const response = await uploadFile(file)
          uploadedImageUrl = response.data.url
          setContent({ ...content, hero_image_url: uploadedImageUrl })
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

      // Update content with the uploaded URL
      const contentToSave = {
        ...content,
        hero_image_url: uploadedImageUrl || content.hero_image_url,
      }
      
      await updateHomeContent(contentToSave)
      alert('Home content updated successfully!')
      
      // Reset file state
      setFile(null)
      setPreview(null)
      setImageInfo(null)
      setUploadProgress(null)
    } catch (error) {
      console.error('Error updating home content:', error)
      alert('Error updating home content')
    } finally {
      setSaving(false)
      setTimeout(() => setUploadProgress(null), 3000)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 md:p-12 border border-gold/20">
      <h2 className="text-4xl font-display text-dusty-rose mb-10 tracking-wide">Home Content</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Hero Text (Couple Names)
            </label>
            <input
              type="text"
              value={content.hero_text}
              onChange={(e) => setContent({ ...content, hero_text: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-dusty-rose font-body font-medium mb-2">
              <div className="flex items-center gap-2">
                <Upload size={18} />
                Upload Hero Image to Azure Blob Storage
              </div>
              <span className="text-xs text-dusty-rose/60 font-normal block mt-1">
                Formats: JPG, PNG, GIF, WEBP. Maximum 5MB. Recommended: 1920x1080px (16:9).
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
                Hero Image URL (if already hosted)
              </label>
              <input
                type="url"
                value={content.hero_image_url}
                onChange={(e) => setContent({ ...content, hero_image_url: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Current Hero Image Preview */}
            {content.hero_image_url && !preview && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gold/30">
                <h4 className="font-semibold text-dusty-rose mb-2">Current Hero Image</h4>
                <img
                  src={normalizeImageUrl(content.hero_image_url)}
                  alt="Current hero"
                  className="w-full h-48 object-cover rounded-lg border border-gold/20"
                  onError={(e) => {
                    console.error('Current hero image failed to load:', content.hero_image_url, 'Normalized:', normalizeImageUrl(content.hero_image_url))
                    e.target.style.display = 'none'
                    // Show error message
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'text-center py-8 text-dusty-rose/60 font-body'
                    errorDiv.textContent = 'Image failed to load. Please check the URL or re-upload.'
                    e.target.parentElement.appendChild(errorDiv)
                  }}
                  onLoad={() => {
                    console.log('Current hero image loaded successfully:', content.hero_image_url)
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Wedding Date
            </label>
            <input
              type="date"
              value={content.wedding_date}
              onChange={(e) => setContent({ ...content, wedding_date: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={saving || uploading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Upload size={20} className="animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default HomeContentTab

