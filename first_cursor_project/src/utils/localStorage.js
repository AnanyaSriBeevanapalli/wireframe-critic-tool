// localStorage.js - Session persistence utilities for AI Wireframe Critic
// Handles saving and loading app state to/from browser localStorage

const STORAGE_KEY = 'wireframeCriticSession'
const CURRENT_VERSION = 1 // Increment this if the state structure changes significantly

/**
 * Structure of saved session state:
 * {
 *   version: number,           // Version for compatibility checking
 *   description: string,       // Wireframe description text
 *   imageData: object|null,    // Analyzed image metadata (width, height, aspectRatio, etc.)
 *   selectedPersona: string,   // Selected persona name
 *   feedbacks: array,          // Generated feedback objects
 *   lastGeneratedDescription: string,  // Last description used for generation
 *   lastGeneratedImageIdentifier: string|null  // Last image identifier used
 * }
 */

/**
 * Save current app state to localStorage
 * @param {Object} state - State object containing app data to save
 * @param {string} state.description - Wireframe description
 * @param {Object|null} state.imageData - Analyzed image data
 * @param {string} state.selectedPersona - Selected persona
 * @param {Array} state.feedbacks - Generated feedbacks array
 * @param {string} state.lastGeneratedDescription - Last generated description
 * @param {string|null} state.lastGeneratedImageIdentifier - Last image identifier
 * @returns {boolean} - True if save was successful, false otherwise
 */
export function saveSession(state) {
  try {
    // Prepare session data with version
    const sessionData = {
      version: CURRENT_VERSION,
      description: state.description || '',
      imageData: state.imageData || null,
      selectedPersona: state.selectedPersona || 'General Designer',
      feedbacks: state.feedbacks || [],
      lastGeneratedDescription: state.lastGeneratedDescription || '',
      lastGeneratedImageIdentifier: state.lastGeneratedImageIdentifier || null
    }

    // Stringify and save to localStorage
    const serialized = JSON.stringify(sessionData)
    localStorage.setItem(STORAGE_KEY, serialized)
    
    return true
  } catch (error) {
    // Handle errors gracefully (e.g., quota exceeded, storage disabled)
    console.error('Failed to save session to localStorage:', error)
    return false
  }
}

/**
 * Load saved session state from localStorage
 * @returns {Object|null} - Saved state object, or null if not found or invalid
 * Returns object with same structure as saveSession expects:
 * { version, description, imageData, selectedPersona, feedbacks, 
 *   lastGeneratedDescription, lastGeneratedImageIdentifier }
 */
export function loadSession() {
  try {
    // Retrieve from localStorage
    const serialized = localStorage.getItem(STORAGE_KEY)
    
    // Return null if nothing saved
    if (!serialized) {
      return null
    }

    // Parse JSON
    const sessionData = JSON.parse(serialized)

    // Validate version (for future compatibility)
    // If version mismatch, return null to avoid loading incompatible data
    if (sessionData.version !== CURRENT_VERSION) {
      console.warn(`Session version mismatch. Expected ${CURRENT_VERSION}, got ${sessionData.version}. Clearing session.`)
      clearSession() // Clean up old data
      return null
    }

    // Validate structure has required fields
    if (typeof sessionData !== 'object' || sessionData === null) {
      console.warn('Invalid session data structure. Clearing session.')
      clearSession()
      return null
    }

    // Return parsed data with defaults for missing fields
    return {
      version: sessionData.version || CURRENT_VERSION,
      description: sessionData.description || '',
      imageData: sessionData.imageData || null,
      selectedPersona: sessionData.selectedPersona || 'General Designer',
      feedbacks: sessionData.feedbacks || [],
      lastGeneratedDescription: sessionData.lastGeneratedDescription || '',
      lastGeneratedImageIdentifier: sessionData.lastGeneratedImageIdentifier || null
    }
  } catch (error) {
    // Handle JSON parse errors or other issues
    console.error('Failed to load session from localStorage:', error)
    
    // Clear corrupted data
    clearSession()
    return null
  }
}

/**
 * Clear saved session from localStorage
 * Removes the session data completely
 * @returns {boolean} - True if clear was successful, false otherwise
 */
export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error)
    return false
  }
}

/**
 * Check if a saved session exists
 * @returns {boolean} - True if session exists in localStorage
 */
export function hasSession() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch (error) {
    return false
  }
}
