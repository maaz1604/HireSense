/**
 * Environment Configuration Verification
 * Run this file to verify your .env setup is correct
 * 
 * Usage: Add this temporarily to your App.js or run in browser console
 */

const verifyEnvironmentSetup = () => {
  console.group('🔍 Environment Configuration Check');
  
  // Check if API key exists
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const hasApiKey = !!apiKey;
  console.log(
    `✅ API Key: ${hasApiKey ? '✓ Loaded' : '✗ Missing'}`,
    hasApiKey ? `(${apiKey.substring(0, 10)}...)` : ''
  );
  
  // Check model configuration
  const model = process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.0-flash-exp (default)';
  console.log(`✅ Model: ${model}`);
  
  // Check app configuration
  const appName = process.env.REACT_APP_NAME || 'HireSense (default)';
  console.log(`✅ App Name: ${appName}`);
  
  const appVersion = process.env.REACT_APP_VERSION || '1.0.0 (default)';
  console.log(`✅ Version: ${appVersion}`);
  
  // Check optional timer configs
  const easyTimer = process.env.REACT_APP_EASY_TIMER || '20 (default)';
  const mediumTimer = process.env.REACT_APP_MEDIUM_TIMER || '60 (default)';
  const hardTimer = process.env.REACT_APP_HARD_TIMER || '120 (default)';
  const totalQuestions = process.env.REACT_APP_TOTAL_QUESTIONS || '6 (default)';
  
  console.group('⏱️ Timer Configuration');
  console.log(`Easy: ${easyTimer}s`);
  console.log(`Medium: ${mediumTimer}s`);
  console.log(`Hard: ${hardTimer}s`);
  console.log(`Total Questions: ${totalQuestions}`);
  console.groupEnd();
  
  // Overall status
  console.log('\n' + '='.repeat(50));
  if (hasApiKey) {
    console.log('✅ Configuration Status: READY');
    console.log('✅ You can start using the application!');
  } else {
    console.warn('⚠️ Configuration Status: INCOMPLETE');
    console.warn('⚠️ Please add REACT_APP_GEMINI_API_KEY to your .env file');
    console.log('\nSteps to fix:');
    console.log('1. Create/edit .env file in project root');
    console.log('2. Add: REACT_APP_GEMINI_API_KEY=your_api_key_here');
    console.log('3. Restart the development server (npm start)');
  }
  console.log('='.repeat(50));
  
  console.groupEnd();
  
  return hasApiKey;
};

// Auto-run verification
const isConfigured = verifyEnvironmentSetup();

// Export for use in other files
export default verifyEnvironmentSetup;
export { isConfigured };
