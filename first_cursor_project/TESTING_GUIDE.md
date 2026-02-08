# AI Wireframe Critic - Testing Guide

## Overview
This guide helps verify that the app works correctly across different scenarios, handles edge cases gracefully, and produces varied, persona-appropriate feedback.

---

## Test Case 1: Basic Form Description (No Image)
**Purpose:** Verify core functionality with text-only input

**Steps:**
1. Clear any existing data (click "Clear Session" if needed)
2. Enter description: `"Login page with email field, password field, and submit button"`
3. Select persona: `General Designer`
4. Click "Generate Feedback"

**Expected Results:**
- ✅ 4-6 feedback cards appear
- ✅ Cards include form-related feedback (category badges show "Form")
- ✅ Mix of "Strength" and "Issue" types
- ✅ Button changes to "Regenerate Feedback"
- ✅ Export buttons (Copy, Download Text, Export PDF) appear below

**What to Verify:**
- Cards animate in smoothly (fade-in effect)
- Cards are expandable (click to see full feedback)
- Feedback mentions form elements (buttons, fields, inputs)
- No console errors

---

## Test Case 2: Navigation-Focused Description with Different Personas
**Purpose:** Verify persona filtering produces different results

**Steps:**
1. Enter description: `"Website homepage with navigation menu in header, sidebar links, and footer"`
2. Test with each persona:
   - **End-User**: Should prioritize usability/navigation/mobile
   - **Stakeholder**: Should prioritize usability/hierarchy
   - **Accessibility Expert**: Should prioritize accessibility/mobile
   - **General Designer**: Should prioritize hierarchy/usability/navigation

**Expected Results:**
- ✅ Different feedback cards appear (or different ordering) for each persona
- ✅ Persona filter info message shows when filtering is active
- ✅ Navigation-related feedback appears (category badge shows "Navigation")
- ✅ Feedback count remains 4-6 cards

**What to Verify:**
- Persona changes trigger different feedback prioritization
- Info message: "Showing X of Y feedback items prioritized for [Persona] persona"
- Preferred categories appear first in the list
- Regenerate with same persona produces different cards (randomization works)

---

## Test Case 3: Image Upload - Small Mobile Image
**Purpose:** Verify image analysis and mobile-focused feedback

**Steps:**
1. Enter description: `"Mobile app wireframe with cards and buttons"`
2. Upload a small image (< 768px width, portrait orientation recommended)
3. Wait for image preview to appear
4. Select persona: `End-User`
5. Click "Generate Feedback"

**Expected Results:**
- ✅ Image preview appears below file input
- ✅ Console shows: `"Image analyzed: { width, height, aspectRatio, isMobileFriendly: true }"`
- ✅ Feedback includes mobile-related comments
- ✅ At least one feedback has category "Mobile"
- ✅ Image dimensions are used in feedback generation

**What to Verify:**
- Image analysis completes without errors
- Mobile-friendly flag is detected correctly
- Mobile category feedback appears
- "Remove Image" button works

---

## Test Case 4: Image Upload - Large Desktop Image
**Purpose:** Verify large image handling and responsive feedback

**Steps:**
1. Enter description: `"Dashboard layout with multiple sections"`
2. Upload a large image (> 1920px width, landscape)
3. Wait for image preview
4. Select persona: `General Designer`
5. Click "Generate Feedback"

**Expected Results:**
- ✅ Image preview appears (may be scaled down)
- ✅ Console shows: `"hasLargeDimensions: true"`
- ✅ Feedback includes responsiveness/mobile adaptation concerns
- ✅ No performance issues or crashes

**What to Verify:**
- Large images don't break the layout
- Image analysis handles large files
- Responsiveness feedback appears
- Export PDF still works with large images

---

## Test Case 5: Edge Case - Empty Description
**Purpose:** Verify validation prevents empty submissions

**Steps:**
1. Leave description field empty (or only whitespace)
2. Optionally upload an image
3. Click "Generate Feedback"

**Expected Results:**
- ✅ Alert appears: `"Please enter a wireframe description first."`
- ✅ No feedback cards are generated
- ✅ Button remains as "Generate Feedback"
- ✅ No console errors

**What to Verify:**
- Validation catches empty/whitespace-only input
- User-friendly error message
- App state remains unchanged
- Can still enter description and retry

---

## Test Case 6: Edge Case - Large File (>10MB)
**Purpose:** Verify file size validation

**Steps:**
1. Try to upload an image file larger than 10MB
2. Observe the error message

**Expected Results:**
- ✅ Error message appears: `"Image file is too large. Please select an image under 10MB."`
- ✅ Error message is styled (red background)
- ✅ File is not uploaded
- ✅ Previous image (if any) remains unchanged

**What to Verify:**
- File size validation works
- Error message is clear and visible
- No file is processed if too large
- Can upload a smaller file after error

---

## Test Case 7: Edge Case - Invalid File Type
**Purpose:** Verify file type validation

**Steps:**
1. Try to upload a non-image file (e.g., .pdf, .txt, .doc)
2. Observe the error message

**Expected Results:**
- ✅ Error message appears: `"Please select a valid image file"`
- ✅ Error message is styled (red background)
- ✅ File is not uploaded
- ✅ No image preview appears

**What to Verify:**
- File type validation works
- Error message is clear
- Only image files are accepted
- Can upload a valid image after error

---

## Test Case 8: Edge Case - Rapid Regenerate
**Purpose:** Verify app handles rapid button clicks gracefully

**Steps:**
1. Generate feedback with any description
2. Quickly click "Regenerate Feedback" 3-4 times in succession
3. Observe behavior

**Expected Results:**
- ✅ Button shows "Regenerating..." and is disabled during generation
- ✅ Only one generation process runs at a time
- ✅ Loading spinner appears
- ✅ Final feedback appears (not multiple sets)
- ✅ No duplicate feedback cards

**What to Verify:**
- Button disabled state prevents double-clicks
- Loading state is visible
- No race conditions or duplicate feedback
- App remains responsive

---

## Test Case 9: Edge Case - Clear Session
**Purpose:** Verify session clearing works completely

**Steps:**
1. Generate feedback with description, image, and notes
2. Add notes to some feedback cards
3. Click "Clear Session"
4. Confirm the dialog
5. Verify all state is reset

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ All inputs cleared: description, image, persona reset to default
- ✅ All feedback cards removed
- ✅ All user notes cleared
- ✅ Button returns to "Generate Feedback"
- ✅ localStorage is cleared
- ✅ File input is reset

**What to Verify:**
- Confirmation prevents accidental clears
- Complete state reset
- Can start fresh after clearing
- Session doesn't restore after clear

---

## Test Case 10: Variability Test - Same Input, Multiple Generations
**Purpose:** Verify randomization produces different feedback

**Steps:**
1. Enter description: `"Homepage with hero section, navigation, and call-to-action button"`
2. Select persona: `Stakeholder`
3. Click "Generate Feedback" → Note the feedback cards
4. Click "Regenerate Feedback" (same inputs) → Compare results
5. Repeat 2-3 times

**Expected Results:**
- ✅ Different feedback cards appear each time (or different ordering)
- ✅ Same categories may appear but with different phrases
- ✅ Feedback count varies (4-6 cards)
- ✅ Persona prioritization remains consistent

**What to Verify:**
- Randomization works (not static results)
- Persona filtering remains consistent
- Variety in feedback phrases
- No duplicate feedback IDs

---

## Test Case 11: User Notes Persistence
**Purpose:** Verify notes save and persist correctly

**Steps:**
1. Generate feedback
2. Expand a feedback card
3. Add a note: `"This is a test note"`
4. Refresh the page (F5)
5. Verify note is still there

**Expected Results:**
- ✅ Note appears in textarea after typing
- ✅ Note persists after page refresh
- ✅ Note appears in exported text/PDF
- ✅ Note is cleared if feedback is regenerated with different inputs

**What to Verify:**
- Notes save to localStorage (check console for save logs)
- Notes restore on page load
- Notes included in exports
- Notes cleanup works when feedback changes

---

## Test Case 12: Export Functionality
**Purpose:** Verify all export options work

**Steps:**
1. Generate feedback with description, image, and notes
2. Test each export button:
   - **Copy**: Click "Copy" → Paste in notepad
   - **Download Text**: Click "Download Text" → Check downloaded .txt file
   - **Export PDF**: Click "Export PDF" → Check downloaded .pdf file

**Expected Results:**
- ✅ Copy: Alert confirms copy, text pastes correctly with all feedback
- ✅ Download Text: File downloads with timestamp, includes description, persona, all feedback, and notes
- ✅ Export PDF: PDF downloads, formatted nicely, includes all content

**What to Verify:**
- All exports include description, persona, feedback, and notes
- PDF is not blank (check content)
- Text file is well-formatted
- File names include timestamps

---

## Test Case 13: Responsive Design
**Purpose:** Verify mobile-first layout works

**Steps:**
1. Open browser DevTools (F12)
2. Test at different viewport sizes:
   - **Mobile (375px)**: Check layout, button stacking, grid (1 column)
   - **Tablet (768px)**: Check 2-column grid, side-by-side inputs
   - **Desktop (1024px)**: Check 3-column grid, optimized spacing
   - **Large Desktop (1440px)**: Check 4-column grid

**Expected Results:**
- ✅ Layout adapts smoothly at each breakpoint
- ✅ Buttons stack on mobile, horizontal on desktop
- ✅ Grid columns adjust: 1 → 2 → 3 → 4
- ✅ Text remains readable at all sizes
- ✅ Touch targets are adequate (44x44px minimum)

**What to Verify:**
- No horizontal scrolling
- Cards don't overflow
- Buttons are tappable on mobile
- Spacing is appropriate for each size

---

## Test Case 14: Accessibility - Keyboard Navigation
**Purpose:** Verify keyboard-only navigation works

**Steps:**
1. Tab through the entire app using only keyboard
2. Use Enter/Space to activate buttons and cards
3. Verify focus indicators are visible

**Expected Results:**
- ✅ Tab order is logical (description → image → persona → generate → cards)
- ✅ Focus indicators are visible (blue outline/ring)
- ✅ Enter/Space activates buttons and expands cards
- ✅ All interactive elements are reachable

**What to Verify:**
- Focus styles are visible and clear
- Tab order makes sense
- Keyboard shortcuts work
- No elements are skipped

---

## Test Case 15: Session Persistence
**Purpose:** Verify localStorage save/load works

**Steps:**
1. Enter description, upload image, select persona, generate feedback, add notes
2. Refresh the page (F5)
3. Verify everything is restored

**Expected Results:**
- ✅ Loading indicator appears briefly
- ✅ Description is restored
- ✅ Persona is restored
- ✅ Feedback cards appear
- ✅ User notes are restored
- ✅ Image preview is NOT restored (File objects can't be serialized - expected)

**What to Verify:**
- Session saves automatically (check console for save logs)
- Session loads on page refresh
- All state is restored correctly
- Image needs to be re-uploaded (expected behavior)

---

## Success Criteria

✅ **All tests pass** - App works correctly across all scenarios
✅ **No console errors** - Clean console output (warnings are okay)
✅ **Variability confirmed** - Different feedback on regeneration
✅ **Persona filtering works** - Different results per persona
✅ **Edge cases handled** - Graceful error messages, no crashes
✅ **Responsive design** - Works on all screen sizes
✅ **Accessibility** - Keyboard navigation, focus states, ARIA labels
✅ **Performance** - Fast generation, smooth animations

---

## Common Issues to Watch For

- **Blank PDF**: Check console for html2pdf errors
- **No feedback generated**: Check description is not empty
- **Image not analyzing**: Check console for image analysis errors
- **Notes not saving**: Check localStorage in DevTools → Application → Local Storage
- **Layout breaks**: Check responsive breakpoints, overflow issues

---

## Quick Verification Checklist

Before considering the app "complete":
- [ ] All 15 test cases pass
- [ ] No critical console errors
- [ ] PDF export works (not blank)
- [ ] Mobile layout is usable
- [ ] Keyboard navigation works
- [ ] Session persistence works
- [ ] Edge cases show friendly errors
- [ ] Variability confirmed (different feedback each time)
