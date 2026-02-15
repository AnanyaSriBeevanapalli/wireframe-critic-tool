// nextTestStepsGenerator.js - Rule-based suggestions for real user testing
// Derives 3–5 actionable bullets from feedback categories and selected persona.

const CATEGORY_LABELS = {
  form: 'form and input design',
  navigation: 'navigation and wayfinding',
  usability: 'overall usability and flow',
  hierarchy: 'visual hierarchy and layout',
  accessibility: 'accessibility and inclusive design',
  mobile: 'mobile and responsive behavior'
}

const PERSONA_TARGETS = {
  'End-User': 'Focus on new users (e.g. first-time visitors, 18–34) and task completion.',
  'Stakeholder': 'Focus on decision-makers and key user segments that drive conversion.',
  'Accessibility Expert': 'Include users with diverse abilities and assistive tech (screen reader, keyboard).',
  'General Designer': 'Focus on new users aged 18–34 and power users to compare behavior.'
}

const PERSONA_QUESTIONS = {
  'End-User': "Ask: \"Was the navigation intuitive? Could you complete the main task?\"",
  'Stakeholder': "Ask: \"Does this support your goals? Where would you drop off?\"",
  'Accessibility Expert': "Ask: \"Could you complete core tasks with your preferred technology?\"",
  'General Designer': "Ask: \"Was the hierarchy clear? Did the layout support the task?\""
}

/**
 * Generate 3–5 short, actionable "Next Steps for Real User Testing" from feedback and persona.
 * Rule-based: prioritizes top issue categories, adds persona-specific target + sample question,
 * and device/method hints when relevant.
 * @param {Array} feedbacks - Array of feedback objects { category, type }
 * @param {string} persona - Selected persona name
 * @returns {string[]} - Array of suggestion strings (3–5 items)
 */
export function generateNextTestSteps(feedbacks, persona) {
  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    return [
      'Run a short usability test with 3–5 participants.',
      PERSONA_TARGETS[persona] || PERSONA_TARGETS['General Designer'],
      PERSONA_QUESTIONS[persona] || PERSONA_QUESTIONS['General Designer']
    ]
  }

  const suggestions = []
  const issues = feedbacks.filter(f => f.type === 'issue')
  const byCategory = {}
  for (const f of feedbacks) {
    const cat = (f.category || 'usability').toLowerCase()
    if (!byCategory[cat]) byCategory[cat] = { issues: 0, strengths: 0 }
    if (f.type === 'issue') byCategory[cat].issues += 1
    else byCategory[cat].strengths += 1
  }

  // 1) Focus areas: top 1–2 issue categories
  const sortedCategories = Object.entries(byCategory)
    .filter(([, counts]) => counts.issues > 0)
    .sort((a, b) => b[1].issues - a[1].issues)

  if (sortedCategories.length > 0) {
    const top = sortedCategories[0]
    const label = CATEGORY_LABELS[top[0]] || top[0]
    suggestions.push(`Prioritize testing ${label} (${top[1].issues} issue${top[1].issues > 1 ? 's' : ''} in feedback).`)
  }
  if (sortedCategories.length > 1) {
    const second = sortedCategories[1]
    const label = CATEGORY_LABELS[second[0]] || second[0]
    suggestions.push(`Also validate ${label}.`)
  }

  // 2) Sample question (persona-based)
  const question = PERSONA_QUESTIONS[persona] || PERSONA_QUESTIONS['General Designer']
  if (!suggestions.includes(question)) {
    suggestions.push(question)
  }

  // 3) Target users (persona-based)
  const target = PERSONA_TARGETS[persona] || PERSONA_TARGETS['General Designer']
  if (!suggestions.includes(target)) {
    suggestions.push(target)
  }

  // 4) Device/method: if mobile or form in feedback, add hint
  const categoriesPresent = new Set(feedbacks.map(f => (f.category || '').toLowerCase()))
  if (categoriesPresent.has('mobile')) {
    suggestions.push('Test on mobile first, then desktop.')
  } else if (categoriesPresent.has('form')) {
    suggestions.push('Test form flows on both mobile and desktop.')
  }

  // Cap at 5, ensure at least 3
  const unique = [...new Set(suggestions)]
  if (unique.length > 5) return unique.slice(0, 5)
  if (unique.length < 3) {
    const fallbacks = ['Run a short usability test with 3–5 participants.', 'Capture where users hesitate or get stuck.']
    for (const f of fallbacks) {
      if (unique.length >= 5) break
      if (!unique.includes(f)) unique.push(f)
    }
  }
  return unique.slice(0, 5)
}
