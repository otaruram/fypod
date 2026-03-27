// Quiz Module - Handle quiz functionality
const QuizModule = {
  // Show quiz mode selection
  showModeSelection(questions) {
    const container = document.getElementById('quiz-container');
    
    container.innerHTML = `
      <div class="quiz-mode-selection">
        <h4 style="font-size: 13px; margin-bottom: 16px; text-align: center;">Choose Quiz Mode</h4>
        <div class="mode-options">
          <button class="mode-btn" data-mode="essay">
            <div class="mode-icon">📝</div>
            <div class="mode-title">Essay Mode</div>
            <div class="mode-desc">Write detailed answers</div>
          </button>
          <button class="mode-btn" data-mode="multiple-choice">
            <div class="mode-icon">✓</div>
            <div class="mode-title">Multiple Choice</div>
            <div class="mode-desc">Select best answers</div>
          </button>
        </div>
      </div>
    `;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode === 'essay') {
          this.showEssayQuiz(questions, container);
        } else {
          this.showMultipleChoiceQuiz(questions, container);
        }
      });
    });
  },
  
  // Show essay quiz
  showEssayQuiz(questions, container) {
    container.innerHTML = `
      <div class="quiz-header">
        <h4 style="font-size: 13px; margin-bottom: 8px;">📝 Essay Mode</h4>
        <p style="font-size: 11px; color: #888;">Answer all questions with detailed explanations</p>
      </div>
      <div class="quiz-questions">
        ${questions.map((q, i) => `
          <div class="question-card">
            <div class="question-number">Question ${i + 1} of ${questions.length}</div>
            <div class="question-text">${q}</div>
            <textarea id="essay-answer-${i}" class="essay-textarea" placeholder="Write your detailed answer here..." rows="6"></textarea>
          </div>
        `).join('')}
      </div>
      <button id="submit-quiz-btn" class="submit-quiz-btn">Submit All Answers</button>
      <div id="quiz-feedback" class="quiz-feedback" style="display: none;"></div>
    `;
    
    document.getElementById('submit-quiz-btn').addEventListener('click', () => {
      this.submitEssayQuiz(questions);
    });
  },

  // Show multiple choice quiz
  showMultipleChoiceQuiz(questions, container) {
    const mcQuestions = questions.map((q, i) => ({
      question: q,
      options: [
        `Option A - Detailed technical approach`,
        `Option B - Standard industry practice`,
        `Option C - Alternative solution method`,
        `Option D - Comprehensive strategy`
      ]
    }));
    
    container.innerHTML = `
      <div class="quiz-header">
        <h4 style="font-size: 13px; margin-bottom: 8px;">✓ Multiple Choice Mode</h4>
        <p style="font-size: 11px; color: #888;">Select the best answer for each question</p>
      </div>
      <div class="quiz-questions">
        ${mcQuestions.map((item, i) => `
          <div class="question-card">
            <div class="question-number">Question ${i + 1} of ${questions.length}</div>
            <div class="question-text">${item.question}</div>
            <div class="mc-options">
              ${item.options.map((opt, j) => `
                <label class="mc-option">
                  <input type="radio" name="question-${i}" value="${String.fromCharCode(65 + j)}" data-index="${i}">
                  <span class="mc-label">${String.fromCharCode(65 + j)}. ${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <button id="submit-quiz-btn" class="submit-quiz-btn">Submit All Answers</button>
      <div id="quiz-feedback" class="quiz-feedback" style="display: none;"></div>
    `;
    
    document.getElementById('submit-quiz-btn').addEventListener('click', () => {
      this.submitMultipleChoiceQuiz(questions);
    });
  },
  
  // Submit essay quiz
  async submitEssayQuiz(questions) {
    const answers = this._collectEssayAnswers(questions);
    
    if (!answers) {
      alert('⚠️ Please answer all questions before submitting.');
      return;
    }
    
    const submitBtn = document.getElementById('submit-quiz-btn');
    const feedbackDiv = document.getElementById('quiz-feedback');
    
    this._setSubmitting(submitBtn, true);
    
    try {
      const settings = await StorageManager.getSettings();
      const evaluation = await APIService.evaluateQuiz(
        answers,
        settings.apiKey,
        settings.defaultModel,
        'Essay'
      );
      
      await this._saveQuizToHistory('Essay', answers, evaluation);
      this._displayFeedback(feedbackDiv, evaluation, submitBtn);
      
    } catch (error) {
      this._displayError(feedbackDiv, error.message, submitBtn);
    }
  },
  
  // Submit multiple choice quiz
  async submitMultipleChoiceQuiz(questions) {
    const answers = this._collectMCAnswers(questions);
    
    if (!answers) {
      alert('⚠️ Please answer all questions before submitting.');
      return;
    }
    
    const submitBtn = document.getElementById('submit-quiz-btn');
    const feedbackDiv = document.getElementById('quiz-feedback');
    
    this._setSubmitting(submitBtn, true);
    
    try {
      const settings = await StorageManager.getSettings();
      const evaluation = await APIService.evaluateQuiz(
        answers,
        settings.apiKey,
        settings.defaultModel,
        'Multiple Choice'
      );
      
      await this._saveQuizToHistory('Multiple Choice', answers, evaluation);
      this._displayFeedback(feedbackDiv, evaluation, submitBtn);
      
    } catch (error) {
      this._displayError(feedbackDiv, error.message, submitBtn);
    }
  },
  
  // Helper methods
  _collectEssayAnswers(questions) {
    const answers = [];
    
    for (let i = 0; i < questions.length; i++) {
      const answer = document.getElementById(`essay-answer-${i}`).value.trim();
      if (!answer) return null;
      
      answers.push({
        question: questions[i],
        answer: answer
      });
    }
    
    return answers;
  },
  
  _collectMCAnswers(questions) {
    const answers = [];
    
    for (let i = 0; i < questions.length; i++) {
      const selected = document.querySelector(`input[name="question-${i}"]:checked`);
      if (!selected) return null;
      
      answers.push({
        question: questions[i],
        answer: selected.value
      });
    }
    
    return answers;
  },
  
  _setSubmitting(button, isSubmitting) {
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Analyzing your answers...' : 'Submit All Answers';
    button.style.opacity = isSubmitting ? '0.6' : '1';
  },
  
  _displayFeedback(feedbackDiv, evaluation, submitBtn) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
      <div class="feedback-header">
        <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
        <h4 style="font-size: 14px; margin-bottom: 16px;">AI Evaluation Results</h4>
      </div>
      <div class="feedback-content">
        ${evaluation.split('\n').map(line => `<p style="margin-bottom: 12px; line-height: 1.6;">${line}</p>`).join('')}
      </div>
    `;
    
    submitBtn.style.display = 'none';
    feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
  
  _displayError(feedbackDiv, errorMessage, submitBtn) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
      <div style="color: #ff6b6b; text-align: center; padding: 20px;">
        <p style="font-size: 14px; margin-bottom: 8px;">❌ Evaluation Failed</p>
        <p style="font-size: 12px;">${errorMessage}</p>
      </div>
    `;
    
    this._setSubmitting(submitBtn, false);
  },
  
  async _saveQuizToHistory(mode, answers, evaluation) {
    const jobTitle = DOMUtils.extractJobTitle();
    
    const quizData = {
      mode: mode,
      questions: answers.map(a => ({
        question: a.question,
        answer: a.answer
      })),
      evaluation: evaluation,
      date: Date.now()
    };
    
    const historyItem = {
      date: Date.now(),
      jobTitle: `${jobTitle} - Quiz (${mode})`,
      url: window.location.href,
      type: 'quiz',
      quizData: JSON.stringify(quizData)
    };
    
    await StorageManager.saveToHistory(historyItem);
  }
};
