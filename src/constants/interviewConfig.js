/**
 * Interview Configuration Constants
 * Following Single Responsibility Principle - Contains only configuration data
 */

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

export const QUESTION_TIMERS = {
  [DIFFICULTY_LEVELS.EASY]: 45, // 45 seconds
  [DIFFICULTY_LEVELS.MEDIUM]: 80, // 80 seconds
  [DIFFICULTY_LEVELS.HARD]: 145 // 145 seconds
};

export const QUESTION_CONFIG = [
  { difficulty: DIFFICULTY_LEVELS.EASY, questionNumber: 1 },
  { difficulty: DIFFICULTY_LEVELS.EASY, questionNumber: 2 },
  { difficulty: DIFFICULTY_LEVELS.EASY, questionNumber: 3 },
  { difficulty: DIFFICULTY_LEVELS.MEDIUM, questionNumber: 4 },
  { difficulty: DIFFICULTY_LEVELS.MEDIUM, questionNumber: 5 },
  { difficulty: DIFFICULTY_LEVELS.MEDIUM, questionNumber: 6 },
  { difficulty: DIFFICULTY_LEVELS.MEDIUM, questionNumber: 7 },
  { difficulty: DIFFICULTY_LEVELS.HARD, questionNumber: 8 },
  { difficulty: DIFFICULTY_LEVELS.HARD, questionNumber: 9 },
  { difficulty: DIFFICULTY_LEVELS.HARD, questionNumber: 10 }
];

export const TOTAL_QUESTIONS = QUESTION_CONFIG.length;

export const JOB_ROLE = 'Full Stack Developer (React/Node.js)';

export const SCORE_CONFIG = {
  MAX_SCORE_PER_QUESTION: 10,
  PASSING_PERCENTAGE: 60,
  EXCELLENT_PERCENTAGE: 80
};

export const INTERVIEW_STATES = {
  UPLOAD: 'upload',
  COLLECT_INFO: 'collect-info',
  INTERVIEW: 'interview',
  COMPLETE: 'complete'
};
