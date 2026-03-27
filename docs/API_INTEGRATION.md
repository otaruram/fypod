# Fypod API Integration Guide

## Sumopod AI API Endpoints

Base URL: `https://ai.sumopod.com`

### 1. Analysis Endpoint
```javascript
POST https://ai.sumopod.com/v1/chat/completions
```

**Request:**
```json
{
  "model": "claude-haiku-4-5|glm-5.1|gpt-5.2|gpt-4.1-mini|gemini/gemini-2.5-pro|kimi-k2",
  "messages": [
    {
      "role": "system",
      "content": "You are a Senior Tech Recruiter..."
    },
    {
      "role": "user",
      "content": "Job Description: ... Analyze this..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "matchScore": 75,
  "gaps": [
    "Missing: Kubernetes experience",
    "Recommended: Fydemy course 'K8s Mastery'"
  ],
  "scamDetection": {
    "isScam": false,
    "confidence": 0.95,
    "salaryRange": "$80k-$120k"
  },
  "questions": [
    "How would you design a fault-tolerant system...",
    "Explain your approach to microservices...",
    "Describe a time you optimized performance..."
  ]
}
```

### 2. Evaluation Endpoint
```javascript
POST https://api.sumopod.com/v1/chat/completions
```

**Request:**
```json
{
  "model": "claude-haiku-4-5",
  "messages": [
    {
      "role": "system",
      "content": "You are a technical interviewer. Evaluate answers..."
    },
    {
      "role": "user",
      "content": "Question: ... Candidate Answer: ..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 300
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Your answer is solid on logic, but lacks depth in 'Scalability'. Try mentioning Azure Load Balancers."
      }
    }
  ]
}
```

## Available Models

Fypod supports multiple AI models via Sumopod API:

- **claude-haiku-4-5**: Fast, efficient, great for quick analysis
- **glm-5.1**: Chinese model, good for multilingual support
- **gpt-5.2**: Latest GPT model, most advanced reasoning
- **gpt-4.1-mini**: Balanced speed and quality
- **gemini/gemini-2.5-pro**: Google's latest, excellent for technical analysis
- **kimi-k2**: Specialized model with long context window

## System Prompt Template

The AI prompt used in analysis:

```
Act as a Senior Tech Recruiter and Career Architect. Analyze the provided CV against the Job Description.

Job Description:
{JOB_DESCRIPTION}

CV Summary:
{CV_EXTRACTED_TEXT}

Provide analysis in JSON format with:

1. matchScore: Integer 0-100 based on technical depth and experience alignment
2. gaps: Array of missing skills with Fydemy course recommendations
3. scamDetection: Object with isScam boolean, confidence score, and salaryRange estimate
4. questions: Array of 3 Google-level technical essay questions tailored to this JD

Guidelines:
- Be direct and professional
- Flag suspicious patterns (MLM, pyramid schemes, unrealistic promises)
- Questions should test deep technical understanding, not trivia
- Salary estimates based on market data for the role and location
- Course recommendations must be specific and actionable

Output strictly in English.
```

## Error Handling

Handle these error cases in `content.js`:

```javascript
try {
  const response = await fetch(API_ENDPOINT, options);
  
  if (response.status === 401) {
    alert('Invalid API key. Please check your Sumopod API key.');
    return;
  }
  
  if (response.status === 429) {
    alert('Rate limit exceeded. Please try again in a few minutes.');
    return;
  }
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
  
} catch (error) {
  console.error('Fypod API Error:', error);
  alert('Analysis failed. Please check your connection and try again.');
}
```

## Rate Limiting

Implement client-side rate limiting:

```javascript
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000 // 1 minute
};

let requestCount = 0;
let windowStart = Date.now();

function checkRateLimit() {
  const now = Date.now();
  
  if (now - windowStart > RATE_LIMIT.windowMs) {
    requestCount = 0;
    windowStart = now;
  }
  
  if (requestCount >= RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please wait a minute.');
  }
  
  requestCount++;
}
```

## Testing

Test API integration with curl:

```bash
curl -X POST https://ai.sumopod.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "claude-haiku-4-5",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Say hello"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

## Security Notes

1. Never log API keys to console
2. Use HTTPS only
3. Validate all user inputs before sending to API
4. Sanitize API responses before displaying
5. Store API keys encrypted in Chrome storage
