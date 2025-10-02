/**
 * Dashboard Utility Functions
 * Provides filtering and sorting logic for candidate data
 */

/**
 * Filter candidates based on search query
 * @param {Array} candidates - Array of candidate objects
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered candidates
 */
export const filterCandidates = (candidates, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return candidates;
  }

  const query = searchQuery.toLowerCase().trim();

  return candidates.filter(candidate => {
    const name = candidate.name?.toLowerCase() || '';
    const email = candidate.email?.toLowerCase() || '';
    const phone = candidate.phone?.toLowerCase() || '';

    return name.includes(query) || email.includes(query) || phone.includes(query);
  });
};

/**
 * Sort candidates based on sort option
 * @param {Array} candidates - Array of candidate objects
 * @param {string} sortBy - Sort option (score-desc, score-asc, name-asc, name-desc, date-desc, date-asc)
 * @returns {Array} Sorted candidates
 */
export const sortCandidates = (candidates, sortBy) => {
  const sortedCandidates = [...candidates];

  switch (sortBy) {
    case 'score-desc':
      return sortedCandidates.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    case 'score-asc':
      return sortedCandidates.sort((a, b) => (a.score || 0) - (b.score || 0));
    
    case 'name-asc':
      return sortedCandidates.sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );
    
    case 'name-desc':
      return sortedCandidates.sort((a, b) => 
        (b.name || '').localeCompare(a.name || '')
      );
    
    case 'date-desc':
      return sortedCandidates.sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      );
    
    case 'date-asc':
      return sortedCandidates.sort((a, b) => 
        new Date(a.completedAt) - new Date(b.completedAt)
      );
    
    default:
      return sortedCandidates.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
};

/**
 * Apply both filtering and sorting to candidates
 * @param {Array} candidates - Array of candidate objects
 * @param {string} searchQuery - Search query string
 * @param {string} sortBy - Sort option
 * @returns {Array} Filtered and sorted candidates
 */
export const processCanditates = (candidates, searchQuery, sortBy) => {
  const filtered = filterCandidates(candidates, searchQuery);
  const sorted = sortCandidates(filtered, sortBy);
  return sorted;
};
