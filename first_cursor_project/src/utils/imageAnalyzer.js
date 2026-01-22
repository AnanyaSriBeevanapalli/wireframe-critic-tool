// imageAnalyzer.js - Image analysis utilities using Canvas API
// Extracts dimensions, aspect ratio, and determines mobile-friendliness

/**
 * Analyze an image file and extract metadata using Canvas API
 * @param {File} file - Image file to analyze
 * @returns {Promise<Object>} - Promise resolving to image data object
 *   { width, height, aspectRatio, isMobileFriendly, hasLargeDimensions }
 */
export function analyzeImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file: must be an image'))
      return
    }

    // Create an image element to load the file
    const img = new Image()
    
    // Create object URL from file for loading
    const objectUrl = URL.createObjectURL(file)

    // Handle successful image load
    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      const aspectRatio = width / height

      // Determine mobile-friendliness based on dimensions
      // Mobile-friendly if width < 768px (typical mobile breakpoint) or portrait orientation
      const isMobileFriendly = width < 768 || aspectRatio < 1

      // Check if image has very large dimensions (might need responsiveness concerns)
      const hasLargeDimensions = width > 1920

      // Clean up object URL
      URL.revokeObjectURL(objectUrl)

      // Return analysis data
      resolve({
        width,
        height,
        aspectRatio: parseFloat(aspectRatio.toFixed(2)), // Round to 2 decimal places
        isMobileFriendly,
        hasLargeDimensions,
        orientation: aspectRatio > 1 ? 'landscape' : aspectRatio < 1 ? 'portrait' : 'square'
      })
    }

    // Handle image load errors
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    // Start loading the image
    img.src = objectUrl
  })
}

/**
 * Alternative method using Canvas API (if Image API doesn't work)
 * More verbose but gives direct access to pixel data if needed
 * @param {File} file - Image file to analyze
 * @returns {Promise<Object>} - Promise resolving to image data object
 */
export function analyzeImageWithCanvas(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file: must be an image'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Create canvas to extract dimensions (and potentially analyze pixels)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        // Optionally draw image to canvas (not needed just for dimensions, but useful for future analysis)
        // ctx.drawImage(img, 0, 0)

        const width = canvas.width
        const height = canvas.height
        const aspectRatio = width / height

        const isMobileFriendly = width < 768 || aspectRatio < 1
        const hasLargeDimensions = width > 1920

        resolve({
          width,
          height,
          aspectRatio: parseFloat(aspectRatio.toFixed(2)),
          isMobileFriendly,
          hasLargeDimensions,
          orientation: aspectRatio > 1 ? 'landscape' : aspectRatio < 1 ? 'portrait' : 'square'
        })
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target.result
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}
