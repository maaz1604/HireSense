/**
 * Refactored IntervieweeChat Component
 * Following SOLID Principles:
 * - Single Responsibility: Delegates specific tasks to specialized components and services
 * - Open/Closed: Uses services that can be extended without modification
 * - Liskov Substitution: Components can be swapped with compatible alternatives
 * - Interface Segregation: Uses focused service interfaces
 * - Dependency Inversion: Depends on service abstractions, not concrete implementations
 */

import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileAlt, FaUpload, FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaUser, FaTrophy } from 'react-icons/fa';

// Services
import aiService from '../services/AIService';
import fileProcessingService from '../services/FileProcessingService';
import storageService from '../services/StorageService';

// Utils
import { validateCandidateInfo, validateFileType, isValidAnswer } from '../utils/validationUtils';
import { calculateFinalScore } from '../utils/scoreUtils';

// Constants
import { 
  QUESTION_CONFIG, 
  QUESTION_TIMERS, 
  TOTAL_QUESTIONS,
  INTERVIEW_STATES,
  SCORE_CONFIG
} from '../constants/interviewConfig';

// Components
import TimerDisplay from './interview/TimerDisplay';
import QuestionDisplay from './interview/QuestionDisplay';
import AnswerInput from './interview/AnswerInput';
import ProgressIndicator from './interview/ProgressIndicator';

import './IntervieweeChat.css';

