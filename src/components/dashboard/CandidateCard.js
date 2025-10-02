import React from 'react';
import './CandidateCard.css';

function CandidateCard({ candidate, rank, onClick }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-improvement';
  };

  return (
    <div 
      className={`candidate-card ${getScoreCategory(candidate.score)}`}
      onClick={onClick}
    >
      <div className="card-header">
        <div className="rank">#{rank}</div>
        <div 
          className="score-badge"
          style={{ backgroundColor: getScoreColor(candidate.score) }}
        >
          {candidate.score}%
        </div>
      </div>

      <div className="card-body">
        <h3 className="candidate-name">{candidate.name}</h3>
        <div className="candidate-info">
          <div className="info-item">
            <span className="icon">📧</span>
            <span className="info-text">{candidate.email}</span>
          </div>
          <div className="info-item">
            <span className="icon">📱</span>
            <span className="info-text">{candidate.phone}</span>
          </div>
          <div className="info-item">
            <span className="icon">💬</span>
            <span className="info-text">{candidate.questionCount} questions</span>
          </div>
          <div className="info-item">
            <span className="icon">📅</span>
            <span className="info-text">
              {new Date(candidate.completedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="view-btn" aria-label={`View details for ${candidate.name}`}>
          View Details →
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
