import React from 'react';
import { FaUsers, FaCheckCircle, FaChartBar } from 'react-icons/fa';
import './DashboardStats.css';

function DashboardStats({ candidates }) {
  const totalCandidates = candidates.length;
  const qualifiedCandidates = candidates.filter(c => c.score >= 70).length;
  const averageScore = totalCandidates > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / totalCandidates)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-stats">
      <div className="stat-box">
        <div className="stat-icon"><FaUsers size={32} /></div>
        <div className="stat-content">
          <span className="stat-number">{totalCandidates}</span>
          <span className="stat-label">Total Candidates</span>
        </div>
      </div>

      <div className="stat-box">
        <div className="stat-icon"><FaCheckCircle size={32} /></div>
        <div className="stat-content">
          <span className="stat-number">{qualifiedCandidates}</span>
          <span className="stat-label">Qualified (≥70%)</span>
        </div>
      </div>

      <div className="stat-box">
        <div className="stat-icon"><FaChartBar size={32} /></div>
        <div className="stat-content">
          <span 
            className="stat-number"
            style={{ color: getScoreColor(averageScore) }}
          >
            {averageScore}%
          </span>
          <span className="stat-label">Average Score</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
