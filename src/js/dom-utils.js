// DOM Utilities - Helper functions for DOM manipulation
const DOMUtils = {
  // Extract job description from page
  extractJobDescription() {
    for (const selector of SELECTORS.jobDescription) {
      const element = document.querySelector(selector);
      if (element) {
        return element.innerText;
      }
    }
    return document.body.innerText;
  },
  
  // Extract job title from page
  extractJobTitle() {
    for (const selector of SELECTORS.jobTitle) {
      const element = document.querySelector(selector);
      if (element && element.innerText.trim()) {
        return element.innerText.trim().substring(0, 100);
      }
    }
    return 'Job Analysis';
  },
  
  // Get or create modal container
  getOrCreateModal() {
    let modal = document.getElementById('fypod-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'fypod-modal';
      document.body.appendChild(modal);
    }
    return modal;
  },
  
  // Clear modal content
  clearModal(modal) {
    modal.innerHTML = '';
  },
  
  // Create icon button SVG
  createIconSVG() {
    return `
      <svg width="32" height="32" viewBox="0 0 128 128" style="cursor: pointer;" id="fypod-trigger">
        <rect x="8" y="8" width="112" height="112" rx="28" fill="#1a1a1a"/>
        <line x1="53" y1="37" x2="83" y2="37" stroke="#aaa" stroke-width="1.2" opacity="0.6"/>
        <line x1="83" y1="37" x2="83" y2="67" stroke="#aaa" stroke-width="1.2" opacity="0.6"/>
        <line x1="83" y1="67" x2="53" y2="67" stroke="#aaa" stroke-width="1.2" opacity="0.6"/>
        <line x1="53" y1="67" x2="53" y2="37" stroke="#aaa" stroke-width="1.2" opacity="0.6"/>
        <line x1="45" y1="45" x2="53" y2="37" stroke="#ccc" stroke-width="1.2" opacity="0.7"/>
        <line x1="75" y1="45" x2="83" y2="37" stroke="#ccc" stroke-width="1.2" opacity="0.7"/>
        <line x1="75" y1="75" x2="83" y2="67" stroke="#ccc" stroke-width="1.2" opacity="0.7"/>
        <line x1="45" y1="75" x2="53" y2="67" stroke="#ccc" stroke-width="1.2" opacity="0.7"/>
        <path d="M 50 48 L 70 48 L 70 52 L 56 52 L 56 58 L 68 58 L 68 62 L 56 62 L 56 72 L 50 72 Z" fill="#FFD700" opacity="0.95"/>
        <line x1="45" y1="45" x2="75" y2="45" stroke="#fff" stroke-width="1.5" opacity="0.8"/>
        <line x1="75" y1="45" x2="75" y2="75" stroke="#fff" stroke-width="1.5" opacity="0.8"/>
        <line x1="75" y1="75" x2="45" y2="75" stroke="#fff" stroke-width="1.5" opacity="0.8"/>
        <line x1="45" y1="75" x2="45" y2="45" stroke="#fff" stroke-width="1.5" opacity="0.8"/>
        <line x1="45" y1="45" x2="75" y2="75" stroke="#fff" stroke-width="0.8" opacity="0.2"/>
        <line x1="75" y1="45" x2="45" y2="75" stroke="#fff" stroke-width="0.8" opacity="0.2"/>
      </svg>
    `;
  },
  
  // Check if current page is a job page
  isJobPage(mode) {
    const patterns = mode === 'all' ? PORTAL_PATTERNS.all : PORTAL_PATTERNS.linkedin;
    return patterns.some(pattern => 
      window.location.hostname.includes(pattern.domain) && 
      window.location.pathname.includes(pattern.path)
    );
  }
};
