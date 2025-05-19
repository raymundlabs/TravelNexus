import { insertData, fetchData, updateData, deleteData } from './supabase';

async function testSupabase() {
  try {
    console.log('Testing Supabase CRUD operations with provided schema...');

    // Test inserting data
    // Using column names from the provided schema image
    const testData = {
      name: 'Test Destination',
      country: 'Philippines',
      description: 'A test destination',
      image_url: 'https://example.com/image.jpg', // Corrected to image_url
      rating: 4.5,
      review_count: 0 // Corrected to review_count
    };

    console.log('\n1. Testing INSERT...');
    // Explicitly type insertedData to resolve 'unknown' error
    const insertedData: Array<{ id: string | number | undefined }> = await insertData('destinations', testData);
    console.log('Inserted data:', insertedData);

    // Get the ID of the inserted record
    // Assuming 'id' is still the primary key column name
    let insertedId = insertedData[0]?.id;
    if (!insertedId) {
      // Attempt to fetch the inserted record to get its ID if insert didn't return it
      console.log('Insert did not return ID, attempting to fetch by name...');
      const fetchedByName = await fetchData<{ id: string | number }>( 'destinations', { column: 'name', value: 'Test Destination' });
      if (fetchedByName && fetchedByName.length > 0) {
        insertedId = fetchedByName[0].id;
        console.log('Fetched ID:', insertedId);
      } else {
         throw new Error('Failed to get inserted record ID after insertion and fetch');
      }
    }
     if (!insertedId) {
        throw new Error('Inserted ID is undefined after all attempts');
    }

    // Test fetching data
    console.log('\n2. Testing SELECT...');
    const allDestinations = await fetchData('destinations');
    console.log('All destinations:', allDestinations);

    // Test fetching with filter
    console.log('\n3. Testing SELECT with filter...');
    // Using column name from the provided schema image (assuming 'country')
    const filteredDestinations = await fetchData('destinations', {
      column: 'country',
      value: 'Philippines'
    });
    console.log('Filtered destinations:', filteredDestinations);

    // Test updating data
    console.log('\n4. Testing UPDATE...');
    // Using column names from the provided schema image
    const updatePayload = {
      name: 'Updated Test Destination',
      rating: 4.8
    };
    // Assuming 'id' is the column used for updating by ID
    const updatedData = await updateData('destinations', insertedId, updatePayload);
    console.log('Updated data:', updatedData);

    // Test deleting data
    console.log('\n5. Testing DELETE...');
    // Assuming 'id' is the column used for deleting by ID
    const deleted = await deleteData('destinations', insertedId);
    console.log('Delete successful:', deleted);

    // Verify deletion
    console.log('\n6. Verifying deletion...');
    const remainingDestinations = await fetchData('destinations');
    console.log('Remaining destinations:', remainingDestinations);

  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Run the test
testSupabase(); 