import React from 'react';
import './CandidateDetails.css';

function CandidateDetails({ candidate, onBack }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="candidate-details">
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to List
        </button>
        <h2>{candidate.name}</h2>
      </div>

      <div className="details-grid">
        {/* Profile Section */}
        <div className="details-section profile-section">
          <h3>📋 Profile Information</h3>
          <div className="profile-info">
            <div className="profile-item">
              <strong>Full Name:</strong>
              <span>{candidate.name}</span>
            </div>
            <div className="profile-item">
              <strong>Email Address:</strong>
              <span>{candidate.email}</span>
            </div>
            <div className="profile-item">
              <strong>Phone Number:</strong>
              <span>{candidate.phone}</span>
            </div>
            <div className="profile-item">
              <strong>Interview Date:</strong>
              <span>{new Date(candidate.completedAt).toLocaleString()}</span>
            </div>
            <div className="profile-item">
              <strong>Questions Answered:</strong>
              <span>{candidate.questionCount}</span>
            </div>
            <div className="profile-item">
              <strong>Final Score:</strong>
              <span 
                className="score-highlight"
                style={{ color: getScoreColor(candidate.score) }}
              >
                {candidate.score}%
              </span>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="details-section summary-section">
          <h3>🤖 AI-Generated Summary</h3>
          <div className="ai-summary">
            {candidate.aiSummary || 'No summary available'}
          </div>
        </div>

        {/* Questions & Answers Section */}
        {candidate.questionsAndAnswers && candidate.questionsAndAnswers.length > 0 && (
          <div className="details-section qa-section">
            <h3>💬 Interview Questions & Answers</h3>
            <div className="qa-list">
              {candidate.questionsAndAnswers.map((qa, idx) => (
                <div key={idx} className="qa-item">
                  <div className="question-header">
                    <span className="question-number">Q{idx + 1}</span>
                    <span className={`difficulty-badge ${qa.difficulty?.toLowerCase()}`}>
                      {qa.difficulty}
                    </span>
                    {qa.score !== undefined && (
                      <span className="qa-score" style={{ color: getScoreColor(qa.score) }}>
                        {qa.score}/10
                      </span>
                    )}
                  </div>
                  <div className="question-text">
                    <strong>Question:</strong>
                    <p>{qa.question}</p>
                  </div>
                  <div className="answer-text">
                    <strong>Answer:</strong>
                    <p>{qa.answer}</p>
                  </div>
                  {qa.feedback && (
                    <div className="feedback-text">
                      <strong>AI Feedback:</strong>
                      <p>{qa.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Extract Section */}
        {candidate.resumeText && (
          <div className="details-section resume-section">
            <h3>📄 Resume Extract</h3>
            <div className="resume-text">
              {candidate.resumeText.length > 1000 
                ? candidate.resumeText.substring(0, 1000) + '...'
                : candidate.resumeText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDetails;
