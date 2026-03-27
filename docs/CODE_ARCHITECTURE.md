# Fypod - Code Architecture

## Overview

The codebase has been refactored from a monolithic spaghetti code into a modular, maintainable architecture with clear separation of concerns.

## Module Structure

```
src/js/
├── config.js          # Configuration and constants
├── dom-utils.js       # DOM manipulation utilities
├── storage.js         # Chrome storage operations
├── api.js             # AI API service
├── ui-components.js   # UI rendering components
├── quiz.js            # Quiz functionality
└── main.js            # Main controller/orchestrator
```

## Module Responsibilities

### 1. config.js
**Purpose:** Centralized configuration and constants

**Contains:**
- API configuration (base URL, models, timeouts)
- Storage limits
- UI constraints (sidebar dimensions)
- Portal patterns for job detection
- DOM selectors

**Why:** Single source of truth for all configuration values. Easy to update without touching business logic.

### 2. dom-utils.js
**Purpose:** DOM manipulation and extraction utilities

**Functions:**
- `extractJobDescription()` - Extract job description from page
- `extractJobTitle()` - Extract job title from page
- `getOrCreateModal()` - Get or create modal container
- `clearModal()` - Clear modal content
- `createIconSVG()` - Generate icon button SVG
- `isJobPage()` - Check if current page is a job page

**Why:** Isolates all DOM-related operations. Makes testing easier and reduces coupling.

### 3. storage.js
**Purpose:** Chrome storage abstraction layer

**Methods:**
- `getSync()` - Get from sync storage
- `getLocal()` - Get from local storage
- `setSync()` - Set to sync storage
- `setLocal()` - Set to local storage
- `getSettings()` - Get all user settings
- `saveToHistory()` - Save item to history

**Why:** Provides Promise-based API over callback-based Chrome storage. Centralizes all storage operations.

### 4. api.js
**Purpose:** AI API service layer

**Methods:**
- `analyzeJob()` - Analyze job against CV
- `evaluateQuiz()` - Evaluate quiz answers
- `_buildAnalysisPrompt()` - Build analysis prompt
- `_buildQuizPrompt()` - Build quiz evaluation prompt
- `_parseAnalysisResponse()` - Parse AI response
- `_handleAPIError()` - Handle API errors

**Why:** Encapsulates all API communication. Easy to mock for testing. Single place to update API logic.

### 5. ui-components.js
**Purpose:** UI rendering and state management

**Methods:**
- `renderIconButton()` - Render floating icon button
- `renderLoading()` - Render loading state
- `renderError()` - Render error state
- `renderResults()` - Render analysis results
- `_setupResizable()` - Setup sidebar resize functionality
- `_formatErrorMessage()` - Format error messages

**Why:** Separates presentation from business logic. Reusable UI components. Easy to update styling.

### 6. quiz.js
**Purpose:** Quiz functionality module

**Methods:**
- `showModeSelection()` - Show quiz mode selection
- `showEssayQuiz()` - Render essay quiz
- `showMultipleChoiceQuiz()` - Render MC quiz
- `submitEssayQuiz()` - Submit and evaluate essay quiz
- `submitMultipleChoiceQuiz()` - Submit and evaluate MC quiz
- `_collectEssayAnswers()` - Collect essay answers
- `_collectMCAnswers()` - Collect MC answers
- `_saveQuizToHistory()` - Save quiz to history

**Why:** Isolates quiz logic. Can be easily extended with new quiz types.

### 7. main.js
**Purpose:** Main application controller

**Methods:**
- `init()` - Initialize application
- `showIconButton()` - Show icon button
- `startAnalysis()` - Start job analysis
- `startQuiz()` - Start quiz
- `saveAnalysisToHistory()` - Save analysis to history

**Why:** Orchestrates all modules. Entry point for the application. Manages application state.

## Data Flow

```
User Action (Click Icon)
    ↓
main.js (startAnalysis)
    ↓
dom-utils.js (extractJobDescription)
    ↓
storage.js (getSettings)
    ↓
api.js (analyzeJob)
    ↓
ui-components.js (renderResults)
    ↓
quiz.js (showModeSelection)
    ↓
api.js (evaluateQuiz)
    ↓
storage.js (saveToHistory)
```

## Benefits of Refactoring

### Before (Spaghetti Code)
- ❌ 900+ lines in single file
- ❌ Mixed concerns (DOM, API, UI, storage)
- ❌ Hard to test
- ❌ Difficult to maintain
- ❌ Tight coupling
- ❌ Repeated code

### After (Modular Architecture)
- ✅ ~100-200 lines per module
- ✅ Clear separation of concerns
- ✅ Easy to test each module
- ✅ Easy to maintain and extend
- ✅ Loose coupling
- ✅ DRY (Don't Repeat Yourself)

## Adding New Features

### Example: Add new quiz type

1. Update `quiz.js`:
```javascript
showTrueFalseQuiz(questions, container) {
  // Implementation
}
```

2. Update mode selection in `quiz.js`:
```javascript
showModeSelection(questions) {
  // Add new button for True/False mode
}
```

3. No changes needed in other modules!

### Example: Add new job portal

1. Update `config.js`:
```javascript
PORTAL_PATTERNS.all.push({
  domain: 'newportal.com',
  path: '/jobs/'
});
```

2. Update `manifest.json` matches

3. Done!

## Testing Strategy

Each module can be tested independently:

- **config.js** - No tests needed (just constants)
- **dom-utils.js** - Mock DOM, test extraction
- **storage.js** - Mock chrome.storage, test operations
- **api.js** - Mock fetch, test API calls
- **ui-components.js** - Test rendering output
- **quiz.js** - Test quiz logic
- **main.js** - Integration tests

## Performance

- Modules loaded in order by manifest.json
- No circular dependencies
- Minimal global scope pollution
- Efficient event handling

## Future Improvements

1. Add TypeScript for type safety
2. Add unit tests for each module
3. Add error boundary for better error handling
4. Add logging module for debugging
5. Add analytics module for usage tracking
