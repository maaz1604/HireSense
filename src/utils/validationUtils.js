/**
 * Validation Utility Functions
 * Following Single Responsibility Principle - Handles only validation logic
 */

/**
 * Validates candidate information
 * @param {Object} candidateInfo - Candidate information object
 * @returns {Object} { isValid: boolean, missingFields: string[] }
 */
export const validateCandidateInfo = (candidateInfo) => {
  const missingFields = [];
  
  if (!candidateInfo.name || candidateInfo.name.trim() === '') {
    missingFields.push('Name');
  }
  
  if (!candidateInfo.email || candidateInfo.email.trim() === '') {
    missingFields.push('Email');
  } else if (!isValidEmail(candidateInfo.email)) {
    missingFields.push('Valid Email');
  }
  
  if (!candidateInfo.phone || candidateInfo.phone.trim() === '') {
    missingFields.push('Phone');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates file type for resume upload
 * @param {File} file - File object
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateFileType = (file) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }
  
  const fileName = file.name.toLowerCase();
  const fileType = file.type;
  
  const isPDF = fileName.endsWith('.pdf') || fileType.includes('pdf');
  const isDOCX = fileName.endsWith('.docx') || fileType.includes('wordprocessingml');
  
  if (!isPDF && !isDOCX) {
    return { isValid: false, message: 'Please upload a PDF or DOCX file' };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, message: 'File size must be less than 10MB' };
  }
  
  return { isValid: true, message: 'Valid file' };
};

/**
 * Validates answer input
 * @param {string} answer - Answer text
 * @returns {boolean} True if answer is valid
 */
export const isValidAnswer = (answer) => {
  return answer && answer.trim().length > 0;
};
