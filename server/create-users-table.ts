
import { createClient } from '@supabase/supabase-js';
import { setupEnvironment } from './setup-env';

// Ensure environment variables are set
setupEnvironment();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function createTablesAndTrigger() {
  console.log('🏗️  Creating tables and trigger for user sync...');

  try {
    // Create roles table first
    const { error: rolesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.roles (
          id serial PRIMARY KEY,
          name text NOT NULL UNIQUE,
          description text,
          created_at timestamp with time zone DEFAULT now()
        );
      `
    });

    if (rolesError) {
      console.error('❌ Error creating roles table:', rolesError);
      return;
    }

    // Insert default roles
    const { error: insertRolesError } = await supabase.rpc('execute_sql', {
      sql: `
        INSERT INTO public.roles (id, name, description) VALUES 
        (1, 'admin', 'Administrator with full access'),
        (2, 'hotel_owner', 'Hotel owner with property management access'),
        (3, 'travel_agent', 'Travel agent with booking management access'),
        (4, 'user', 'Regular user with booking access')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    if (insertRolesError) {
      console.error('❌ Error inserting roles:', insertRolesError);
      return;
    }

    // Create users table
    const { error: usersError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id serial NOT NULL,
          username text NOT NULL,
          password text NOT NULL,
          email text NOT NULL,
          full_name text NULL,
          created_at timestamp without time zone NULL DEFAULT now(),
          phone text NULL,
          role_id integer NOT NULL DEFAULT 4,
          is_active boolean NULL DEFAULT true,
          is_email_verified boolean NULL DEFAULT false,
          is_phone_verified boolean NULL DEFAULT false,
          last_login timestamp without time zone NULL,
          reset_token text NULL,
          reset_token_expiry timestamp without time zone NULL,
          verification_token text NULL,
          profile_image text NULL,
          auth_user_id uuid NULL,
          CONSTRAINT users_pkey PRIMARY KEY (id),
          CONSTRAINT users_email_unique UNIQUE (email),
          CONSTRAINT users_username_unique UNIQUE (username),
          CONSTRAINT users_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles (id),
          CONSTRAINT users_auth_user_id_unique UNIQUE (auth_user_id)
        );
      `
    });

    if (usersError) {
      console.error('❌ Error creating users table:', usersError);
      return;
    }

    // Create function to sync auth users to public users
    const { error: functionError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION sync_auth_user_to_public()
        RETURNS TRIGGER AS $$
        DECLARE
          user_role_id integer := 4; -- Default to regular user
        BEGIN
          -- Determine role based on user metadata
          IF NEW.raw_user_meta_data ->> 'role' = 'admin' THEN
            user_role_id := 1;
          ELSIF NEW.raw_user_meta_data ->> 'role' = 'hotel_owner' OR NEW.raw_user_meta_data ->> 'role' = 'hotel' THEN
            user_role_id := 2;
          ELSIF NEW.raw_user_meta_data ->> 'role' = 'travel_agent' OR NEW.raw_user_meta_data ->> 'role' = 'agent' THEN
            user_role_id := 3;
          ELSE
            user_role_id := 4; -- Regular user
          END IF;

          -- Insert into public.users
          INSERT INTO public.users (
            auth_user_id,
            email,
            username,
            full_name,
            password,
            role_id,
            is_active,
            is_email_verified,
            created_at
          )
          VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
            'supabase_auth', -- Placeholder since auth is handled by Supabase
            user_role_id,
            true,
            NEW.email_confirmed_at IS NOT NULL,
            NEW.created_at
          )
          ON CONFLICT (auth_user_id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            is_email_verified = EXCLUDED.is_email_verified,
            last_login = CASE WHEN NEW.last_sign_in_at > OLD.last_login THEN NEW.last_sign_in_at ELSE OLD.last_login END;

          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (functionError) {
      console.error('❌ Error creating sync function:', functionError);
      return;
    }

    // Create trigger to automatically sync new auth users
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP TRIGGER IF EXISTS sync_auth_user_trigger ON auth.users;
        CREATE TRIGGER sync_auth_user_trigger
          AFTER INSERT OR UPDATE ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION sync_auth_user_to_public();
      `
    });

    if (triggerError) {
      console.error('❌ Error creating trigger:', triggerError);
      return;
    }

    console.log('✅ Successfully created:');
    console.log('  - roles table with default roles');
    console.log('  - users table with proper constraints');
    console.log('  - sync function for auth.users -> public.users');
    console.log('  - trigger to automatically sync new users');

    // Sync existing auth users
    console.log('🔄 Syncing existing auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Could not fetch auth users:', authError);
      return;
    }

    for (const authUser of authUsers.users) {
      const roleId = authUser.user_metadata?.role === 'admin' ? 1 : 
                    authUser.user_metadata?.role === 'hotel_owner' || authUser.user_metadata?.role === 'hotel' ? 2 :
                    authUser.user_metadata?.role === 'travel_agent' || authUser.user_metadata?.role === 'agent' ? 3 : 4;

      const { error: syncError } = await supabase
        .from('users')
        .upsert({
          auth_user_id: authUser.id,
          email: authUser.email,
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
          password: 'supabase_auth',
          role_id: roleId,
          is_active: true,
          is_email_verified: authUser.email_confirmed_at !== null,
          created_at: authUser.created_at
        }, {
          onConflict: 'auth_user_id'
        });

      if (syncError) {
        console.error(`❌ Error syncing user ${authUser.email}:`, syncError);
      } else {
        console.log(`✅ Synced user: ${authUser.email}`);
      }
    }

    console.log('🎉 User sync setup completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createTablesAndTrigger().catch(console.error);
