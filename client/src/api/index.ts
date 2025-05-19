import axios from 'axios';

// Function to fetch details for a specific package by ID
export const fetchPackageDetails = async (packageId: string) => {
  try {
    const response = await axios.get(`/api/packages/${packageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching package details for ID ${packageId}:`, error);
    throw error; // Re-throw the error so react-query can handle it
  }
};

// You can add other API calling functions here later 