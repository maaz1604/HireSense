import React, { useState, useMemo } from 'react';
import { FaUsers } from 'react-icons/fa';
import SearchBar from './dashboard/SearchBar';
import SortControls from './dashboard/SortControls';
import DashboardStats from './dashboard/DashboardStats';
import CandidateList from './dashboard/CandidateList';
import CandidateDetails from './dashboard/CandidateDetails';
import { processCanditates } from '../utils/dashboardUtils';
import './InterviewerDashboard.css';

function InterviewerDashboard({ candidates }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, details
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score-desc');

  // Process candidates with search and sort
  const processedCandidates = useMemo(() => {
    return processCanditates(candidates, searchQuery, sortBy);
  }, [candidates, searchQuery, sortBy]);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCandidate(null);
  };

  return (
    <div className="interviewer-dashboard">
      {viewMode === 'list' ? (
        <div className="candidates-list">
          <div className="dashboard-header">
            <h2><FaUsers /> Candidate Dashboard</h2>
            
            {/* Stats Section */}
            <DashboardStats candidates={candidates} />

            {/* Search and Sort Controls */}
            <div className="controls-row">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <SortControls 
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Candidates List */}
          <CandidateList 
            candidates={processedCandidates}
            onCandidateClick={handleCandidateClick}
          />
        </div>
      ) : (
        <CandidateDetails 
          candidate={selectedCandidate}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}

export default InterviewerDashboard;
