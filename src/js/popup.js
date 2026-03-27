// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    
    tab.classList.add('active');
    document.getElementById(targetTab).classList.remove('hidden');
    
    if (targetTab === 'history') {
      loadHistory();
    } else if (targetTab === 'settings') {
      loadSettings();
    }
  });
});

// Dropzone handling
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('cvFile');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '#fff';
});

dropzone.addEventListener('dragleave', () => {
  dropzone.style.borderColor = '#333';
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '#333';
  
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    handleFile(file);
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

function handleFile(file) {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    alert('⚠️ File too large!\n\nPlease use a CV smaller than 5MB.');
    return;
  }
  
  dropzone.querySelector('p').textContent = 'Uploading...';
  dropzone.style.borderColor = '#888';
  
  const reader = new FileReader();
  
  reader.onerror = () => {
    dropzone.querySelector('p').textContent = '❌ Upload failed. Try again.';
    dropzone.style.borderColor = '#ff6b6b';
  };
  
  reader.onload = (e) => {
    const cvData = e.target.result;
    
    // Use chrome.storage.local for CV (no size limit)
    chrome.storage.local.set({ cvData: cvData }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
        dropzone.querySelector('p').textContent = '❌ Failed to save CV';
        dropzone.style.borderColor = '#ff6b6b';
        alert('Failed to save CV: ' + chrome.runtime.lastError.message);
      } else {
        // Also save filename to sync storage
        chrome.storage.sync.set({ cvFileName: file.name }, () => {
          dropzone.querySelector('p').textContent = `✓ ${file.name}`;
          dropzone.style.borderColor = '#4CAF50';
          console.log('CV saved successfully:', file.name);
        });
      }
    });
  };
  
  reader.readAsDataURL(file);
}

// API Key and Model handling
const apiKeyInput = document.getElementById('apiKey');
const defaultModelSelect = document.getElementById('defaultModel');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

chrome.storage.sync.get(['apiKey', 'defaultModel', 'cvFileName'], (result) => {
  if (result.apiKey) {
    apiKeyInput.value = result.apiKey;
    updateStatus(true);
  }
  if (result.defaultModel) {
    defaultModelSelect.value = result.defaultModel;
  }
  
  // Check if CV exists in local storage
  chrome.storage.local.get(['cvData'], (localResult) => {
    if (localResult.cvData) {
      const fileName = result.cvFileName || 'CV Uploaded';
      dropzone.querySelector('p').textContent = `✓ ${fileName}`;
      dropzone.style.borderColor = '#4CAF50';
    }
  });
});

apiKeyInput.addEventListener('input', () => {
  const apiKey = apiKeyInput.value.trim();
  chrome.storage.sync.set({ apiKey }, () => {
    updateStatus(apiKey.length > 0);
  });
});

defaultModelSelect.addEventListener('change', () => {
  const model = defaultModelSelect.value;
  chrome.storage.sync.set({ defaultModel: model });
});

function updateStatus(connected) {
  if (connected) {
    statusIndicator.textContent = '🟢';
    statusText.textContent = 'Connected to ai.sumopod.com';
  } else {
    statusIndicator.textContent = '🔴';
    statusText.textContent = 'Not connected';
  }
}

// Settings management
function loadSettings() {
  chrome.storage.sync.get(['portalMode'], (result) => {
    const mode = result.portalMode || 'linkedin';
    document.getElementById(`mode-${mode}`).checked = true;
  });
}

// Handle portal mode change
document.querySelectorAll('input[name="portalMode"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const mode = e.target.value;
    chrome.storage.sync.set({ portalMode: mode }, () => {
      console.log('Portal mode set to:', mode);
    });
  });
});

