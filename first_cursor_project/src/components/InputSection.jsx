import { useState } from 'react'

/**
 * InputSection Component
 * 
 * Handles the text description input and optional image upload.
 * - Textarea for wireframe description
 * - File input for image upload
 * - Shows image preview when image is uploaded
 */
function InputSection({ description, imageFile, onDescriptionChange, onImageChange }) {
  const [imagePreview, setImagePreview] = useState(null)

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      onImageChange(file)
      
      // Create preview URL for display
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
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
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
        />
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
        />
        {imagePreview && (
          <div className="image-preview">
            <img 
              src={imagePreview} 
              alt="Wireframe preview" 
              className="preview-image"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default InputSection
