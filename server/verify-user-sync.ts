
import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';
import { db } from './supabase-db';
import { users } from '@shared/schema';

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

async function verifyUserSync() {
  console.log('🔍 Verifying user synchronization between Supabase Auth and database...');

  try {
    // Get users from Supabase Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    console.log(`📊 Found ${authUsers.users.length} users in Supabase Auth`);

    // Get users from database
    const dbUsers = await db.select().from(users);
    console.log(`📊 Found ${dbUsers.length} users in database`);

    // Compare users
    for (const authUser of authUsers.users) {
      const dbUser = dbUsers.find(u => u.email === authUser.email);
      if (dbUser) {
        console.log(`✅ User synced: ${authUser.email} (Auth ID: ${authUser.id}, DB ID: ${dbUser.id})`);
      } else {
        console.log(`❌ User missing in DB: ${authUser.email} (Auth ID: ${authUser.id})`);
      }
    }

    // Check for orphaned DB users
    for (const dbUser of dbUsers) {
      const authUser = authUsers.users.find(u => u.email === dbUser.email);
      if (!authUser) {
        console.log(`⚠️ Orphaned DB user: ${dbUser.email} (DB ID: ${dbUser.id})`);
      }
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

verifyUserSync().catch(console.error);
