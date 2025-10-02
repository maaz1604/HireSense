/**
 * Time Utility Functions
 * Following Single Responsibility Principle - Handles only time-related operations
 */

/**
 * Formats seconds into MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Checks if time is running low (less than 25% remaining)
 * @param {number} currentTime - Current time in seconds
 * @param {number} totalTime - Total allocated time in seconds
 * @returns {boolean} True if time is critically low
 */
export const isTimeCritical = (currentTime, totalTime) => {
  return currentTime < totalTime * 0.25;
};

/**
 * Gets time remaining percentage
 * @param {number} currentTime - Current time in seconds
 * @param {number} totalTime - Total allocated time in seconds
 * @returns {number} Percentage of time remaining (0-100)
 */
export const getTimePercentage = (currentTime, totalTime) => {
  return Math.round((currentTime / totalTime) * 100);
};
