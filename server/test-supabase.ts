
import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';

// Ensure environment variables are set
setupEnvironment();

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  try {
    // Test auth users listing
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth users error:', authError);
    } else {
      console.log('✅ Auth users retrieved:', authUsers.users.length);
      authUsers.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
    }

    // Test basic query
    const { data, error } = await supabase.from('users').select('*').limit(5);
    
    if (error) {
      console.error('❌ Database error:', error);
    } else {
      console.log('✅ Database connection successful');
      console.log('📊 Sample users:', data?.length || 0);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testSupabaseConnection().catch(console.error);
