// feedbackPhrases.js - Mock UX feedback phrases used for simulated wireframe critique
// Contains categorized feedback phrases that will be selected based on wireframe description keywords

export const feedbackPhrases = [
    // ============ USABILITY CATEGORY ============
    {
      text: "The button text is clear and action-oriented, making the primary action obvious to users.",
      category: "usability",
      type: "positive",
      suggestion: null
    },
    {
      text: "The call-to-action button lacks sufficient visual hierarchy and may be overlooked.",
      category: "usability",
      type: "issue",
      suggestion: "Consider using a contrasting color and larger size to draw attention to the primary action."
    },
    {
      text: "Information density is well-balanced—not overwhelming, allowing users to scan content easily.",
      category: "usability",
      type: "positive",
      suggestion: null
    },
    {
      text: "The layout feels cluttered with too many elements competing for attention.",
      category: "usability",
      type: "issue",
      suggestion: "Apply the 80/20 rule: highlight the most important 20% of content and de-emphasize the rest using whitespace."
    },
    {
      text: "Progressive disclosure is implemented effectively—showing only essential information upfront.",
      category: "usability",
      type: "positive",
      suggestion: null
    },
    {
      text: "Critical information is buried below the fold, requiring unnecessary scrolling.",
      category: "usability",
      type: "issue",
      suggestion: "Move key actions and value propositions above the fold for better visibility."
    },
  
    // ============ HIERARCHY CATEGORY ============
    {
      text: "Visual hierarchy is clear—headings, body text, and actions are well-distinguished.",
      category: "hierarchy",
      type: "positive",
      suggestion: null
    },
    {
      text: "Typography hierarchy is weak; heading sizes don't create clear distinction between levels.",
      category: "hierarchy",
      type: "issue",
      suggestion: "Establish a clear type scale with at least 2:1 ratio between heading levels for better scanning."
    },
    {
      text: "Color and spacing effectively guide the eye to important elements in the correct order.",
      category: "hierarchy",
      type: "positive",
      suggestion: null
    },
    {
      text: "Multiple elements have equal visual weight, making it unclear where users should focus first.",
      category: "hierarchy",
      type: "issue",
      suggestion: "Use size, contrast, and positioning to create a clear focal point—the Z-pattern or F-pattern reading flow."
    },
    {
      text: "The wireframe demonstrates strong information architecture with logical grouping of related elements.",
      category: "hierarchy",
      type: "positive",
      suggestion: null
    },
    {
      text: "Related content is scattered across the layout, breaking mental models of grouping.",
      category: "hierarchy",
      type: "issue",
      suggestion: "Group related elements using visual proximity (closer spacing) and containers to improve cognitive load."
    },
  
    // ============ ACCESSIBILITY CATEGORY ============
    {
      text: "Form fields have clear labels positioned appropriately for screen reader users.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
    {
      text: "Color is used as the sole indicator of important information, which fails accessibility standards.",
      category: "accessibility",
      type: "issue",
      suggestion: "Combine color with text labels, icons, or patterns to ensure information is perceivable by all users."
    },
    {
      text: "Interactive elements appear large enough for easy tapping and have adequate spacing.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
    {
      text: "Text contrast may be insufficient for users with low vision; dark gray on light gray is problematic.",
      category: "accessibility",
      type: "issue",
      suggestion: "Ensure text meets WCAG AA standards: 4.5:1 contrast ratio for normal text, 3:1 for large text."
    },
    {
      text: "The wireframe considers keyboard navigation with a logical tab order.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
  
    // ============ NAVIGATION CATEGORY ============
    {
      text: "Navigation placement is intuitive and follows common web conventions.",
      category: "navigation",
      type: "positive",
      suggestion: null
    },
    {
      text: "The navigation structure is unclear—users may struggle to understand their location and next steps.",
      category: "navigation",
      type: "issue",
      suggestion: "Consider adding breadcrumbs, clear section labels, or a 'You are here' indicator to improve wayfinding."
    },
    {
      text: "Primary navigation items are concise and use language familiar to the target audience.",
      category: "navigation",
      type: "positive",
      suggestion: null
    },
    {
      text: "Too many navigation options create decision paralysis—the paradox of choice.",
      category: "navigation",
      type: "issue",
      suggestion: "Limit top-level navigation to 5-7 items. Group secondary options in a clear menu hierarchy."
    },
    {
      text: "The back button and exit paths are clearly defined, supporting user exploration.",
      category: "navigation",
      type: "positive",
      suggestion: null
    },
  
    // ============ FORM CATEGORY ============
    {
      text: "Form fields are organized logically with related inputs grouped together.",
      category: "form",
      type: "positive",
      suggestion: null
    },
    {
      text: "Required fields are not clearly marked, which may lead to form submission errors.",
      category: "form",
      type: "issue",
      suggestion: "Use asterisks (*) or 'required' labels, and consider inline validation for better user feedback."
    },
    {
      text: "The form uses appropriate input types (email, password) which improves mobile UX and validation.",
      category: "form",
      type: "positive",
      suggestion: null
    },
    {
      text: "Error states are not considered—users won't know what went wrong if validation fails.",
      category: "form",
      type: "issue",
      suggestion: "Design error messages that are specific, actionable, and placed near the relevant field."
    },
    {
      text: "The form length is reasonable; breaking multi-step forms into stages would reduce abandonment.",
      category: "form",
      type: "issue",
      suggestion: "If the form has more than 5-7 fields, consider a multi-step wizard with progress indicators."
    },
  
    // ============ MOBILE CATEGORY ============
    {
      text: "The layout adapts well to smaller screens with appropriate touch target sizes (minimum 44x44px).",
      category: "mobile",
      type: "positive",
      suggestion: null
    },
    {
      text: "Text appears too small on mobile devices and may require pinch-to-zoom, harming usability.",
      category: "mobile",
      type: "issue",
      suggestion: "Ensure body text is at least 16px on mobile to prevent automatic zooming and improve readability."
    },
    {
      text: "The mobile layout prioritizes content effectively, hiding less critical elements.",
      category: "mobile",
      type: "positive",
      suggestion: null
    },
    {
      text: "Horizontal scrolling is required, which breaks mobile UX patterns and frustrates users.",
      category: "mobile",
      type: "issue",
      suggestion: "Ensure all content fits within the viewport width. Use responsive breakpoints and flexible layouts."
    },
    {
      text: "Thumb-friendly navigation placement makes the interface easy to use one-handed.",
      category: "mobile",
      type: "positive",
      suggestion: null
    },
    {
      text: "Images and media may not be optimized for mobile data consumption and slow connections.",
      category: "mobile",
      type: "issue",
      suggestion: "Consider lazy loading, responsive images, and providing low-bandwidth alternatives."
    }
  ]