
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/context/AuthContext';

// Create a single supabase client for interacting with your database
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create an admin user in Supabase
 * This function should be called only once to set up the initial admin
 * For security reasons, this function should be removed or disabled after setup
 */
export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    let userId;
    
    // Try to sign in first (in case the user already exists)
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!signInError && signInData.user) {
        userId = signInData.user.id;
        console.log('Signed in existing user, will update to admin');
      }
    } catch (signInErr) {
      console.log('Sign in failed, will try to create new user');
    }
    
    // If sign in failed, try to register a new user
    if (!userId) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'admin'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      userId = data.user?.id;
    }
    
    if (!userId) {
      return { success: false, error: "Couldn't get a valid user ID" };
    }
    
    // Add the admin role to the user profile
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: name,
          role: 'admin',
          created_at: new Date(),
        });
      
      if (profileError) {
        console.error('Error creating admin profile:', profileError);
      }
    } catch (profileErr) {
      console.error('Exception during profile creation:', profileErr);
    }
    
    return { success: true, user: { id: userId, email } };
  } catch (err) {
    console.error("Error creating admin:", err);
    return { success: false, error: err };
  }
};

/**
 * Update a user's role to admin
 * This is useful if you need to promote an existing user to admin
 */
export const setUserAsAdmin = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (err) {
    console.error("Error setting user as admin:", err);
    return { success: false, error: err };
  }
};