// History management
function loadHistory() {
  chrome.storage.local.get(['history'], (result) => {
    const history = result.history || [];
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p style="color: #888; text-align: center; padding: 40px 20px; font-size: 13px;">No analysis yet</p>';
      return;
    }
    
    historyList.innerHTML = history.slice(0, 15).map((item, index) => {
      // Add badge for quiz items
      const badge = item.type === 'quiz' ? '<span style="background: rgba(255, 215, 0, 0.2); color: #FFD700; padding: 2px 6px; border-radius: 3px; font-size: 9px; margin-left: 6px;">QUIZ</span>' : '';
      
      return `
        <div class="history-item" data-index="${index}">
          <div class="history-info">
            <div class="history-title">${item.jobTitle || 'Job Analysis'}${badge}</div>
            <div class="history-date">${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div class="history-actions">
            <button class="history-btn download-btn" data-index="${index}" title="Download PNG">📥</button>
            <button class="history-btn copy-btn" data-index="${index}" title="Copy">📋</button>
            <button class="history-btn delete-btn" data-index="${index}" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners after rendering
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest('.history-actions')) return;
        const index = parseInt(item.dataset.index);
        viewHistoryDetail(index);
      });
    });
    
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        downloadAsPNG(index, btn);
      });
    });
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        copyAnalysis(index, btn);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        deleteAnalysis(index);
      });
    });
  });
}

window.viewHistoryDetail = function(index) {
  chrome.storage.local.get(['history'], (result) => {
    const item = result.history[index];
    if (!item) {
      console.error('History item not found:', index);
      return;
    }
    
    try {
      let detailHTML = '';
      
      // Check if this is a quiz result
      if (item.type === 'quiz' && item.quizData) {
        const quizData = JSON.parse(item.quizData);
        detailHTML = `
          <div class="history-detail">
            <button id="close-detail-btn" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #888; font-size: 20px; cursor: pointer; z-index: 10;">×</button>
            <h3 style="margin: 0 0 8px 0; font-size: 16px; padding-right: 30px;">${item.jobTitle}</h3>
            <div style="font-size: 10px; color: #888; margin-bottom: 16px;">${quizData.mode} Mode • ${new Date(quizData.date).toLocaleDateString()}</div>
            
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 12px;">Questions & Answers</div>
              ${quizData.questions.map((qa, i) => `
                <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                  <div style="font-size: 10px; color: #888; margin-bottom: 6px;">Question ${i + 1}</div>
                  <div style="font-size: 11px; margin-bottom: 8px; color: #e0e0e0;">${qa.question}</div>
                  <div style="font-size: 10px; color: #666; margin-bottom: 4px;">Your Answer:</div>
                  <div style="font-size: 11px; color: #aaa; line-height: 1.5;">${qa.answer}</div>
                </div>
              `).join('')}
            </div>
            
            <div style="margin-bottom: 16px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 12px;">AI Evaluation</div>
              <div style="background: rgba(76, 175, 80, 0.08); border: 1px solid rgba(76, 175, 80, 0.2); padding: 12px; border-radius: 6px; font-size: 11px; line-height: 1.6; color: #b8e6ba;">
                ${quizData.evaluation.split('\n').map(line => `<p style="margin-bottom: 8px;">${line}</p>`).join('')}
              </div>
            </div>
            
            ${item.url ? `<a href="${item.url}" target="_blank" style="display: block; margin-top: 12px; font-size: 11px; color: #4CAF50; text-decoration: none;">View Job Posting →</a>` : ''}
          </div>
        `;
      } else {
        // Regular analysis result
        const analysis = JSON.parse(item.analysis);
        
        // Render insights if available
        let insightsHTML = '';
        if (analysis.insights) {
          const renderStars = (score) => '⭐'.repeat(score || 0) + '☆'.repeat(5 - (score || 0));
          
          insightsHTML = `
            <div style="margin-bottom: 16px;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px;">Career Insights</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${analysis.insights.careerGrowth ? `
                  <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 9px; color: #888; margin-bottom: 4px;">📈 Career Growth</div>
                    <div style="font-size: 12px; margin-bottom: 4px;">${renderStars(analysis.insights.careerGrowth.score)}</div>
                    <div style="font-size: 9px; color: #999;">${analysis.insights.careerGrowth.reason}</div>
                  </div>
                ` : ''}
                ${analysis.insights.techModernity ? `
                  <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 9px; color: #888; margin-bottom: 4px;">💻 Tech Modernity</div>
                    <div style="font-size: 12px; margin-bottom: 4px;">${renderStars(analysis.insights.techModernity.score)}</div>
                    <div style="font-size: 9px; color: #999;">${analysis.insights.techModernity.reason}</div>
                  </div>
                ` : ''}
                ${analysis.insights.workLifeBalance ? `
                  <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 9px; color: #888; margin-bottom: 4px;">⚖️ Work-Life Balance</div>
                    <div style="font-size: 11px; color: #FFD700; font-weight: 600;">${analysis.insights.workLifeBalance}</div>
                  </div>
                ` : ''}
                ${analysis.insights.cultureFit ? `
                  <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 9px; color: #888; margin-bottom: 4px;">🏢 Culture</div>
                    <div style="font-size: 10px; color: #aaa;">${analysis.insights.cultureFit}</div>
                  </div>
                ` : ''}
              </div>
              ${analysis.insights.learningOpportunities ? `
                <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px; margin-top: 8px;">
                  <div style="font-size: 9px; color: #888; margin-bottom: 4px;">📚 Learning Opportunities</div>
                  <div style="font-size: 10px; color: #aaa; line-height: 1.4;">${analysis.insights.learningOpportunities}</div>
                </div>
              ` : ''}
            </div>
          `;
        }
        
        detailHTML = `
          <div class="history-detail">
            <button id="close-detail-btn" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #888; font-size: 20px; cursor: pointer; z-index: 10;">×</button>
            <h3 style="margin: 0 0 16px 0; font-size: 16px; padding-right: 30px;">${item.jobTitle}</h3>
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-flex; width: 60px; height: 60px; border-radius: 50%; border: 2px solid #FFD700; align-items: center; justify-content: center; font-size: 18px; font-weight: 600;">
                ${analysis.matchScore}%
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px;">Skill Gaps</div>
              ${(analysis.gaps || []).map(gap => `<div style="background: rgba(255,255,255,0.05); padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11px;">${gap}</div>`).join('')}
            </div>
            ${insightsHTML}
            ${analysis.scamDetection?.salaryRange ? `<div style="font-size: 11px; color: #888; margin-top: 12px;">Est. Salary: ${analysis.scamDetection.salaryRange}</div>` : ''}
            ${analysis.scamDetection?.isScam ? `<div style="font-size: 11px; color: #ff6b6b; margin-top: 8px;">⚠️ ${analysis.scamDetection.reason}</div>` : ''}
            ${item.url ? `<a href="${item.url}" target="_blank" style="display: block; margin-top: 12px; font-size: 11px; color: #4CAF50; text-decoration: none;">View Job Posting →</a>` : ''}
          </div>
        `;
      }
      
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = detailHTML;
      
      // Add close button listener
      document.getElementById('close-detail-btn').addEventListener('click', closeHistoryDetail);
    } catch (e) {
      console.error('Failed to parse history item:', e);
      alert('Failed to load history details. The data might be corrupted.');
    }
  });
};

window.closeHistoryDetail = function() {
  loadHistory();
};

function copyAnalysis(index, buttonElement) {
  chrome.storage.local.get(['history'], (result) => {
    const item = result.history[index];
    if (!item) {
      console.error('History item not found:', index);
      return;
    }
    
    try {
      const analysis = JSON.parse(item.analysis);
      const text = `Job: ${item.jobTitle}
Date: ${new Date(item.date).toLocaleDateString()}

Match Score: ${analysis.matchScore}%

Skill Gaps:
${(analysis.gaps || []).map((gap, i) => `${i + 1}. ${gap}`).join('\n')}

${analysis.scamDetection?.salaryRange ? `Estimated Salary: ${analysis.scamDetection.salaryRange}` : ''}

${analysis.scamDetection?.isScam ? `⚠️ Warning: ${analysis.scamDetection.reason}` : ''}

${item.url ? `Job URL: ${item.url}` : ''}`;
      
      navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '✓';
        buttonElement.style.color = '#4CAF50';
        setTimeout(() => {
          buttonElement.textContent = originalText;
          buttonElement.style.color = '';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      });
    } catch (e) {
      console.error('Failed to parse history item:', e);
      // Fallback: copy raw analysis
      navigator.clipboard.writeText(item.analysis).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      });
    }
  });
}

function deleteAnalysis(index) {
  if (confirm('Delete this analysis?\n\nThis action cannot be undone.')) {
    chrome.storage.local.get(['history'], (result) => {
      const history = result.history || [];
      if (index >= 0 && index < history.length) {
        history.splice(index, 1);
        chrome.storage.local.set({ history }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to delete:', chrome.runtime.lastError);
            alert('Failed to delete analysis');
          } else {
            console.log('Analysis deleted successfully');
            loadHistory();
          }
        });
      }
    });
  }
}


function downloadAsPNG(index, buttonElement) {
  chrome.storage.local.get(['history'], (result) => {
    const item = result.history[index];
    if (!item) {
      console.error('History item not found:', index);
      return;
    }
    
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Fypod Analysis', 40, 60);
      
      // Job Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      const title = item.jobTitle || 'Job Analysis';
      wrapText(ctx, title, 40, 120, 720, 30);
      
      let yPos = 180;
      
      // Check if quiz or analysis
      if (item.type === 'quiz' && item.quizData) {
        const quizData = JSON.parse(item.quizData);
        
        // Mode badge
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.fillRect(40, yPos, 150, 30);
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px Arial';
        ctx.fillText(`${quizData.mode} Mode`, 50, yPos + 20);
        
        yPos += 60;
        
        // Questions & Answers
        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        ctx.fillText('QUESTIONS & ANSWERS', 40, yPos);
        yPos += 30;
        
        quizData.questions.forEach((qa, i) => {
          ctx.fillStyle = '#CCCCCC';
          ctx.font = 'bold 16px Arial';
          ctx.fillText(`Q${i + 1}:`, 40, yPos);
          yPos += 25;
          
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '14px Arial';
          yPos = wrapText(ctx, qa.question, 40, yPos, 720, 20);
          yPos += 10;
          
          ctx.fillStyle = '#888888';
          ctx.font = '12px Arial';
          ctx.fillText('Answer:', 40, yPos);
          yPos += 20;
          
          ctx.fillStyle = '#999999';
          yPos = wrapText(ctx, qa.answer, 40, yPos, 720, 18);
          yPos += 30;
        });
        
      } else {
        const analysis = JSON.parse(item.analysis);
        
        // Match Score Circle
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(400, yPos + 50, 40, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${analysis.matchScore}%`, 400, yPos + 60);
        ctx.textAlign = 'left';
        
        ctx.fillStyle = '#888888';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Match Score', 400, yPos + 110);
        ctx.textAlign = 'left';
        
        yPos += 160;
        
        // Skill Gaps
        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        ctx.fillText('SKILL GAP ANALYSIS', 40, yPos);
        yPos += 30;
        
        (analysis.gaps || []).forEach((gap, i) => {
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '14px Arial';
          yPos = wrapText(ctx, `${i + 1}. ${gap}`, 40, yPos, 720, 22);
          yPos += 10;
        });
        
        // Salary
        if (analysis.scamDetection?.salaryRange) {
          yPos += 20;
          ctx.fillStyle = '#888888';
          ctx.font = '14px Arial';
          ctx.fillText(`Est. Salary: ${analysis.scamDetection.salaryRange}`, 40, yPos);
          yPos += 30;
        }
      }
      
      // Footer
      yPos = canvas.height - 40;
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.fillText(`Generated by Fypod • ${new Date(item.date).toLocaleDateString()}`, 40, yPos);
      
      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fypod-${item.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Show feedback
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '✓';
        buttonElement.style.color = '#4CAF50';
        setTimeout(() => {
          buttonElement.textContent = originalText;
          buttonElement.style.color = '';
        }, 1500);
      });
      
    } catch (e) {
      console.error('Failed to generate PNG:', e);
      alert('Failed to generate PNG');
    }
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}
