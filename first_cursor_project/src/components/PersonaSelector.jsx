/**
 * PersonaSelector Component
 * 
 * Allows user to select a persona for feedback generation using radio buttons.
 * Different personas focus on different aspects of UX feedback.
 * 
 * @param {string} selectedPersona - Currently selected persona name
 * @param {Function} onPersonaChange - Callback when persona selection changes
 */
function PersonaSelector({ selectedPersona, onPersonaChange }) {
  // Persona definitions with descriptions
  const personas = [
    {
      id: 'End-User',
      name: 'End-User',
      description: 'Prioritizes usability, navigation, and ease of use'
    },
    {
      id: 'Stakeholder',
      name: 'Stakeholder',
      description: 'Focuses on business value, conversion, and metrics'
    },
    {
      id: 'Accessibility Expert',
      name: 'Accessibility Expert',
      description: 'Emphasizes WCAG compliance, inclusivity, and accessibility'
    },
    {
      id: 'General Designer',
      name: 'General Designer',
      description: 'Balanced perspective on design principles and best practices'
    }
  ]

  // Handle radio button change
  const handleChange = (personaId) => {
    onPersonaChange(personaId)
  }

  return (
    <div className="persona-selector-container">
      <fieldset className="persona-fieldset">
        <legend className="persona-legend">
          Select Feedback Persona
        </legend>
        <div 
          className="persona-radio-group" 
          role="radiogroup"
          aria-label="Feedback persona selection"
        >
          {personas.map((persona) => {
            const isSelected = selectedPersona === persona.id
            const inputId = `persona-${persona.id.toLowerCase().replace(/\s+/g, '-')}`
            
            return (
              <div key={persona.id} className="persona-radio-option">
                <input
                  type="radio"
                  id={inputId}
                  name="persona"
                  value={persona.id}
                  checked={isSelected}
                  onChange={() => handleChange(persona.id)}
                  className="persona-radio-input"
                  aria-describedby={`${inputId}-description`}
                />
                <label 
                  htmlFor={inputId} 
                  className="persona-radio-label"
                >
                  <span className="persona-name">{persona.name}</span>
                  <span 
                    id={`${inputId}-description`}
                    className="persona-description"
                  >
                    {persona.description}
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

export default PersonaSelector
