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
      text: "This unclear CTA could reduce conversion by 10–20% (industry avg). Consider stronger action-oriented copy.",
      category: "usability",
      type: "issue",
      suggestion: "A/B test button copy; 'Get started' and 'Start free trial' often outperform vague labels and improve conversion."
    },
    {
      text: "Prominent social proof section aligns with high-trust patterns (+15% conversion lift in similar flows).",
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
      text: "Progressive disclosure reduces cognitive load and supports higher completion rates in signup flows.",
      category: "usability",
      type: "positive",
      suggestion: null
    },
    {
      text: "Information buried below the fold typically sees 50% fewer engagements; key value props may be missed.",
      category: "usability",
      type: "issue",
      suggestion: "Move primary value proposition and CTA above the fold to align with viewport benchmarks."
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
      text: "Clear hierarchy supports faster time-to-decision and can improve funnel metrics and conversion.",
      category: "hierarchy",
      type: "positive",
      suggestion: null
    },
    {
      text: "Weak visual hierarchy can dilute CTA impact and hurt conversion; primary action should dominate.",
      category: "hierarchy",
      type: "issue",
      suggestion: "Use size and contrast so the main action has 2–3x visual weight over secondary elements."
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
      text: "Form labels are programmatically associated (WCAG SC 3.3.2 Labels or Instructions), supporting assistive tech.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
    {
      text: "Color alone conveys meaning here, failing WCAG SC 1.4.1 Use of Color; add icons or text.",
      category: "accessibility",
      type: "issue",
      suggestion: "Do not rely on color alone; pair with labels, patterns, or icons so information is available to all."
    },
    {
      text: "Semantic headings meet WCAG SC 1.3.1 Info and Relationships — excellent screen reader support.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
    {
      text: "Insufficient color contrast (fails WCAG SC 1.4.3 AA 4.5:1). Risk: excludes users with low vision.",
      category: "accessibility",
      type: "issue",
      suggestion: "Achieve at least 4.5:1 for normal text, 3:1 for large text; use a contrast checker before build."
    },
    {
      text: "Logical tab order supports WCAG SC 2.4.3 Focus Order and makes keyboard navigation predictable.",
      category: "accessibility",
      type: "positive",
      suggestion: null
    },
    {
      text: "Focus indicators may be missing or too subtle (WCAG SC 2.4.7 Focus Visible); keyboard users need clear focus.",
      category: "accessibility",
      type: "issue",
      suggestion: "Provide a visible focus ring (e.g. 2px outline) for all interactive elements in keyboard navigation."
    },
  
    // ============ NAVIGATION CATEGORY ============
    {
      text: "Navigation placement is intuitive and follows common web conventions.",
      category: "navigation",
      type: "positive",
      suggestion: null
    },
    {
      text: "Unclear navigation increases bounce risk; users who can't find next steps often drop off and hurt retention.",
      category: "navigation",
      type: "issue",
      suggestion: "Add breadcrumbs or a clear 'next step' CTA to improve wayfinding and reduce exit rate."
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
      text: "Logical form flow and appropriate input types support higher completion rates and lower abandonment.",
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
      text: "Long or unclear forms drive abandonment (e.g. 10–15% per extra field); consider shortening or staging.",
      category: "form",
      type: "issue",
      suggestion: "Use a multi-step form with progress indicator to improve completion rate and reduce perceived effort."
    },
  
    // ============ MOBILE CATEGORY ============
    {
      text: "Touch targets meet or exceed 44x44 CSS px, supporting WCAG SC 2.5.5 Target Size and reducing mis-taps.",
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
      text: "Responsive layout and reflow support WCAG SC 1.4.10 Reflow; content adapts without horizontal scroll.",
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
      text: "Touch targets below 44x44 CSS px can fail WCAG SC 2.5.5 Target Size (Level AAA); risk of mis-taps.",
      category: "mobile",
      type: "issue",
      suggestion: "Use minimum 44x44px touch targets and adequate spacing between interactive elements."
    }
  ]