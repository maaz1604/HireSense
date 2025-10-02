import React from 'react';
import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <div className="search-icon">🔍</div>
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button 
          className="clear-search"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
