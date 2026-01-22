import { useState } from 'react'
import InputSection from './components/InputSection'
import PersonaSelector from './components/PersonaSelector'
import FeedbackGrid from './components/FeedbackGrid'
import { generateFeedback } from './utils/feedbackGenerator'
import { analyzeImage } from './utils/imageAnalyzer'
import { formatFeedbackAsText, copyToClipboard, downloadAsText } from './utils/exportUtils'
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
  
  // Button Logic State (tracks last generation inputs to determine button label)
  const [lastGeneratedDescription, setLastGeneratedDescription] = useState('')
  const [lastGeneratedImageIdentifier, setLastGeneratedImageIdentifier] = useState(null)

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
      const text = formatFeedbackAsText(feedbacks, description, selectedPersona)
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
      const text = formatFeedbackAsText(feedbacks, description, selectedPersona)
      downloadAsText(text, 'wireframe-feedback')
    } catch (error) {
      console.error('Error downloading feedback:', error)
      alert('Failed to download feedback. Please try again.')
    }
  }

  /**
   * Handle user note changes for individual feedback cards
   * Updates notes state mapped by feedback ID
   * @param {string} feedbackId - ID of the feedback card
   * @param {string} note - User's note text
   */
  const handleNoteChange = (feedbackId, note) => {
    setUserNotes(prev => ({
      ...prev,
      [feedbackId]: note
    }))
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>AI Wireframe Critic</h1>
        <p className="subtitle">Get nuanced UX feedback on your wireframes</p>
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
                  >
                    Copy
                  </button>
                  <button 
                    className="export-button download-button"
                    onClick={handleDownloadAsText}
                    title="Download feedback as text file"
                  >
                    Download
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
