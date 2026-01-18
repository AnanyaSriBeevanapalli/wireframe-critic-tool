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

  // Map feedback type to CSS class name
  // Generator uses "positive" and "issue", but CSS expects "strength" and "issue"
  const getTypeClass = (type) => {
    if (type === 'positive') return 'strength'
    return type || 'issue'
  }

  if (!feedback) {
    return null // Don't render if no feedback provided
  }

  const typeClass = getTypeClass(feedback.type)

  return (
    <div className={`feedback-card ${typeClass}`}>
      <div 
        className="feedback-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="feedback-badge">{feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}</span>
        <span className="feedback-type">{feedback.type === 'positive' ? 'Strength' : 'Issue'}</span>
        <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="feedback-card-body">
          <p className="feedback-text">{feedback.text}</p>
          {feedback.suggestion && (
            <p className="feedback-suggestion">
              <strong>Suggestion:</strong> {feedback.suggestion}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedbackCard
