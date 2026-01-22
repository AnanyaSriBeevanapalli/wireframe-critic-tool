import FeedbackCard from './FeedbackCard'

/**
 * FeedbackGrid Component
 * 
 * Displays feedback cards in a responsive grid layout.
 * Filters and displays feedbacks based on selected persona.
 * 
 * @param {Array} feedbacks - Array of feedback objects
 * @param {string} selectedPersona - Currently selected persona
 * @param {Function} onNoteChange - Optional callback for user note changes
 * @param {Object} userNotes - Optional object mapping feedback IDs to notes
 */
function FeedbackGrid({ feedbacks, selectedPersona, onNoteChange, userNotes = {} }) {
  // Show placeholder message if no feedbacks yet
  if (feedbacks.length === 0) {
    return (
      <div className="feedback-grid-empty">
        <p>Click "Generate Feedback" to see feedback cards here.</p>
      </div>
    )
  }

  return (
    <div className="feedback-grid">
      {feedbacks.map((feedback) => (
        <FeedbackCard 
          key={feedback.id} 
          feedback={feedback}
          onNoteChange={onNoteChange}
          userNote={userNotes[feedback.id] || ''}
        />
      ))}
    </div>
  )
}

export default FeedbackGrid
