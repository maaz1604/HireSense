/**
 * AI Service
 * Following Open/Closed Principle - Extensible for different AI providers
 * Following Dependency Inversion Principle - Depends on abstractions (AI interface)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { JOB_ROLE } from '../constants/interviewConfig';

class AIService {
  constructor(apiKey, modelName = 'gemini-2.0-flash-exp') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  /**
   * Checks if error is due to API limit/quota exceeded
   * @param {Error} error - The error object
   * @returns {boolean} True if it's a quota/limit error
   */
  isQuotaExceededError(error) {
    const errorMessage = error.message?.toLowerCase() || '';
    return errorMessage.includes('quota') || 
           errorMessage.includes('limit') || 
           errorMessage.includes('429') ||
           errorMessage.includes('resource_exhausted') ||
           errorMessage.includes('api key') ||
           error.status === 429;
  }

  /**
   * Gets user-friendly error message
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */
  getErrorMessage(error) {
    if (this.isQuotaExceededError(error)) {
      return '⚠️ API Limit Exceeded: The Gemini API quota has been reached. Please try again later or contact support.';
    }
    return error.message || 'An unexpected error occurred';
  }

  /**
   * Gets a model instance
   * @returns {Object} Generative AI model
   */
  getModel() {
    return this.genAI.getGenerativeModel({ model: this.modelName });
  }

  /**
   * Generates an interview question based on difficulty and context
   * @param {string} difficulty - Question difficulty (Easy/Medium/Hard)
   * @param {number} questionNumber - Current question number
   * @param {string} resumeText - Candidate's resume text
   * @param {Array} previousQuestions - Array of previous questions
   * @returns {Promise<string>} Generated question
   */
  async generateQuestion(difficulty, questionNumber, resumeText, previousQuestions = []) {
    try {
      const model = this.getModel();
      
      const resumeSummary = resumeText.substring(0, 1000);
      const previousQuestionsText = previousQuestions.join('\\n');
      
      const prompt = `You are conducting a technical interview for a ${JOB_ROLE} position.

Candidate's Resume Summary:
${resumeSummary}

Previous Questions Asked:
${previousQuestionsText || 'None - this is the first question'}

Generate a ${difficulty} level question (Question #${questionNumber} of 6) that tests:
- For React: Components, Hooks, State Management, Performance Optimization
- For Node.js: Express, APIs, Middleware, Database Integration, Authentication

Requirements:
1. Make it specific to Full Stack Development with React and Node.js
2. ${difficulty === 'Easy' ? 'Focus on fundamental concepts and basic implementation' : difficulty === 'Medium' ? 'Test practical application and problem-solving skills' : 'Challenge advanced understanding, system design, and best practices'}
3. The question should be clear and answerable in ${difficulty === 'Easy' ? '20 seconds' : difficulty === 'Medium' ? '60 seconds' : '2 minutes'}
4. Do NOT repeat topics from previous questions
5. Return ONLY the question, no preamble or explanations

Question:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const question = response.text().trim();
      
      return question || `What is your experience with ${difficulty.toLowerCase()}-level ${JOB_ROLE} development?`;
    } catch (error) {
      console.error('Error generating question:', error);
      
      if (this.isQuotaExceededError(error)) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`Failed to generate question: ${error.message}`);
    }
  }

  /**
   * Evaluates an answer and provides a score
   * @param {string} question - The question that was asked
   * @param {string} answer - The candidate's answer
   * @param {string} difficulty - Question difficulty
   * @returns {Promise<Object>} { score: number, feedback: string }
   */
  async evaluateAnswer(question, answer, difficulty) {
    try {
      const model = this.getModel();
      
      const prompt = `You are evaluating an interview answer for a ${JOB_ROLE} position.

Difficulty Level: ${difficulty}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and provide:
1. A score from 0-10 (where 10 is excellent and 0 is completely incorrect)
2. Brief feedback (1-2 sentences)

Scoring criteria:
- Technical accuracy (50%)
- Completeness (25%)
- Clarity of explanation (25%)

For ${difficulty} difficulty:
${difficulty === 'Easy' ? '- Expect basic understanding and correct fundamentals' : difficulty === 'Medium' ? '- Expect practical knowledge and problem-solving approach' : '- Expect deep technical knowledge, best practices, and system thinking'}

Return in this exact format:
Score: [number]
Feedback: [feedback text]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      const scoreMatch = text.match(/Score:\\s*(\\d+)/i);
      const feedbackMatch = text.match(/Feedback:\\s*(.+)/is);
      
      const score = scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1]), 0), 10) : 5;
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Answer received.';
      
      return { score, feedback };
    } catch (error) {
      console.error('Error evaluating answer:', error);
      
      if (this.isQuotaExceededError(error)) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      return { score: 5, feedback: 'Unable to evaluate. Default score assigned.' };
    }
  }

  /**
   * Generates a final summary for the candidate
   * @param {Object} candidateInfo - Candidate information
   * @param {Array} questionsAndAnswers - Array of {question, answer, score, difficulty}
   * @param {number} finalScore - Final percentage score
   * @returns {Promise<string>} AI-generated summary
   */
  async generateSummary(candidateInfo, questionsAndAnswers, finalScore) {
    try {
      const model = this.getModel();
      
      const qaText = questionsAndAnswers.map((qa, idx) => 
        `Q${idx + 1} (${qa.difficulty}): ${qa.question}\\nA: ${qa.answer}\\nScore: ${qa.score}/10`
      ).join('\\n\\n');
      
      const prompt = `Generate a professional interview summary for this ${JOB_ROLE} candidate.

Candidate: ${candidateInfo.name}
Email: ${candidateInfo.email}
Final Score: ${finalScore}%

Interview Questions & Answers:
${qaText}

Provide a concise 3-4 sentence summary covering:
1. Overall performance and technical strengths
2. Areas that need improvement
3. Hiring recommendation (Strongly Recommend / Recommend / Consider / Do Not Recommend)

Keep it professional and constructive.

Summary:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text().trim();
      
      return summary || `Candidate ${candidateInfo.name} completed the interview with a score of ${finalScore}%.`;
    } catch (error) {
      console.error('Error generating summary:', error);
      
      if (this.isQuotaExceededError(error)) {
        return `Candidate ${candidateInfo.name} completed the interview with a score of ${finalScore}%. (API limit exceeded - detailed summary unavailable)`;
      }
      
      return `Candidate ${candidateInfo.name} completed the interview with a score of ${finalScore}%. Unable to generate detailed summary.`;
    }
  }

  /**
   * Extracts information from resume text
   * @param {string} resumeText - Raw resume text
   * @returns {Promise<Object>} Extracted info {name, email, phone}
   */
  async extractResumeInfo(resumeText) {
    try {
      // Check if we have quota issues
      if (this.isQuotaExceededError({ message: 'pre-check' })) {
        throw new Error('QUOTA_EXCEEDED');
      }

      const model = this.getModel();
      
      // First, try with regex patterns for common information
      const regexExtracted = this.extractWithRegex(resumeText);
      
      // Enhanced prompt for better extraction
      const prompt = `Analyze this resume text and extract the personal contact information.
Look for:
- Full name (usually at the top, could be the candidate's name)
- Email address (contains @ symbol)
- Phone number (various formats like +1-xxx-xxx-xxxx, (xxx) xxx-xxxx, xxx.xxx.xxxx, etc.)

Resume text:
${resumeText.substring(0, 3000)}

Return ONLY a valid JSON object with these exact keys: name, email, phone.
If any field is not clearly found, use an empty string "".
Do not include any markdown formatting, explanations, or code blocks.

Example format:
{"name":"John Doe","email":"john.doe@email.com","phone":"+1-234-567-8900"}`;

      console.log('Resume text preview:', resumeText.substring(0, 500));
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let jsonText = response.text().trim();
      
      console.log('AI response:', jsonText);
      
      // Clean up the response
      jsonText = jsonText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        .trim();
      
      // Try to extract JSON from the response
      let extracted = { name: '', email: '', phone: '' };
      
      try {
        // Try direct JSON parse first
        const parsed = JSON.parse(jsonText);
        extracted = {
          name: (parsed.name || '').trim(),
          email: (parsed.email || '').trim(),
          phone: (parsed.phone || '').trim()
        };
      } catch (parseError) {
        // Try to find JSON object in the text
        const jsonMatch = jsonText.match(/\{[^}]*"name"[^}]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          extracted = {
            name: (parsed.name || '').trim(),
            email: (parsed.email || '').trim(),
            phone: (parsed.phone || '').trim()
          };
        }
      }
      
      // Merge with regex results if AI didn't find everything
      const finalResult = {
        name: extracted.name || regexExtracted.name,
        email: extracted.email || regexExtracted.email,
        phone: extracted.phone || regexExtracted.phone
      };
      
      console.log('Final extracted info:', finalResult);
      return finalResult;
      
    } catch (error) {
      console.error('Error extracting resume info:', error);
      
      if (this.isQuotaExceededError(error)) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      // Fallback to regex extraction only
      const regexResult = this.extractWithRegex(resumeText);
      console.log('Fallback regex extraction:', regexResult);
      return regexResult;
    }
  }

  /**
   * Extracts information using regex patterns as fallback
   * @param {string} text - Resume text
   * @returns {Object} Extracted info {name, email, phone}
   */
  extractWithRegex(text) {
    const result = { name: '', email: '', phone: '' };
    
    if (!text) return result;
    
    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      result.email = emailMatch[0];
    }
    
    // Extract phone number (various formats)
    const phonePatterns = [
      /\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
      /\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
      /\+[1-9]{1}[0-9]{3,14}/
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch) {
        result.phone = phoneMatch[0].replace(/[^\d+()-]/g, '');
        break;
      }
    }
    
    // Extract name (heuristic: first non-empty line that's not contact info)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    for (const line of lines.slice(0, 5)) { // Check first 5 lines
      // Skip lines that look like email, phone, or common resume headers
      if (!line.includes('@') && 
          !line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) &&
          !line.toLowerCase().includes('resume') &&
          !line.toLowerCase().includes('curriculum') &&
          line.length > 2 && line.length < 50 &&
          /^[A-Za-z\s.'-]+$/.test(line)) {
        result.name = line;
        break;
      }
    }
    
    return result;
  }
}

// Get API key from environment variable or use default
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyDe7deVIrm8alJbt4fJg2yraPIsQRkHV3o';
const MODEL_NAME = process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.0-flash-exp';

// Export singleton instance
const aiService = new AIService(API_KEY, MODEL_NAME);
export default aiService;
