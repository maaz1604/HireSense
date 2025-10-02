import React from 'react';
import './SortControls.css';

const SORT_OPTIONS = [
  { value: 'score-desc', label: 'Score: High to Low' },
  { value: 'score-asc', label: 'Score: Low to High' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'date-desc', label: 'Date: Newest First' },
  { value: 'date-asc', label: 'Date: Oldest First' },
];

function SortControls({ sortBy, onSortChange }) {
  return (
    <div className="sort-controls">
      <label htmlFor="sort-select" className="sort-label">
        <span className="sort-icon">⇅</span>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortControls;
