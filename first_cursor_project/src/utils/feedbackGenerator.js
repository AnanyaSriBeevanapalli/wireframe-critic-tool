// feedbackGenerator.js - Core logic for generating UX feedback based on wireframe descriptions
// Handles keyword extraction, category selection, persona filtering, and feedback generation

import { feedbackPhrases } from '../data/feedbackPhrases.js'

/**
 * Extract relevant keywords from the wireframe description using regex patterns
 * @param {string} description - The wireframe description text
 * @returns {Array<string>} - Array of detected keywords
 */
export function extractKeywords(description) {
  if (!description || typeof description !== 'string') {
    return []
  }

  const normalizedDescription = description.toLowerCase()
  const keywords = []

  // Navigation keywords
  const navPattern = /\b(nav|navigation|menu|header|footer|sidebar|breadcrumb|link|links)\b/gi
  if (navPattern.test(description)) {
    keywords.push('navigation')
  }

  // Form keywords
  const formPattern = /\b(form|input|field|fields|button|buttons|submit|textbox|textarea|checkbox|radio|dropdown|select)\b/gi
  if (formPattern.test(description)) {
    keywords.push('form')
  }

  // Layout/Hierarchy keywords
  const layoutPattern = /\b(layout|grid|column|columns|row|card|cards|section|group|hierarchy|heading|headings|title|titles)\b/gi
  if (layoutPattern.test(description)) {
    keywords.push('hierarchy')
  }

  // Mobile/Responsive keywords
  const mobilePattern = /\b(mobile|responsive|breakpoint|breakpoints|touch|tap|screen|viewport|device)\b/gi
  if (mobilePattern.test(description)) {
    keywords.push('mobile')
  }

  // Usability keywords (broad category - catch-all for general UX)
  const usabilityPattern = /\b(click|interaction|action|cta|call.to.action|user|users|interface|ui|ux|experience)\b/gi
  if (usabilityPattern.test(description)) {
    keywords.push('usability')
  }

  // Accessibility keywords
  const accessibilityPattern = /\b(accessibility|accessible|a11y|screen.reader|keyboard|contrast|color|blind|vision|disability)\b/gi
  if (accessibilityPattern.test(description)) {
    keywords.push('accessibility')
  }

  return [...new Set(keywords)] // Remove duplicates
}

/**
 * Select relevant categories based on extracted keywords
 * Also includes some default categories to ensure variety
 * @param {Array<string>} keywords - Keywords extracted from description
 * @returns {Array<string>} - Categories to focus on for feedback generation
 */
export function selectRelevantCategories(keywords) {
  const categories = ['usability', 'hierarchy', 'accessibility', 'navigation', 'form', 'mobile']
  
  // If we have keywords, use those categories
  if (keywords.length > 0) {
    const keywordCategories = keywords
    // Always include 'usability' and 'hierarchy' as they're relevant to most wireframes
    const defaultCategories = ['usability', 'hierarchy']
    const combined = [...new Set([...keywordCategories, ...defaultCategories])]
    return combined
  }

  // If no keywords detected, use a balanced mix
  return ['usability', 'hierarchy']
}

/**
 * Filter and prioritize feedback based on selected persona
 * Different personas focus on different aspects of UX
 * @param {Array} feedbacks - Array of feedback objects
 * @param {string} persona - Selected persona name
 * @returns {Array} - Filtered/sorted feedback array
 */
export function filterByPersona(feedbacks, persona) {
  if (!feedbacks || feedbacks.length === 0) {
    return feedbacks
  }

  // Define category priorities for each persona
  const personaPriorities = {
    'End-User': {
      preferred: ['usability', 'navigation', 'mobile'],
      weight: 1.5 // Increase weight for preferred categories
    },
    'Stakeholder': {
      preferred: ['usability', 'hierarchy'],
      weight: 1.3
    },
    'Accessibility Expert': {
      preferred: ['accessibility', 'mobile'],
      weight: 2.0 // Strong focus on accessibility
    },
    'General Designer': {
      preferred: ['hierarchy', 'usability', 'navigation'],
      weight: 1.2
    }
  }

  const priorities = personaPriorities[persona] || personaPriorities['General Designer']

  // Sort feedbacks: preferred categories first, then by type (issues before positives)
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    const aIsPreferred = priorities.preferred.includes(a.category)
    const bIsPreferred = priorities.preferred.includes(b.category)

    // Preferred categories come first
    if (aIsPreferred && !bIsPreferred) return -1
    if (!aIsPreferred && bIsPreferred) return 1

    // Within same priority, issues come before positives
    if (a.type === 'issue' && b.type === 'positive') return -1
    if (a.type === 'positive' && b.type === 'issue') return 1

    return 0
  })

  return sortedFeedbacks
}

