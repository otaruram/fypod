# Fypod Extension - Project Structure

```
fypod-extension/
├── src/                          # Source code
│   ├── css/                      # Stylesheets
│   │   ├── content.css          # Content script styles (sidebar, quiz)
│   │   └── popup.css            # Extension popup styles
│   ├── js/                       # JavaScript files
│   │   ├── content.js           # Content script (job analysis, quiz)
│   │   └── popup.js             # Popup logic (setup, history, settings)
│   └── html/                     # HTML files
│       ├── popup.html           # Extension popup interface
│       └── landing.html         # Landing page (optional)
│
├── icons/                        # Extension icons
│   ├── icon16.png               # 16x16 toolbar icon
│   ├── icon48.png               # 48x48 extension icon
│   ├── icon128.png              # 128x128 store icon
│   ├── icon.svg                 # Source SVG
│   └── README.md                # Icon documentation
│
├── docs/                         # Documentation
│   ├── features/                # Feature documentation
│   │   ├── QUIZ_FEATURE_UPDATE.md
│   │   ├── QUIZ_HISTORY_FEATURE.md
│   │   ├── SETTINGS_FEATURE.md
│   │   ├── SIDEBAR_LAYOUT_UPDATE.md
│   │   ├── MULTI_PORTAL_UPDATE.md
│   │   ├── MINIMALIST_UPDATE.md
│   │   ├── DESIGN_UPDATE.md
│   │   ├── CV_STORAGE_FIX.md
│   │   ├── HISTORY_FEATURES_ACTIVE.md
│   │   └── HISTORY_STORAGE_FIX.md
│   ├── guides/                  # User guides
│   │   ├── QUICKSTART.md
│   │   ├── QUICK_REFERENCE.md
│   │   └── SETUP_COMPLETE.md
│   ├── API_INTEGRATION.md       # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── ICON_INSTRUCTIONS.md     # Icon generation guide
│   ├── MARKETING.md             # Marketing materials
│   └── PRESENTATION.md          # Presentation deck
│
├── tools/                        # Development tools
│   └── generate_icons.html      # Icon generator utility
│
├── .vscode/                      # VS Code settings
├── .gitignore                    # Git ignore rules
├── manifest.json                 # Chrome extension manifest
├── CHANGELOG.md                  # Version history
└── README.md                     # Main documentation

```

## Key Files

### Core Extension Files
- `manifest.json` - Extension configuration and permissions
- `src/js/content.js` - Main logic for job analysis and quiz features
- `src/js/popup.js` - Popup interface logic (setup, settings, history)
- `src/css/content.css` - Styling for sidebar and quiz interface
- `src/css/popup.css` - Styling for extension popup

### Features
1. **Job Analysis** - AI-powered CV matching with job descriptions
2. **Quiz System** - Essay and multiple choice interview preparation
3. **History** - Saved analysis and quiz results
4. **Multi-Portal Support** - Works on LinkedIn, Glints, JobStreet, Indeed, etc.
5. **Settings** - Portal mode selection and configuration

### Storage
- `chrome.storage.local` - CV data, history (no size limit)
- `chrome.storage.sync` - API key, model, settings (synced across devices)

## Development

### File Organization
- **src/** - All source code (JS, CSS, HTML)
- **docs/** - All documentation and guides
- **icons/** - Extension icons and assets
- **tools/** - Development utilities

### Adding New Features
1. Update relevant files in `src/`
2. Document in `docs/features/`
3. Update CHANGELOG.md
4. Test on all supported portals

### Building for Production
1. Ensure all paths in manifest.json are correct
2. Test extension loading in Chrome
3. Verify all features work
4. Package for Chrome Web Store
