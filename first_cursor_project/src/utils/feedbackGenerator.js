// feedbackGenerator.js - Core logic for generating UX feedback based on wireframe descriptions
// Handles keyword extraction, category selection, persona filtering, and feedback generation
// Deterministic: same (description + image dimensions + persona) always yields the same cards.

import { feedbackPhrases } from '../data/feedbackPhrases.js'

/**
 * Simple string hash for deterministic seeding (fast, no crypto dependency).
 * @param {string} str - Input string
 * @returns {number} - Non-negative integer hash
 */
function simpleHash(str) {
  const s = String(str ?? '')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Compute a deterministic seed from current inputs so same input always gives same feedback set.
 * @param {string} description - Wireframe description
 * @param {Object|null} imageData - Image metadata (width, height)
 * @param {string} persona - Selected persona
 * @returns {number} - Seed number
 */
function getInputSeed(description, imageData, persona) {
  const desc = String(description ?? '').trim()
  const imageId = imageData && imageData.width != null && imageData.height != null
    ? `${imageData.width}-${imageData.height}`
    : ''
  const p = String(persona ?? '')
  return simpleHash(desc + '|' + imageId + '|' + p)
}

/**
 * Classify phrase style by content so we can restrict by persona (no changes to feedbackPhrases.js).
 * Stakeholder-style: metrics, conversion, ROI, retention, etc.
 * Accessibility Expert-style: WCAG SC references, success criteria.
 * Generic: neither of the above (for End-User and General Designer).
 */
function isStakeholderStyle(phrase) {
  const s = `${phrase.text || ''} ${phrase.suggestion || ''}`.toLowerCase()
  return /conversion|retention|metrics|roi|funnel|completion rate|abandonment|bounce|drop off|industry avg|viewport benchmarks|exit rate|value props|\d+%\s*(lift|fewer|per)/i.test(s)
}

function isAccessibilityExpertStyle(phrase) {
  const s = `${phrase.text || ''} ${phrase.suggestion || ''}`.toLowerCase()
  return /wcag|sc\s*1\.|sc\s*2\.|sc\s*3\.|4\.5:1|focus order|focus visible|target size|reflow|labels or instructions|use of color|info and relationships/i.test(s)
}

function isGenericStyle(phrase) {
  return !isStakeholderStyle(phrase) && !isAccessibilityExpertStyle(phrase)
}

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
 * Select feedback phrases deterministically from relevant categories, filtered by persona style.
 * Same (categories + persona + seed) always returns the same set. Shows 6–8 high-relevance cards.
 * @param {Array<string>} categories - Categories to select from
 * @param {number} count - Optional target count (otherwise 6–8 from seed)
 * @param {string} persona - Selected persona (determines which phrase styles are allowed)
 * @param {number} seed - Deterministic seed (from description + image + persona)
 * @returns {Array} - Array of feedback objects with stable IDs
 */
function selectRandomPhrases(categories, count = null, persona = 'General Designer', seed = 0) {
  // Filter phrases by relevant categories
  let relevantPhrases = feedbackPhrases.filter(phrase =>
    categories.includes(phrase.category)
  )

  // Restrict to persona-appropriate phrase styles (no UI/data changes — selection only)
  if (persona === 'Stakeholder') {
    relevantPhrases = relevantPhrases.filter(isStakeholderStyle)
    if (relevantPhrases.length === 0) {
      relevantPhrases = feedbackPhrases.filter(p => categories.includes(p.category) && isGenericStyle(p))
    }
  } else if (persona === 'Accessibility Expert') {
    relevantPhrases = relevantPhrases.filter(isAccessibilityExpertStyle)
    if (relevantPhrases.length === 0) {
      relevantPhrases = feedbackPhrases.filter(p => categories.includes(p.category) && isGenericStyle(p))
    }
  } else {
    // End-User, General Designer: only generic (no metrics, no WCAG)
    relevantPhrases = relevantPhrases.filter(isGenericStyle)
    if (relevantPhrases.length === 0) {
      relevantPhrases = feedbackPhrases.filter(p => categories.includes(p.category))
    }
  }

  if (relevantPhrases.length === 0) {
    const fallback = feedbackPhrases.slice(0, Math.min(4, feedbackPhrases.length))
    return fallback.map((p, i) => ({
      ...p,
      id: `feedback-${seed}-fallback-${i}`
    }))
  }

  // Deterministic order: sort by hash(phrase text + seed) so same seed => same order
  const ordered = [...relevantPhrases].sort((a, b) => {
    const ha = simpleHash((a.text || '') + seed)
    const hb = simpleHash((b.text || '') + seed)
    return ha - hb || 0
  })

  // Target 6–8 cards (deterministic per seed)
  const targetCount = count ?? (6 + (seed % 3))
  const selectedCount = Math.min(Math.max(6, targetCount), 8, ordered.length)
  const selected = ordered.slice(0, selectedCount)

  return selected.map((phrase, index) => ({
    ...phrase,
    id: `feedback-${seed}-${index}`
  }))
}

/**
 * Generate feedback based on image data (if provided). Deterministic: same image + persona + seed => same choice.
 * @param {Object|null} imageData - Image metadata (width, height, aspectRatio, etc.)
 * @param {string} persona - Selected persona (for phrase style filter)
 * @param {number} seed - Deterministic seed
 * @returns {Array} - Array of additional feedback objects related to image/mobile
 */
function generateImageBasedFeedback(imageData, persona = 'General Designer', seed = 0) {
  const additionalFeedbacks = []

  if (!imageData) {
    return additionalFeedbacks
  }

  if (imageData.width && imageData.height) {
    const aspectRatio = imageData.width / imageData.height

    if (aspectRatio < 1 || imageData.width < 768) {
      let mobilePhrases = feedbackPhrases.filter(p => p.category === 'mobile')
      if (persona === 'Stakeholder') {
        mobilePhrases = mobilePhrases.filter(isStakeholderStyle)
        if (mobilePhrases.length === 0) mobilePhrases = feedbackPhrases.filter(p => p.category === 'mobile' && isGenericStyle(p))
      } else if (persona === 'Accessibility Expert') {
        mobilePhrases = mobilePhrases.filter(isAccessibilityExpertStyle)
        if (mobilePhrases.length === 0) mobilePhrases = feedbackPhrases.filter(p => p.category === 'mobile' && isGenericStyle(p))
      } else {
        mobilePhrases = mobilePhrases.filter(isGenericStyle)
        if (mobilePhrases.length === 0) mobilePhrases = feedbackPhrases.filter(p => p.category === 'mobile')
      }
      if (mobilePhrases.length > 0) {
        const index = Math.abs(seed % mobilePhrases.length)
        const chosen = mobilePhrases[index]
        additionalFeedbacks.push({
          ...chosen,
          id: `feedback-image-mobile-${seed}`
        })
      }
    }

    if (imageData.width > 1920) {
      additionalFeedbacks.push({
        text: "Consider how this large layout adapts to smaller screens and mobile devices.",
        category: "mobile",
        type: "issue",
        suggestion: "Ensure responsive breakpoints are implemented and test the layout at various screen sizes.",
        id: `feedback-image-responsive-${seed}`
      })
    }
  }

  return additionalFeedbacks
}

/**
 * Main function: Generate feedback based on description, image, and persona.
 * Deterministic: same inputs always produce the same set of 6–8 cards.
 * @param {string} description - Wireframe description
 * @param {Object|null} imageData - Image metadata (optional)
 * @param {string} persona - Selected persona
 * @returns {Array} - Array of feedback objects ready to display
 */
export function generateFeedback(description = '', imageData = null, persona = 'General Designer') {
  const seed = getInputSeed(description, imageData, persona)
  const keywords = extractKeywords(description)
  let categories = selectRelevantCategories(keywords)

  // Accessibility Expert needs accessibility and mobile in the pool so WCAG phrases can be selected
  if (persona === 'Accessibility Expert') {
    const extra = ['accessibility', 'mobile'].filter(c => !categories.includes(c))
    categories = [...categories, ...extra]
  }

  let feedbacks = selectRandomPhrases(categories, null, persona, seed)

  if (imageData) {
    const imageFeedbacks = generateImageBasedFeedback(imageData, persona, seed)
    feedbacks = [...feedbacks, ...imageFeedbacks]
  }

  // Remove duplicates based on feedback text (prevent duplicate content)
  const seenTexts = new Set()
  feedbacks = feedbacks.filter(feedback => {
    const textKey = feedback.text.toLowerCase().trim()
    if (seenTexts.has(textKey)) {
      return false
    }
    seenTexts.add(textKey)
    return true
  })

  // Filter and prioritize by persona
  feedbacks = filterByPersona(feedbacks, persona)

  // Limit to 8 feedbacks maximum (show 6–8 relevant cards)
  if (feedbacks.length > 8) {
    feedbacks = feedbacks.slice(0, 8)
  }

  // Ensure minimum of 6 feedbacks (if possible), using deterministic fallback
  if (feedbacks.length < 6 && feedbackPhrases.length >= 6) {
    const remaining = 6 - feedbacks.length
    const usedTexts = new Set(feedbacks.map(f => (f.text || '').toLowerCase().trim()))
    let pool = feedbackPhrases.filter(p => !usedTexts.has((p.text || '').toLowerCase().trim()))
    if (persona === 'Stakeholder') {
      pool = pool.filter(isStakeholderStyle)
      if (pool.length === 0) pool = feedbackPhrases.filter(p => !usedTexts.has((p.text || '').toLowerCase().trim()) && isGenericStyle(p))
    } else if (persona === 'Accessibility Expert') {
      pool = pool.filter(isAccessibilityExpertStyle)
      if (pool.length === 0) pool = feedbackPhrases.filter(p => !usedTexts.has((p.text || '').toLowerCase().trim()) && isGenericStyle(p))
    } else {
      pool = pool.filter(isGenericStyle)
      if (pool.length === 0) pool = feedbackPhrases.filter(p => !usedTexts.has((p.text || '').toLowerCase().trim()))
    }
    // Deterministic order for fallback
    const ordered = [...pool].sort((a, b) => {
      const ha = simpleHash((a.text || '') + seed + 'fallback')
      const hb = simpleHash((b.text || '') + seed + 'fallback')
      return ha - hb || 0
    })
    const additional = ordered.slice(0, remaining).map((p, i) => ({
      ...p,
      id: `feedback-fallback-${seed}-${i}`
    }))
    feedbacks = [...feedbacks, ...additional]
  }

  return feedbacks
}

// ====================================
// TEST EXAMPLES (commented out)
// Uncomment these to test the generator in isolation
// ====================================

// Example 1: Basic feedback generation with form-related description
// const testDescription1 = "Login page with email field and button"
// const testFeedbacks1 = generateFeedback(testDescription1, null, 'End-User')
// console.log('Test 1 - Form description:', testFeedbacks1)
// console.log('Test 1 - Keywords:', extractKeywords(testDescription1))
// console.log('Test 1 - Categories:', selectRelevantCategories(extractKeywords(testDescription1)))

// Example 2: Navigation-focused description with image data
// const testDescription2 = "Website with navigation menu in header and sidebar links"
// const testImageData2 = { width: 375, height: 667, aspectRatio: 0.56 } // Mobile portrait
// const testFeedbacks2 = generateFeedback(testDescription2, testImageData2, 'Accessibility Expert')
// console.log('Test 2 - Navigation + mobile image:', testFeedbacks2)
// console.log('Test 2 - Persona focus:', 'Accessibility Expert')

// Example 3: Generic description to test fallback behavior
// const testDescription3 = "Homepage layout with cards and sections"
// const testFeedbacks3 = generateFeedback(testDescription3, null, 'General Designer')
// console.log('Test 3 - Generic description:', testFeedbacks3)
// console.log('Test 3 - Count:', testFeedbacks3.length)

// Example 4: Test different personas with same description
// const testDescription4 = "Contact form with multiple input fields and a submit button"
// const personas = ['End-User', 'Stakeholder', 'Accessibility Expert', 'General Designer']
// personas.forEach(persona => {
//   const feedbacks = generateFeedback(testDescription4, null, persona)
//   const categories = feedbacks.map(f => f.category)
//   console.log(`${persona}:`, categories.join(', '))
// })
