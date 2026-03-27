# CV Storage Fix

## ❌ Problem
CV tidak bisa tersimpan karena:
- `chrome.storage.sync` memiliki limit 8KB per item
- PDF CV biasanya 100KB - 2MB (terlalu besar)
- Error: QUOTA_BYTES_PER_ITEM quota exceeded

## ✅ Solution

### Storage Strategy
**chrome.storage.local** (untuk CV)
- No size limit (hanya dibatasi disk space)
- CV tersimpan di device
- Tidak sync antar device (tapi tetap permanen)

**chrome.storage.sync** (untuk settings)
- API key
- Default model
- Portal mode
- CV filename (untuk display)
- History metadata

### Implementation

```javascript
// Save CV (local storage)
chrome.storage.local.set({ cvData: base64Data })

// Save settings (sync storage)
chrome.storage.sync.set({ 
  apiKey: "...",
  defaultModel: "...",
  portalMode: "...",
  cvFileName: "resume.pdf"
})
```

### Error Handling
- File size check (max 5MB)
- Upload progress indicator
- Error messages dengan feedback visual
- Chrome runtime error handling

### User Feedback
- "Uploading..." saat proses
- "✓ filename.pdf" saat sukses (border hijau)
- "❌ Upload failed" saat error (border merah)
- Alert dengan error detail jika gagal

## 🎯 Benefits
- CV bisa tersimpan (no size limit)
- Settings tetap sync antar device
- Error handling yang jelas
- Visual feedback untuk user
- Permanen (tidak hilang)

## 📦 Storage Structure
```javascript
// Local Storage (per device)
chrome.storage.local {
  cvData: "data:application/pdf;base64,..."  // Large file
}

// Sync Storage (across devices)
chrome.storage.sync {
  apiKey: "sk-...",
  defaultModel: "claude-haiku-4-5",
  portalMode: "linkedin",
  cvFileName: "resume.pdf",
  history: [...]
}
```

## 🚀 Result
- CV upload works reliably
- No more "Please upload CV" errors
- Clear feedback saat upload
- Permanen storage
