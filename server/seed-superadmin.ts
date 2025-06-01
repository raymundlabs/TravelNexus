import { insertData, supabase } from './supabase';
import bcrypt from 'bcrypt';
import { db } from "./db";
import { roles } from '../shared/schema';
import { sql, eq } from 'drizzle-orm';

async function seedSuperadmin() {
  console.log("🌱 Seeding superadmin user...");

  try {
    // Fetch the admin role ID
    const adminRole = await db.select().from(roles).where(sql`${roles.name} = 'admin'`);

    if (!adminRole || adminRole.length === 0) {
      throw new Error("Admin role not found in the database. Please run the main seed script first.");
    }
    const adminRoleId = adminRole[0].id;

    const hashedSuperAdminPassword = await bcrypt.hash("123456", 10);
    const superAdmin = {
      username: "admin",
      password: hashedSuperAdminPassword,
      email: "admin@pgtickets.com",
      full_name: "Super Administrator",
      role_id: adminRoleId as string,
      is_active: true,
      is_email_verified: true,
      created_at : new Date(),
      updated_at: new Date()
    };

    console.log("Inserting superadmin user...");
    const insertedSuperAdmin = await insertData('users', superAdmin);
    console.log("✅ Superadmin user created successfully");

  } catch (error) {
    console.error("Error seeding superadmin:", error);
  } finally {
    // Close the Supabase connection if it's open and managed here
    // If supabase.js handles connection pooling, this might not be necessary or could be harmful.
    // For now, assuming insertData closes connection or connection pool is managed externally.
  }
}

seedSuperadmin(); 