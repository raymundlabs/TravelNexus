import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { db } from "./db";
import { sql } from "drizzle-orm";
import {
  roles,
  users,
  destinations,
  hotels,
  tours,
  packages,
  specialOffers,
  testimonials,
  bookings,
  payments,
  agentPointTransactions,
  agentRewardRedemptions,
  agentRewardPoints,
  hotelOwnership,
  agentProfiles,
  hotelOwnerProfiles,
} from "@shared/schema";

// For migrations
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

async function migrate() {
  try {
    console.log("Starting migration...");

    // Create roles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phone TEXT,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        is_active BOOLEAN DEFAULT TRUE,
        is_email_verified BOOLEAN DEFAULT FALSE,
        is_phone_verified BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP,
        verification_token TEXT,
        profile_image TEXT
      );
    `);

    // Create destinations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Create hotels table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        address TEXT NOT NULL,
        price REAL NOT NULL,
        image_url TEXT NOT NULL,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        amenities TEXT[],
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Create tours table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        duration INTEGER NOT NULL,
        price REAL NOT NULL,
        image_url TEXT NOT NULL,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Create packages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image_url TEXT NOT NULL,
        duration INTEGER NOT NULL,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Create special_offers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS special_offers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        discount_percentage INTEGER NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        image_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create testimonials table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        video_url TEXT
      );
    `);

    // Create bookings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
        tour_id INTEGER REFERENCES tours(id) ON DELETE SET NULL,
        hotel_id INTEGER REFERENCES hotels(id) ON DELETE SET NULL,
        booking_date TIMESTAMP NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL,
        total_amount REAL NOT NULL,
        payment_status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create payments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        amount REAL NOT NULL,
        payment_date TIMESTAMP NOT NULL,
        payment_method TEXT NOT NULL,
        transaction_id TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agent_profiles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agent_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name TEXT,
        business_address TEXT,
        phone TEXT,
        website TEXT,
        commission_rate REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create hotel_owner_profiles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotel_owner_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name TEXT,
        business_address TEXT,
        phone TEXT,
        website TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create hotel_ownership table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotel_ownership (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
        owner_id INTEGER NOT NULL REFERENCES hotel_owner_profiles(id) ON DELETE CASCADE,
        ownership_percentage REAL NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agent_reward_points table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agent_reward_points (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agent_point_transactions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agent_point_transactions (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        transaction_type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create agent_reward_redemptions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS agent_reward_redemptions (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
        points_used INTEGER NOT NULL,
        redemption_type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

async function main() {
  console.log('Running migrations...');
  
  const db = drizzle(migrationClient, { schema });
  
  // This will automatically run needed migrations on the database
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('Migrations completed!');
  
  await migrationClient.end();
}

// Run the migration
migrate().catch(console.error);

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 