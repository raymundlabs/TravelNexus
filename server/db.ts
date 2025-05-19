import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Hardcoded values for testing
const DATABASE_URL = "postgresql://postgres:9C3tUwhNlHke8Cz7@db.mjrasxyesgodetsthwqo.supabase.co:5432/postgres";
const SUPABASE_URL = "https://mjrasxyesgodetsthwqo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcmFzeHllc2dvZGV0c3Rod3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY1NTUsImV4cCI6MjA2MDg4MjU1NX0.xsrnVchHualZ85sAIkhEinyVOUyIy2wf3r_JAJz_11A";

console.log("Using hardcoded values for testing:");
console.log("DATABASE_URL exists:", !!DATABASE_URL);
console.log("SUPABASE_URL exists:", !!SUPABASE_URL);
console.log("SUPABASE_ANON_KEY exists:", !!SUPABASE_ANON_KEY);

// Create a postgres client with debug logging
const client = postgres(DATABASE_URL, {
  ssl: 'require',
  max: 10, // Connection pool size
  debug: true, // Enable debug logging
  onnotice: (notice) => console.log('Postgres notice:', notice),
  onparameter: (key, value) => console.log('Postgres parameter:', key, value),
});

export const db = drizzle(client, { schema });

// For compatibility with code that expects pool
export const pool = { 
  connectionString: DATABASE_URL,
  // Mock query method for compatibility
  query: (text: string, params: any[]) => client.unsafe(text, params)
};
