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

  // Process feedbacks: prioritize preferred categories, add visual flag
  // Sort: preferred categories first, then by type (issues before positives)
  const processedFeedbacks = [...feedbacks]
    .map(feedback => ({
      ...feedback,
      // Add a flag to indicate if this is a preferred category for the persona
      isPreferredForPersona: preferredCategories.includes(feedback.category)
    }))
    .sort((a, b) => {
      const aIsPreferred = a.isPreferredForPersona
      const bIsPreferred = b.isPreferredForPersona

      // Preferred categories come first
      if (aIsPreferred && !bIsPreferred) return -1
      if (!aIsPreferred && bIsPreferred) return 1

      // Within same priority, issues come before positives
      if (a.type === 'issue' && b.type === 'positive') return -1
      if (a.type === 'positive' && b.type === 'issue') return 1

      return 0
    })

  // Check if we have preferred feedbacks
  const preferredFeedbacks = processedFeedbacks.filter(f => f.isPreferredForPersona)
  const hasPreferredOnly = preferredFeedbacks.length > 0 && preferredFeedbacks.length === processedFeedbacks.length

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

  // Split by type: Issues (left column) and Strengths/positive (right column)
  // Persona prioritization is already applied in processedFeedbacks order
  const issues = processedFeedbacks.filter(f => f.type === 'issue')
  const strengths = processedFeedbacks.filter(f => f.type === 'positive')

  return (
    <>
      {/* Show info message if filtering/sorting is active */}
      {preferredCount > 0 && preferredCount < totalCount && (
        <div className="persona-filter-info" role="status" aria-live="polite">
          <span className="filter-info-text">
            Showing {preferredCount} of {totalCount} feedback items prioritized for <strong>{selectedPersona}</strong> persona.
          </span>
        </div>
      )}

      <div
        className="feedback-two-column-layout"
        role="region"
        aria-label={`Feedback: ${totalCount} items (${issues.length} issues, ${strengths.length} strengths)${selectedPersona ? ` for ${selectedPersona} persona` : ''}`}
      >
        {/* Left column: Issues */}
        <div className="feedback-column issues-column">
          <h3 className="feedback-column-header" id="issues-header">
            Issues to Fix
          </h3>
          {issues.length === 0 ? (
            <p className="feedback-column-empty" aria-live="polite">
              No issues detected!
            </p>
          ) : (
            <div className="feedback-column-cards" aria-labelledby="issues-header">
              {issues.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onNoteChange={onNoteChange}
                  userNote={userNotes[feedback.id] || ''}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right column: Strengths */}
        <div className="feedback-column strengths-column">
          <h3 className="feedback-column-header" id="strengths-header">
            Strengths to Keep
          </h3>
          {strengths.length === 0 ? (
            <p className="feedback-column-empty" aria-live="polite">
              No strengths highlighted yet.
            </p>
          ) : (
            <div className="feedback-column-cards" aria-labelledby="strengths-header">
              {strengths.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onNoteChange={onNoteChange}
                  userNote={userNotes[feedback.id] || ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FeedbackGrid
