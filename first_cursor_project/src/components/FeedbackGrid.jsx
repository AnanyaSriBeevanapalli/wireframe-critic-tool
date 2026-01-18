import FeedbackCard from './FeedbackCard'

/**
 * FeedbackGrid Component
 * 
 * Displays feedback cards in a responsive grid layout.
 * Will filter feedbacks by selected persona (to be implemented later).
 */
function FeedbackGrid({ feedbacks, selectedPersona }) {
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
        />
      ))}
    </div>
  )
}

export default FeedbackGrid
