import * as fs from 'fs';
import * as path from 'path';

// Manually set the environment variables to make sure they're loaded correctly
function setupEnvironment() {
  console.log('Setting up environment variables for Supabase...');
  
  // Directly set the DATABASE_URL from the value in .env file
  process.env.DATABASE_URL = 'postgres://postgres:JpQSvfyxld46R9T4@db.mjrasxyesgodetsthwqo.supabase.co:5432/postgres';
  process.env.SUPABASE_URL = 'https://mjrasxyesgodetsthwqo.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcmFzeHllc2dvZGV0c3Rod3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY1NTUsImV4cCI6MjA2MDg4MjU1NX0.xsrnVchHualZ85sAIkhEinyVOUyIy2wf3r_JAJz_11A';
  process.env.SESSION_SECRET = 'white-beach-puerto-galera-tours-secret-key';
  
  console.log('Environment variables set:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not Set');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
  console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not Set');
}

// Export the setup function so it can be imported and used in other files
export { setupEnvironment };

// Also run it directly if this file is executed
setupEnvironment();