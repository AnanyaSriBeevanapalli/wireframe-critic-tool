import { useState, useRef, useEffect } from 'react'

/**
 * FeedbackCard Component
 * 
 * Individual feedback card with expandable content.
 * Displays category badge, feedback text, suggestions, and optional user notes.
 * 
 * @param {Object} feedback - Feedback object with id, text, category, type, suggestion
 * @param {Function} onNoteChange - Optional callback when user notes change (feedbackId, note)
 * @param {string} userNote - Optional initial user note value
 */
function FeedbackCard({ feedback, onNoteChange, userNote = '' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [note, setNote] = useState(userNote || '')
  const headerRef = useRef(null)
  const contentId = `feedback-content-${feedback?.id || 'unknown'}`

  // Sync note with prop if it changes externally
  useEffect(() => {
    if (userNote !== undefined) {
      setNote(userNote)
    }
  }, [userNote])

  // Map feedback type to CSS class name
  // Generator uses "positive" and "issue", but CSS expects "strength" and "issue"
  const getTypeClass = (type) => {
    if (type === 'positive') return 'strength'
    return type || 'issue'
  }

  // Get category display name (capitalized)
  const getCategoryName = (category) => {
    if (!category) return 'General'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Get category badge color class
  const getCategoryBadgeClass = (category) => {
    const categoryMap = {
      'usability': 'badge-usability',
      'hierarchy': 'badge-hierarchy',
      'accessibility': 'badge-accessibility',
      'navigation': 'badge-navigation',
      'form': 'badge-form',
      'mobile': 'badge-mobile'
    }
    return categoryMap[category?.toLowerCase()] || 'badge-default'
  }

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleExpand()
    }
  }

  // Handle note changes
  const handleNoteChange = (event) => {
    const newNote = event.target.value
    setNote(newNote)
    
    // Call parent callback if provided
    if (onNoteChange && feedback?.id) {
      onNoteChange(feedback.id, newNote)
    }
  }

  if (!feedback) {
    return null // Don't render if no feedback provided
  }

  const typeClass = getTypeClass(feedback.type)
  const typeLabel = feedback.type === 'positive' ? 'Strength' : 'Issue'
  const categoryName = getCategoryName(feedback.category)
  const badgeClass = getCategoryBadgeClass(feedback.category)

  return (
    <article className={`feedback-card ${typeClass}`}>
      <div 
        ref={headerRef}
        className="feedback-card-header"
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={`${typeLabel} feedback: ${categoryName}. Click to ${isExpanded ? 'collapse' : 'expand'}`}
      >
        <span className={`feedback-badge ${badgeClass}`}>
          {categoryName}
        </span>
        <span className="feedback-type">{typeLabel}</span>
        <span className="expand-icon" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </div>
      
      {isExpanded && (
        <div 
          id={contentId}
          className="feedback-card-body"
          role="region"
          aria-labelledby={`feedback-header-${feedback.id}`}
        >
          <div className="feedback-content">
            <p className="feedback-text">{feedback.text}</p>
            
            {feedback.suggestion && (
              <div className="feedback-suggestion">
                <strong>Suggestion:</strong>
                <p>{feedback.suggestion}</p>
              </div>
            )}
          </div>

          {/* User Notes Section */}
          {onNoteChange && (
            <div className="feedback-notes">
              <label 
                htmlFor={`note-${feedback.id}`}
                className="notes-label"
              >
                Your Notes:
              </label>
              <textarea
                id={`note-${feedback.id}`}
                className="notes-textarea"
                placeholder="Add your own notes or thoughts about this feedback..."
                value={note}
                onChange={handleNoteChange}
                rows={3}
                aria-label={`Notes for ${categoryName} feedback`}
              />
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default FeedbackCard
