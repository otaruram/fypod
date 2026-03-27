// Storage Manager - Handle Chrome Storage Operations
const StorageManager = {
  // Get data from sync storage
  async getSync(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, resolve);
    });
  },
  
  // Get data from local storage
  async getLocal(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },
  
  // Set data to sync storage
  async setSync(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  
  // Set data to local storage
  async setLocal(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  
  // Get user settings
  async getSettings() {
    const sync = await this.getSync(['apiKey', 'defaultModel', 'portalMode']);
    const local = await this.getLocal(['cvData']);
    return { ...sync, ...local };
  },
  
  // Save to history
  async saveToHistory(item) {
    const { history = [] } = await this.getLocal(['history']);
    history.unshift(item);
    const trimmed = history.slice(0, CONFIG.STORAGE.MAX_HISTORY_ITEMS);
    await this.setLocal({ history: trimmed });
  }
};
