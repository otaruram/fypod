// API Service - Handle AI API Calls
const APIService = {
  async analyzeJob(jobDesc, cvData, apiKey, model) {
    const prompt = this._buildAnalysisPrompt(jobDesc);
    
    try {
      const response = await fetch(CONFIG.API.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || CONFIG.API.DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a Senior Tech Recruiter and Career Architect. Analyze CVs against job descriptions and provide detailed feedback in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: CONFIG.API.MAX_TOKENS
        })
      });
      
      if (!response.ok) {
        throw this._handleAPIError(response);
      }
      
      const data = await response.json();
      return this._parseAnalysisResponse(data);
      
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  },
  
  async evaluateQuiz(answers, apiKey, model, mode) {
    const prompt = this._buildQuizPrompt(answers, mode);
    
    const response = await fetch(CONFIG.API.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || CONFIG.API.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer providing detailed, constructive feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    
    if (!response.ok) {
      throw new Error('Evaluation failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  _buildAnalysisPrompt(jobDesc) {
    return `You are an elite Tech Recruiter AI. Analyze this job posting and provide ONLY JSON output.

Job Description:
${jobDesc}

CRITICAL REQUIREMENTS:
1. Calculate Match Score (0-100) - Be realistic, most candidates are 40-70%
2. Identify EXACTLY 3 Key Skills Missing (if any) - Suggest specific Fydemy courses
3. Detect Scam/MLM patterns - Check for: unrealistic salary, vague JD, pyramid language, "be your own boss"
4. Estimate salary based on tech stack and market data
5. Generate EXACTLY 3 Technical "Kill-Questions" - These should be deep, scenario-based questions that test real understanding

OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
{
  "matchScore": <number 0-100>,
  "gaps": [
    "Missing: <skill> → Fydemy: '<course name>'",
    "Missing: <skill> → Fydemy: '<course name>'",
    "Missing: <skill> → Fydemy: '<course name>'"
  ],
  "scamDetection": {
    "isScam": <boolean>,
    "reason": "<brief reason if scam>",
    "salaryRange": "<realistic range with currency>"
  },
  "questions": [
    "<Deep technical question 1>",
    "<Deep technical question 2>",
    "<Deep technical question 3>"
  ]
}

RULES:
- Output ONLY the JSON object, no extra text
- If less than 3 gaps, still provide 3 items (can say "No major gap in X")
- Questions must be scenario-based, not trivia
- Salary must include currency (USD/IDR/etc)
- Be brutally honest about match score`;
  },
  
  _buildQuizPrompt(answers, mode) {
    const answerText = answers.map((item, i) => `
Question ${i + 1}: ${item.question}
${mode === 'Essay' ? 'Answer' : 'Selected Answer'}: ${item.answer}
`).join('\n');
    
    if (mode === 'Essay') {
      return `You are a technical interviewer. Evaluate these essay answers:

${answerText}

IMPORTANT: Provide feedback in PLAIN TEXT format without any markdown symbols (no ##, **, __, --, etc).

Provide concise feedback in this format:

Overall Score: X/10

Strengths:
• [point 1]
• [point 2]

Areas for Improvement:
• [point 1]
• [point 2]

Question 1 Feedback:
[brief, focused feedback]

Question 2 Feedback:
[brief, focused feedback]

Question 3 Feedback:
[brief, focused feedback]

Keep it simple, clean, and actionable. No markdown formatting.`;
    } else {
      return `You are a technical interviewer. Evaluate these multiple choice answers:

${answerText}

IMPORTANT: Provide feedback in PLAIN TEXT format without any markdown symbols (no ##, **, __, --, etc).

Provide concise feedback in this format:

Overall Score: X/10

Question 1: [Correct/Incorrect]
[brief explanation why]

Question 2: [Correct/Incorrect]
[brief explanation why]

Question 3: [Correct/Incorrect]
[brief explanation why]

Key Takeaways:
• [concept 1]
• [concept 2]
• [concept 3]

Recommendations:
[brief, actionable advice]

Keep it simple, clean, and focused. No markdown formatting.`;
    }
  },
  
  _parseAnalysisResponse(data) {
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return {
        matchScore: 0,
        gaps: ['Unable to parse analysis. Please try again.'],
        scamDetection: { isScam: false, confidence: 0, salaryRange: 'Unknown' },
        questions: []
      };
    }
  },
  
  _handleAPIError(response) {
    if (response.status === 401) {
      return new Error('Unauthorized: Invalid API key');
    } else if (response.status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    } else {
      return new Error(`API error (${response.status})`);
    }
  }
};
