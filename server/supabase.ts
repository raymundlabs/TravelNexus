import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables, preferring the service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL || "https://mjrasxyesgodetsthwqo.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcmFzeHllc2dvZGV0c3Rod3FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTMwNjU1NSwiZXhwIjoyMDYwODgyNTU1fQ.pW-b4rnszqtadFxbjvb-nc5lPddEltfD6zRcGRiyaxI" || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcmFzeHllc2dvZGV0c3Rod3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY1NTUsImV4cCI6MjA2MDg4MjU1NX0.xsrnVchHualZ85sAIkhEinyVOUyIy2wf3r_JAJz_11A";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Generic CRUD operations
export async function insertData<T>(tableName: string, data: T | T[]) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    throw error;
  }
}

export async function fetchData<T>(tableName: string, query?: { column: string; value: any }) {
  try {
    let queryBuilder = supabase.from(tableName).select('*');
    
    if (query) {
      queryBuilder = queryBuilder.eq(query.column, query.value);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data as T[];
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
}

export async function updateData<T>(tableName: string, id: number | string, data: Partial<T>) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error updating data in ${tableName}:`, error);
    throw error;
  }
}

export async function deleteData(tableName: string, id: number | string) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting data from ${tableName}:`, error);
    throw error;
  }
}

// Example usage:
// const newDestination = await insertData('destinations', { name: 'New Place', country: 'PH' });
// const destinations = await fetchData('destinations');
// const updatedDestination = await updateData('destinations', 1, { name: 'Updated Place' });
// const deleted = await deleteData('destinations', 1); 