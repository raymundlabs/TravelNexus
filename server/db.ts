import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { Pool } from 'pg';

// Check if required environment variables are defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to set up your Supabase database?");
}

// Create a postgres client with the Supabase connection URL
const client = postgres(process.env.DATABASE_URL, {
  ssl: true, // Required for Supabase
  max: 10, // Connection pool size
});

// Initialize Drizzle ORM with our schema
export const db = drizzle(client, { schema });

// Create a pg Pool for session store and other libraries that expect it
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connections
  }
});
