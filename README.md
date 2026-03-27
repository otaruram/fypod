# Fypod - AI-Powered Career Accelerator

Chrome extension that analyzes job postings against your CV using AI, provides match scores, identifies skill gaps, and offers interview preparation quizzes.

## Features

✨ **Job Analysis**
- AI-powered CV matching with job descriptions
- Match score calculation
- Skill gap identification with Fydemy course recommendations
- Scam detection
- Salary estimation

🎯 **Interview Preparation**
- Essay and multiple choice quiz modes
- AI-powered answer evaluation
- Comprehensive feedback and scoring

📊 **History & Tracking**
- Save all analysis and quiz results
- View detailed history
- Copy and share results
- Delete old entries

🌐 **Multi-Portal Support**
- LinkedIn
- Glints
- JobStreet
- Indeed
- Kalibrr
- Glassdoor
- JobsDB

## Quick Start

1. **Install Extension**
   - Load unpacked extension in Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

2. **Setup**
   - Click extension icon in toolbar
   - Upload your CV (PDF format, max 5MB)
   - Enter Sumopod API key: `sk-DeEyx-q-3NSj9TA8VlkoPQ`
   - Select default AI model

3. **Use**
   - Visit any supported job portal
   - Click the Fypod icon on job pages
   - View analysis and take quizzes
   - Check history in extension popup

## Project Structure

```
fypod-extension/
├── src/              # Source code (JS, CSS, HTML)
│   ├── js/          # Modular JavaScript
│   │   ├── config.js         # Configuration & constants
│   │   ├── dom-utils.js      # DOM utilities
│   │   ├── storage.js        # Storage manager
│   │   ├── api.js            # API service
│   │   ├── ui-components.js  # UI components
│   │   ├── quiz.js           # Quiz module
│   │   └── main.js           # Main controller
│   ├── css/         # Stylesheets
│   └── html/        # HTML templates
├── icons/            # Extension icons
├── docs/             # Documentation
├── tools/            # Development utilities
└── manifest.json     # Extension configuration
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure.
See [docs/CODE_ARCHITECTURE.md](docs/CODE_ARCHITECTURE.md) for code architecture.

## Documentation

- [Quick Start Guide](docs/guides/QUICKSTART.md)
- [API Integration](docs/API_INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Feature Documentation](docs/features/)

## Technology Stack

- **Manifest V3** - Chrome Extension
- **Vanilla JavaScript** - No frameworks
- **Chrome Storage API** - Local and sync storage
- **Sumopod AI API** - Multiple AI models
- **CSS3** - Modern styling with gold theme

## AI Models

- Claude Haiku 4.5 (Fast)
- GPT 4.1 Mini (Balanced)
- GPT 5.2 (Advanced)
- Gemini 2.5 Pro (Technical)
- GLM 5.1 (Multilingual)
- Kimi K2 (Long Context)

## Storage

- **chrome.storage.local** - CV data, history (unlimited)
- **chrome.storage.sync** - API key, settings (synced across devices)

## Development

### File Organization
- `src/js/` - JavaScript files
- `src/css/` - Stylesheets
- `src/html/` - HTML templates
- `docs/` - All documentation
- `icons/` - Extension icons

### Key Files
- `src/js/content.js` - Job analysis and quiz logic
- `src/js/popup.js` - Extension popup interface
- `manifest.json` - Extension configuration

## Version

Current version: 1.0.0

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

Proprietary - All rights reserved

## Support

For issues or questions, refer to the documentation in the `docs/` folder.
