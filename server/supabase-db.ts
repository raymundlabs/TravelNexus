import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Check for environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables");
}

// Create a Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// For direct database access, we'll use postgres.js
// This assumes DATABASE_URL has been set
// If not available, we'll recreate it from the Supabase URL
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
  databaseUrl = `postgres://postgres.${projectRef}:$POSTGRES_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
  console.log('Database URL recreated from Supabase URL:', databaseUrl.replace(/:.+?@/, ':***@'));
}

// Create a PostgreSQL client
const client = postgres(databaseUrl, { ssl: 'require' });

// Create a connection pool for session storage
export const pool = {
  query: async (text, params) => {
    try {
      return await client.unsafe(text, params);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },
  end: async () => {
    await client.end();
  }
};

// Create a Drizzle ORM instance with our schema
export const db = drizzle(client, { schema });