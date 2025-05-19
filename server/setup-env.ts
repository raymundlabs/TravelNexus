/**
 * Environment setup utility for the White Beach Puerto Galera Tours website
 * This ensures all necessary environment variables are available
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to load from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function setupEnvironment() {
  console.log('Setting up environment variables for White Beach Puerto Galera Tours...');
  
  // Make sure we have a default session secret
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = 'white-beach-puerto-galera-tours-secret-key';
  }
  
  console.log('Environment variables set:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not Set');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
  console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not Set');
}

// Export the setup function so it can be imported and used in other files
export { setupEnvironment };