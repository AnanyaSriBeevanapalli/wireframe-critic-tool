// exportUtils.js - Utilities for exporting feedback data

/**
 * Format feedbacks as plain text for export
 * Includes user notes if provided
 * @param {Array} feedbacks - Array of feedback objects
 * @param {string} description - Wireframe description
 * @param {string} persona - Selected persona
 * @param {Object} userNotes - Optional user notes object mapping feedback IDs to notes
 * @returns {string} - Formatted text string
 */
export function formatFeedbackAsText(feedbacks, description, persona, userNotes = {}) {
  let text = 'AI Wireframe Critic - Feedback Report\n'
  text += '='.repeat(60) + '\n\n'
  
  if (description) {
    text += `Wireframe Description:\n${description}\n\n`
  }
  
  text += `Persona: ${persona}\n`
  text += `Generated: ${new Date().toLocaleString()}\n`
  text += `Total Feedback Items: ${feedbacks.length}\n\n`
  text += '='.repeat(60) + '\n\n'
  
  feedbacks.forEach((feedback, index) => {
    text += `\n${index + 1}. [${feedback.category.toUpperCase()}] ${feedback.type === 'positive' ? 'STRENGTH' : 'ISSUE'}\n`
    text += '-'.repeat(60) + '\n'
    text += `Feedback: ${feedback.text}\n\n`
    
    if (feedback.suggestion) {
      text += `Suggestion: ${feedback.suggestion}\n\n`
    }
    
    // Include user notes if available
    if (userNotes[feedback.id]) {
      text += `Your Notes: ${userNotes[feedback.id]}\n\n`
    }
    
    text += '-'.repeat(60) + '\n'
  })
  
  text += '\n' + '='.repeat(60) + '\n'
  text += 'End of Report\n'
  
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

/**
 * Export feedback section to PDF using html2pdf.js
 * Creates a formatted PDF with header, description, persona, and all feedback cards
 * @param {string} description - Wireframe description
 * @param {string} persona - Selected persona
 * @param {Array} feedbacks - Array of feedback objects
 * @param {Object} userNotes - Optional user notes object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function exportToPDF(description, persona, feedbacks, userNotes = {}) {
  // Check if html2pdf is available
  if (typeof window.html2pdf === 'undefined') {
    console.error('html2pdf.js is not loaded. Please check the CDN script.')
    alert('PDF export is not available. Please ensure html2pdf.js is loaded.')
    return false
  }

  console.log('[PDF Export] Starting PDF generation...')
  console.log('[PDF Export] Feedbacks count:', feedbacks.length)

  try {
    // Create a temporary container for PDF content
    const pdfContainer = document.createElement('div')
    pdfContainer.id = 'pdf-export-container'
    
    // Position it on-screen but at the top, fully visible to html2canvas
    pdfContainer.style.position = 'fixed'
    pdfContainer.style.top = '0'
    pdfContainer.style.left = '0'
    pdfContainer.style.width = '8.5in' // Letter size width (816px)
    pdfContainer.style.minHeight = '11in' // Letter size height minimum (1056px)
    pdfContainer.style.padding = '1in'
    pdfContainer.style.backgroundColor = '#ffffff'
    pdfContainer.style.fontFamily = 'Arial, sans-serif'
    pdfContainer.style.fontSize = '12px'
    pdfContainer.style.lineHeight = '1.6'
    pdfContainer.style.color = '#333333'
    pdfContainer.style.zIndex = '99999'
    // Critical: Make it fully visible and rendered
    pdfContainer.style.display = 'block'
    pdfContainer.style.visibility = 'visible'
    pdfContainer.style.opacity = '1'
    pdfContainer.style.overflow = 'visible'
    // Ensure it's in the viewport but won't interfere with UI
    pdfContainer.style.pointerEvents = 'none'

    // Create header
    const header = document.createElement('div')
    header.style.marginBottom = '30px'
    header.style.borderBottom = '3px solid #3498db'
    header.style.paddingBottom = '15px'
    
    const title = document.createElement('h1')
    title.textContent = 'AI Wireframe Critic - Feedback Report'
    title.style.margin = '0 0 10px 0'
    title.style.fontSize = '24px'
    title.style.color = '#2c3e50'
    title.style.fontWeight = 'bold'
    
    const timestamp = document.createElement('p')
    timestamp.textContent = `Generated: ${new Date().toLocaleString()}`
    timestamp.style.margin = '5px 0'
    timestamp.style.fontSize = '11px'
    timestamp.style.color = '#7f8c8d'
    
    header.appendChild(title)
    header.appendChild(timestamp)
    pdfContainer.appendChild(header)

    // Add description section
    if (description) {
      const descSection = document.createElement('div')
      descSection.style.marginBottom = '20px'
      
      const descLabel = document.createElement('strong')
      descLabel.textContent = 'Wireframe Description: '
      descLabel.style.color = '#2c3e50'
      
      const descText = document.createElement('span')
      descText.textContent = description
      
      descSection.appendChild(descLabel)
      descSection.appendChild(descText)
      pdfContainer.appendChild(descSection)
    }

    // Add persona section
    const personaSection = document.createElement('div')
    personaSection.style.marginBottom = '25px'
    
    const personaLabel = document.createElement('strong')
    personaLabel.textContent = 'Feedback Persona: '
    personaLabel.style.color = '#2c3e50'
    
    const personaText = document.createElement('span')
    personaText.textContent = persona
    
    personaSection.appendChild(personaLabel)
    personaSection.appendChild(personaText)
    pdfContainer.appendChild(personaSection)

    // Add feedback cards
    feedbacks.forEach((feedback, index) => {
      const card = document.createElement('div')
      card.style.marginBottom = '20px'
      card.style.padding = '15px'
      card.style.border = '1px solid #e0e0e0'
      card.style.borderLeft = `4px solid ${feedback.type === 'positive' ? '#27ae60' : '#e74c3c'}`
      card.style.borderRadius = '4px'
      card.style.backgroundColor = '#fafafa'

      // Category and type badge
      const badge = document.createElement('div')
      badge.style.marginBottom = '10px'
      badge.style.fontSize = '11px'
      badge.style.fontWeight = 'bold'
      badge.style.color = '#ffffff'
      badge.style.backgroundColor = '#3498db'
      badge.style.padding = '4px 10px'
      badge.style.borderRadius = '12px'
      badge.style.display = 'inline-block'
      badge.textContent = `${feedback.category.toUpperCase()} - ${feedback.type === 'positive' ? 'STRENGTH' : 'ISSUE'}`
      card.appendChild(badge)

      // Feedback text
      const feedbackText = document.createElement('p')
      feedbackText.textContent = feedback.text
      feedbackText.style.margin = '10px 0'
      feedbackText.style.color = '#34495e'
      card.appendChild(feedbackText)

      // Suggestion if available
      if (feedback.suggestion) {
        const suggestionDiv = document.createElement('div')
        suggestionDiv.style.marginTop = '10px'
        suggestionDiv.style.padding = '10px'
        suggestionDiv.style.backgroundColor = '#ecf0f1'
        suggestionDiv.style.borderLeft = '3px solid #3498db'
        suggestionDiv.style.borderRadius = '4px'
        
        const suggestionLabel = document.createElement('strong')
        suggestionLabel.textContent = 'Suggestion: '
        suggestionLabel.style.color = '#2c3e50'
        
        const suggestionText = document.createElement('span')
        suggestionText.textContent = feedback.suggestion
        suggestionText.style.color = '#34495e'
        
        suggestionDiv.appendChild(suggestionLabel)
        suggestionDiv.appendChild(suggestionText)
        card.appendChild(suggestionDiv)
      }

      // User notes if available
      if (userNotes[feedback.id]) {
        const notesDiv = document.createElement('div')
        notesDiv.style.marginTop = '10px'
        notesDiv.style.padding = '10px'
        notesDiv.style.backgroundColor = '#fff9e6'
        notesDiv.style.borderLeft = '3px solid #f39c12'
        notesDiv.style.borderRadius = '4px'
        notesDiv.style.fontStyle = 'italic'
        
        const notesLabel = document.createElement('strong')
        notesLabel.textContent = 'Your Notes: '
        notesLabel.style.color = '#2c3e50'
        
        const notesText = document.createElement('span')
        notesText.textContent = userNotes[feedback.id]
        notesText.style.color = '#34495e'
        
        notesDiv.appendChild(notesLabel)
        notesDiv.appendChild(notesText)
        card.appendChild(notesDiv)
      }

      pdfContainer.appendChild(card)
    })

    // Append to body temporarily
    document.body.appendChild(pdfContainer)

    // Debug: Check element state immediately after append
    console.log('[PDF Export] Step 1: Container appended to DOM')
    console.log('[PDF Export] Container element exists:', !!pdfContainer)
    console.log('[PDF Export] Container has children:', pdfContainer.children.length)
    console.log('[PDF Export] Container innerHTML length:', pdfContainer.innerHTML.length)
    
    // Force a synchronous layout calculation
    const initialRect = pdfContainer.getBoundingClientRect()
    const initialHeight = pdfContainer.offsetHeight
    const initialClientHeight = pdfContainer.clientHeight
    const initialScrollHeight = pdfContainer.scrollHeight
    
    console.log('[PDF Export] Step 2: Initial dimensions check')
    console.log('[PDF Export] - offsetHeight:', initialHeight)
    console.log('[PDF Export] - clientHeight:', initialClientHeight)
    console.log('[PDF Export] - scrollHeight:', initialScrollHeight)
    console.log('[PDF Export] - bounding rect:', {
      width: initialRect.width,
      height: initialRect.height,
      top: initialRect.top,
      left: initialRect.left
    })

    // Wait for browser to fully render the element (critical for html2canvas)
    // Use requestAnimationFrame to ensure rendering is complete
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 300)
        })
      })
    })

    // Verify element is ready after delay
    const finalRect = pdfContainer.getBoundingClientRect()
    const finalHeight = pdfContainer.offsetHeight
    const finalClientHeight = pdfContainer.clientHeight
    
    console.log('[PDF Export] Step 3: After render delay - Final dimensions')
    console.log('[PDF Export] - offsetHeight:', finalHeight)
    console.log('[PDF Export] - clientHeight:', finalClientHeight)
    console.log('[PDF Export] - bounding rect:', {
      width: finalRect.width,
      height: finalRect.height
    })

    if (finalHeight === 0 || finalClientHeight === 0) {
      console.error('[PDF Export] ERROR: Container has zero height!')
      console.error('[PDF Export] - offsetHeight:', finalHeight)
      console.error('[PDF Export] - clientHeight:', finalClientHeight)
      document.body.removeChild(pdfContainer)
      alert('Failed to generate PDF: content not rendered properly.')
      return false
    }

    // Generate PDF with improved options
    const filename = `Wireframe_Critic_Feedback_${Date.now()}.pdf`
    
    console.log('[PDF Export] Step 4: Calling html2pdf with options')
    console.log('[PDF Export] - Target element dimensions:', {
      width: pdfContainer.offsetWidth,
      height: pdfContainer.offsetHeight
    })
    
    try {
      await window.html2pdf()
        .set({
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 3, // Higher scale for better quality
            useCORS: true,
            logging: true, // Enable logging for debugging
            allowTaint: true,
            backgroundColor: '#ffffff',
            windowWidth: document.body.scrollWidth || window.innerWidth,
            windowHeight: document.body.scrollHeight || window.innerHeight,
            width: pdfContainer.offsetWidth,
            height: pdfContainer.offsetHeight,
            x: 0,
            y: 0
          },
          jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait' 
          }
        })
        .from(pdfContainer)
        .save()
      
      console.log('[PDF Export] Step 5: PDF generation completed successfully')
    } catch (pdfError) {
      console.error('[PDF Export] ERROR during html2pdf execution:', pdfError)
      throw pdfError
    }

    // Clean up
    document.body.removeChild(pdfContainer)
    console.log('[PDF Export] Step 6: Container removed from DOM')

    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Failed to export PDF. Please try again.')
    return false
  }
}
