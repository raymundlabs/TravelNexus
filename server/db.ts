import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Configure dotenv to load from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("Environment variables check:");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY exists:", !!process.env.SUPABASE_ANON_KEY);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a postgres client
const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10, // Connection pool size
});

export const db = drizzle(client, { schema });

// For compatibility with code that expects pool
export const pool = { 
  connectionString: process.env.DATABASE_URL,
  // Mock query method for compatibility
  query: (text: string, params: any[]) => client.unsafe(text, params)
};
