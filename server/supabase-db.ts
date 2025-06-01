import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';
import * as schema from "@shared/schema";
import { Pool } from 'pg';

// Ensure environment variables are set
setupEnvironment();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.DATABASE_URL) {
  throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY, and DATABASE_URL must be set in environment variables");
}

console.log('Creating Supabase client...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

// Create Supabase client for auth operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create postgres connection for Drizzle ORM
const client = postgres(process.env.DATABASE_URL, {
  ssl: true, // Required for Supabase
  max: 10, // Connection pool size
});

// Initialize Drizzle ORM with our schema
export const db = drizzle(client, { schema });

// Create a pg Pool for session store
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connections
  }
});