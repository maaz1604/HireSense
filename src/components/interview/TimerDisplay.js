/**
 * Timer Display Component
 * Following Single Responsibility Principle - Only displays timer
 */

import React from 'react';
import { MdTimer } from 'react-icons/md';
import { formatTime, isTimeCritical } from '../../utils/timeUtils';
import './TimerDisplay.css';

const TimerDisplay = ({ timeRemaining, totalTime, isPaused }) => {
  const isCritical = isTimeCritical(timeRemaining, totalTime);
  
  return (
    <div className={`timer-display ${isCritical ? 'critical' : ''} ${isPaused ? 'paused' : ''}`}>
      <span className="timer-icon"><MdTimer /></span>
      <span className="timer-value">{formatTime(timeRemaining)}</span>
      {isPaused && <span className="timer-status">Paused</span>}
    </div>
  );
};

export default TimerDisplay;
