/**
 * Score Calculation Utilities
 * Following Single Responsibility Principle - Handles only score-related calculations
 */

import { SCORE_CONFIG, TOTAL_QUESTIONS } from '../constants/interviewConfig';

/**
 * Calculates final percentage score
 * @param {number} totalScore - Sum of all question scores
 * @returns {number} Percentage score (0-100)
 */
export const calculateFinalScore = (totalScore) => {
  const maxPossibleScore = TOTAL_QUESTIONS * SCORE_CONFIG.MAX_SCORE_PER_QUESTION;
  return Math.round((totalScore / maxPossibleScore) * 100);
};

/**
 * Determines score category based on percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Score category
 */
export const getScoreCategory = (percentage) => {
  if (percentage >= SCORE_CONFIG.EXCELLENT_PERCENTAGE) return 'Excellent';
  if (percentage >= SCORE_CONFIG.PASSING_PERCENTAGE) return 'Good';
  return 'Needs Improvement';
};

/**
 * Gets color class based on score percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} CSS class name
 */
export const getScoreColor = (percentage) => {
  if (percentage >= SCORE_CONFIG.EXCELLENT_PERCENTAGE) return 'score-excellent';
  if (percentage >= SCORE_CONFIG.PASSING_PERCENTAGE) return 'score-good';
  return 'score-poor';
};

/**
 * Validates if candidate passed the interview
 * @param {number} percentage - Score percentage (0-100)
 * @returns {boolean} True if passed
 */
export const isPassingScore = (percentage) => {
  return percentage >= SCORE_CONFIG.PASSING_PERCENTAGE;
};
