/**
 * Answer Input Component
 * Following Single Responsibility Principle - Only handles answer input
 */

import React from 'react';
import './AnswerInput.css';

const AnswerInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled,
  loading,
  placeholder = "Type your answer here..."
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="answer-input">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled || loading}
      />
      
      <div className="submit-section">
        <span className="answer-hint">
          💡 Tip: Press Ctrl + Enter to submit quickly
        </span>
        <button 
          className="submit-button"
          onClick={onSubmit}
          disabled={disabled || loading || !value.trim()}
        >
          {loading ? (
            <>
              <span className="icon">⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <span className="icon">✓</span>
              Submit Answer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnswerInput;
