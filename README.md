# HireSense 🤖

An intelligent interview management system built with React.js and Google Gemini AI that streamlines the interview process with automated question generation, real-time evaluation, and comprehensive candidate tracking.

## 🌟 Features

### Interviewee Tab (Chat Interface)
- 📄 **Resume Upload**: Support for PDF and DOCX file formats
- 🤖 **Smart Information Extraction**: Automatically extracts Name, Email, and Phone from resumes using AI
- 💬 **Interactive Chat**: Collects missing information through conversational interface
- � **AI-Powered Interview**: 
  - Generates contextual questions based on resume and previous answers
  - ⏱️ 30-minute countdown timer with visual feedback
  - Real-time answer evaluation (0-10 scoring per question)
  - Minimum 5 questions per interview
- ⏸️ **Pause & Resume**: Automatically saves progress with Welcome Back modal on return
- � **Final Score**: Calculates percentage-based final score with detailed summary

### Interviewer Tab (Dashboard)
- 📋 **Candidate Overview**: Grid view of all completed interviews sorted by score
- 📈 **Smart Statistics**: 
  - Total candidates
  - Qualified candidates (≥60%)
  - Average score across all candidates
- 🔍 **Detailed View**:
  - Complete candidate profile
  - Full chat history with Q&A
  - AI-generated summary
  - Resume extract
  - Color-coded score badges (Green: ≥80%, Yellow: ≥60%, Red: <60%)

### Data Persistence
- 💾 **Local Storage**: All data persists across browser sessions
- 🔄 **Session Recovery**: Automatically detects interrupted interviews
- 🔗 **Sync Between Tabs**: Real-time synchronization between Interviewee and Interviewer views

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd Ai-interview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The application will automatically open at [http://localhost:3000](http://localhost:3000)

## 🔑 API Configuration

The application uses **Google Gemini API** configured through environment variables.

Create a `.env` file in the root directory with your API key:
```env
REACT_APP_GEMINI_API_KEY="your_gemini_api_key_here"
REACT_APP_GEMINI_MODEL="gemini-2.0-flash-exp"
```

**Note**: The API key is now properly configured using environment variables for security. Make sure to add `.env` to your `.gitignore` file.

## 📦 Dependencies

- **react** (^18.2.0): UI framework
- **react-dom** (^18.2.0): React rendering
- **@google/generative-ai** (^0.21.0): Google Gemini AI integration
- **pdfjs-dist** (^3.11.174): PDF text extraction
- **mammoth** (^1.6.0): DOCX file parsing
- **react-scripts** (5.0.1): Build tooling

## 📖 Usage Guide

### For Interviewees

1. **Upload Resume**
   - Click "Choose Resume" or drag & drop your resume (PDF or DOCX)
   - Wait for automatic information extraction

2. **Complete Profile**
   - Review extracted Name, Email, and Phone
   - Fill in any missing information via chat
   - Confirm details to proceed

3. **Take Interview**
   - Answer AI-generated questions in the chat
   - Watch the 30-minute timer countdown
   - Each answer is evaluated immediately (0-10 score)
   - Complete at least 5 questions before ending

4. **View Results**
   - See your final percentage score
   - Read the AI-generated summary
   - Switch to Interviewer tab to see full details

### For Interviewers

1. **View Candidates**
   - Navigate to the "Interviewer Dashboard" tab
   - See all candidates ranked by score
   - View statistics at the top

2. **Review Details**
   - Click "View Details" on any candidate card
   - Access complete chat history
   - Read AI evaluation summary
   - View profile and resume extract

3. **Make Decisions**
   - Use color-coded scores for quick assessment
   - Review individual answers for detailed evaluation
   - Check AI summary for overall performance

## 🏗️ Project Structure

```
Ai-interview/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── IntervieweeChat.js       # Main interview interface
│   │   ├── IntervieweeChat.css      # Interview styling
│   │   ├── InterviewerDashboard.js  # Dashboard component
│   │   ├── InterviewerDashboard.css # Dashboard styling
│   │   ├── WelcomeBackModal.js      # Resume modal
│   │   └── WelcomeBackModal.css     # Modal styling
│   ├── App.js                        # Main app with tab navigation
│   ├── App.css                       # App-level styling
│   ├── index.js                      # React entry point
│   └── index.css                     # Global styles
├── package.json
├── README.md
└── ...
```

## 🎨 Key Components

### IntervieweeChat.js
Handles the complete interview workflow:
- Resume file upload and parsing (PDF/DOCX)
- AI-powered information extraction
- Chat-based information collection
- Question generation and answer evaluation
- Timer management (30 minutes)
- Score calculation

### InterviewerDashboard.js
Manages candidate viewing and evaluation:
- Candidate list with sorting by score
- Statistical overview (total, qualified, average)
- Detailed candidate profiles
- Chat history viewer
- AI summary display

### WelcomeBackModal.js
Provides session recovery:
- Detects interrupted interviews
- Displays session information
- Offers resume or fresh start options

## 🔧 Technical Details

### AI Integration
- **Model**: gemini-1.5-flash
- **Functions**:
  - Resume parsing for structured data extraction
  - Question generation based on context and previous answers
  - Answer evaluation with 0-10 scoring
  - Final summary generation

### File Processing
- **PDF**: Uses `pdfjs-dist` with CDN worker for text extraction
- **DOCX**: Uses `mammoth` library for document parsing
- **Validation**: Checks file type before processing

### Timer System
- 30-minute countdown with seconds display
- Visual pulse animation on timer
- Pauses when interview is paused
- Resumes from saved time on session recovery

### Scoring System
- Each answer scored 0-10 by AI
- Final score = (Total Points / (Questions × 10)) × 100
- Color coding: 
  - Green: ≥80% (Excellent)
  - Yellow: ≥60% (Good)
  - Red: <60% (Needs Improvement)

### Issue: npm install fails
**Solution**: Clear npm cache and try again:
```bash
npm cache clean --force
npm install
```

### Issue: Port 3000 is already in use
**Solution**: Kill the process or use a different port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or start on different port
set PORT=3001 && npm start
```

### Issue: API errors
**Solution**: 
- Check your internet connection
- Verify the API key is correct
- Check Gemini API quota/limit