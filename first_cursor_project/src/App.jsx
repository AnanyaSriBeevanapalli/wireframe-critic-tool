import { useState } from 'react'
import InputSection from './components/InputSection'
import PersonaSelector from './components/PersonaSelector'
import FeedbackGrid from './components/FeedbackGrid'
import { generateFeedback } from './utils/feedbackGenerator'
import { analyzeImage } from './utils/imageAnalyzer'
import { formatFeedbackAsText, copyToClipboard, downloadAsText } from './utils/exportUtils'
import './styles/App.css'

function App() {
  // State for wireframe description
  const [description, setDescription] = useState('')
  
  // State for uploaded image file
  const [imageFile, setImageFile] = useState(null)
  
  // State for analyzed image data (dimensions, aspect ratio, etc.)
  const [imageData, setImageData] = useState(null)
  
  // State for selected persona
  const [selectedPersona, setSelectedPersona] = useState('General Designer')
  
  // State for generated feedbacks
  const [feedbacks, setFeedbacks] = useState([])
  
  // State for user notes (mapped by feedback ID)
  const [userNotes, setUserNotes] = useState({})
  
  // State for loading feedback generation
  const [isGenerating, setIsGenerating] = useState(false)
  
  // State to track last inputs used for generation (for button label logic)
  const [lastGeneratedDescription, setLastGeneratedDescription] = useState('')
  const [lastGeneratedImageIdentifier, setLastGeneratedImageIdentifier] = useState(null)

  // Handler for description changes
  const handleDescriptionChange = (value) => {
    setDescription(value)
  }

  // Handler for image file changes - analyze image when uploaded
  const handleImageChange = async (file) => {
    setImageFile(file)
    
    // Reset image data
    setImageData(null)
    
    // If file is provided, analyze it
    if (file) {
      try {
        const analyzed = await analyzeImage(file)
        setImageData(analyzed)
        console.log('Image analyzed:', analyzed) // Debug log
      } catch (error) {
        console.error('Error analyzing image:', error)
        // Continue without image data if analysis fails
      }
    }
  }

  // Handler for persona changes
  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona)
  }

  // Helper: Create a simple identifier for an image file (name + size)
  // This allows us to detect if the image has changed
  const getImageIdentifier = (file) => {
    if (!file) return null
    return `${file.name}-${file.size}`
  }

  // Helper: Check if current inputs differ from last generation inputs
  // Returns true if inputs have changed (should show "Generate Feedback")
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

  // Handler for generating feedback when button is clicked
  const handleGenerateFeedback = async () => {
    // Don't generate if description is empty
    if (!description.trim()) {
      alert('Please enter a wireframe description first.')
      return
    }

    // Set loading state
    setIsGenerating(true)

    // Simulate slight delay for better UX (makes loading state visible)
    // In production, this might be where we call an API
    await new Promise(resolve => setTimeout(resolve, 300))

    // Generate feedback using description, image data, and selected persona
    const generatedFeedbacks = generateFeedback(description, imageData, selectedPersona)
    
    // Update state with generated feedbacks
    setFeedbacks(generatedFeedbacks)
    
    // Save current inputs as the "last generated" inputs
    // This allows us to detect if inputs change later
    setLastGeneratedDescription(description.trim())
    setLastGeneratedImageIdentifier(getImageIdentifier(imageFile))
    
    // Clear loading state
    setIsGenerating(false)
  }

  // Handler for regenerating feedback (same as generate, just clearer UX intent)
  const handleRegenerateFeedback = () => {
    handleGenerateFeedback()
  }

  // Handler for copying feedback to clipboard
  const handleCopyToClipboard = async () => {
    if (feedbacks.length === 0) {
      alert('No feedback to copy. Generate feedback first.')
      return
    }

    const text = formatFeedbackAsText(feedbacks, description, selectedPersona)
    const success = await copyToClipboard(text)
    
    if (success) {
      alert('Feedback copied to clipboard!')
    } else {
      alert('Failed to copy to clipboard. Please try the download option instead.')
    }
  }

  // Handler for downloading feedback as text file
  const handleDownloadAsText = () => {
    if (feedbacks.length === 0) {
      alert('No feedback to download. Generate feedback first.')
      return
    }

    const text = formatFeedbackAsText(feedbacks, description, selectedPersona)
    downloadAsText(text, 'wireframe-feedback')
  }

  // Handler for user note changes
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
