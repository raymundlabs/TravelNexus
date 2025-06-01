import { insertData, fetchData, updateData, deleteData } from './supabase';
import { db } from "./db";
import { roles } from '../shared/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function testSupabase() {
  try {
    console.log('Testing Supabase CRUD operations with user schema...');

    // Fetch an existing role ID (e.g., 'customer' or 'admin')
    const customerRole = await db.select().from(roles).where(db.eq(roles.name, 'customer'));
    if (!customerRole || customerRole.length === 0) {
      throw new Error("Customer role not found. Please ensure roles are seeded.");
    }
    const roleId = customerRole[0].id;

    // Hash a password for the test user
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    // Test inserting data into users table
    const testData = {
      username: 'testuser_crud',
      password: hashedPassword,
      email: 'test_crud@example.com',
      full_name: 'Test User CRUD',
      role_id: roleId,
      is_active: true,
      is_email_verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('\n1. Testing INSERT into users...');
    const insertedData: Array<{ id: string | undefined }> = await insertData('users', testData);
    console.log('Inserted user data:', insertedData);

    let insertedId: string | undefined = insertedData[0]?.id;
    if (!insertedId) {
      console.log('Insert did not return ID, attempting to fetch by username...');
      const fetchedByName = await fetchData<{ id: string }>( 'users', { column: 'username', value: 'testuser_crud' });
      if (fetchedByName && fetchedByName.length > 0) {
        insertedId = fetchedByName[0].id;
        console.log('Fetched ID:', insertedId);
      } else {
         throw new Error('Failed to get inserted user record ID after insertion and fetch');
      }
    }
     if (!insertedId) {
        throw new Error('Inserted user ID is undefined after all attempts');
    }

    // Test fetching all users
    console.log('\n2. Testing SELECT all users...');
    const allUsers = await fetchData('users');
    console.log('All users:', allUsers);

    // Test fetching user with filter
    console.log('\n3. Testing SELECT user with filter (by email)...');
    const filteredUsers = await fetchData('users', {
      column: 'email',
      value: 'test_crud@example.com'
    });
    console.log('Filtered users:', filteredUsers);

    // Test updating user data
    console.log('\n4. Testing UPDATE user...');
    const updatePayload = {
      full_name: 'Updated Test User CRUD',
      is_active: false
    };
    const updatedData = await updateData('users', insertedId as string, updatePayload);
    console.log('Updated user data:', updatedData);

    // Test deleting user data
    console.log('\n5. Testing DELETE user...');
    const deleted = await deleteData('users', insertedId as string);
    console.log('User delete successful:', deleted);

    // Verify deletion
    console.log('\n6. Verifying user deletion...');
    const remainingUsers = await fetchData('users');
    console.log('Remaining users:', remainingUsers);

  } catch (error) {
    console.error('Error in user test:', error);
  }
}

// Run the test
testSupabase(); 