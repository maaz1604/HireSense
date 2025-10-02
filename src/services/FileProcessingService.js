/**
 * File Processing Service
 * Following Single Responsibility Principle - Handles only file processing operations
 */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class FileProcessingService {
  /**
   * Extracts text from PDF file
   * @param {File} file - PDF file object
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromPDF(file) {
    try {
      console.log('Extracting text from PDF:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      console.log('PDF has', pdf.numPages, 'pages');

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        console.log(`Page ${i} text length:`, pageText.length);
      }

      console.log('Total extracted text length:', fullText.length);
      
      if (fullText.trim().length === 0) {
        throw new Error('PDF appears to be image-based or empty. Please use a text-based PDF or convert to DOCX format.');
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      if (error.message.includes('image-based')) {
        throw error;
      }
      throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
    }
  }

  /**
   * Extracts text from DOCX file
   * @param {File} file - DOCX file object
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromDOCX(file) {
    try {
      console.log('Extracting text from DOCX:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      console.log('DOCX extracted text length:', result.value.length);
      console.log('DOCX warnings:', result.messages);
      
      if (result.value.trim().length === 0) {
        throw new Error('DOCX file appears to be empty or contains only images. Please use a text-based document.');
      }
      
      return result.value.trim();
    } catch (error) {
      console.error('DOCX extraction error:', error);
      if (error.message.includes('empty')) {
        throw error;
      }
      throw new Error('Failed to extract text from DOCX. The file may be corrupted or in an unsupported format.');
    }
  }

  /**
   * Processes resume file based on type
   * @param {File} file - Resume file (PDF or DOCX)
   * @returns {Promise<string>} Extracted text
   */
  async processResumeFile(file) {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
      return await this.extractTextFromPDF(file);
    } else if (fileName.endsWith('.docx') || fileType.includes('wordprocessingml')) {
      return await this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file format');
    }
  }
}

// Export singleton instance
const fileProcessingService = new FileProcessingService();
export default fileProcessingService;
