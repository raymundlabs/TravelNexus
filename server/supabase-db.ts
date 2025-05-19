import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { Pool } from 'pg';

// Use the Supabase PostgreSQL connection string from environment variables
const SUPABASE_DB_URL = process.env.DATABASE_URL as string;

// Create postgres client with required SSL for Supabase
const client = postgres(SUPABASE_DB_URL, {
  ssl: true,
  max: 10, // Connection pool size
});

// Initialize Drizzle ORM with our schema
export const db = drizzle(client, { schema });

// Create a pg Pool for session store and other libraries that expect it
export const pool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});