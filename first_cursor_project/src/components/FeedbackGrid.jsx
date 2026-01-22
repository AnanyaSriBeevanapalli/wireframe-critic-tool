import FeedbackCard from './FeedbackCard'

/**
 * FeedbackGrid Component
 * 
 * Displays feedback cards in a responsive CSS Grid layout.
 * Optionally filters and prioritizes feedbacks based on selected persona.
 * 
 * @param {Array} feedbacks - Array of feedback objects from generateFeedback
 * @param {string} selectedPersona - Currently selected persona (for display context)
 * @param {Function} onNoteChange - Optional callback for user note changes
 * @param {Object} userNotes - Optional object mapping feedback IDs to notes
 */
function FeedbackGrid({ feedbacks, selectedPersona, onNoteChange, userNotes = {} }) {
  // Define persona category priorities for optional filtering
  const personaCategoryPriorities = {
    'End-User': ['usability', 'navigation', 'mobile'],
    'Stakeholder': ['usability', 'hierarchy'],
    'Accessibility Expert': ['accessibility', 'mobile'],
    'General Designer': ['hierarchy', 'usability', 'navigation']
  }

  // Get preferred categories for current persona
  const preferredCategories = personaCategoryPriorities[selectedPersona] || []

  // Filter and sort feedbacks based on persona (optional enhancement)
  // Note: generateFeedback already does persona-based sorting, but we can add
  // additional visual emphasis or filtering here if needed
  const processedFeedbacks = [...feedbacks].map(feedback => ({
    ...feedback,
    // Add a flag to indicate if this is a preferred category for the persona
    isPreferredForPersona: preferredCategories.includes(feedback.category)
  }))

  // Show empty state if no feedbacks
  if (feedbacks.length === 0) {
    return (
      <div 
        className="feedback-grid-empty"
        role="status"
        aria-live="polite"
        aria-label="No feedback generated yet"
      >
        <div className="empty-state-icon">💡</div>
        <p className="empty-state-message">
          Click "Generate Feedback" to see feedback cards here.
        </p>
        <p className="empty-state-hint">
          Enter a wireframe description and select a persona to get started.
        </p>
      </div>
    )
  }

  // Calculate grid statistics for accessibility
  const totalCount = processedFeedbacks.length
  const preferredCount = processedFeedbacks.filter(f => f.isPreferredForPersona).length

  return (
    <div 
      className="feedback-grid"
      role="region"
      aria-label={`Feedback grid: ${totalCount} feedback ${totalCount === 1 ? 'item' : 'items'}${selectedPersona ? ` for ${selectedPersona} persona` : ''}`}
    >
      {processedFeedbacks.map((feedback, index) => (
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
