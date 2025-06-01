import bcrypt from 'bcrypt';
import { db } from "./db";
import { users, roles } from '../shared/schema';
import { sql, eq } from 'drizzle-orm';

async function seedSuperadmin() {
  console.log("🌱 Seeding superadmin user...");

  try {
    // Fetch the admin role ID
    const adminRole = await db.select().from(roles).where(eq(roles.name, 'admin'));

    if (!adminRole || adminRole.length === 0) {
      throw new Error("Admin role not found in the database. Please run the main seed script first.");
    }
    const adminRoleId = adminRole[0].id;

    const hashedSuperAdminPassword = await bcrypt.hash("123456", 10);
    
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingAdmin.length > 0) {
      console.log("✅ Superadmin user already exists");
      return;
    }

    const superAdmin = {
      username: "admin",
      password: hashedSuperAdminPassword,
      email: "admin@pgtickets.com",
      fullName: "Super Administrator",
      roleId: adminRoleId,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: "+639123456789",
      profileImage: null,
      isPhoneVerified: false,
      lastLogin: null,
      resetToken: null,
      resetTokenExpiry: null,
      verificationToken: null
    };

    console.log("Inserting superadmin user...");
    const insertedSuperAdmin = await db.insert(users).values(superAdmin).returning();
    console.log("✅ Superadmin user created successfully:", insertedSuperAdmin[0].username);

  } catch (error) {
    console.error("Error seeding superadmin:", error);
  }
}

// Also create test users for different roles
async function seedTestUsers() {
  console.log("🌱 Seeding test users...");

  try {
    // Get all roles
    const allRoles = await db.select().from(roles);
    const roleMap = allRoles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {} as Record<string, number>);

    const testUsers = [
      {
        username: "demouser",
        password: await bcrypt.hash("test123", 10),
        email: "user@example.com",
        fullName: "Demo User",
        roleId: roleMap.user || 1,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: "+639123456780",
        profileImage: null,
        isPhoneVerified: false,
        lastLogin: null,
        resetToken: null,
        resetTokenExpiry: null,
        verificationToken: null
      },
      {
        username: "hotelowner",
        password: await bcrypt.hash("test123", 10),
        email: "hotel@example.com",
        fullName: "Hotel Owner",
        roleId: roleMap.hotel || 2,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: "+639123456781",
        profileImage: null,
        isPhoneVerified: false,
        lastLogin: null,
        resetToken: null,
        resetTokenExpiry: null,
        verificationToken: null
      },
      {
        username: "travelagent",
        password: await bcrypt.hash("test123", 10),
        email: "agent@example.com",
        fullName: "Travel Agent",
        roleId: roleMap.agent || 3,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: "+639123456782",
        profileImage: null,
        isPhoneVerified: false,
        lastLogin: null,
        resetToken: null,
        resetTokenExpiry: null,
        verificationToken: null
      }
    ];

    for (const testUser of testUsers) {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, testUser.username));
      
      if (existingUser.length === 0) {
        await db.insert(users).values(testUser);
        console.log(`✅ Test user created: ${testUser.username}`);
      } else {
        console.log(`✅ Test user already exists: ${testUser.username}`);
      }
    }

  } catch (error) {
    console.error("Error seeding test users:", error);
  }
}

async function seedAllUsers() {
  await seedSuperadmin();
  await seedTestUsers();
}

seedAllUsers();