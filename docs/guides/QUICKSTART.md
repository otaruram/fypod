# Fypod Quick Start Guide

## 🚀 Launch Checklist (3 Days to Live)

### Day 1: Design & Assets
- [ ] Generate icons (5 minutes)
  - Open `generate_icons.html` in browser
  - Click download buttons for all 3 sizes
  - Save as icon16.png, icon48.png, icon128.png in `icons/` folder
  - Alternative: See ICON_INSTRUCTIONS.md for other options

- [ ] Create screenshots (1 hour)
  - Install extension locally
  - Open LinkedIn job page
  - Capture 5 screenshots at 1280x800
  - Edit in Photoshop/Figma for polish

### Day 2: Testing & Polish
- [ ] API is already configured! ✅
  - Base URL: https://api.sumopod.com
  - Models: claude-haiku-4-5, glm-5.1, gpt-5.2, gpt-4.1-mini, gemini/gemini-2.5-pro, kimi-k2
  - Just add your API key in extension popup

- [ ] Test on LinkedIn (30 minutes)
  - Visit 10 different job pages
  - Verify modal appears correctly
  - Test all 6 AI models
  - Check history functionality

- [ ] Browser testing (30 minutes)
  - Test on Chrome (primary)
  - Test on Edge (Chromium-based, should work)
  - Verify on different screen sizes

- [ ] Create demo video (1 hour)
  - Record with OBS Studio
  - Add voiceover
  - Edit to 60 seconds
  - Upload to YouTube (unlisted)

### Day 3: Submission & Launch
- [ ] Chrome Web Store submission (2 hours)
  - Pay $5 developer fee
  - Fill out store listing
  - Upload ZIP file
  - Submit for review (usually 1-3 days)

- [ ] Prepare marketing (1 hour)
  - Write LinkedIn post (use template from MARKETING.md)
  - Schedule for launch day
  - Prepare email to SumoData users

- [ ] Set up analytics
  - Create Google Analytics property
  - Add tracking to extension (optional)
  - Set up Chrome Web Store dashboard alerts

## 📦 How to Package for Submission

```bash
# Navigate to project folder
cd fypod

# Create ZIP file (exclude dev files)
zip -r fypod-v1.0.0.zip . -x "*.git*" "*.md" "node_modules/*" ".DS_Store"

# Verify ZIP contents
unzip -l fypod-v1.0.0.zip
```

**ZIP should contain:**
- manifest.json
- popup.html, popup.css, popup.js
- content.js, content.css
- icons/ folder with 3 PNG files

## 🧪 Local Testing

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `fypod` folder
5. Extension should appear in toolbar
6. Visit any LinkedIn job page to test

## 🔑 API Key Setup

For testing, create a test API key:
1. Go to Sumopod dashboard
2. Generate new API key
3. Copy key
4. Open Fypod extension popup
5. Paste in "Sumopod API Key" field
6. Status should show "🟢 Connected"

## 📝 Store Listing Copy

**Name**: Fypod

**Tagline**: AI-Powered Career Accelerator for LinkedIn

**Category**: Productivity

**Description**: (Use full text from MARKETING.md)

**Screenshots** (in order):
1. Hero shot: Floating modal on LinkedIn job page
2. Results: Match score with 75% displayed
3. Quiz: Interactive essay question with answer box
4. History: List of past analyses
5. Setup: Extension popup with CV upload

**Promotional Images**:
- Small tile: 440x280
- Large tile: 920x680
- Marquee: 1400x560

(Create these in Canva using Fypod logo + tagline)

## 🎯 Launch Day Checklist

**Morning (9 AM)**:
- [ ] Check Chrome Web Store - is it live?
- [ ] Test install from store
- [ ] Post on LinkedIn
- [ ] Email SumoData users
- [ ] Post in relevant subreddits (r/SideProject, r/chrome_extensions)

**Afternoon (2 PM)**:
- [ ] Monitor install count
- [ ] Respond to any comments/questions
- [ ] Check for bug reports

**Evening (8 PM)**:
- [ ] Review analytics
- [ ] Plan next day's marketing
- [ ] Celebrate! 🎉

## 🐛 Common Issues & Fixes

**Issue**: Modal doesn't appear on LinkedIn
**Fix**: Check if URL matches pattern in manifest.json

**Issue**: API calls fail
**Fix**: Verify API key is correct, check CORS settings

**Issue**: CV upload doesn't work
**Fix**: Ensure file is PDF, check file size (<5MB)

**Issue**: History doesn't save
**Fix**: Check Chrome storage permissions in manifest

## 📊 Success Metrics (Week 1)

**Day 1**: 50 installs (LinkedIn network)
**Day 3**: 100 installs (Reddit posts)
**Day 7**: 200 installs (organic growth)

**If below targets**: Increase marketing, ask for reviews
**If above targets**: Scale up, prepare for support volume

## 🔄 Post-Launch Updates

**Week 2**: Bug fixes based on user feedback
**Week 4**: Add requested features (top 3 from reviews)
**Month 2**: Internationalization (Indonesian language)
**Month 3**: Expand to other job platforms

## 💡 Pro Tips

1. **Respond to every review** (good or bad) within 24 hours
2. **Update frequently** (shows active development)
3. **Use user feedback** for feature prioritization
4. **Cross-promote** with SumoData and Fydemy
5. **Build in public** (share metrics on LinkedIn)

## 🆘 Support Strategy

**Email**: support@fypod.com (forward to your email)
**Response time**: <24 hours
**Common questions**: Create FAQ in store listing

**Template Response**:
> "Thanks for using Fypod! [Answer to question]. If you're enjoying Fypod, we'd love a 5-star review. Let me know if you need anything else!"

## 🎓 Learning Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

---

**Ready to launch? Let's make Fypod the #1 AI career tool! 🚀**

Questions? Check DEPLOYMENT.md for detailed instructions.