/**
 * Select random feedback phrases from relevant categories
 * Ensures variety by selecting different phrases each time
 * @param {Array<string>} categories - Categories to select from
 * @param {number} count - Number of feedback items to generate (default: 4-6)
 * @returns {Array} - Array of feedback objects with unique IDs
 */
function selectRandomPhrases(categories, count = null) {
  // Filter phrases by relevant categories
  const relevantPhrases = feedbackPhrases.filter(phrase => 
    categories.includes(phrase.category)
  )

  if (relevantPhrases.length === 0) {
    // Fallback: use all phrases if no category match
    return feedbackPhrases.slice(0, Math.min(4, feedbackPhrases.length))
  }

  // Determine how many feedbacks to generate (4-6, or use provided count)
  const targetCount = count || Math.floor(Math.random() * 3) + 4 // Random between 4-6
  const selectedCount = Math.min(targetCount, relevantPhrases.length)

  // Randomly select phrases (with shuffling to ensure variety)
  const shuffled = [...relevantPhrases].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, selectedCount)

  // Add unique IDs to each feedback for React keys
  return selected.map((phrase, index) => ({
    ...phrase,
    id: `feedback-${Date.now()}-${index}` // Unique ID based on timestamp and index
  }))
}

/**
 * Generate feedback based on image data (if provided)
 * Adds mobile/responsive feedback if image dimensions indicate mobile concerns
 * @param {Object|null} imageData - Image metadata (width, height, aspectRatio, etc.)
 * @returns {Array} - Array of additional feedback objects related to image/mobile
 */
function generateImageBasedFeedback(imageData) {
  const additionalFeedbacks = []

  if (!imageData) {
    return additionalFeedbacks
  }

  // Check if image suggests mobile-related concerns
  if (imageData.width && imageData.height) {
    const aspectRatio = imageData.width / imageData.height

    // If image is portrait-oriented or small, likely mobile-focused
    if (aspectRatio < 1 || imageData.width < 768) {
      // Add mobile-specific feedback
      const mobilePhrases = feedbackPhrases.filter(p => p.category === 'mobile')
      if (mobilePhrases.length > 0) {
        const randomMobilePhrase = mobilePhrases[Math.floor(Math.random() * mobilePhrases.length)]
        additionalFeedbacks.push({
          ...randomMobilePhrase,
          id: `feedback-image-mobile-${Date.now()}`
        })
      }
    }

    // If image is very large, suggest responsiveness concerns
    if (imageData.width > 1920) {
      additionalFeedbacks.push({
        text: "Consider how this large layout adapts to smaller screens and mobile devices.",
        category: "mobile",
        type: "issue",
        suggestion: "Ensure responsive breakpoints are implemented and test the layout at various screen sizes.",
        id: `feedback-image-responsive-${Date.now()}`
      })
    }
  }

  return additionalFeedbacks
}

/**
 * Main function: Generate feedback based on description, image, and persona
 * Combines all the logic above to produce final feedback array
 * @param {string} description - Wireframe description
 * @param {Object|null} imageData - Image metadata (optional)
 * @param {string} persona - Selected persona
 * @returns {Array} - Array of feedback objects ready to display
 */
export function generateFeedback(description = '', imageData = null, persona = 'General Designer') {
  // Step 1: Extract keywords from description
  const keywords = extractKeywords(description)

  // Step 2: Select relevant categories based on keywords
  const categories = selectRelevantCategories(keywords)

  // Step 3: Select random phrases from relevant categories
  // Generate 4-6 feedbacks (randomized count for variety)
  let feedbacks = selectRandomPhrases(categories)

  // Step 4: Add image-based feedback if image data is provided
  if (imageData) {
    const imageFeedbacks = generateImageBasedFeedback(imageData)
    feedbacks = [...feedbacks, ...imageFeedbacks]
  }

  // Step 5: Filter and prioritize by persona
  feedbacks = filterByPersona(feedbacks, persona)

  // Step 6: Limit to 6 feedbacks maximum for clean display
  if (feedbacks.length > 6) {
    feedbacks = feedbacks.slice(0, 6)
  }

  // Ensure minimum of 4 feedbacks (if possible)
  if (feedbacks.length < 4 && feedbackPhrases.length >= 4) {
    // Fill with random phrases if needed
    const remaining = 4 - feedbacks.length
    const allCategories = feedbackPhrases.filter(p => !feedbacks.some(f => f.id === p.id))
    const shuffled = [...allCategories].sort(() => Math.random() - 0.5)
    const additional = shuffled.slice(0, remaining).map((p, i) => ({
      ...p,
      id: `feedback-fallback-${Date.now()}-${i}`
    }))
    feedbacks = [...feedbacks, ...additional]
  }

  return feedbacks
}
