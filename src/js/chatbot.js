// Ucing Chatbot - AI HR Professional Assistant
const UcingChatbot = {
  conversationHistory: [],
  currentContext: null,
  
  // Initialize chatbot with context
  init(analysisData, cvData, jobDescription) {
    this.currentContext = {
      analysis: analysisData,
      cvData: cvData,
      jobDescription: jobDescription,
      timestamp: Date.now()
    };
    this.conversationHistory = [];
  },
  
  // Render chat interface
  renderChatUI(container) {
    container.innerHTML = `
      <div class="ucing-chat-container">
        <div class="ucing-header">
          <div class="ucing-avatar">🐱</div>
          <div class="ucing-info">
            <div class="ucing-name">Ucing</div>
            <div class="ucing-status">HR Professional AI • Online</div>
          </div>
          <button id="close-chat-btn" class="chat-close-btn">×</button>
        </div>
        
        <div class="ucing-messages" id="ucing-messages">
          <div class="ucing-message bot">
            <div class="message-avatar">🐱</div>
            <div class="message-content">
              <div class="message-text">
                Hi! I'm Ucing, your AI HR assistant 👋
                <br><br>
                I've analyzed your CV and this job posting. I can help you with:
                <br>
                • Career advice & growth strategies
                <br>
                • Interview preparation tips
                <br>
                • Skill development recommendations
                <br>
                • Salary negotiation guidance
                <br>
                • Learning resources & courses
                <br><br>
                What would you like to discuss? 😊
              </div>
            </div>
          </div>
        </div>
        
        <div class="ucing-quick-actions">
          <button class="quick-action-btn" data-action="interview">🎯 Interview Tips</button>
          <button class="quick-action-btn" data-action="skills">📚 Skill Gaps</button>
          <button class="quick-action-btn" data-action="salary">💰 Salary Advice</button>
          <button class="quick-action-btn" data-action="career">📈 Career Path</button>
        </div>
        
        <div class="ucing-input-area">
          <textarea 
            id="ucing-input" 
            placeholder="Ask me anything about this job, your career, or interview prep..."
            rows="2"
          ></textarea>
          <button id="ucing-send-btn" class="ucing-send-btn">
            <span>Send</span>
            <span class="send-icon">➤</span>
          </button>
        </div>
      </div>
    `;
    
    this._setupEventListeners();
  },
  
  // Setup event listeners
  _setupEventListeners() {
    const sendBtn = document.getElementById('ucing-send-btn');
    const input = document.getElementById('ucing-input');
    const closeBtn = document.getElementById('close-chat-btn');
    
    sendBtn.addEventListener('click', () => this._sendMessage());
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._sendMessage();
      }
    });
    
    closeBtn.addEventListener('click', () => {
      document.querySelector('.ucing-chat-container').style.display = 'none';
      document.querySelector('.fypod-results').style.display = 'block';
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this._handleQuickAction(action);
      });
    });
  },
  
  // Handle quick actions
  _handleQuickAction(action) {
    const prompts = {
      interview: "Give me specific interview tips for this role based on my CV and the job requirements. Include 3 key areas I should focus on.",
      skills: "Based on my skill gaps, create a detailed learning roadmap with specific courses and resources I should study.",
      salary: "What salary range should I negotiate for this position? Consider my experience, the market rate, and the company type.",
      career: "Analyze my career trajectory if I take this job. What are the growth opportunities and next steps in 2-3 years?"
    };
    
    const input = document.getElementById('ucing-input');
    input.value = prompts[action];
    this._sendMessage();
  },
  
  // Send message
  async _sendMessage() {
    const input = document.getElementById('ucing-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    this._addMessageToUI(message, 'user');
    input.value = '';
    
    // Show typing indicator
    this._showTypingIndicator();
    
    try {
      // Get AI response
      const response = await this._getAIResponse(message);
      
      // Remove typing indicator
      this._removeTypingIndicator();
      
      // Add bot response to UI
      this._addMessageToUI(response, 'bot');
      
      // Save to conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );
      
    } catch (error) {
      this._removeTypingIndicator();
      this._addMessageToUI(
        "Sorry, I encountered an error. Please try again! 😿",
        'bot'
      );
      console.error('Ucing chat error:', error);
    }
  },
  
  // Get AI response
  async _getAIResponse(userMessage) {
    const settings = await StorageManager.getSettings();
    
    // Build context-aware prompt
    const systemPrompt = this._buildSystemPrompt();
    const contextPrompt = this._buildContextPrompt(userMessage);
    
    const response = await fetch(CONFIG.API.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.defaultModel || CONFIG.API.DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory,
          { role: 'user', content: contextPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) throw new Error('Failed to get response');
    
    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  // Build system prompt
  _buildSystemPrompt() {
    return `You are Ucing 🐱, an expert HR professional AI assistant equivalent to Google's top recruiters.

PERSONALITY:
- Friendly, warm, and encouraging
- Professional but approachable
- Bilingual (English & Indonesian) - respond in the language user uses
- Use emojis occasionally to be friendly
- Give specific, actionable advice

EXPERTISE:
- Career counseling & growth strategies
- Interview preparation & techniques
- Skill development & learning paths
- Salary negotiation tactics
- Tech industry insights
- Company culture analysis

RESPONSE STYLE:
- Be concise but comprehensive (3-5 paragraphs max)
- Use bullet points for clarity
- Include specific examples when possible
- Provide actionable next steps
- Add relevant learning resources/links when helpful
- Be encouraging and supportive

IMPORTANT:
- Always base advice on the provided context (CV, job analysis, insights)
- Be honest about challenges but focus on solutions
- Tailor advice to the specific job and user's background
- If asked about salary, give realistic ranges with reasoning`;
  },
  
  // Build context prompt
  _buildContextPrompt(userMessage) {
    const ctx = this.currentContext;
    
    return `USER QUESTION: ${userMessage}

CONTEXT YOU HAVE ACCESS TO:

1. JOB ANALYSIS:
- Match Score: ${ctx.analysis.matchScore}%
- Skill Gaps: ${ctx.analysis.gaps.join(', ')}
- Salary Range: ${ctx.analysis.scamDetection?.salaryRange || 'Not specified'}
${ctx.analysis.insights ? `
- Career Growth: ${ctx.analysis.insights.careerGrowth?.score}/5 - ${ctx.analysis.insights.careerGrowth?.reason}
- Tech Modernity: ${ctx.analysis.insights.techModernity?.score}/5 - ${ctx.analysis.insights.techModernity?.reason}
- Work-Life Balance: ${ctx.analysis.insights.workLifeBalance}
- Culture Fit: ${ctx.analysis.insights.cultureFit}
- Learning Opportunities: ${ctx.analysis.insights.learningOpportunities}
` : ''}

2. INTERVIEW QUESTIONS:
${ctx.analysis.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}

3. JOB DESCRIPTION EXCERPT:
${ctx.jobDescription.substring(0, 500)}...

Based on this context, provide helpful, specific advice. Include links to learning resources when relevant (Coursera, Udemy, freeCodeCamp, etc).`;
  },
  
  // Add message to UI
  _addMessageToUI(message, type) {
    const messagesContainer = document.getElementById('ucing-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ucing-message ${type}`;
    
    if (type === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">🐱</div>
        <div class="message-content">
          <div class="message-text">${this._formatMessage(message)}</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="message-text">${this._escapeHtml(message)}</div>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Show typing indicator
  _showTypingIndicator() {
    const messagesContainer = document.getElementById('ucing-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ucing-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">🐱</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Remove typing indicator
  _removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  },
  
  // Format message (convert markdown-like syntax to HTML)
  _formatMessage(message) {
    return message
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  },
  
  // Escape HTML
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
