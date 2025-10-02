/**
 * Progress Indicator Component
 * Following Single Responsibility Principle - Only displays progress
 */

import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentQuestion, totalQuestions, score, maxScore }) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="progress-indicator">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="progress-stats">
        <div className="stat">
          <span className="stat-label">Progress:</span>
          <span className="stat-value">{currentQuestion}/{totalQuestions} Questions</span>
        </div>
        <div className="stat">
          <span className="stat-label">Current Score:</span>
          <span className="stat-value">{score}/{maxScore} Points</span>
        </div>
        {scorePercentage > 0 && (
          <div className="stat">
            <span className="stat-label">Percentage:</span>
            <span className={`stat-value score-${scorePercentage >= 80 ? 'excellent' : scorePercentage >= 60 ? 'good' : 'poor'}`}>
              {scorePercentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
