import bcrypt from 'bcrypt';
import { storage } from './storage';

async function initializeUsers() {
  console.log("🌱 Initializing test users with bcrypt passwords...");

  const testUsers = [
    {
      username: "admin",
      password: "123456",
      email: "admin@pgtickets.com",
      fullName: "Super Administrator",
      roleId: 4
    },
    {
      username: "demouser",
      password: "test123",
      email: "user@example.com",
      fullName: "Demo User",
      roleId: 1
    },
    {
      username: "hotelowner",
      password: "test123",
      email: "hotel@example.com",
      fullName: "Hotel Owner",
      roleId: 2
    },
    {
      username: "travelagent",
      password: "test123",
      email: "agent@example.com",
      fullName: "Travel Agent",
      roleId: 3
    }
  ];

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (!existingUser) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Create the user
        await storage.createUser({
          username: userData.username,
          password: hashedPassword,
          email: userData.email,
          fullName: userData.fullName,
          roleId: userData.roleId
        });
        
        console.log(`✅ Created user: ${userData.username}`);
      } else {
        console.log(`✅ User already exists: ${userData.username}`);
      }
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }
}

initializeUsers();