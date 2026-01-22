// exportUtils.js - Utilities for exporting feedback data

/**
 * Format feedbacks as plain text for export
 * @param {Array} feedbacks - Array of feedback objects
 * @param {string} description - Wireframe description
 * @param {string} persona - Selected persona
 * @returns {string} - Formatted text string
 */
export function formatFeedbackAsText(feedbacks, description, persona) {
  let text = 'AI Wireframe Critic - Feedback Report\n'
  text += '=' .repeat(50) + '\n\n'
  
  if (description) {
    text += `Wireframe Description:\n${description}\n\n`
  }
  
  text += `Persona: ${persona}\n`
  text += `Generated: ${new Date().toLocaleString()}\n\n`
  text += '-'.repeat(50) + '\n\n'
  
  feedbacks.forEach((feedback, index) => {
    text += `${index + 1}. [${feedback.category.toUpperCase()}] ${feedback.type.toUpperCase()}\n`
    text += `${feedback.text}\n`
    if (feedback.suggestion) {
      text += `\nSuggestion: ${feedback.suggestion}\n`
    }
    text += '\n' + '-'.repeat(50) + '\n\n'
  })
  
  return text
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful
 */
export async function copyToClipboard(text) {
  try {
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Download text as a .txt file
 * @param {string} text - Text content to download
 * @param {string} filename - Filename (without extension)
 */
export function downloadAsText(text, filename = 'wireframe-feedback') {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
