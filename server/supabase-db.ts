// server/supabase-db.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env'; // Assuming you have this utility
import * as schema from "@shared/schema"; // Assuming your Drizzle schema definition
import { Pool } from 'pg'; // For the session store

// Load environment variables
setupEnvironment();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.DATABASE_URL) {
  console.error("SUPABASE_URL, SUPABASE_ANON_KEY, and DATABASE_URL must be set in environment variables.");
  // Exit the process or handle this error appropriately
  process.exit(1);
}

console.log('Configuring database connections...');

// --- Supabase Client for Auth Operations ---
// Use this for user-facing Supabase Auth methods (signInWithPassword, signUp, etc.)
// Note: For backend admin tasks bypassing RLS, you would use the service_role key.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
console.log('Supabase client initialized.');


// --- Postgres Client for Drizzle ORM (using 'postgres' library) ---
// This is the client Drizzle will use for database queries
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Connection pool size for Drizzle client
  ssl: { // <--- ADD THIS BLOCK for local development certificate issues
     rejectUnauthorized: false // WARNING: Disable certificate validation - USE ONLY IN DEVELOPMENT
  },
  // Additional options for postgres client if needed (e.g., connect_timeout)
});

// Initialize Drizzle ORM with the postgres client and schema
export const db = drizzle(client, { schema });
console.log('Drizzle ORM initialized.');


// --- PG Pool for Session Store (using 'pg' library) ---
// connect-pg-simple requires a pg.Pool instance
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { // <--- ADD THIS BLOCK for local development certificate issues
    rejectUnauthorized: false // WARNING: Disable certificate validation - USE ONLY IN DEVELOPMENT
  },
   max: 10, // Connection pool size for session store
   // idleTimeoutMillis: 30000, // Example: close idle clients after 30s
});

// Test the pool connection (optional, but helpful for debugging)
pool.on('connect', () => {
    console.log('Postgres pool client connected');
});

pool.on('error', (err) => {
    console.error('Postgres pool error:', err.message, err.stack);
});

console.log('PG Pool for session store initialized.');


// Export everything needed by other parts of the application


// Note: If you need a Supabase client with the service_role key for admin operations,
// you would create another client instance like this (ensure SERVICE_ROLE_KEY env var exists):
// export const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   {
//     auth: { autoRefreshToken: false, persistSession: false }, // Service role bypasses user auth flow
//   }
// );