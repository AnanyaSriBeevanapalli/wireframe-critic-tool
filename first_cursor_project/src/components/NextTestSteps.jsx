import { useState } from 'react'

/**
 * NextTestSteps Component
 *
 * Compact, collapsible "Next Steps for Real User Testing" section shown below the feedback grid.
 * Header is clickable to expand/collapse; collapsed height kept small (~100–150px).
 */
function NextTestSteps({ suggestions = [], defaultExpanded = false, 'data-testid': dataTestId }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!suggestions || suggestions.length === 0) return null

  const handleToggle = () => setIsExpanded(prev => !prev)

  return (
    <div
      className="next-test-steps"
      data-testid={dataTestId || 'next-test-steps'}
      role="region"
      aria-label="Next steps for real user testing"
    >
      <button
        type="button"
        className="next-test-steps-header"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls="next-test-steps-content"
        id="next-test-steps-toggle"
      >
        <span className="next-test-steps-title">Next Steps for Real User Testing</span>
        <span className="next-test-steps-chevron" aria-hidden="true">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      <div
        id="next-test-steps-content"
        className={`next-test-steps-content ${isExpanded ? 'next-test-steps-content--expanded' : ''}`}
        hidden={!isExpanded}
      >
        <ul className="next-test-steps-list">
          {suggestions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NextTestSteps
