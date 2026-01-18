/**
 * PersonaSelector Component
 * 
 * Allows user to select a persona for feedback generation.
 * Different personas focus on different aspects:
 * - End-User: Usability and ease of use
 * - Stakeholder: Business value and conversion
 * - Accessibility Expert: WCAG compliance and inclusivity
 * - General Designer: Balanced design principles
 */
function PersonaSelector({ selectedPersona, onPersonaChange }) {
  const personas = [
    'End-User',
    'Stakeholder',
    'Accessibility Expert',
    'General Designer'
  ]

  return (
    <div className="persona-selector-container">
      <label htmlFor="persona-select" className="persona-label">
        Select Feedback Persona:
      </label>
      <select
        id="persona-select"
        className="persona-select"
        value={selectedPersona}
        onChange={(e) => onPersonaChange(e.target.value)}
      >
        {personas.map((persona) => (
          <option key={persona} value={persona}>
            {persona}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PersonaSelector
