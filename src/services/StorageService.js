/**
 * Storage Service
 * Following Single Responsibility Principle - Handles only localStorage operations
 * Following Interface Segregation Principle - Clean interface for storage operations
 */

const STORAGE_KEYS = {
  CANDIDATES: 'interview_candidates',
  CURRENT_SESSION: 'interview_current_session'
};

class StorageService {
  /**
   * Saves candidates list to localStorage
   * @param {Array} candidates - Array of candidate objects
   */
  saveCandidates(candidates) {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (error) {
      console.error('Error saving candidates:', error);
    }
  }

  /**
   * Loads candidates list from localStorage
   * @returns {Array} Array of candidate objects
   */
  loadCandidates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading candidates:', error);
      return [];
    }
  }

  /**
   * Adds a new candidate to the list
   * @param {Object} candidate - Candidate object
   */
  addCandidate(candidate) {
    const candidates = this.loadCandidates();
    candidates.push(candidate);
    this.saveCandidates(candidates);
  }

  /**
   * Updates an existing candidate
   * @param {string} candidateId - Candidate ID
   * @param {Object} updatedData - Updated candidate data
   */
  updateCandidate(candidateId, updatedData) {
    const candidates = this.loadCandidates();
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index] = { ...candidates[index], ...updatedData };
      this.saveCandidates(candidates);
    }
  }

  /**
   * Saves current interview session
   * @param {Object} session - Session data
   */
  saveCurrentSession(session) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Loads current interview session
   * @returns {Object|null} Session data or null
   */
  loadCurrentSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }

  /**
   * Clears current interview session
   */
  clearCurrentSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  /**
   * Clears all interview data
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
