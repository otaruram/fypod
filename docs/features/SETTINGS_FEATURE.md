# Settings Feature - Portal Mode

## ✅ New Feature: Settings Tab

### Portal Mode Options

**1. LinkedIn Only (Default)**
- Icon hanya muncul di LinkedIn job pages
- Lightweight & focused
- Recommended untuk most users

**2. All Job Portals**
- Icon muncul di semua job portals:
  - LinkedIn
  - Glints
  - JobStreet (ID & International)
  - Indeed (ID & International)
  - Kalibrr
  - Glassdoor
  - JobsDB
- Untuk power users yang browse banyak platform

## 🎨 UI/UX

### Settings Tab
- Radio button selection
- Clear descriptions untuk setiap mode
- Note: "Reload page after changing mode"
- Elegant card design dengan hover effects

### User Flow
1. Open extension popup
2. Click Settings tab
3. Select mode (LinkedIn Only / All Job Portals)
4. Reload job page
5. Icon appears based on selected mode

## 💾 Storage
```javascript
chrome.storage.sync {
  portalMode: "linkedin" | "all"  // default: "linkedin"
}
```

## 🚀 Benefits
- User control over which portals to enable
- Default mode = lightweight (LinkedIn only)
- Optional mode = maximum coverage (all portals)
- Setting persists across sessions & devices
- No performance impact when disabled

## 🎯 Default Behavior
- First install: LinkedIn Only
- User explicitly enables All Portals if needed
- Mode saved permanently (chrome.storage.sync)
