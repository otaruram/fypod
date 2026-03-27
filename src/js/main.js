// Main Controller - Orchestrate all modules
const FypodApp = {
  modal: null,
  currentAnalysis: null,
  
  async init() {
    const settings = await StorageManager.getSync(['portalMode']);
    const mode = settings.portalMode || 'linkedin';
    
    if (DOMUtils.isJobPage(mode)) {
      this.modal = DOMUtils.getOrCreateModal();
      this.showIconButton();
    }
  },
  
  showIconButton() {
    UIComponents.renderIconButton(this.modal, () => this.startAnalysis());
  },
  
  async startAnalysis() {
    try {
      const jobDescription = DOMUtils.extractJobDescription();
      
      if (!jobDescription || jobDescription === 'No job description found') {
        alert('⚠️ Could not find job description on this page.\n\nPlease make sure you are on a job posting page.');
        return;
      }
      
      const settings = await StorageManager.getSettings();
      
      // Validate settings
      if (!settings.cvData) {
        alert('⚠️ Please upload your CV first!\n\n1. Click Fypod icon in toolbar\n2. Go to Setup tab\n3. Upload your CV (PDF)');
        return;
      }
      
      if (!settings.apiKey) {
        alert('⚠️ Please set your API key first!\n\n1. Click Fypod icon in toolbar\n2. Go to Setup tab\n3. Enter your Sumopod API key');
        return;
      }
      
      // Show loading
      UIComponents.renderLoading(this.modal, () => this.showIconButton());
      
      // Perform analysis
      const analysis = await APIService.analyzeJob(
        jobDescription,
        settings.cvData,
        settings.apiKey,
        settings.defaultModel
      );
      
      this.currentAnalysis = analysis;
      
      // Save to history
      await this.saveAnalysisToHistory(analysis);
      
      // Display results
      const questions = (analysis.questions || []).slice(0, 3);
      UIComponents.renderResults(
        this.modal,
        analysis,
        questions,
        () => this.showIconButton(),
        (qs) => this.startQuiz(qs)
      );
      
    } catch (error) {
      console.error('Fypod Analysis Error:', error);
      UIComponents.renderError(this.modal, error.message, () => this.showIconButton());
    }
  },
  
  startQuiz(questions) {
    QuizModule.showModeSelection(questions);
  },
  
  async saveAnalysisToHistory(analysis) {
    const jobTitle = DOMUtils.extractJobTitle();
    
    const historyItem = {
      date: Date.now(),
      jobTitle: jobTitle,
      url: window.location.href,
      analysis: JSON.stringify(analysis)
    };
    
    await StorageManager.saveToHistory(historyItem);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FypodApp.init());
} else {
  FypodApp.init();
}
