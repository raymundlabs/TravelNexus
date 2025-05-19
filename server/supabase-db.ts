import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';
import * as schema from "@shared/schema";

// Ensure environment variables are set
setupEnvironment();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables");
}

console.log('Creating Supabase client...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create a simplified database interface that works with our storage implementation
export const db = {
  select: () => ({
    from: (table) => ({
      where: () => Promise.resolve([]),
      limit: () => Promise.resolve([]),
      orderBy: () => Promise.resolve([])
    })
  }),
  insert: (table) => ({
    values: (data) => ({
      returning: () => Promise.resolve([data])
    })
  }),
  delete: () => ({
    where: () => ({
      execute: () => Promise.resolve()
    }),
    execute: () => Promise.resolve()
  })
};

// Mock pool for session store
export const pool = {
  query: async (text, params) => {
    console.log('Query executed:', text);
    return [];
  },
  connect: async () => {
    return {
      query: async () => [],
      release: () => {}
    };
  }
};