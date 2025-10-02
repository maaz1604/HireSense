/**
 * Question Display Component
 * Following Single Responsibility Principle - Only displays question information
 */

import React from 'react';
import './QuestionDisplay.css';

const QuestionDisplay = ({ 
  questionNumber, 
  totalQuestions, 
  difficulty, 
  questionText,
  loading 
}) => {
  return (
    <div className="question-display">
      <div className="question-header">
        <div className="question-info">
          <span className="question-number">Question {questionNumber}/{totalQuestions}</span>
          <span className={`difficulty-badge difficulty-${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        </div>
      </div>
      
      <div className="question-content">
        {loading ? (
          <div className="question-loading">
            <div className="spinner"></div>
            <p>Generating your next question...</p>
          </div>
        ) : (
          <div className="question-text">
            <span className="icon">❓</span>
            <p>{questionText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
