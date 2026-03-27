# Fypod Deployment Guide

## Pre-Deployment Checklist

1. **Icons**: Create and place icon files in `/icons/` folder
   - icon16.png, icon48.png, icon128.png
   
2. **API Integration**: Update API endpoints in `content.js`
   - Replace placeholder URLs with actual Sumopod API endpoints
   - Test API connectivity
   
3. **Testing**: Test on LinkedIn job pages
   - Verify auto-detection works
   - Test CV upload and analysis
   - Check history functionality

## Chrome Web Store Submission

### Step 1: Developer Account
- Pay $5 one-time fee at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Use "Oki Taruna" as verified publisher name

### Step 2: Package Extension
```bash
# Create a ZIP file with all extension files
zip -r fypod.zip . -x "*.git*" "node_modules/*" "*.md"
```

### Step 3: Store Listing
- **Name**: Fypod
- **Summary**: AI-Powered Career Accelerator for LinkedIn
- **Description**: Use the marketing copy from MARKETING.md
- **Category**: Productivity
- **Language**: English
- **Screenshots**: Capture 1280x800 screenshots showing:
  1. Floating modal on LinkedIn
  2. Analysis results with match score
  3. Interactive essay questions
  4. Extension popup (Setup tab)

### Step 4: Privacy
- **Single Purpose**: Career analysis and job matching
- **Permissions Justification**:
  - `storage`: Save CV, API key, and analysis history
  - `activeTab`: Detect LinkedIn job pages
  - `host_permissions`: Inject UI on LinkedIn

### Step 5: Pricing
- Free (monetize through Sumopod API usage)

## Post-Launch

1. **Monitor**: Check reviews and ratings daily
2. **Update**: Push updates for bug fixes within 24 hours
3. **Marketing**: Share on LinkedIn with demo video
4. **Analytics**: Track installs and active users

## Target Metrics
- Week 1: 100 installs
- Month 1: 1,000 installs
- Month 3: 5,000 installs

Good luck! 🚀
