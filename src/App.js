import React, { useState, useEffect } from 'react';
import { RiRobot2Fill } from 'react-icons/ri';
import { FaUser, FaUserTie } from 'react-icons/fa';
import IntervieweeChat from './components/IntervieweeChat';
import InterviewerDashboard from './components/InterviewerDashboard';
import WelcomeBackModal from './components/WelcomeBackModal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [candidates, setCandidates] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCandidates = localStorage.getItem('interviewCandidates');
    const savedSession = localStorage.getItem('currentInterviewSession');
    
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
    
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setCurrentSession(session);
      setShowWelcomeBack(true);
    }
  }, []);

  // Save candidates to localStorage whenever they change
  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('interviewCandidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  // Save current session to localStorage
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentInterviewSession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentInterviewSession');
    }
  }, [currentSession]);

  const handleResumeInterview = () => {
    setShowWelcomeBack(false);
    setActiveTab('interviewee');
  };

  const handleStartFresh = () => {
    setShowWelcomeBack(false);
    setCurrentSession(null);
    localStorage.removeItem('currentInterviewSession');
  };

  const updateCandidate = (candidateData) => {
    setCandidates(prev => {
      const existingIndex = prev.findIndex(c => c.id === candidateData.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = candidateData;
        return updated;
      }
      return [...prev, candidateData];
    });
  };

  return (
    <div className="App">
      {showWelcomeBack && currentSession && (
        <WelcomeBackModal
          session={currentSession}
          onResume={handleResumeInterview}
          onStartFresh={handleStartFresh}
        />
      )}

      <div className="app-header">
        <h1><RiRobot2Fill /> HireSense</h1>
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'interviewee' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviewee')}
          >
            <FaUser /> Interviewee
          </button>
          <button
            className={`tab-btn ${activeTab === 'interviewer' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviewer')}
          >
            <FaUserTie /> Interviewer Dashboard
          </button>
        </div>
      </div>

      <div className="app-content">
        {activeTab === 'interviewee' ? (
          <IntervieweeChat
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            updateCandidate={updateCandidate}
            candidates={candidates}
          />
        ) : (
          <InterviewerDashboard
            candidates={candidates}
            updateCandidate={updateCandidate}
          />
        )}
      </div>

      <div className="app-footer">
        <p>Build by Maaz Amir</p>
      </div>
    </div>
  );
}

export default App;
