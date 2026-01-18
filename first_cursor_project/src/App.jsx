import { useState } from 'react'
import InputSection from './components/InputSection'
import PersonaSelector from './components/PersonaSelector'
import FeedbackGrid from './components/FeedbackGrid'
import { generateFeedback } from './utils/feedbackGenerator'
import './styles/App.css'

function App() {
  // State for wireframe description
  const [description, setDescription] = useState('')
  
  // State for uploaded image file
  const [imageFile, setImageFile] = useState(null)
  
  // State for selected persona
  const [selectedPersona, setSelectedPersona] = useState('General Designer')
  
  // State for generated feedbacks (will be populated later)
  const [feedbacks, setFeedbacks] = useState([])

  // Handler for description changes
  const handleDescriptionChange = (value) => {
    setDescription(value)
  }

  // Handler for image file changes
  const handleImageChange = (file) => {
    setImageFile(file)
  }

  // Handler for persona changes
  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona)
  }

  // Handler for generating feedback when button is clicked
  const handleGenerateFeedback = () => {
    // Generate feedback using the description, image data (null for now), and selected persona
    // Note: imageData will be implemented in Phase 3 (image analysis)
    const imageData = null // TODO: Add image analysis in Phase 3
    
    const generatedFeedbacks = generateFeedback(description, imageData, selectedPersona)
    
    // Update state with generated feedbacks
    setFeedbacks(generatedFeedbacks)
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

        {/* Generate Button */}
        <section className="generate-section">
          <button 
            className="generate-button"
            onClick={handleGenerateFeedback}
          >
            Generate Feedback
          </button>
        </section>

        {/* Feedback Cards Area */}
        <section className="feedback-section">
          <FeedbackGrid 
            feedbacks={feedbacks}
            selectedPersona={selectedPersona}
          />
        </section>
      </main>
    </div>
  )
}

export default App
