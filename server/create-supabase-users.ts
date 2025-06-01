import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';

// Ensure environment variables are set
setupEnvironment();

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTestUsers() {
  console.log('🌱 Creating test users in Supabase auth.users...');

  const testUsers = [
    {
      email: 'admin@whitebeach.com',
      password: '123456',
      username: 'admin',
      role: 'admin'
    },
    {
      email: 'demo@whitebeach.com',
      password: 'test123',
      username: 'demouser',
      role: 'user'
    },
    {
      email: 'hotel@whitebeach.com',
      password: 'test123',
      username: 'hotelowner',
      role: 'hotel_owner'
    },
    {
      email: 'agent@whitebeach.com',
      password: 'test123',
      username: 'travelagent',
      role: 'travel_agent'
    }
  ];

  for (const user of testUsers) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          username: user.username,
          role: user.role
        },
        email_confirm: true // Auto-confirm email
      });

      if (error) {
        console.error(`❌ Failed to create user ${user.username}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.username} (${user.email})`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.username}:`, error);
    }
  }

  console.log('\n📋 Test credentials:');
  console.log('- admin@whitebeach.com / 123456 (Administrator)');
  console.log('- demo@whitebeach.com / test123 (Regular User)');
  console.log('- hotel@whitebeach.com / test123 (Hotel Owner)');
  console.log('- agent@whitebeach.com / test123 (Travel Agent)');
}

createTestUsers().catch(console.error);