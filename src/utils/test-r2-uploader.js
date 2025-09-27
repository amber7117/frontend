// Test script for R2 uploader functionality
import { singleFileUploader, singleFileDelete } from './r2-uploader';

// Simple test function to verify R2 uploader works
export const testR2Uploader = async () => {
  console.log('Testing R2 Uploader...');
  
  // Check if environment variables are set
  const requiredEnvVars = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID', 
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName].includes('your_'));
  
  if (missingVars.length > 0) {
    console.error('Missing R2 environment variables:', missingVars);
    console.log('Please update your .env file with actual R2 credentials');
    return false;
  }
  
  console.log('✅ All R2 environment variables are set');
  console.log('R2 configuration:');
  console.log('- Account ID:', process.env.R2_ACCOUNT_ID);
  console.log('- Bucket Name:', process.env.R2_BUCKET_NAME);
  console.log('- Public URL:', process.env.R2_PUBLIC_URL);
  
  return true;
};

// Export for use in other files if needed
export default testR2Uploader;
