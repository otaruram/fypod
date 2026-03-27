// Configuration and Constants
const CONFIG = {
  API: {
    BASE_URL: 'https://ai.sumopod.com/v1/chat/completions',
    DEFAULT_MODEL: 'claude-haiku-4-5',
    TIMEOUT: 30000,
    MAX_TOKENS: 2000
  },
  
  STORAGE: {
    MAX_HISTORY_ITEMS: 15,
    MAX_CV_SIZE: 5 * 1024 * 1024 // 5MB
  },
  
  UI: {
    SIDEBAR_MIN_WIDTH: 280,
    SIDEBAR_MAX_WIDTH: 800,
    SIDEBAR_DEFAULT_WIDTH: 320
  }
};

const PORTAL_PATTERNS = {
  linkedin: [
    { domain: 'linkedin.com', path: '/jobs/' }
  ],
  
  all: [
    { domain: 'linkedin.com', path: '/jobs/' },
    { domain: 'glints.com', path: '/opportunities/jobs/' },
    { domain: 'jobstreet', path: '/job/' },
    { domain: 'indeed.com', path: 'viewjob' },
    { domain: 'kalibrr.com', path: '/c/' },
    { domain: 'glassdoor.com', path: '/job-listing/' },
    { domain: 'jobsdb.com', path: '/job/' }
  ]
};

const SELECTORS = {
  jobDescription: [
    '.jobs-description__content',
    '.job-details',
    '[class*="description"]'
  ],
  
  jobTitle: [
    'h1',
    '.job-title',
    '[class*="title"]',
    '[class*="job-name"]'
  ]
};
