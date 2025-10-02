import React from 'react';
import CandidateCard from './CandidateCard';
import './CandidateList.css';

function CandidateList({ candidates, onCandidateClick }) {
  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No Candidates Found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="candidates-grid">
      {candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          rank={index + 1}
          onClick={() => onCandidateClick(candidate)}
        />
      ))}
    </div>
  );
}

export default CandidateList;
