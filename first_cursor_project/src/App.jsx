import { useState, useEffect, useRef } from 'react'
import InputSection from './components/InputSection'
import PersonaSelector from './components/PersonaSelector'
import FeedbackGrid from './components/FeedbackGrid'
import { generateFeedback } from './utils/feedbackGenerator'
import { analyzeImage } from './utils/imageAnalyzer'
import { formatFeedbackAsText, copyToClipboard, downloadAsText, exportToPDF } from './utils/exportUtils'
import { saveSession, loadSession, clearSession } from './utils/localStorage'
import './styles/App.css'

function App() {
  // ====================================
  // STATE MANAGEMENT
  // ====================================
  
  // Input State
  const [description, setDescription] = useState('') // Wireframe description text
  const [imageFile, setImageFile] = useState(null) // Uploaded image File object
  const [imageData, setImageData] = useState(null) // Analyzed image metadata (width, height, aspectRatio, etc.)
  
  // Configuration State
  const [selectedPersona, setSelectedPersona] = useState('General Designer') // Selected feedback persona
  
  // Output State
  const [feedbacks, setFeedbacks] = useState([]) // Generated feedback array
  const [userNotes, setUserNotes] = useState({}) // User notes mapped by feedback ID: { [feedbackId]: note }
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false) // Loading state for feedback generation
  const [isLoadingSession, setIsLoadingSession] = useState(true) // Loading state for session restore
  
  // Button Logic State (tracks last generation inputs to determine button label)
  const [lastGeneratedDescription, setLastGeneratedDescription] = useState('')
  const [lastGeneratedImageIdentifier, setLastGeneratedImageIdentifier] = useState(null)

  // Refs for debouncing
  const saveTimeoutRef = useRef(null)
  const notesSaveTimeoutRef = useRef(null)
  const isInitialMountRef = useRef(true)

  // ====================================
  // INPUT HANDLERS
  // ====================================
  
  /**
   * Handle wireframe description text changes
   * @param {string} value - New description text
   */
  const handleDescriptionChange = (value) => {
    setDescription(value)
  }

  /**
   * Handle image file upload and analysis
   * Automatically analyzes image dimensions when uploaded
   * @param {File|null} file - Uploaded image file or null if cleared
   */
  const handleImageChange = async (file) => {
    setImageFile(file)
    
    // Reset image data when file changes
    setImageData(null)
    
    // If file is provided, analyze it for dimensions and metadata
    if (file) {
      try {
        const analyzed = await analyzeImage(file)
        setImageData(analyzed)
        console.log('Image analyzed:', analyzed) // Debug log
      } catch (error) {
        console.error('Error analyzing image:', error)
        // Continue without image data if analysis fails
        // User can still generate feedback without image analysis
      }
    }
  }

  /**
   * Handle persona selection changes
   * @param {string} persona - Selected persona name
   */
  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona)
  }

  // ====================================
  // HELPER FUNCTIONS
  // ====================================
  
  /**
   * Create a simple identifier for an image file (name + size)
   * Used to detect if the image has changed since last generation
   * @param {File|null} file - Image file
   * @returns {string|null} - Identifier string or null
   */
  const getImageIdentifier = (file) => {
    if (!file) return null
    return `${file.name}-${file.size}`
  }

  /**
   * Check if current inputs differ from last generation inputs
   * Used to determine button label ("Generate" vs "Regenerate")
   * @returns {boolean} - True if inputs have changed
   */
  const hasInputsChanged = () => {
    const currentDescription = description.trim()
    const currentImageId = getImageIdentifier(imageFile)
    
    // If description changed
    if (currentDescription !== lastGeneratedDescription) {
      return true
    }
    
    // If image changed (different file or was added/removed)
    if (currentImageId !== lastGeneratedImageIdentifier) {
      return true
    }
    
    // Inputs are the same
    return false
  }

  // ====================================
  // MAIN FEEDBACK GENERATION HANDLER
  // ====================================
  
  /**
   * Generate feedback based on current inputs
   * Handles validation, loading state, and error handling
   */
  const handleGenerateFeedback = async () => {
    // Validate: Don't generate if description is empty
    if (!description.trim()) {
      alert('Please enter a wireframe description first.')
      return
    }

    // Set loading state
    setIsGenerating(true)

    try {
      // Simulate slight delay for better UX (makes loading state visible)
      // In production, this might be where we call an API
      await new Promise(resolve => setTimeout(resolve, 300))

      // Generate feedback using description, image data, and selected persona
      const generatedFeedbacks = generateFeedback(description, imageData, selectedPersona)
      
      // Update state with generated feedbacks
      setFeedbacks(generatedFeedbacks)
      
      // Save current inputs as the "last generated" inputs
      // This allows us to detect if inputs change later (for button label logic)
      setLastGeneratedDescription(description.trim())
      setLastGeneratedImageIdentifier(getImageIdentifier(imageFile))
    } catch (error) {
      // Handle any errors during generation
      console.error('Error generating feedback:', error)
      alert('Failed to generate feedback. Please try again.')
    } finally {
      // Always clear loading state, even if there was an error
      setIsGenerating(false)
    }
  }

  // ====================================
  // ACTION HANDLERS
  // ====================================
  
  /**
   * Regenerate feedback with same inputs
   * Same functionality as generate, but clearer UX intent
   */
  const handleRegenerateFeedback = () => {
    handleGenerateFeedback()
  }

  /**
   * Copy feedback to clipboard
   * Formats feedback as text and copies to system clipboard
   */
  const handleCopyToClipboard = async () => {
    if (feedbacks.length === 0) {
      alert('No feedback to copy. Generate feedback first.')
      return
    }

    try {
      const text = formatFeedbackAsText(feedbacks, description, selectedPersona, userNotes)
      const success = await copyToClipboard(text)
      
      if (success) {
        alert('Feedback copied to clipboard!')
      } else {
        alert('Failed to copy to clipboard. Please try the download option instead.')
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy to clipboard. Please try the download option instead.')
    }
  }

  /**
   * Download feedback as text file
   * Formats feedback and triggers browser download
   */
  const handleDownloadAsText = () => {
    if (feedbacks.length === 0) {
      alert('No feedback to download. Generate feedback first.')
      return
    }

    try {
      const text = formatFeedbackAsText(feedbacks, description, selectedPersona, userNotes)
      downloadAsText(text, 'wireframe-feedback')
    } catch (error) {
      console.error('Error downloading feedback:', error)
      alert('Failed to download feedback. Please try again.')
    }
  }

  /**
   * Export feedback to PDF
   * Uses html2pdf.js to generate a formatted PDF document
   */
  const handleExportToPDF = async () => {
    if (feedbacks.length === 0) {
      alert('No feedback to export. Generate feedback first.')
      return
    }

    // Set loading state
    setIsGenerating(true)

    try {
      // Add a small delay to ensure any loading states are cleared
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const success = await exportToPDF(description, selectedPersona, feedbacks, userNotes)
      
      if (success) {
        // PDF download started successfully
        console.log('[App] PDF export completed successfully')
      } else {
        alert('Failed to export PDF. Please check the console for details.')
      }
    } catch (error) {
      console.error('[App] Error exporting to PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      // Clear loading state after a brief delay to ensure PDF generation completes
      setTimeout(() => {
        setIsGenerating(false)
      }, 500)
    }
  }

  /**
   * Handle user note changes for individual feedback cards
   * Updates notes state mapped by feedback ID
   * Auto-saves to localStorage with debouncing
   * @param {string} feedbackId - ID of the feedback card
   * @param {string} note - User's note text
   */
  const handleNoteChange = (feedbackId, note) => {
    setUserNotes(prev => {
      const updated = {
        ...prev,
        [feedbackId]: note
      }
      
      // Debounce notes save to localStorage (500ms delay)
      if (notesSaveTimeoutRef.current) {
        clearTimeout(notesSaveTimeoutRef.current)
      }
      
      notesSaveTimeoutRef.current = setTimeout(() => {
        try {
          const currentState = {
            description,
            imageData,
            selectedPersona,
            feedbacks,
            userNotes: updated,
            lastGeneratedDescription,
            lastGeneratedImageIdentifier
          }
          saveSession(currentState)
        } catch (error) {
          console.error('Failed to save notes:', error)
        }
      }, 500)
      
      return updated
    })
  }

  /**
   * Clear all session data and reset app state
   */
  const handleClearSession = () => {
    if (window.confirm('Are you sure you want to clear all data? This will reset your description, feedback, and notes.')) {
      // Clear localStorage
      clearSession()
      
      // Reset all state
      setDescription('')
      setImageFile(null)
      setImageData(null)
      setSelectedPersona('General Designer')
      setFeedbacks([])
      setUserNotes({})
      setLastGeneratedDescription('')
      setLastGeneratedImageIdentifier(null)
      
      // Clear file input if it exists
      const fileInput = document.getElementById('image-upload')
      if (fileInput) {
        fileInput.value = ''
      }
    }
  }

  // ====================================
  // SESSION MANAGEMENT (localStorage)
  // ====================================
  
  /**
   * Load session from localStorage on mount
   */
  useEffect(() => {
    const loadSavedSession = async () => {
      try {
        setIsLoadingSession(true)
        const saved = loadSession()
        
        if (saved) {
          // Restore all state from saved session
          setDescription(saved.description || '')
          setSelectedPersona(saved.selectedPersona || 'General Designer')
          setFeedbacks(saved.feedbacks || [])
          setUserNotes(saved.userNotes || {})
          setImageData(saved.imageData || null)
          setLastGeneratedDescription(saved.lastGeneratedDescription || '')
          setLastGeneratedImageIdentifier(saved.lastGeneratedImageIdentifier || null)
          
          console.log('Session restored from localStorage')
        }
      } catch (error) {
        console.error('Error loading session:', error)
        // Continue with default state on error
      } finally {
        setIsLoadingSession(false)
        isInitialMountRef.current = false
      }
    }
    
    loadSavedSession()
  }, []) // Run only on mount

  /**
   * Auto-save session to localStorage when state changes
   * Debounced to avoid excessive saves (800ms delay)
   */
  useEffect(() => {
    // Skip save on initial mount (we just loaded)
    if (isInitialMountRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const currentState = {
          description,
          imageData,
          selectedPersona,
          feedbacks,
          userNotes,
          lastGeneratedDescription,
          lastGeneratedImageIdentifier
        }
        saveSession(currentState)
      } catch (error) {
        console.error('Failed to auto-save session:', error)
      }
    }, 800) // 800ms debounce

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [description, selectedPersona, feedbacks, imageData, lastGeneratedDescription, lastGeneratedImageIdentifier]) // Auto-save on these changes

  /**
   * Clear user notes when feedbacks change significantly
   * (e.g., new generation with different inputs)
   */
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      return
    }

    // If feedbacks change and we have notes, check if feedback IDs still match
    if (feedbacks.length > 0 && Object.keys(userNotes).length > 0) {
      const currentFeedbackIds = new Set(feedbacks.map(f => f.id))
      const noteIds = Object.keys(userNotes)
      
      // Remove notes for feedbacks that no longer exist
      const notesToKeep = noteIds.filter(id => currentFeedbackIds.has(id))
      
      if (notesToKeep.length !== noteIds.length) {
        const cleanedNotes = {}
        notesToKeep.forEach(id => {
          cleanedNotes[id] = userNotes[id]
        })
        setUserNotes(cleanedNotes)
      }
    } else if (feedbacks.length === 0 && Object.keys(userNotes).length > 0) {
      // Clear all notes if feedbacks are cleared
      setUserNotes({})
    }
  }, [feedbacks]) // Run when feedbacks change

  // Show loading state during session restore
  if (isLoadingSession) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>AI Wireframe Critic</h1>
          <p className="subtitle">Loading your session...</p>
        </header>
        <main className="app-main">
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Restoring your previous session...</span>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>AI Wireframe Critic</h1>
        <p className="subtitle">Get nuanced UX feedback on your wireframes</p>
        <button
          className="clear-session-button"
          onClick={handleClearSession}
          title="Clear all data and start fresh"
          aria-label="Clear session and reset all data"
        >
          Clear Session
        </button>
      </header>

      {/* Main content container */}
      <main className="app-main">
        {/* Input Section: Description and Image Upload */}
        <section className="input-section">
          <InputSection
            description={description}
            imageFile={imageFile}
            onDescriptionChange={handleDescriptionChange}
            onImageChange={handleImageChange}
          />
        </section>

        {/* Persona Selector */}
        <section className="persona-section">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={handlePersonaChange}
          />
        </section>

        {/* Generate/Regenerate Button */}
        <section className="generate-section">
          <div className="generate-buttons-container">
            {feedbacks.length === 0 || hasInputsChanged() ? (
              <button 
                className="generate-button"
                onClick={handleGenerateFeedback}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Feedback'}
              </button>
            ) : (
              <>
                <button 
                  className="generate-button regenerate-button"
                  onClick={handleRegenerateFeedback}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate Feedback'}
                </button>
                <div className="export-buttons">
                  <button 
                    className="export-button copy-button"
                    onClick={handleCopyToClipboard}
                    title="Copy feedback to clipboard"
                    disabled={isGenerating}
                  >
                    Copy
                  </button>
                  <button 
                    className="export-button download-button"
                    onClick={handleDownloadAsText}
                    title="Download feedback as text file"
                    disabled={isGenerating}
                  >
                    Download Text
                  </button>
                  <button 
                    className="export-button pdf-button"
                    onClick={handleExportToPDF}
                    title="Export feedback as PDF"
                    disabled={isGenerating}
                  >
                    Export PDF
                  </button>
                </div>
              </>
            )}
          </div>
          {isGenerating && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Analyzing wireframe and generating feedback...</span>
            </div>
          )}
        </section>

        {/* Feedback Cards Area */}
        <section className="feedback-section">
          <FeedbackGrid 
            feedbacks={feedbacks}
            selectedPersona={selectedPersona}
            onNoteChange={handleNoteChange}
            userNotes={userNotes}
          />
        </section>
      </main>
    </div>
  )
}

export default App
