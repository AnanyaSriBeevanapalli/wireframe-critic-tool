import { useState, useEffect } from 'react'

/**
 * InputSection Component
 * 
 * Handles the text description input and optional image upload.
 * - Controlled textarea for wireframe description
 * - File input for image upload (accepts image/*)
 * - Image preview with clear option
 * - Full accessibility support
 * 
 * @param {string} description - Current description value
 * @param {File|null} imageFile - Current image file (for controlled component)
 * @param {Function} onDescriptionChange - Callback when description changes
 * @param {Function} onImageChange - Callback when image file changes
 */
function InputSection({ description, imageFile, onDescriptionChange, onImageChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState(null)

  // Update preview when imageFile prop changes (for controlled component)
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setImageError(null)
      }
      
      reader.onerror = () => {
        setImageError('Failed to load image preview')
        setImagePreview(null)
      }
      
      reader.readAsDataURL(imageFile)
    } else {
      // Clear preview when imageFile is removed
      setImagePreview(null)
      setImageError(null)
    }
  }, [imageFile])

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file')
        return
      }
      
      // Validate file size (optional: limit to 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setImageError('Image file is too large. Please select an image under 10MB.')
        return
      }
      
      // Clear previous errors
      setImageError(null)
      
      // Notify parent component
      onImageChange(file)
    } else {
      // File input cleared
      onImageChange(null)
    }
  }

  // Handle clearing the image
  const handleClearImage = () => {
    // Clear the file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) {
      fileInput.value = ''
    }
    
    // Notify parent to clear image
    onImageChange(null)
    setImageError(null)
  }

  // Handle description textarea changes
  const handleDescriptionChange = (event) => {
    onDescriptionChange(event.target.value)
  }

  return (
    <div className="input-section-container">
      {/* Wireframe Description Textarea */}
      <div className="input-group">
        <label htmlFor="wireframe-description">
          Wireframe Description
        </label>
        <textarea
          id="wireframe-description"
          className="description-textarea"
          placeholder="Describe your wireframe... (e.g., 'Login page with email field and button')"
          value={description || ''}
          onChange={handleDescriptionChange}
          rows={4}
          aria-label="Wireframe description input"
          aria-describedby="description-help"
        />
        <small id="description-help" className="input-help-text">
          Provide a detailed description of your wireframe layout and elements
        </small>
      </div>

      {/* Image Upload */}
      <div className="input-group">
        <label htmlFor="image-upload">
          Upload Wireframe Image (Optional)
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          aria-label="Upload wireframe image"
          aria-describedby="image-help"
        />
        <small id="image-help" className="input-help-text">
          Upload a screenshot or image of your wireframe for analysis
        </small>
        
        {/* Error message */}
        {imageError && (
          <div className="image-error" role="alert" aria-live="polite">
            {imageError}
          </div>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="image-preview">
            <img 
              src={imagePreview} 
              alt="Wireframe preview" 
              className="preview-image"
              aria-label="Uploaded wireframe preview"
            />
            <button
              type="button"
              className="clear-image-button"
              onClick={handleClearImage}
              aria-label="Remove uploaded image"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputSection
