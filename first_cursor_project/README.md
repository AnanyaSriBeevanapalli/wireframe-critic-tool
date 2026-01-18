# AI Wireframe Critic

A single-page web app that simulates nuanced UX feedback on wireframes, helping designers and product teams get quick insights without real user testing.

## Project Setup (Phase 1 Complete)

This project uses **React** with **Vite** for fast development.

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Current Features

✅ Basic project structure with React + Vite
✅ Input section with textarea for wireframe description
✅ Optional image upload with preview
✅ Persona selector dropdown (4 personas)
✅ Generate feedback button (placeholder)
✅ Feedback grid layout (ready for cards)
✅ Responsive design (mobile-first)

### Project Structure

```
/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app component
    ├── components/         # React components
    │   ├── InputSection.jsx
    │   ├── PersonaSelector.jsx
    │   ├── FeedbackCard.jsx
    │   └── FeedbackGrid.jsx
    └── styles/
        └── App.css         # Main stylesheet
```

### Next Steps (Phase 2-6)

- Add feedback phrase database
- Implement feedback generation logic
- Add image analysis
- Connect real feedback to cards
- Add localStorage for session saving
- Implement PDF/text export
