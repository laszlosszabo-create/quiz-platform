# Enhanced Questions Editor (Quiz Admin)

## Overview
The Enhanced Questions Editor is a modern, user-friendly admin interface for managing quiz questions in the quiz platform. It allows administrators to:

- Add, edit, delete quiz questions with real, human-readable text (not just keys)
- Edit question text in multiple languages (HU/EN)
- Add, edit, delete answer options for each question
- Assign point values (scores) to each answer option
- Set questions as active/inactive
- Reorder questions via drag & drop
- Preview questions as users will see them
- All changes are automatically synced to the database and translations table

## Features
- **Question Text**: Editable in Hungarian and English
- **Help Text**: Optional, per language
- **Question Type**: Single choice, multiple choice, or scale (1-5)
- **Answer Options**: Each with key, text (HU/EN), and score
- **Active/Inactive**: Toggle per question
- **Order**: Drag & drop to reorder
- **Preview**: See exactly how the question will appear to users
- **Translations**: All texts are synced to `quiz_translations` for AI and user display

## Usage
1. Go to `/admin/quiz-editor?id=...` and select the **Kérdések** tab
2. Add or edit questions using the intuitive UI
3. Enter real question text and answer options (not just keys)
4. Assign scores to each answer option
5. Save changes – everything is stored in the database and translations

## Technical Details
- Component: `src/app/admin/quiz-editor/components/enhanced-questions-editor.tsx`
- Integrated in: `src/app/admin/quiz-editor/page.tsx` (replaces old QuestionsEditor)
- Data model: `quiz_questions` table for structure, `quiz_translations` for texts
- All changes are live and reflected in the quiz and AI prompt system

## Developer Notes
- To extend: add more languages, validation, or advanced logic as needed
- For troubleshooting, check the browser console for debug logs
- The old `questions-editor.tsx` is now deprecated

---

_Last updated: 2025-08-22_