function IntervieweeChat({ currentSession, setCurrentSession, updateCandidate }) {
  // State Management
  const [step, setStep] = useState(INTERVIEW_STATES.UPLOAD);
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    phone: '',
    resumeText: ''
  });
  
  // Interview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused] = useState(false);
  const timerRef = useRef(null);
  
  // UI Refs
  const fileInputRef = useRef(null);

  // Get current question config
  const getCurrentQuestionConfig = () => {
    return currentQuestionIndex < TOTAL_QUESTIONS 
      ? QUESTION_CONFIG[currentQuestionIndex] 
      : null;
  };

  // Restore session on mount
  useEffect(() => {
    if (currentSession) {
      setCandidateInfo(currentSession.candidateInfo || candidateInfo);
      setStep(currentSession.step || INTERVIEW_STATES.UPLOAD);
      setCurrentQuestionIndex(currentSession.currentQuestionIndex || 0);
      setCurrentQuestion(currentSession.currentQuestion || '');
      setQuestionsAndAnswers(currentSession.questionsAndAnswers || []);
      setScore(currentSession.score || 0);
      setTimeRemaining(currentSession.timeRemaining || 0);
    }
    // eslint-disable-next-line
  }, []);

  // Timer Effect
  useEffect(() => {
    if (step === INTERVIEW_STATES.INTERVIEW && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line
  }, [step, isPaused, timeRemaining]);

  // Save session whenever state changes
  useEffect(() => {
    if (step === INTERVIEW_STATES.INTERVIEW) {
      const sessionData = {
        candidateInfo,
        step,
        currentQuestionIndex,
        currentQuestion,
        questionsAndAnswers,
        score,
        timeRemaining,
        id: currentSession?.id || Date.now().toString()
      };
      storageService.saveCurrentSession(sessionData);
      setCurrentSession(sessionData);
    }
    // eslint-disable-next-line
  }, [candidateInfo, step, currentQuestionIndex, currentQuestion, questionsAndAnswers, score, timeRemaining]);

  /**
   * Handles file upload and resume processing
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFileType(file);
    if (!validation.isValid) {
      toast.error(validation.message, { position: 'top-center' });
      return;
    }

    setLoading(true);

    try {
      console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Extract text from the resume file
      const resumeText = await fileProcessingService.processResumeFile(file);
      console.log('Extracted resume text length:', resumeText.length);
      console.log('Resume text preview:', resumeText.substring(0, 300));

      if (!resumeText || resumeText.trim().length < 10) {
        throw new Error('Unable to extract readable text from the resume. Please ensure the file is not corrupted or image-based.');
      }
      
      // Extract candidate information using AI
      const extractedInfo = await aiService.extractResumeInfo(resumeText);
      console.log('Extracted info from AI:', extractedInfo);
      
      const newInfo = {
        name: extractedInfo.name || '',
        email: extractedInfo.email || '',
        phone: extractedInfo.phone || '',
        resumeText: resumeText
      };

      setCandidateInfo(newInfo);

      // Validate if we have all required information
      const infoValidation = validateCandidateInfo(newInfo);
      
      if (!infoValidation.isValid) {
        console.log('Missing fields:', infoValidation.missingFields);
        toast.warning(`Please provide missing information: ${infoValidation.missingFields.join(', ')}`, { 
          position: 'top-center', 
          autoClose: 4000 
        });
        setStep(INTERVIEW_STATES.COLLECT_INFO);
      } else {
        console.log('All information found, starting interview');
        toast.success('Resume processed successfully! All information extracted.', {
          position: 'top-center',
          autoClose: 2000
        });
        startInterview(newInfo);
      }
    } catch (error) {
      console.error('Resume processing error:', error);
      
      if (error.message === 'QUOTA_EXCEEDED') {
        toast.error('⚠️ API Limit Exceeded! Please fill in your information manually.', { 
          position: 'top-center', 
          autoClose: 5000,
          theme: 'colored'
        });
        setStep(INTERVIEW_STATES.COLLECT_INFO);
      } else {
        toast.error(`Error processing resume: ${error.message}`, { 
          position: 'top-center', 
          autoClose: 4000 
        });
        setStep(INTERVIEW_STATES.COLLECT_INFO);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles candidate info form submission
   */
  const handleInfoSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateCandidateInfo(candidateInfo);
    if (!validation.isValid) {
      toast.error(`Please fill in all required fields: ${validation.missingFields.join(', ')}`, { 
        position: 'top-center', 
        autoClose: 3000 
      });
      return;
    }

    if (!candidateInfo.resumeText || candidateInfo.resumeText.trim() === '') {
      toast.error('Please upload a resume first', { position: 'top-center', autoClose: 3000 });
      return;
    }

    startInterview(candidateInfo);
  };

  /**
   * Starts the interview process
   */
  const startInterview = async (info) => {
    setStep(INTERVIEW_STATES.INTERVIEW);
    setCurrentQuestionIndex(0);
    setQuestionsAndAnswers([]);
    setScore(0);
    
    await generateNextQuestion(info, 0, []);
  };

  /**
   * Generates the next question
   */
  const generateNextQuestion = async (info, questionIndex, previousQA) => {
    if (questionIndex >= TOTAL_QUESTIONS) {
      completeInterview();
      return;
    }

    setLoading(true);
    const questionConfig = QUESTION_CONFIG[questionIndex];
    const { difficulty, questionNumber } = questionConfig;

    try {
      const previousQuestions = previousQA.map(qa => qa.question);
      const question = await aiService.generateQuestion(
        difficulty,
        questionNumber,
        info.resumeText,
        previousQuestions
      );

      setCurrentQuestion(question);
      setCurrentQuestionIndex(questionIndex);
      
      // Set timer for this question
      const timeLimit = QUESTION_TIMERS[difficulty];
      setTimeRemaining(timeLimit);
    } catch (error) {
      if (error.message === 'QUOTA_EXCEEDED') {
        toast.error('⚠️ API Limit Exceeded! The Gemini API quota has been reached. Using fallback question.', { 
          position: 'top-center', 
          autoClose: 5000,
          theme: 'colored'
        });
      } else {
        toast.error(`Error generating question: ${error.message}`, { 
          position: 'top-right', 
          autoClose: 3000 
        });
      }
      setCurrentQuestion('What is your experience with Full Stack Development using React and Node.js?');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles answer submission
   */
  const handleSubmitAnswer = async () => {
    if (!isValidAnswer(currentAnswer)) {
      toast.warning('Please provide an answer', { position: 'top-right', autoClose: 2000 });
      return;
    }

    clearInterval(timerRef.current);
    setLoading(true);
    const questionConfig = getCurrentQuestionConfig();

    try {
      // Evaluate the answer
      const evaluation = await aiService.evaluateAnswer(
        currentQuestion,
        currentAnswer,
        questionConfig.difficulty
      );

      const newQA = {
        questionNumber: questionConfig.questionNumber,
        difficulty: questionConfig.difficulty,
        question: currentQuestion,
        answer: currentAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback,
        timeUsed: QUESTION_TIMERS[questionConfig.difficulty] - timeRemaining
      };

      setQuestionsAndAnswers(prev => [...prev, newQA]);
      setScore(prevScore => prevScore + evaluation.score);

      // Clear answer and move to next question
      setCurrentAnswer('');
      
      const nextIndex = currentQuestionIndex + 1;
      await generateNextQuestion(
        candidateInfo, 
        nextIndex, 
        [...questionsAndAnswers, newQA]
      );
    } catch (error) {
      if (error.message === 'QUOTA_EXCEEDED') {
        toast.error('⚠️ API Limit Exceeded! Using default score of 5/10 for this answer.', { 
          position: 'top-center', 
          autoClose: 5000,
          theme: 'colored'
        });
        
        // Use default evaluation if quota exceeded
        const newQA = {
          questionNumber: questionConfig.questionNumber,
          difficulty: questionConfig.difficulty,
          question: currentQuestion,
          answer: currentAnswer,
          score: 5,
          feedback: 'API limit reached. Default score assigned.',
          timeUsed: QUESTION_TIMERS[questionConfig.difficulty] - timeRemaining
        };

        setQuestionsAndAnswers(prev => [...prev, newQA]);
        setScore(prevScore => prevScore + 5);
        setCurrentAnswer('');
        
        const nextIndex = currentQuestionIndex + 1;
        await generateNextQuestion(
          candidateInfo, 
          nextIndex, 
          [...questionsAndAnswers, newQA]
        );
      } else {
        toast.error('Error evaluating answer', { position: 'top-right', autoClose: 2000 });
      }
      setLoading(false);
    }
  };

  /**
   * Handles timeout - automatically submits answer and moves to next question
   */
  const handleTimeOut = async () => {
    if (loading) return;
    
    clearInterval(timerRef.current);
    
    toast.warning('⏰ Time is up! Auto-submitting your answer...', { 
      position: 'top-center', 
      autoClose: 2000 
    });
    
    // If no answer provided, use default message
    const answerToSubmit = currentAnswer.trim() || 'No answer provided (time expired)';
    
    setLoading(true);
    const questionConfig = getCurrentQuestionConfig();

    try {
      // Evaluate the answer
      const evaluation = await aiService.evaluateAnswer(
        currentQuestion,
        answerToSubmit,
        questionConfig.difficulty
      );

      const newQA = {
        questionNumber: questionConfig.questionNumber,
        difficulty: questionConfig.difficulty,
        question: currentQuestion,
        answer: answerToSubmit,
        score: evaluation.score,
        feedback: evaluation.feedback,
        timeUsed: QUESTION_TIMERS[questionConfig.difficulty]
      };

      setQuestionsAndAnswers(prev => [...prev, newQA]);
      setScore(prevScore => prevScore + evaluation.score);

      // Clear answer and move to next question
      setCurrentAnswer('');
      
      const nextIndex = currentQuestionIndex + 1;
      await generateNextQuestion(
        candidateInfo, 
        nextIndex, 
        [...questionsAndAnswers, newQA]
      );
    } catch (error) {
      if (error.message === 'QUOTA_EXCEEDED') {
        toast.error('⚠️ API Limit Exceeded! Using default score of 5/10 for this answer.', { 
          position: 'top-center', 
          autoClose: 5000,
          theme: 'colored'
        });
        
        // Use default evaluation if quota exceeded
        const newQA = {
          questionNumber: questionConfig.questionNumber,
          difficulty: questionConfig.difficulty,
          question: currentQuestion,
          answer: answerToSubmit,
          score: 5,
          feedback: 'API limit reached. Default score assigned.',
          timeUsed: QUESTION_TIMERS[questionConfig.difficulty]
        };

        setQuestionsAndAnswers(prev => [...prev, newQA]);
        setScore(prevScore => prevScore + 5);
        setCurrentAnswer('');
        
        const nextIndex = currentQuestionIndex + 1;
        await generateNextQuestion(
          candidateInfo, 
          nextIndex, 
          [...questionsAndAnswers, newQA]
        );
      } else {
        toast.error('Error evaluating answer', { position: 'top-right', autoClose: 2000 });
      }
      setLoading(false);
    }
  };

  /**
   * Completes the interview and generates summary
   */
  const completeInterview = async () => {
    setStep(INTERVIEW_STATES.COMPLETE);
    clearInterval(timerRef.current);
    setLoading(true);

    try {
      const finalScore = calculateFinalScore(score);
      const summary = await aiService.generateSummary(
        candidateInfo,
        questionsAndAnswers,
        finalScore
      );

      const completeCandidate = {
        id: currentSession?.id || Date.now().toString(),
        ...candidateInfo,
        questionsAndAnswers,
        score: finalScore,
        totalPoints: score,
        maxPoints: TOTAL_QUESTIONS * SCORE_CONFIG.MAX_SCORE_PER_QUESTION,
        aiSummary: summary,
        completedAt: new Date().toISOString()
      };

      storageService.addCandidate(completeCandidate);
      storageService.clearCurrentSession();
      
      if (updateCandidate) {
        updateCandidate(completeCandidate);
      }

      toast.success(`🎉 Interview Complete! Final Score: ${finalScore}%`, { 
        position: 'top-center', 
        autoClose: 5000 
      });
    } catch (error) {
      toast.error('Error completing interview', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets interview for new attempt
   */
  const resetInterview = () => {
    setStep(INTERVIEW_STATES.UPLOAD);
    setCandidateInfo({ name: '', email: '', phone: '', resumeText: '' });
    setCurrentQuestionIndex(0);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setQuestionsAndAnswers([]);
    setScore(0);
    setTimeRemaining(0);
    storageService.clearCurrentSession();
    setCurrentSession(null);
  };

  // Render upload section
  const renderUploadSection = () => (
    <div className="upload-section">
      <div className="upload-card">
        <h2><FaFileAlt /> Upload Your Resume</h2>
        <p>Upload your resume in PDF or DOCX format to begin the Full Stack Developer interview</p>
        
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          {loading ? (
            <div className="upload-loading">
              <div className="spinner"></div>
              <p>Processing your resume...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon"><FaUpload size={48} /></div>
              <p>Click to upload or drag and drop</p>
              <span>PDF or DOCX (Max 10MB)</span>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );

  // Render info collection section
  const renderInfoCollection = () => {
    const validation = validateCandidateInfo(candidateInfo);
    const extractedFields = [];
    if (candidateInfo.name) extractedFields.push('Name');
    if (candidateInfo.email) extractedFields.push('Email');
    if (candidateInfo.phone) extractedFields.push('Phone');

    return (
      <div className="info-collection">
        <div className="info-card">
          <h2><FaClipboardList /> Complete Your Profile</h2>
          <p>Please provide the missing information to continue</p>
          {extractedFields.length > 0 && (
            <div className="extraction-status">
              <p className="success-text"><FaCheckCircle /> Successfully extracted: {extractedFields.join(', ')}</p>
            </div>
          )}
          {validation.missingFields.length > 0 && (
            <div className="missing-fields">
              <p className="warning-text"><FaExclamationTriangle /> Please provide: {validation.missingFields.join(', ')}</p>
            </div>
          )}
        
        <form onSubmit={handleInfoSubmit}>
          <div className="form-field">
            <label>Full Name *</label>
            <input
              type="text"
              value={candidateInfo.name}
              onChange={(e) => setCandidateInfo({...candidateInfo, name: e.target.value})}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-field">
            <label>Email Address *</label>
            <input
              type="email"
              value={candidateInfo.email}
              onChange={(e) => setCandidateInfo({...candidateInfo, email: e.target.value})}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={candidateInfo.phone}
              onChange={(e) => setCandidateInfo({...candidateInfo, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <button type="submit" className="btn-primary">Start Interview</button>
        </form>
      </div>
    </div>
    );
  };

  // Render interview section
  const renderInterviewSection = () => {
    const questionConfig = getCurrentQuestionConfig();
    if (!questionConfig) return null;

    return (
      <div className="interview-section">
        <div className="interview-header">
          <div className="candidate-badge">
            <span className="icon"><FaUser /></span>
            <span>{candidateInfo.name}</span>
          </div>
          
          <TimerDisplay 
            timeRemaining={timeRemaining}
            totalTime={QUESTION_TIMERS[questionConfig.difficulty]}
            isPaused={isPaused}
          />
        </div>

        <ProgressIndicator 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={TOTAL_QUESTIONS}
          score={score}
          maxScore={TOTAL_QUESTIONS * SCORE_CONFIG.MAX_SCORE_PER_QUESTION}
        />

        <QuestionDisplay 
          questionNumber={questionConfig.questionNumber}
          totalQuestions={TOTAL_QUESTIONS}
          difficulty={questionConfig.difficulty}
          questionText={currentQuestion}
          loading={loading}
        />

        {!loading && (
          <AnswerInput 
            value={currentAnswer}
            onChange={setCurrentAnswer}
            onSubmit={handleSubmitAnswer}
            disabled={loading || timeRemaining === 0}
            loading={loading}
          />
        )}
      </div>
    );
  };

  // Render completion section
  const renderCompletionSection = () => {
    const finalScore = calculateFinalScore(score);
    const latestCandidate = questionsAndAnswers.length > 0 ? {
      ...candidateInfo,
      score: finalScore,
      totalPoints: score,
      maxPoints: TOTAL_QUESTIONS * SCORE_CONFIG.MAX_SCORE_PER_QUESTION
    } : null;

    return (
      <div className="complete-section">
        <div className="complete-card">
          <div className="complete-icon"><FaTrophy size={64} /></div>
          <h2>Interview Complete!</h2>
          
          {latestCandidate && (
            <>
              <div className="final-score">
                <h3>Final Score</h3>
                <div className={`score-display score-${finalScore >= 80 ? 'excellent' : finalScore >= 60 ? 'good' : 'poor'}`}>
                  {finalScore}%
                </div>
                <p>{latestCandidate.totalPoints} / {latestCandidate.maxPoints} points</p>
              </div>

              <div className="complete-stats">
                <div className="stat-item">
                  <span className="stat-label">Questions Answered</span>
                  <span className="stat-value">{questionsAndAnswers.length}/{TOTAL_QUESTIONS}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">
                    {(score / questionsAndAnswers.length).toFixed(1)}/10
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="complete-actions">
            <button onClick={resetInterview} className="btn-primary">
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="interviewee-chat">
      {step === INTERVIEW_STATES.UPLOAD && renderUploadSection()}
      {step === INTERVIEW_STATES.COLLECT_INFO && renderInfoCollection()}
      {step === INTERVIEW_STATES.INTERVIEW && renderInterviewSection()}
      {step === INTERVIEW_STATES.COMPLETE && renderCompletionSection()}
      <ToastContainer />
    </div>
  );
}

export default IntervieweeChat;
