import { useState } from 'react'

/**
 * FeedbackCard Component
 * 
 * Individual feedback card with expandable content.
 * Each card shows:
 * - Category badge (usability, hierarchy, etc.)
 * - Feedback title/type (Strength or Issue)
 * - Feedback text
 * - Optional user notes (to be implemented later)
 */
function FeedbackCard({ feedback }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Placeholder feedback structure (will be replaced with real data later)
  const displayFeedback = feedback || {
    id: 'placeholder',
    category: 'Usability',
    type: 'strength',
    text: 'This is a placeholder feedback card.',
    suggestion: 'Add real feedback generation logic in Phase 2-3'
  }

  return (
    <div className={`feedback-card ${displayFeedback.type}`}>
      <div 
        className="feedback-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="feedback-badge">{displayFeedback.category}</span>
        <span className="feedback-type">{displayFeedback.type}</span>
        <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="feedback-card-body">
          <p className="feedback-text">{displayFeedback.text}</p>
          {displayFeedback.suggestion && (
            <p className="feedback-suggestion">
              <strong>Suggestion:</strong> {displayFeedback.suggestion}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedbackCard
