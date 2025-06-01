
import { setupEnvironment } from './setup-env';
import { db } from './supabase-db';
import { roles } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Ensure environment variables are set
setupEnvironment();

async function initializeRoles() {
  console.log('🔧 Initializing roles in database...');

  const rolesToCreate = [
    { name: 'admin', description: 'System administrator with full access' },
    { name: 'hotel_owner', description: 'Hotel owner who can manage their properties' },
    { name: 'travel_agent', description: 'Travel agent who can book for clients' },
    { name: 'user', description: 'Regular customer who can make bookings' }
  ];

  for (const roleData of rolesToCreate) {
    try {
      // Check if role already exists
      const [existingRole] = await db.select().from(roles).where(eq(roles.name, roleData.name));
      
      if (!existingRole) {
        await db.insert(roles).values(roleData);
        console.log(`✅ Created role: ${roleData.name}`);
      } else {
        console.log(`👍 Role already exists: ${roleData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating role ${roleData.name}:`, error);
    }
  }

  console.log('🎉 Role initialization complete!');
}

initializeRoles().catch(console.error);
