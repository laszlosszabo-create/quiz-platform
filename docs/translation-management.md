# Translation Management System - Documentation

## Overview
A comprehensive translation management system for the Quiz Platform, providing both dashboard overview and focus-stable editing capabilities.

## Components Architecture

### 1. Translation Management Dashboard (`/admin/translations`)
**Location**: `src/app/admin/translations/page.tsx`

**Features**:
- Real-time statistics for HU/EN translation completion rates
- Missing translations detection with detailed listings
- Export functionality (CSV/JSON formats)
- Quiz overview with translation status indicators
- Direct navigation to quiz editors

**API Dependencies**:
- `GET /api/admin/quizzes` - Fetches all quizzes with translations
- `GET /api/admin/translations/export` - Handles CSV/JSON export

### 2. Focus-Stable Translation Editor
**Problem Solved**: React-based input fields lost focus on every keystroke due to component re-rendering.

**Solution**: Native HTML/JS editor embedded via iframe
- **Location**: `public/admin/translations-native.html`
- **Integration**: Used in both standalone and quiz-editor contexts
- **Communication**: PostMessage API for parent-child data sync

**Usage Contexts**:
1. **Standalone**: `/admin/quizzes/[id]/translations` (iframe integration)
2. **Quiz Editor Tab**: `/admin/quiz-editor?id=...` (TranslationEditor component with iframe)

### 3. API Endpoints

#### `/api/admin/quizzes` (Enhanced)
- **Method**: GET
- **Purpose**: Returns all quizzes with aggregated translations
- **Response**: Structured quiz data with translations grouped by language

#### `/api/admin/translations/export`
- **Method**: GET
- **Parameters**: `?format=csv|json`
- **Purpose**: Export all translations in specified format
- **Response**: File download (CSV or JSON)

## File Structure
```
src/
├── app/admin/translations/
│   └── page.tsx                           # Translation Management Dashboard
├── app/admin/quiz-editor/components/
│   └── translation-editor.tsx             # Iframe-integrated component
├── app/api/admin/
│   ├── quizzes/route.ts                   # Enhanced with translations
│   └── translations/export/route.ts       # Export functionality
└── components/ui/
    ├── badge.tsx                          # Status badges
    ├── progress.tsx                       # Completion indicators
    └── tabs.tsx                           # Language switching

public/admin/
└── translations-native.html              # Focus-stable native editor
```

## Technical Implementation

### Translation Field Validation
The system validates these required fields per quiz:
- `landing_headline`
- `landing_sub`
- `landing_description`
- `email_gate_title`
- `email_gate_button`
- `result_title`
- `result_description`

### Data Flow
1. **Dashboard Load**: Fetches all quiz translations via `/api/admin/quizzes`
2. **Statistics Calculation**: Client-side processing of translation completeness
3. **Missing Detection**: Identifies untranslated required fields per language
4. **Export**: Server-side aggregation and formatting for CSV/JSON export

### Iframe Communication
```javascript
// Native editor → Parent component
window.parent.postMessage({
  type: 'translationsSaved',
  translations: updatedTranslations
}, '*');

// Parent component listening
window.addEventListener('message', (event) => {
  if (event.data.type === 'translationsSaved') {
    // Update React state with new translations
  }
});
```

## Known Issues & Limitations

### 1. Translation Field Detection Inconsistency
- **Issue**: Dashboard validates only basic required fields, but quiz editor shows more comprehensive missing translations
- **Impact**: Minor cosmetic inconsistency in missing translation counts
- **Priority**: Low - can be refined in future iterations
- **Workaround**: Use direct quiz-editor links for comprehensive translation editing

### 2. Export Limitations
- Currently exports all quizzes; no selective export
- CSV format uses simple key_hu/key_en column naming
- No import functionality (export-only)

## Future Enhancements
- **Selective Export**: Choose specific quizzes or fields to export
- **Import Functionality**: Bulk translation uploads via CSV/JSON
- **Translation Memory**: Suggest similar translations across quizzes
- **Validation Rules**: Custom field validation (character limits, required patterns)
- **Workflow Management**: Translation approval process with multiple reviewers

## Dependencies
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-tabs` - Language switcher tabs
- `lucide-react` - UI icons
- `class-variance-authority` - Badge variants

## Performance Considerations
- Translation statistics calculated client-side to reduce API calls
- Native HTML editor eliminates React re-rendering overhead
- Iframe isolation prevents parent component interference
- Export operations use streaming for large datasets

---

**Last Updated**: August 18, 2025  
**Version**: 1.0  
**Status**: Production Ready
