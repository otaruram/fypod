// UI Components - Render functions for different UI states
const UIComponents = {
  // Render icon button
  renderIconButton(modal, onClickHandler) {
    DOMUtils.clearModal(modal);
    
    const iconButton = document.createElement('div');
    iconButton.className = 'fypod-icon-button';
    iconButton.innerHTML = DOMUtils.createIconSVG();
    
    modal.appendChild(iconButton);
    document.getElementById('fypod-trigger').addEventListener('click', onClickHandler);
  },
  
  // Render loading state
  renderLoading(modal, onCloseHandler) {
    const iconButton = modal.querySelector('.fypod-icon-button');
    if (iconButton) iconButton.remove();
    
    const sidebar = document.createElement('div');
    sidebar.className = 'fypod-content';
    sidebar.innerHTML = `
      <button id="fypod-close-loading" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #888; font-size: 20px; cursor: pointer; z-index: 100;">×</button>
      <div class="fypod-loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px 20px;">
        <div class="spinner"></div>
        <p style="margin-top: 16px; font-size: 14px;">Analyzing with AI...</p>
        <p style="font-size: 12px; color: #666; margin-top: 8px;">This may take 10-30 seconds</p>
      </div>
    `;
    
    modal.appendChild(sidebar);
    document.getElementById('fypod-close-loading').addEventListener('click', onCloseHandler);
  },
  
  // Render error state
  renderError(modal, errorMessage, onCloseHandler) {
    const existingContent = modal.querySelector('.fypod-content');
    if (existingContent) existingContent.remove();
    
    const { message, troubleshooting } = this._formatErrorMessage(errorMessage);
    
    const sidebar = document.createElement('div');
    sidebar.className = 'fypod-content';
    sidebar.innerHTML = `
      <button id="fypod-close-error" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #888; font-size: 20px; cursor: pointer; z-index: 100;">×</button>
      <div style="padding: 40px 20px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h3 style="margin-bottom: 8px;">Analysis Failed</h3>
        <p style="color: #ff6b6b; margin-bottom: 16px;">${message}</p>
        ${troubleshooting}
        <button onclick="location.reload()" style="margin-top: 20px; background: #FFD700; color: #000; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Try Again
        </button>
      </div>
    `;
    
    modal.appendChild(sidebar);
    document.getElementById('fypod-close-error').addEventListener('click', onCloseHandler);
  },

  // Render analysis results
  renderResults(modal, analysis, questions, onCloseHandler, onQuizStart) {
    const existingContent = modal.querySelector('.fypod-content');
    if (existingContent) existingContent.remove();
    
    const gaps = this._normalizeGaps(analysis.gaps);
    const scamWarning = this._renderScamWarning(analysis.scamDetection);
    const salaryInfo = this._renderSalaryInfo(analysis.scamDetection);
    const quizSection = this._renderQuizSection(questions);
    
    const sidebar = document.createElement('div');
    sidebar.className = 'fypod-content';
    sidebar.innerHTML = `
      <div class="resize-handle" id="resize-handle"></div>
      <button id="fypod-close-results" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #888; font-size: 20px; cursor: pointer; z-index: 100;">×</button>
      <div class="fypod-results">
        ${scamWarning}
        
        <div class="score-section">
          <div class="score-label">Match Score</div>
          <div class="score-circle">${analysis.matchScore}%</div>
          ${salaryInfo}
        </div>
        
        <div class="section">
          <div class="section-title">Skill Gap Analysis</div>
          <div class="gap-list">
            ${gaps.map(gap => `<div class="gap-item">${gap}</div>`).join('')}
          </div>
        </div>
        
        ${quizSection}
      </div>
    `;
    
    modal.appendChild(sidebar);
    
    document.getElementById('fypod-close-results').addEventListener('click', onCloseHandler);
    this._setupResizable(sidebar);
    
    if (questions.length > 0) {
      this._setupQuizButton(questions, onQuizStart);
    }
  },
  
  // Helper methods
  _normalizeGaps(gaps) {
    const normalized = (gaps || []).slice(0, 3);
    while (normalized.length < 3) {
      normalized.push('No significant gap detected');
    }
    return normalized;
  },
  
  _renderScamWarning(scamDetection) {
    if (!scamDetection?.isScam) return '';
    
    return `<div class="scam-warning">
      <div class="scam-warning-icon">⚠️</div>
      <div class="scam-warning-text">
        <div class="scam-warning-title">Potential Risk Detected</div>
        <div class="scam-warning-desc">${scamDetection.reason || 'This posting shows suspicious patterns. Exercise caution.'}</div>
      </div>
    </div>`;
  },
  
  _renderSalaryInfo(scamDetection) {
    if (!scamDetection?.salaryRange) return '';
    return `<div class="salary-info">Est. Salary: ${scamDetection.salaryRange}</div>`;
  },
  
  _renderQuizSection(questions) {
    if (questions.length === 0) return '';
    
    return `<div class="section">
      <div class="section-title">Interview Preparation</div>
      <p style="font-size: 11px; color: #888; margin-bottom: 12px;">Test your knowledge with AI-powered killer questions</p>
      <button id="start-quiz-btn" class="quiz-start-btn">
        Start Kill-Questions Quiz →
      </button>
      <div id="quiz-container" style="display: none;"></div>
    </div>`;
  },
  
  _setupResizable(sidebar) {
    const handle = document.getElementById('resize-handle');
    if (!handle) return;
    
    let isResizing = false;
    let startX, startWidth;
    
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      e.preventDefault();
      document.body.style.cursor = 'ew-resize';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const deltaX = startX - e.clientX;
      const newWidth = startWidth + deltaX;
      
      if (newWidth >= CONFIG.UI.SIDEBAR_MIN_WIDTH && newWidth <= CONFIG.UI.SIDEBAR_MAX_WIDTH) {
        sidebar.style.width = newWidth + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
      }
    });
  },
  
  _setupQuizButton(questions, onQuizStart) {
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (!startQuizBtn) return;
    
    startQuizBtn.addEventListener('click', () => {
      startQuizBtn.style.display = 'none';
      document.getElementById('quiz-container').style.display = 'block';
      onQuizStart(questions);
    });
    
    startQuizBtn.addEventListener('mouseenter', () => {
      startQuizBtn.style.background = '#f0f0f0';
      startQuizBtn.style.transform = 'translateY(-1px)';
      startQuizBtn.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.2)';
    });
    
    startQuizBtn.addEventListener('mouseleave', () => {
      startQuizBtn.style.background = '#FFD700';
      startQuizBtn.style.transform = 'translateY(0)';
      startQuizBtn.style.boxShadow = 'none';
    });
  },
  
  _formatErrorMessage(errorMessage) {
    let message = errorMessage;
    let troubleshooting = '';
    
    if (errorMessage.includes('NAME_NOT_RESOLVED') || errorMessage.includes('Failed to fetch')) {
      message = 'Cannot connect to Sumopod API';
      troubleshooting = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 13px; text-align: left;">
          <strong>Troubleshooting:</strong>
          <ul style="margin: 8px 0 0 20px; line-height: 1.8;">
            <li>Check if ai.sumopod.com is accessible</li>
            <li>Verify your API key is correct</li>
            <li>Check your internet connection</li>
            <li>Try again in a few moments</li>
          </ul>
        </div>
      `;
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      message = 'Invalid API Key';
      troubleshooting = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 13px;">
          <p>Please check your API key in the extension popup.</p>
        </div>
      `;
    } else if (errorMessage.includes('429')) {
      message = 'Rate limit exceeded';
      troubleshooting = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 13px;">
          <p>Please wait a few minutes before trying again.</p>
        </div>
      `;
    }
    
    return { message, troubleshooting };
  }
};
