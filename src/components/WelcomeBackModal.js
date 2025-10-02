import React from 'react';
import './WelcomeBackModal.css';

function WelcomeBackModal({ session, onResume, onStartFresh }) {
  return (
    <div className="modal-overlay">
      <div className="welcome-modal">
        <div className="modal-header">
          <h2>👋 Welcome Back!</h2>
        </div>

        <div className="modal-body">
          <p className="modal-message">
            You have an interview in progress for <strong>{session?.candidateInfo?.name}</strong>
          </p>

          <div className="session-info">
            <div className="info-row">
              <span className="label">Questions Answered:</span>
              <span className="value">{session?.questionCount || 0}</span>
            </div>
            <div className="info-row">
              <span className="label">Time Remaining:</span>
              <span className="value">
                {Math.floor((session?.timeRemaining || 0) / 60)} minutes
              </span>
            </div>
          </div>

          <p className="modal-prompt">
            Would you like to resume or start fresh?
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onStartFresh}>
            Start Fresh
          </button>
          <button className="btn-primary" onClick={onResume}>
            Resume Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBackModal;
