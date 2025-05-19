console.log("Script starting...");

import { db } from "./db";
import { sql } from "drizzle-orm";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("Connection successful! Current time:", result);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    process.exit(0);
  }
}

testConnection(); 